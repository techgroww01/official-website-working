import { type NextRequest } from "next/server";
import { z } from "zod";
import { apiError, apiOk, formatZodError, parseJsonBody } from "@/lib/api/http";
import { requirePermission, writeRedactedAuditLog } from "@/lib/auth/session";
import { verifyHmacPayload } from "@/lib/security/crypto";
import { validateMutationCsrf } from "@/lib/security/csrf";
import { DOMAIN_SIZE_LIMITS, type UploadDomain, verifyFileMagicAndStructure } from "@/lib/security/upload-validator";
import { getSupabaseAdminClient, isSupabaseAdminConfigured } from "@/lib/supabase/admin";

const commitSchema = z
  .object({
    commitToken: z.string().min(10),
  })
  .strict();

interface MediaCommitPayload extends Record<string, unknown> {
  bucket: string;
  storagePath: string;
  mimeType: string;
  byteSize: number;
  userId: string;
  domain: UploadDomain;
  folder: string;
  altText: string;
  isDecorative: boolean;
}

export async function POST(request: NextRequest) {
  const csrf = validateMutationCsrf(request);
  if (!csrf.ok) return apiError("CSRF_REJECTED", csrf.reason ?? "Origin invalid", csrf.status ?? 403);

  const auth = await requirePermission("media", "create");
  if (!auth.ok) return auth.response;

  const parsedBody = await parseJsonBody(request);
  if (!parsedBody.ok) return apiError("INVALID_JSON", "Invalid JSON payload", 400);

  const parsed = commitSchema.safeParse(parsedBody.data);
  if (!parsed.success) {
    return apiError("VALIDATION_ERROR", "commitToken required", 400, formatZodError(parsed.error));
  }

  const payload = verifyHmacPayload<MediaCommitPayload>(parsed.data.commitToken);
  if (!payload || payload.userId !== auth.auth.userId) {
    return apiError("INVALID_TOKEN", "Commit token is invalid or expired", 400);
  }

  if (!isSupabaseAdminConfigured()) {
    return apiOk(
      {
        assetId: "demo-media-asset-id",
        storagePath: payload.storagePath,
        bucket: payload.bucket,
        demoMode: true,
      },
      201
    );
  }

  const admin = getSupabaseAdminClient();
  const { data: downloaded, error: dlErr } = await admin.storage
    .from(payload.bucket)
    .download(payload.storagePath);

  if (dlErr || !downloaded) {
    return apiError("FILE_NOT_FOUND", "Uploaded file not found in storage", 404);
  }

  const bytes = new Uint8Array(await downloaded.arrayBuffer());
  const maxLimit = DOMAIN_SIZE_LIMITS[payload.domain] ?? 5 * 1024 * 1024;
  if (bytes.byteLength > maxLimit || bytes.byteLength === 0) {
    await admin.storage.from(payload.bucket).remove([payload.storagePath]);
    return apiError("FILE_TOO_LARGE", `File size exceeds ${maxLimit} bytes`, 413);
  }

  const structureCheck = verifyFileMagicAndStructure(bytes, payload.mimeType);
  if (!structureCheck.ok) {
    await admin.storage.from(payload.bucket).remove([payload.storagePath]);
    return apiError("CORRUPT_FILE", structureCheck.error ?? "File magic bytes mismatch", 400);
  }

  const { data: asset, error: insertErr } = await admin
    .from("media_assets")
    .insert({
      bucket: payload.bucket,
      storage_path: payload.storagePath,
      mime_type: payload.mimeType,
      byte_size: bytes.byteLength,
      alt_text: payload.altText,
      is_decorative: payload.isDecorative,
      folder: payload.folder,
      created_by: auth.auth.userId,
    })
    .select("id, bucket, storage_path, mime_type, byte_size, created_at")
    .single();

  if (insertErr || !asset) {
    await admin.storage.from(payload.bucket).remove([payload.storagePath]);
    return apiError("DB_ERROR", "Failed to register media asset", 500);
  }

  await writeRedactedAuditLog({
    actorUserId: auth.auth.userId,
    actorRoles: auth.auth.roles,
    action: "MEDIA_UPLOADED",
    resourceType: "media",
    resourceId: asset.id,
    changedFields: ["storage_path", "mime_type", "byte_size"],
  });

  return apiOk(asset, 201);
}
