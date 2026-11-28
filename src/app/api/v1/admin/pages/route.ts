import { type NextRequest } from "next/server";
import { z } from "zod";
import { apiError, apiOk, formatZodError, parseJsonBody } from "@/lib/api/http";
import { requirePermission, writeRedactedAuditLog } from "@/lib/auth/session";
import { validateMutationCsrf } from "@/lib/security/csrf";
import { getSupabaseAdminClient, isSupabaseAdminConfigured } from "@/lib/supabase/admin";

export async function GET() {
  const auth = await requirePermission("cms_pages", "read");
  if (!auth.ok) return auth.response;

  if (!isSupabaseAdminConfigured()) {
    return apiOk({
      pages: [
        { id: "p1", slug: "home", title: "Homepage", status: "published", updatedAt: new Date().toISOString() },
        { id: "p2", slug: "about", title: "About Us", status: "published", updatedAt: new Date().toISOString() },
        { id: "p3", slug: "services", title: "Services Catalog", status: "published", updatedAt: new Date().toISOString() },
      ],
      demoMode: true,
    });
  }

  const admin = getSupabaseAdminClient();
  const { data, error } = await admin
    .from("pages")
    .select("id, slug, title, status, published_at, created_at")
    .is("deleted_at", null)
    .order("slug");

  if (error) return apiError("DB_ERROR", "Failed to fetch pages", 500);
  return apiOk({ pages: data ?? [] });
}

const pagePatchSchema = z
  .object({
    id: z.string().uuid(),
    title: z.string().min(2).max(120).optional(),
    status: z.enum(["draft", "in_review", "published", "archived"]).optional(),
    sections: z.array(z.record(z.string(), z.unknown())).optional(),
    seo: z.record(z.string(), z.unknown()).optional(),
  })
  .strict();

export async function PATCH(request: NextRequest) {
  const csrf = validateMutationCsrf(request);
  if (!csrf.ok) return apiError("CSRF_REJECTED", csrf.reason ?? "Origin invalid", csrf.status ?? 403);

  const auth = await requirePermission("cms_pages", "update");
  if (!auth.ok) return auth.response;

  const parsedBody = await parseJsonBody(request);
  if (!parsedBody.ok) return apiError("INVALID_JSON", "Invalid JSON body", 400);

  const parsed = pagePatchSchema.safeParse(parsedBody.data);
  if (!parsed.success) {
    return apiError("VALIDATION_ERROR", "Invalid page update", 400, formatZodError(parsed.error));
  }

  if (parsed.data.status === "published") {
    const pubAuth = await requirePermission("cms_pages", "publish");
    if (!pubAuth.ok) return pubAuth.response;
  }

  if (!isSupabaseAdminConfigured()) {
    return apiOk({ updated: true, pageId: parsed.data.id, demoMode: true });
  }

  const admin = getSupabaseAdminClient();
  const updates: Record<string, unknown> = {
    updated_by: auth.auth.userId,
  };
  if (parsed.data.title) updates.title = parsed.data.title;
  if (parsed.data.status) {
    updates.status = parsed.data.status;
    if (parsed.data.status === "published") updates.published_at = new Date().toISOString();
  }
  if (parsed.data.sections) updates.sections = parsed.data.sections;
  if (parsed.data.seo) updates.seo = parsed.data.seo;

  const { data, error } = await admin
    .from("pages")
    .update(updates)
    .eq("id", parsed.data.id)
    .select("id, slug, title, status, published_at")
    .single();

  if (error || !data) return apiError("UPDATE_FAILED", "Failed to update page", 500);

  await writeRedactedAuditLog({
    actorUserId: auth.auth.userId,
    actorRoles: auth.auth.roles,
    action: "PAGE_UPDATED",
    resourceType: "cms_pages",
    resourceId: data.id,
    changedFields: Object.keys(updates),
  });

  return apiOk(data);
}
