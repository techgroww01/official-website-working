import { type NextRequest } from "next/server";
import { z } from "zod";
import { apiError, apiOk, formatZodError, parseJsonBody } from "@/lib/api/http";
import { writeRedactedAuditLog } from "@/lib/auth/session";
import { validateMutationCsrf } from "@/lib/security/csrf";
import { getSupabaseAdminClient, isSupabaseAdminConfigured } from "@/lib/supabase/admin";
import { createServerSupabaseClient } from "@/lib/supabase/server";

const resetSchema = z
  .object({
    password: z.string().min(12).max(128),
  })
  .strict();

export async function POST(request: NextRequest) {
  const csrf = validateMutationCsrf(request);
  if (!csrf.ok) return apiError("CSRF_REJECTED", csrf.reason ?? "Origin invalid", csrf.status ?? 403);

  const parsedBody = await parseJsonBody(request);
  if (!parsedBody.ok) return apiError("INVALID_JSON", "Invalid JSON body", 400);

  const parsed = resetSchema.safeParse(parsedBody.data);
  if (!parsed.success) {
    return apiError("VALIDATION_ERROR", "Password must be at least 12 characters", 400, formatZodError(parsed.error));
  }

  const supabase = await createServerSupabaseClient();
  const { data: userData, error: userErr } = await supabase.auth.getUser();

  if (userErr || !userData?.user) {
    return apiError("UNAUTHORIZED", "Password reset session has expired. Please request a new link.", 401);
  }

  const { error: updateErr } = await supabase.auth.updateUser({
    password: parsed.data.password,
  });

  if (updateErr) {
    return apiError("UPDATE_FAILED", updateErr.message, 400);
  }

  // Increment session_version to invalidate other active sessions
  if (isSupabaseAdminConfigured()) {
    const admin = getSupabaseAdminClient();
    await admin.rpc("increment_session_version", { p_user_id: userData.user.id });
  }

  await writeRedactedAuditLog({
    actorUserId: userData.user.id,
    actorRoles: ["auth_reset"],
    action: "PASSWORD_RESET_COMPLETED",
    resourceType: "user",
    resourceId: userData.user.id,
  });

  return apiOk({ updated: true });
}
