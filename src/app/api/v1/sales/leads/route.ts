import { type NextRequest } from "next/server";
import { z } from "zod";
import { apiError, apiOk, formatZodError, parseJsonBody } from "@/lib/api/http";
import { requirePermission, writeRedactedAuditLog } from "@/lib/auth/session";
import { validateMutationCsrf } from "@/lib/security/csrf";
import { getSupabaseAdminClient, isSupabaseAdminConfigured } from "@/lib/supabase/admin";

export async function GET() {
  const auth = await requirePermission("leads", "read");
  if (!auth.ok) return auth.response;

  if (!isSupabaseAdminConfigured()) {
    return apiOk({ leads: [], demoMode: true });
  }

  const admin = getSupabaseAdminClient();
  let query = admin
    .from("leads")
    .select("id, company_name, full_name, email, phone, service_interest, budget_bracket, stage, assigned_to, created_at");

  // sales_rep can only view leads assigned to them
  if (auth.auth.roles.includes("sales_rep") && !auth.auth.roles.includes("sales_manager") && !auth.auth.roles.includes("sales_admin") && !auth.auth.roles.includes("super_admin")) {
    query = query.eq("assigned_to", auth.auth.userId);
  }

  const { data, error } = await query.order("created_at", { ascending: false });
  if (error) return apiError("DB_ERROR", "Failed to retrieve leads", 500);

  return apiOk({ leads: data ?? [] });
}

const leadPatchSchema = z
  .object({
    leadId: z.string().uuid(),
    stage: z.enum(["new", "contacted", "qualified", "unqualified", "converted"]).optional(),
    assignedTo: z.string().uuid().nullable().optional(),
  })
  .strict();

export async function PATCH(request: NextRequest) {
  const csrf = validateMutationCsrf(request);
  if (!csrf.ok) return apiError("CSRF_REJECTED", csrf.reason ?? "Origin invalid", csrf.status ?? 403);

  const auth = await requirePermission("leads", "update");
  if (!auth.ok) return auth.response;

  const parsedBody = await parseJsonBody(request);
  if (!parsedBody.ok) return apiError("INVALID_JSON", "Invalid JSON body", 400);

  const parsed = leadPatchSchema.safeParse(parsedBody.data);
  if (!parsed.success) {
    return apiError("VALIDATION_ERROR", "Invalid lead update parameters", 400, formatZodError(parsed.error));
  }

  if (!isSupabaseAdminConfigured()) {
    return apiOk({ updated: true, leadId: parsed.data.leadId, demoMode: true });
  }

  const admin = getSupabaseAdminClient();
  const updates: Record<string, unknown> = {};
  if (parsed.data.stage) updates.stage = parsed.data.stage;
  if (parsed.data.assignedTo !== undefined) updates.assigned_to = parsed.data.assignedTo;

  const { data, error } = await admin
    .from("leads")
    .update(updates)
    .eq("id", parsed.data.leadId)
    .select("id, stage, assigned_to")
    .single();

  if (error || !data) return apiError("UPDATE_FAILED", "Failed to update lead", 500);

  await writeRedactedAuditLog({
    actorUserId: auth.auth.userId,
    actorRoles: auth.auth.roles,
    action: "LEAD_UPDATED",
    resourceType: "leads",
    resourceId: data.id,
    changedFields: Object.keys(updates),
  });

  return apiOk(data);
}
