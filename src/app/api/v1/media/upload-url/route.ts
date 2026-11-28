import { randomUUID } from "node:crypto";
import { type NextRequest } from "next/server";
import { z } from "zod";
import { apiError, apiOk, formatZodError, parseJsonBody } from "@/lib/api/http";
import { requirePermission } from "@/lib/auth/session";
import { signHmacPayload } from "@/lib/security/crypto";
import { validateMutationCsrf } from "@/lib/security/csrf";
import { checkRateLimit, getTrustedClientIp } from "@/lib/security/rate-limit";
import {
  type UploadDomain,
  validateUploadMetadata,
} from "@/lib/security/upload-validator";
import { getSupabaseAdminClient, isSupabaseAdminConfigured } from "@/lib/supabase/admin";

const uploadIntentSchema = z
  .object({
    domain: z.enum(["cms", "client", "intern", "offer", "proposal", "billing"]),
    filename: z.string().min(1).max(255),
    mimeType: z.string().min(3).max(128),
    byteSize: z.number().int().positive(),
    folder: z.string().max(64).optional(),
    altText: z.string().max(255).optional(),
    isDecorative: z.boolean().default(false),
  })
  .strict();

export async function POST(request: NextRequest) {
  const csrf = validateMutationCsrf(request);
  if (!csrf.ok) return apiError("CSRF_REJECTED", csrf.reason ?? "Origin invalid", csrf.status ?? 403);

  const auth = await requirePermission("media", "create");
  if (!auth.ok) return auth.response;

  const ip = getTrustedClientIp(request);
  const rl = await checkRateLimit("portal_api", `${auth.auth.userId}:upload`);
  if (!rl.allowed) return apiError("RATE_LIMITED", "Upload rate limit reached", 429);

  const parsedBody = await parseJsonBody(request);
  if (!parsedBody.ok) return apiError("INVALID_JSON", "Invalid JSON payload", 400);

  const parsed = uploadIntentSchema.safeParse(parsedBody.data);
  if (!parsed.success) {
    return apiError("VALIDATION_ERROR", "Invalid upload parameters", 400, formatZodError(parsed.error));
  }

  const metaCheck = validateUploadMetadata(
    parsed.data.domain as UploadDomain,
    parsed.data.filename,
    parsed.data.mimeType,
    parsed.data.byteSize
  );

  if (!metaCheck.ok) {
    return apiError("INVALID_FILE", metaCheck.error ?? "Invalid upload", metaCheck.status ?? 415);
  }

  const bucket = parsed.data.domain === "cms" ? "public_assets" : "private_uploads";
  const ext = parsed.data.filename.split(".").pop()?.toLowerCase() ?? "bin";
  const storagePath = `${parsed.data.folder ?? parsed.data.domain}/${randomUUID()}.${ext}`;

  const commitToken = signHmacPayload(
    {
      bucket,
      storagePath,
      mimeType: parsed.data.mimeType,
      byteSize: parsed.data.byteSize,
      userId: auth.auth.userId,
      domain: parsed.data.domain,
      folder: parsed.data.folder ?? parsed.data.domain,
      altText: parsed.data.altText ?? "",
      isDecorative: parsed.data.isDecorative,
    },
    900
  );

  if (!isSupabaseAdminConfigured()) {
    return apiOk({
      uploadUrl: null,
      commitToken,
      bucket,
      storagePath,
      demoMode: true,
    });
  }

  const admin = getSupabaseAdminClient();
  const { data, error } = await admin.storage.from(bucket).createSignedUploadUrl(storagePath);

  if (error || !data?.signedUrl) {
    return apiError("STORAGE_ERROR", "Could not generate upload URL", 500);
  }

  return apiOk({
    uploadUrl: data.signedUrl,
    commitToken,
    bucket,
    storagePath,
    demoMode: false,
  });
}
