import { type NextRequest } from "next/server";
import { z } from "zod";
import { apiError, apiOk, formatZodError, parseJsonBody } from "@/lib/api/http";
import { requirePermission, writeRedactedAuditLog } from "@/lib/auth/session";
import { validateMutationCsrf } from "@/lib/security/csrf";
import { getSupabaseAdminClient, isSupabaseAdminConfigured } from "@/lib/supabase/admin";

const eraseSchema = z.object({ applicationId: z.string().uuid() }).strict();

export async function POST(request: NextRequest) {
  const csrf = validateMutationCsrf(request);
  if (!csrf.ok) return apiError("CSRF_REJECTED", csrf.reason ?? "Origin invalid", csrf.status ?? 403);

  const auth = await requirePermission("retention", "manage");
  if (!auth.ok) return auth.response;

  const parsedBody = await parseJsonBody(request);
  if (!parsedBody.ok) return apiError("INVALID_JSON", "Invalid JSON body", 400);

  const parsed = eraseSchema.safeParse(parsedBody.data);
  if (!parsed.success) {
    return apiError("VALIDATION_ERROR", "Invalid application ID", 400, formatZodError(parsed.error));
  }

  if (!isSupabaseAdminConfigured()) {
    return apiOk({ erased: true, applicationId: parsed.data.applicationId, demoMode: true });
  }

  const admin = getSupabaseAdminClient();
  const { data: app } = await admin
    .from("applications")
    .select("id, resume_asset_id")
    .eq("id", parsed.data.applicationId)
    .single();

  if (app?.resume_asset_id) {
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

  await admin
    .from("applications")
    .update({
      full_name: "Erased Pursuant to Right to be Forgotten",
      email: `erased_${parsed.data.applicationId.slice(0, 8)}@dpdp.local`,
      phone: "0000000000",
      linkedin_url: null,
      portfolio_url: null,
      cover_note: null,
      resume_asset_id: null,
      anonymized_at: new Date().toISOString(),
    })
    .eq("id", parsed.data.applicationId);

  await writeRedactedAuditLog({
    actorUserId: auth.auth.userId,
    actorRoles: auth.auth.roles,
    action: "DPDP_IMMEDIATE_ERASURE_EXECUTED",
    resourceType: "applications",
    resourceId: parsed.data.applicationId,
    changedFields: ["anonymized_at"],
  });

  return apiOk({ erased: true, applicationId: parsed.data.applicationId });
}
