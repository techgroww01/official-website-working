import { type NextRequest } from "next/server";
import { z } from "zod";
import { apiError, apiOk, formatZodError, parseJsonBody } from "@/lib/api/http";
import { requirePermission } from "@/lib/auth/session";
import { validateMutationCsrf } from "@/lib/security/csrf";
import { getSupabaseAdminClient, isSupabaseAdminConfigured } from "@/lib/supabase/admin";

const convertSchema = z
  .object({
    opportunityId: z.string().uuid(),
    projectCode: z.string().min(3).max(32),
    operationsManagerId: z.string().uuid().optional(),
  })
  .strict();

export async function POST(request: NextRequest) {
  const csrf = validateMutationCsrf(request);
  if (!csrf.ok) return apiError("CSRF_REJECTED", csrf.reason ?? "Origin invalid", csrf.status ?? 403);

  const auth = await requirePermission("opportunities", "approve");
  if (!auth.ok) return auth.response;

  const parsedBody = await parseJsonBody(request);
  if (!parsedBody.ok) return apiError("INVALID_JSON", "Invalid JSON body", 400);

  const parsed = convertSchema.safeParse(parsedBody.data);
  if (!parsed.success) {
    return apiError("VALIDATION_ERROR", "Invalid conversion parameters", 400, formatZodError(parsed.error));
  }

  if (!isSupabaseAdminConfigured()) {
    return apiOk({
      converted: true,
      projectId: "demo-client-project-id",
      projectCode: parsed.data.projectCode,
      demoMode: true,
    });
  }

  const admin = getSupabaseAdminClient();
  const { data: rpcRes, error: rpcErr } = await admin.rpc("convert_opportunity_to_project", {
    p_opp_id: parsed.data.opportunityId,
    p_project_code: parsed.data.projectCode,
    p_ops_manager_id: parsed.data.operationsManagerId ?? auth.auth.userId,
    p_actor_id: auth.auth.userId,
  });

  if (rpcErr) {
    return apiError("CONVERSION_FAILED", rpcErr.message || "Failed to convert opportunity to client project", 500);
  }

  return apiOk(rpcRes);
}
