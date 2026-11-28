import { type NextRequest } from "next/server";
import { z } from "zod";
import { apiError, apiOk, formatZodError, parseJsonBody } from "@/lib/api/http";
import { requirePermission, writeRedactedAuditLog } from "@/lib/auth/session";
import { validateMutationCsrf } from "@/lib/security/csrf";
import { getSupabaseAdminClient, isSupabaseAdminConfigured } from "@/lib/supabase/admin";

const submitSchema = z
  .object({
    taskId: z.string().uuid(),
    submissionUrl: z.string().url().max(500),
    notes: z.string().max(2000).optional(),
  })
  .strict();

export async function POST(request: NextRequest) {
  const csrf = validateMutationCsrf(request);
  if (!csrf.ok) return apiError("CSRF_REJECTED", csrf.reason ?? "Origin invalid", csrf.status ?? 403);

  const auth = await requirePermission("task_submissions", "create");
  if (!auth.ok) return auth.response;

  const parsedBody = await parseJsonBody(request);
  if (!parsedBody.ok) return apiError("INVALID_JSON", "Invalid JSON payload", 400);

  const parsed = submitSchema.safeParse(parsedBody.data);
  if (!parsed.success) {
    return apiError("VALIDATION_ERROR", "Invalid submission parameters", 400, formatZodError(parsed.error));
  }

  if (!isSupabaseAdminConfigured()) {
    return apiOk({ created: true, submissionId: "demo-submission-id", demoMode: true }, 201);
  }

  const admin = getSupabaseAdminClient();
  const { data, error } = await admin
    .from("task_submissions")
    .insert({
      task_id: parsed.data.taskId,
      submitted_by: auth.auth.userId,
      submission_url: parsed.data.submissionUrl,
      notes: parsed.data.notes ?? null,
    })
    .select("id, task_id, submission_url, created_at")
    .single();

  if (error || !data) return apiError("DB_ERROR", "Failed to record submission", 500);

  // Update task status to in_review
  await admin
    .from("intern_tasks")
    .update({ status: "in_review" })
    .eq("id", parsed.data.taskId);

  await writeRedactedAuditLog({
    actorUserId: auth.auth.userId,
    actorRoles: auth.auth.roles,
    action: "TASK_SUBMITTED",
    resourceType: "task_submissions",
    resourceId: data.id,
    changedFields: ["submission_url"],
  });

  return apiOk(data, 201);
}
