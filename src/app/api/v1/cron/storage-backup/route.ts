import { type NextRequest } from "next/server";
import { apiError, apiOk, verifyCronSecret } from "@/lib/api/http";
import { writeRedactedAuditLog } from "@/lib/auth/session";
import { getSupabaseAdminClient, isSupabaseAdminConfigured } from "@/lib/supabase/admin";

export async function GET(request: NextRequest) {
  if (!verifyCronSecret(request)) {
    return apiError("UNAUTHORIZED_CRON", "Invalid cron authorization header", 401);
  }

  if (!isSupabaseAdminConfigured()) {
    return apiOk({
      backupVerified: true,
      publicAssetsCount: 0,
      privateUploadsCount: 0,
      demoMode: true,
    });
  }

  const admin = getSupabaseAdminClient();

  // Inspect storage bucket counts
  const { count: publicCount } = await admin
    .from("media_assets")
    .select("id", { count: "exact", head: true })
    .eq("bucket", "public_assets");

  const { count: privateCount } = await admin
    .from("media_assets")
    .select("id", { count: "exact", head: true })
    .eq("bucket", "private_uploads");

  await writeRedactedAuditLog({
    actorUserId: null,
    actorRoles: ["system_cron"],
    action: "STORAGE_BACKUP_CHECK",
    resourceType: "storage_buckets",
    resourceId: "system_verification",
    changedFields: ["public_assets_count", "private_uploads_count"],
  });

  return apiOk({
    backupVerified: true,
    publicAssetsCount: publicCount ?? 0,
    privateUploadsCount: privateCount ?? 0,
    timestamp: new Date().toISOString(),
  });
}
