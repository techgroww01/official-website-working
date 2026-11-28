import { type NextRequest } from "next/server";
import { z } from "zod";
import { apiError, apiOk, formatZodError, parseJsonBody } from "@/lib/api/http";
import { requirePermission, writeRedactedAuditLog } from "@/lib/auth/session";
import { validateMutationCsrf } from "@/lib/security/csrf";
import { getSupabaseAdminClient, isSupabaseAdminConfigured } from "@/lib/supabase/admin";

const approveDeliverableSchema = z
  .object({
    deliverableId: z.string().uuid(),
    signOffNotes: z.string().max(1000).optional(),
  })
  .strict();

export async function POST(request: NextRequest) {
  const csrf = validateMutationCsrf(request);
  if (!csrf.ok) return apiError("CSRF_REJECTED", csrf.reason ?? "Origin invalid", csrf.status ?? 403);

  const auth = await requirePermission("deliverables", "approve");
  if (!auth.ok) return auth.response;

  const parsedBody = await parseJsonBody(request);
  if (!parsedBody.ok) return apiError("INVALID_JSON", "Invalid JSON body", 400);

  const parsed = approveDeliverableSchema.safeParse(parsedBody.data);
  if (!parsed.success) {
    return apiError("VALIDATION_ERROR", "Invalid deliverable sign-off", 400, formatZodError(parsed.error));
  }

  if (!isSupabaseAdminConfigured()) {
    return apiOk({ approved: true, deliverableId: parsed.data.deliverableId, demoMode: true });
  }

  const admin = getSupabaseAdminClient();
  const { data, error } = await admin
    .from("project_deliverables")
    .update({
      status: "approved",
      approved_by: auth.auth.userId,
      approved_at: new Date().toISOString(),
    })
    .eq("id", parsed.data.deliverableId)
    .select("id, title, status, approved_at")
    .single();

  if (error || !data) {
    return apiError("UPDATE_FAILED", "Unable to approve deliverable", 500);
  }

  await writeRedactedAuditLog({
    actorUserId: auth.auth.userId,
    actorRoles: auth.auth.roles,
    action: "DELIVERABLE_APPROVED",
    resourceType: "deliverables",
    resourceId: data.id,
    changedFields: ["status", "approved_at"],
  });

  return apiOk(data);
}
