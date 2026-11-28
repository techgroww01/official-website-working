import { randomUUID } from "node:crypto";
import { type NextRequest } from "next/server";
import { z } from "zod";
import { apiError, apiOk, formatZodError, parseJsonBody } from "@/lib/api/http";
import { verifyTurnstileToken } from "@/lib/auth/session";
import { signHmacPayload } from "@/lib/security/crypto";
import { validateMutationCsrf } from "@/lib/security/csrf";
import { checkRateLimit, getTrustedClientIp } from "@/lib/security/rate-limit";
import { validateUploadMetadata } from "@/lib/security/upload-validator";
import { getSupabaseAdminClient, isSupabaseAdminConfigured } from "@/lib/supabase/admin";

const intentSchema = z
  .object({
    postingId: z.string().min(1).max(128),
    filename: z.string().min(1).max(255),
    mimeType: z.string().min(3).max(128),
    byteSize: z.number().int().positive(),
    turnstileToken: z.string().min(1),
  })
  .strict();

export async function POST(request: NextRequest) {
  const csrf = validateMutationCsrf(request);
  if (!csrf.ok) return apiError("CSRF_REJECTED", csrf.reason ?? "Origin invalid", csrf.status ?? 403);

  const ip = getTrustedClientIp(request);
  const rl = await checkRateLimit("public_apply", `${ip}:upload`);
  if (!rl.allowed) {
    return apiError("RATE_LIMITED", "Too many upload attempts. Please wait.", 429, undefined, {
      "Retry-After": String(rl.resetSeconds),
    });
  }

  const parsedBody = await parseJsonBody(request);
  if (!parsedBody.ok) return apiError("INVALID_JSON", "Request body must be valid JSON", 400);

  const parsed = intentSchema.safeParse(parsedBody.data);
  if (!parsed.success) {
    return apiError("VALIDATION_ERROR", "Invalid upload metadata", 400, formatZodError(parsed.error));
  }

  const turnstileOk = await verifyTurnstileToken(parsed.data.turnstileToken, ip);
  if (!turnstileOk) return apiError("TURNSTILE_FAILED", "Security verification failed", 400);

  const metaCheck = validateUploadMetadata(
    "resume",
    parsed.data.filename,
    parsed.data.mimeType,
    parsed.data.byteSize
  );
  if (!metaCheck.ok) {
    return apiError("INVALID_FILE", metaCheck.error ?? "Unsupported file", metaCheck.status ?? 415);
  }

  const ext = parsed.data.mimeType.includes("pdf") ? "pdf" : "docx";
  const storagePath = `resumes/${parsed.data.postingId}/${randomUUID()}.${ext}`;
  const bucket = "private_uploads";

  const uploadCommitToken = signHmacPayload(
    {
      bucket,
      path: storagePath,
      mimeType: parsed.data.mimeType.toLowerCase().trim(),
      byteSize: parsed.data.byteSize,
      postingId: parsed.data.postingId,
    },
    900
  );

  if (!isSupabaseAdminConfigured()) {
    return apiOk({
      uploadUrl: null,
      uploadCommitToken,
      bucket,
      path: storagePath,
      demoMode: true,
    });
  }

  const admin = getSupabaseAdminClient();
  const { data, error } = await admin.storage.from(bucket).createSignedUploadUrl(storagePath);
  if (error || !data?.signedUrl) {
    return apiError("STORAGE_ERROR", "Unable to provision resume upload URL", 500);
  }

  return apiOk({
    uploadUrl: data.signedUrl,
    uploadCommitToken,
    bucket,
    path: storagePath,
    demoMode: false,
  });
}
