import { revalidateTag } from "next/cache";
import { type NextRequest } from "next/server";
import { z } from "zod";
import { apiError, apiOk, formatZodError, parseJsonBody } from "@/lib/api/http";
import { requirePermission, writeRedactedAuditLog } from "@/lib/auth/session";
import { validateMutationCsrf } from "@/lib/security/csrf";
import { getSupabaseAdminClient, isSupabaseAdminConfigured } from "@/lib/supabase/admin";

export async function GET() {
  const auth = await requirePermission("blog", "read");
  if (!auth.ok) return auth.response;

  if (!isSupabaseAdminConfigured()) {
    return apiOk({ articles: [], demoMode: true });
  }

  const admin = getSupabaseAdminClient();
  const { data, error } = await admin
    .from("articles")
    .select("id, slug, title, category, status, published_at, scheduled_publish_at, created_at")
    .order("created_at", { ascending: false });

  if (error) return apiError("DB_ERROR", "Failed to fetch articles", 500);
  return apiOk({ articles: data ?? [] });
}

const articleSchema = z
  .object({
    slug: z.string().min(2).max(120),
    title: z.string().min(2).max(200),
    summary: z.string().min(10).max(600),
    bodyMarkdown: z.string().min(20),
    category: z.string().min(2).max(64),
    readingTimeMinutes: z.number().int().positive().default(5),
    status: z.enum(["draft", "in_review", "scheduled", "published", "archived"]).default("draft"),
    scheduledPublishAt: z.string().datetime().optional(),
  })
  .strict();

export async function POST(request: NextRequest) {
  const csrf = validateMutationCsrf(request);
  if (!csrf.ok) return apiError("CSRF_REJECTED", csrf.reason ?? "Origin invalid", csrf.status ?? 403);

  const auth = await requirePermission("blog", "create");
  if (!auth.ok) return auth.response;

  const parsedBody = await parseJsonBody(request);
  if (!parsedBody.ok) return apiError("INVALID_JSON", "Invalid JSON body", 400);

  const parsed = articleSchema.safeParse(parsedBody.data);
  if (!parsed.success) {
    return apiError("VALIDATION_ERROR", "Invalid article data", 400, formatZodError(parsed.error));
  }

  if (parsed.data.status === "published" || parsed.data.status === "scheduled") {
    const pubAuth = await requirePermission("blog", "publish");
    if (!pubAuth.ok) return pubAuth.response;
  }

  if (!isSupabaseAdminConfigured()) {
    return apiOk({ created: true, slug: parsed.data.slug, demoMode: true }, 201);
  }

  const admin = getSupabaseAdminClient();
  const publishedAt = parsed.data.status === "published" ? new Date().toISOString() : null;

  const { data, error } = await admin
    .from("articles")
    .insert({
      slug: parsed.data.slug,
      title: parsed.data.title,
      summary: parsed.data.summary,
      body_markdown: parsed.data.bodyMarkdown,
      category: parsed.data.category,
      reading_time_minutes: parsed.data.readingTimeMinutes,
      status: parsed.data.status,
      published_at: publishedAt,
      scheduled_publish_at: parsed.data.scheduledPublishAt ?? null,
      author_id: auth.auth.userId,
    })
    .select("id, slug, title, status, published_at")
    .single();

  if (error || !data) {
    if (error?.code === "23505") return apiError("DUPLICATE_SLUG", "Article slug already exists", 409);
    return apiError("INSERT_FAILED", "Failed to create article", 500);
  }

  if (parsed.data.status === "published") {
    revalidateTag("insights", "max");
  }

  await writeRedactedAuditLog({
    actorUserId: auth.auth.userId,
    actorRoles: auth.auth.roles,
    action: "ARTICLE_CREATED",
    resourceType: "blog",
    resourceId: data.id,
    changedFields: ["slug", "title", "status"],
  });

  return apiOk(data, 201);
}
