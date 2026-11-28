import { type NextRequest } from "next/server";
import { z } from "zod";
import { apiError, apiOk, formatZodError, parseJsonBody } from "@/lib/api/http";
import { requirePermission, writeRedactedAuditLog } from "@/lib/auth/session";
import { validateMutationCsrf } from "@/lib/security/csrf";
import { getSupabaseAdminClient, isSupabaseAdminConfigured } from "@/lib/supabase/admin";

export async function GET() {
  const auth = await requirePermission("applications", "read");
  if (!auth.ok) return auth.response;

  if (!isSupabaseAdminConfigured()) {
    return apiOk({ applications: [], demoMode: true });
  }

  const admin = getSupabaseAdminClient();
  const { data, error } = await admin
    .from("applications")
    .select("id, full_name, email, stage, talent_pool_consent, created_at, job_postings(title)")
    .is("anonymized_at", null)
    .order("created_at", { ascending: false });

  if (error) return apiError("DB_ERROR", "Failed to load candidate applications", 500);

  return apiOk({ applications: data ?? [] });
}

const stagePatchSchema = z
  .object({
    applicationId: z.string().uuid(),
    stage: z.enum(["applied", "screening", "interview", "offered", "accepted", "rejected", "withdrawn"]),
  })
  .strict();

export async function PATCH(request: NextRequest) {
  const csrf = validateMutationCsrf(request);
  if (!csrf.ok) return apiError("CSRF_REJECTED", csrf.reason ?? "Origin invalid", csrf.status ?? 403);

  const auth = await requirePermission("applications", "update");
  if (!auth.ok) return auth.response;

  const parsedBody = await parseJsonBody(request);
  if (!parsedBody.ok) return apiError("INVALID_JSON", "Invalid JSON payload", 400);

  const parsed = stagePatchSchema.safeParse(parsedBody.data);
  if (!parsed.success) {
    return apiError("VALIDATION_ERROR", "Invalid stage change", 400, formatZodError(parsed.error));
  }

  if (!isSupabaseAdminConfigured()) {
    return apiOk({ updated: true, applicationId: parsed.data.applicationId, demoMode: true });
  }

  const admin = getSupabaseAdminClient();
  const { data, error } = await admin
    .from("applications")
    .update({ stage: parsed.data.stage })
    .eq("id", parsed.data.applicationId)
    .select("id, stage")
    .single();

  if (error || !data) return apiError("UPDATE_FAILED", "Unable to update candidate stage", 500);

  await writeRedactedAuditLog({
    actorUserId: auth.auth.userId,
    actorRoles: auth.auth.roles,
    action: "CANDIDATE_STAGE_CHANGED",
    resourceType: "applications",
    resourceId: data.id,
    changedFields: ["stage"],
  });

  return apiOk(data);
}
