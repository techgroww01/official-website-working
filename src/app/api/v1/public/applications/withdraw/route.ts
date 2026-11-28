import { type NextRequest } from "next/server";
import { z } from "zod";
import { apiError, apiOk, formatZodError, parseJsonBody } from "@/lib/api/http";
import { writeRedactedAuditLog } from "@/lib/auth/session";
import { hashClientIp, sha256Hex } from "@/lib/security/crypto";
import { validateMutationCsrf } from "@/lib/security/csrf";
import { checkRateLimit, getTrustedClientIp } from "@/lib/security/rate-limit";
import { getSupabaseAdminClient, isSupabaseAdminConfigured } from "@/lib/supabase/admin";

const withdrawSchema = z.object({ token: z.string().min(10).max(256) }).strict();

export async function POST(request: NextRequest) {
  const csrf = validateMutationCsrf(request);
  if (!csrf.ok) return apiError("CSRF_REJECTED", csrf.reason ?? "Origin invalid", csrf.status ?? 403);

  const ip = getTrustedClientIp(request);
  const rl = await checkRateLimit("public_apply", `${ip}:withdraw`);
  if (!rl.allowed) return apiError("RATE_LIMITED", "Too many requests", 429);

  const parsedBody = await parseJsonBody(request);
  if (!parsedBody.ok) return apiError("INVALID_JSON", "Invalid JSON payload", 400);

  const parsed = withdrawSchema.safeParse(parsedBody.data);
  if (!parsed.success) {
    return apiError("VALIDATION_ERROR", "Valid status token required", 400, formatZodError(parsed.error));
  }

  if (!isSupabaseAdminConfigured()) {
    return apiOk({ stage: "withdrawn", demoMode: true });
  }

  const admin = getSupabaseAdminClient();
  const { data: app, error } = await admin
    .from("applications")
    .update({ stage: "withdrawn" })
    .eq("status_token_hash", sha256Hex(parsed.data.token))
    .is("anonymized_at", null)
    .select("id, stage")
    .maybeSingle();

  if (error || !app) {
    return apiError("NOT_FOUND", "Active application not found for provided token", 404);
  }

  await writeRedactedAuditLog({
    actorUserId: null,
    actorRoles: ["candidate_token"],
    action: "APPLICATION_WITHDRAWN",
    resourceType: "application",
    resourceId: app.id,
    changedFields: ["stage"],
    ipHash: hashClientIp(ip),
  });

  return apiOk({ id: app.id, stage: app.stage });
}
