import { type NextRequest } from "next/server";
import { z } from "zod";
import { apiError, apiOk, formatZodError, parseJsonBody } from "@/lib/api/http";
import { requirePermission, writeRedactedAuditLog } from "@/lib/auth/session";
import { validateMutationCsrf } from "@/lib/security/csrf";
import { getSupabaseAdminClient, isSupabaseAdminConfigured } from "@/lib/supabase/admin";

export async function GET() {
  const auth = await requirePermission("portfolio", "read");
  if (!auth.ok) return auth.response;

  if (!isSupabaseAdminConfigured()) {
    return apiOk({ items: [], demoMode: true });
  }

  const admin = getSupabaseAdminClient();
  const { data, error } = await admin
    .from("portfolio_items")
    .select("id, slug, title, project_type, is_client_approved, industry, status, is_featured, created_at")
    .order("created_at", { ascending: false });

  if (error) return apiError("DB_ERROR", "Failed to fetch portfolio items", 500);
  return apiOk({ items: data ?? [] });
}

const portfolioSchema = z
  .object({
    slug: z.string().min(2).max(100),
    title: z.string().min(2).max(160),
    projectType: z.enum(["reference_blueprint", "client_project"]),
    isClientApproved: z.boolean().default(false),
    clientDisplayName: z.string().max(120).optional(),
    industry: z.string().min(2).max(64),
    summary: z.string().min(10).max(600),
    challenge: z.string().min(10).max(3000),
    architecture: z.string().min(10).max(3000),
    outcomes: z.string().max(2000).optional(),
    techStack: z.array(z.string()).default([]),
    isFeatured: z.boolean().default(false),
    status: z.enum(["draft", "in_review", "published", "archived"]).default("draft"),
  })
  .strict();

export async function POST(request: NextRequest) {
  const csrf = validateMutationCsrf(request);
  if (!csrf.ok) return apiError("CSRF_REJECTED", csrf.reason ?? "Origin invalid", csrf.status ?? 403);

  const auth = await requirePermission("portfolio", "create");
  if (!auth.ok) return auth.response;

  const parsedBody = await parseJsonBody(request);
  if (!parsedBody.ok) return apiError("INVALID_JSON", "Invalid JSON body", 400);

  const parsed = portfolioSchema.safeParse(parsedBody.data);
  if (!parsed.success) {
    return apiError("VALIDATION_ERROR", "Invalid portfolio fields", 400, formatZodError(parsed.error));
  }

  // Strict check constraint: client_project cannot be published unless is_client_approved is true!
  if (
    parsed.data.projectType === "client_project" &&
    parsed.data.status === "published" &&
    !parsed.data.isClientApproved
  ) {
    return apiError(
      "UNAPPROVED_CLIENT_PROJECT",
      "Client projects cannot be published without verified client approval (is_client_approved = true)",
      422
    );
  }

  if (parsed.data.status === "published") {
    const pubAuth = await requirePermission("portfolio", "publish");
    if (!pubAuth.ok) return pubAuth.response;
  }

  if (!isSupabaseAdminConfigured()) {
    return apiOk({ created: true, slug: parsed.data.slug, demoMode: true }, 201);
  }

  const admin = getSupabaseAdminClient();
  const { data, error } = await admin
    .from("portfolio_items")
    .insert({
      slug: parsed.data.slug,
      title: parsed.data.title,
      project_type: parsed.data.projectType,
      is_client_approved: parsed.data.isClientApproved,
      client_display_name: parsed.data.clientDisplayName,
      industry: parsed.data.industry,
      summary: parsed.data.summary,
      challenge: parsed.data.challenge,
      architecture: parsed.data.architecture,
      outcomes: parsed.data.outcomes,
      tech_stack: parsed.data.techStack,
      is_featured: parsed.data.isFeatured,
      status: parsed.data.status,
    })
    .select("id, slug, title, status, project_type")
    .single();

  if (error || !data) {
    if (error?.code === "23505") return apiError("DUPLICATE_SLUG", "Portfolio slug exists", 409);
    return apiError("INSERT_FAILED", "Failed to save portfolio item", 500);
  }

  await writeRedactedAuditLog({
    actorUserId: auth.auth.userId,
    actorRoles: auth.auth.roles,
    action: "PORTFOLIO_CREATED",
    resourceType: "portfolio",
    resourceId: data.id,
    changedFields: ["slug", "project_type", "status", "is_client_approved"],
  });

  return apiOk(data, 201);
}
