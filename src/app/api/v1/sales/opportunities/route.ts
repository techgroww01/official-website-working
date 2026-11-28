import { type NextRequest } from "next/server";
import { z } from "zod";
import { apiError, apiOk, formatZodError, parseJsonBody } from "@/lib/api/http";
import { requirePermission, writeRedactedAuditLog } from "@/lib/auth/session";
import { validateMutationCsrf } from "@/lib/security/csrf";
import { getSupabaseAdminClient, isSupabaseAdminConfigured } from "@/lib/supabase/admin";

export async function GET() {
  const auth = await requirePermission("opportunities", "read");
  if (!auth.ok) return auth.response;

  if (!isSupabaseAdminConfigured()) {
    return apiOk({ opportunities: [], demoMode: true });
  }

  const admin = getSupabaseAdminClient();
  const { data, error } = await admin
    .from("opportunities")
    .select("id, organization_id, title, estimated_value, currency, pipeline_stage, expected_close_date, owner_id, organizations(name)")
    .order("created_at", { ascending: false });

  if (error) return apiError("DB_ERROR", "Failed to retrieve opportunities", 500);
  return apiOk({ opportunities: data ?? [] });
}

const oppPatchSchema = z
  .object({
    id: z.string().uuid(),
    pipelineStage: z.enum(["qualification", "discovery", "proposal", "negotiation", "won", "lost"]),
    lostReason: z.string().max(500).optional(),
  })
  .strict();

export async function PATCH(request: NextRequest) {
  const csrf = validateMutationCsrf(request);
  if (!csrf.ok) return apiError("CSRF_REJECTED", csrf.reason ?? "Origin invalid", csrf.status ?? 403);

  const auth = await requirePermission("opportunities", "update");
  if (!auth.ok) return auth.response;

  const parsedBody = await parseJsonBody(request);
  if (!parsedBody.ok) return apiError("INVALID_JSON", "Invalid JSON payload", 400);

  const parsed = oppPatchSchema.safeParse(parsedBody.data);
  if (!parsed.success) {
    return apiError("VALIDATION_ERROR", "Invalid pipeline stage update", 400, formatZodError(parsed.error));
  }

  if (!isSupabaseAdminConfigured()) {
    return apiOk({ updated: true, id: parsed.data.id, demoMode: true });
  }

  const admin = getSupabaseAdminClient();
  const { data, error } = await admin
    .from("opportunities")
    .update({
      pipeline_stage: parsed.data.pipelineStage,
      lost_reason: parsed.data.lostReason ?? null,
    })
    .eq("id", parsed.data.id)
    .select("id, pipeline_stage")
    .single();

  if (error || !data) return apiError("UPDATE_FAILED", "Unable to update opportunity", 500);

  await writeRedactedAuditLog({
    actorUserId: auth.auth.userId,
    actorRoles: auth.auth.roles,
    action: "OPPORTUNITY_STAGE_UPDATED",
    resourceType: "opportunities",
    resourceId: data.id,
    changedFields: ["pipeline_stage"],
  });

  return apiOk(data);
}
