import { type NextRequest } from "next/server";
import { z } from "zod";
import { apiError, apiOk, formatZodError, parseJsonBody } from "@/lib/api/http";
import { requirePermission, writeRedactedAuditLog } from "@/lib/auth/session";
import { validateMutationCsrf } from "@/lib/security/csrf";
import { getSupabaseAdminClient, isSupabaseAdminConfigured } from "@/lib/supabase/admin";

export async function GET() {
  const auth = await requirePermission("services", "read");
  if (!auth.ok) return auth.response;

  if (!isSupabaseAdminConfigured()) {
    return apiOk({ services: [], demoMode: true });
  }

  const admin = getSupabaseAdminClient();
  const { data, error } = await admin
    .from("services")
    .select("id, slug, category, title, summary, status, sort_order")
    .is("deleted_at", null)
    .order("sort_order");

  if (error) return apiError("DB_ERROR", "Failed to load services", 500);
  return apiOk({ services: data ?? [] });
}

const serviceSchema = z
  .object({
    id: z.string().uuid().optional(),
    slug: z.string().min(2).max(80),
    category: z.string().min(2).max(64),
    title: z.string().min(2).max(120),
    summary: z.string().min(10).max(500),
    problemStatement: z.string().min(10).max(2000),
    solutionApproach: z.string().min(10).max(2000),
    techTags: z.array(z.string()).default([]),
    status: z.enum(["draft", "in_review", "published", "archived"]).default("draft"),
    sortOrder: z.number().int().default(0),
  })
  .strict();

export async function POST(request: NextRequest) {
  const csrf = validateMutationCsrf(request);
  if (!csrf.ok) return apiError("CSRF_REJECTED", csrf.reason ?? "Origin invalid", csrf.status ?? 403);

  const auth = await requirePermission("services", "create");
  if (!auth.ok) return auth.response;

  const parsedBody = await parseJsonBody(request);
  if (!parsedBody.ok) return apiError("INVALID_JSON", "Invalid JSON body", 400);

  const parsed = serviceSchema.safeParse(parsedBody.data);
  if (!parsed.success) {
    return apiError("VALIDATION_ERROR", "Invalid service fields", 400, formatZodError(parsed.error));
  }

  if (parsed.data.status === "published") {
    const pubAuth = await requirePermission("services", "publish");
    if (!pubAuth.ok) return pubAuth.response;
  }

  if (!isSupabaseAdminConfigured()) {
    return apiOk({ created: true, slug: parsed.data.slug, demoMode: true }, 201);
  }

  const admin = getSupabaseAdminClient();
  const { data, error } = await admin
    .from("services")
    .insert({
      slug: parsed.data.slug,
      category: parsed.data.category,
      title: parsed.data.title,
      summary: parsed.data.summary,
      problem_statement: parsed.data.problemStatement,
      solution_approach: parsed.data.solutionApproach,
      tech_tags: parsed.data.techTags,
      status: parsed.data.status,
      sort_order: parsed.data.sortOrder,
    })
    .select("id, slug, title, status")
    .single();

  if (error || !data) {
    if (error?.code === "23505") return apiError("DUPLICATE_SLUG", "Service slug already exists", 409);
    return apiError("INSERT_FAILED", "Failed to create service", 500);
  }

  await writeRedactedAuditLog({
    actorUserId: auth.auth.userId,
    actorRoles: auth.auth.roles,
    action: "SERVICE_CREATED",
    resourceType: "services",
    resourceId: data.id,
    changedFields: ["slug", "title", "status"],
  });

  return apiOk(data, 201);
}
