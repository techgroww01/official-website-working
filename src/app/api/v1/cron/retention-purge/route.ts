import { type NextRequest } from "next/server";
import { apiError, apiOk, verifyCronSecret } from "@/lib/api/http";
import { writeRedactedAuditLog } from "@/lib/auth/session";
import { getSupabaseAdminClient, isSupabaseAdminConfigured } from "@/lib/supabase/admin";

export async function GET(request: NextRequest) {
  if (!verifyCronSecret(request)) {
    return apiError("UNAUTHORIZED_CRON", "Invalid cron authorization header", 401);
  }

  if (!isSupabaseAdminConfigured()) {
    return apiOk({ purgedApplications: 0, purgedEnquiries: 0, demoMode: true });
  }

  const admin = getSupabaseAdminClient();
  const now = new Date().toISOString();

  // 1. Find applications past retention expiration where anonymized_at is null
  const { data: expiredApps } = await admin
    .from("applications")
    .select("id, resume_asset_id")
    .is("anonymized_at", null)
    .lte("retention_expires_at", now)
    .limit(50);

  let purgedApplications = 0;
  if (expiredApps && expiredApps.length > 0) {
    for (const app of expiredApps) {
      // Remove resume asset if present
      if (app.resume_asset_id) {
        const { data: asset } = await admin
          .from("media_assets")
          .select("bucket, storage_path")
          .eq("id", app.resume_asset_id)
          .maybeSingle();

        if (asset) {
          await admin.storage.from(asset.bucket).remove([asset.storage_path]);
          await admin.from("media_assets").delete().eq("id", app.resume_asset_id);
        }
      }

      // Anonymize application record
      await admin
        .from("applications")
        .update({
          full_name: "Redacted Candidate",
          email: `redacted_${app.id.slice(0, 8)}@retention.local`,
          phone: "0000000000",
          linkedin_url: null,
          portfolio_url: null,
          cover_note: null,
          resume_asset_id: null,
          anonymized_at: now,
        })
        .eq("id", app.id);

      purgedApplications++;
    }

    await writeRedactedAuditLog({
      actorUserId: null,
      actorRoles: ["system_cron"],
      action: "RETENTION_APPLICATIONS_PURGED",
      resourceType: "application",
      resourceId: `batch_${purgedApplications}`,
      changedFields: ["anonymized_at"],
    });
  }

  // 2. Anonymize contact enquiries older than 24 months
  const { data: expiredEnquiries } = await admin
    .from("contact_enquiries")
    .select("id")
    .lte("retention_expires_at", now)
    .limit(100);

  let purgedEnquiries = 0;
  if (expiredEnquiries && expiredEnquiries.length > 0) {
    const ids = expiredEnquiries.map((e) => e.id);
    await admin
      .from("contact_enquiries")
      .update({
        full_name: "Redacted Inquirer",
        email: "redacted@retention.local",
        phone: null,
        message: "[REDACTED PURSUANT TO RETENTION POLICY]",
      })
      .in("id", ids);

    purgedEnquiries = ids.length;

    await writeRedactedAuditLog({
      actorUserId: null,
      actorRoles: ["system_cron"],
      action: "RETENTION_ENQUIRIES_PURGED",
      resourceType: "contact_enquiries",
      resourceId: `batch_${purgedEnquiries}`,
    });
  }

  return apiOk({ purgedApplications, purgedEnquiries, timestamp: now });
}
