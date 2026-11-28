import { revalidateTag } from "next/cache";
import { type NextRequest } from "next/server";
import { apiError, apiOk, verifyCronSecret } from "@/lib/api/http";
import { writeRedactedAuditLog } from "@/lib/auth/session";
import { getSupabaseAdminClient, isSupabaseAdminConfigured } from "@/lib/supabase/admin";

export async function GET(request: NextRequest) {
  if (!verifyCronSecret(request)) {
    return apiError("UNAUTHORIZED_CRON", "Invalid cron authorization header", 401);
  }

  if (!isSupabaseAdminConfigured()) {
    return apiOk({ publishedArticles: 0, demoMode: true });
  }

  const admin = getSupabaseAdminClient();
  const now = new Date().toISOString();

  // Find articles scheduled for publication at or before now
  const { data: articles, error } = await admin
    .from("articles")
    .select("id, slug, title")
    .eq("status", "scheduled")
    .lte("scheduled_publish_at", now);

  if (error || !articles || articles.length === 0) {
    return apiOk({ publishedArticles: 0 });
  }

  const ids = articles.map((a) => a.id);
  const { error: updateErr } = await admin
    .from("articles")
    .update({
      status: "published",
      published_at: now,
    })
    .in("id", ids);

  if (updateErr) {
    return apiError("UPDATE_FAILED", "Failed to transition scheduled articles", 500);
  }

  // Purge public cache tag for insights
  revalidateTag("insights", "max");

  await writeRedactedAuditLog({
    actorUserId: null,
    actorRoles: ["system_cron"],
    action: "SCHEDULED_ARTICLES_PUBLISHED",
    resourceType: "articles",
    resourceId: `batch_${ids.length}`,
    changedFields: ["status", "published_at"],
  });

  return apiOk({ publishedArticles: ids.length, ids });
}
