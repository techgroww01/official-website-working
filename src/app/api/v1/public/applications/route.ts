import { type NextRequest } from "next/server";
import { z } from "zod";
import { apiError, apiOk, formatZodError, parseJsonBody } from "@/lib/api/http";
import { verifyTurnstileToken } from "@/lib/auth/session";
import { sendTransactionalEmail } from "@/lib/email/resend";
import { COMPANY_CONFIG } from "@/lib/company-config";
import { generateOpaqueToken, hashClientIp, sha256Hex, verifyHmacPayload } from "@/lib/security/crypto";
import { validateMutationCsrf } from "@/lib/security/csrf";
import { checkRateLimit, getTrustedClientIp } from "@/lib/security/rate-limit";
import { DOMAIN_SIZE_LIMITS, verifyFileMagicAndStructure } from "@/lib/security/upload-validator";
import { getSupabaseAdminClient, isSupabaseAdminConfigured } from "@/lib/supabase/admin";

const applicationSchema = z
  .object({
    postingId: z.string().min(1).max(128),
    fullName: z.string().min(2).max(120),
    email: z.string().email(),
    phone: z.string().min(7).max(32),
    linkedinUrl: z.string().url().optional(),
    portfolioUrl: z.string().url().optional(),
    coverNote: z.string().max(4000).optional(),
    uploadCommitToken: z.string().min(10),
    privacyConsent: z.literal(true),
    talentPoolConsent: z.boolean().default(false),
    turnstileToken: z.string().min(1),
  })
  .strict();

interface ResumeCommitPayload extends Record<string, unknown> {
  bucket: string;
  path: string;
  mimeType: string;
  byteSize: number;
  postingId: string;
}

export async function POST(request: NextRequest) {
  const csrf = validateMutationCsrf(request);
  if (!csrf.ok) return apiError("CSRF_REJECTED", csrf.reason ?? "Origin invalid", csrf.status ?? 403);

  const ip = getTrustedClientIp(request);
  const rl = await checkRateLimit("public_apply", `${ip}:submit`);
  if (!rl.allowed) {
    return apiError("RATE_LIMITED", "Too many application submissions. Try later.", 429, undefined, {
      "Retry-After": String(rl.resetSeconds),
    });
  }

  const parsedBody = await parseJsonBody(request);
  if (!parsedBody.ok) return apiError("INVALID_JSON", "Invalid JSON payload", 400);

  const parsed = applicationSchema.safeParse(parsedBody.data);
  if (!parsed.success) {
    return apiError("VALIDATION_ERROR", "Invalid application fields", 400, formatZodError(parsed.error));
  }

  const turnstileOk = await verifyTurnstileToken(parsed.data.turnstileToken, ip);
  if (!turnstileOk) return apiError("TURNSTILE_FAILED", "Security verification failed", 400);

  const commit = verifyHmacPayload<ResumeCommitPayload>(parsed.data.uploadCommitToken);
  if (!commit || commit.postingId !== parsed.data.postingId) {
    return apiError("INVALID_UPLOAD_TOKEN", "Resume upload token is invalid or expired", 400);
  }

  const statusLookupToken = generateOpaqueToken(24);
  const statusTokenHash = sha256Hex(statusLookupToken);

  if (!isSupabaseAdminConfigured()) {
    return apiOk(
      {
        applicationId: "demo-application-id",
        statusLookupToken,
        demoMode: true,
      },
      201
    );
  }

  const admin = getSupabaseAdminClient();
  const { data: downloaded, error: dlErr } = await admin.storage
    .from(commit.bucket)
    .download(commit.path);

  if (dlErr || !downloaded) {
    return apiError("RESUME_NOT_FOUND", "Uploaded resume file could not be retrieved for scanning", 400);
  }

  const bytes = new Uint8Array(await downloaded.arrayBuffer());
  if (bytes.byteLength === 0 || bytes.byteLength > DOMAIN_SIZE_LIMITS.resume) {
    await admin.storage.from(commit.bucket).remove([commit.path]);
    return apiError("FILE_TOO_LARGE", "Resume exceeds 5 MB limit or is empty", 413);
  }

  const structureCheck = verifyFileMagicAndStructure(bytes, commit.mimeType);
  if (!structureCheck.ok) {
    await admin.storage.from(commit.bucket).remove([commit.path]);
    return apiError(
      "UNSAFE_FILE",
      structureCheck.error ?? "Uploaded file failed magic-byte/structure verification",
      structureCheck.status ?? 400
    );
  }

  const { data: rpcData, error: rpcErr } = await admin.rpc("create_application", {
    p_posting_id: parsed.data.postingId,
    p_full_name: parsed.data.fullName.trim(),
    p_email: parsed.data.email.trim().toLowerCase(),
    p_phone: parsed.data.phone.trim(),
    p_linkedin_url: parsed.data.linkedinUrl ?? null,
    p_portfolio_url: parsed.data.portfolioUrl ?? null,
    p_cover_note: parsed.data.coverNote?.trim() ?? null,
    p_storage_bucket: commit.bucket,
    p_storage_path: commit.path,
    p_mime_type: commit.mimeType,
    p_byte_size: bytes.byteLength,
    p_talent_pool_consent: parsed.data.talentPoolConsent,
    p_status_token_hash: statusTokenHash,
    p_ip_hash: hashClientIp(ip),
  });

  if (rpcErr) {
    await admin.storage.from(commit.bucket).remove([commit.path]);
    const msg = rpcErr.message || "";
    if (msg.includes("JOB_NOT_OPEN")) {
      return apiError("JOB_NOT_OPEN", "This position is no longer accepting applications", 404);
    }
    if (rpcErr.code === "23505" || msg.includes("uq_active_application")) {
      return apiError("DUPLICATE_APPLICATION", "An active application already exists for this role", 409);
    }
    return apiError("APPLICATION_FAILED", "Unable to store application", 500);
  }

  const applicationId =
    (rpcData as { applicationId?: string } | null)?.applicationId ?? "unknown";
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://techgroww.co.in";
  const statusUrl = `${siteUrl}/careers/status?token=${encodeURIComponent(statusLookupToken)}`;

  await sendTransactionalEmail({
    to: parsed.data.email.trim().toLowerCase(),
    subject: "Tech Groww — Application Received",
    templateKey: "application_received",
    priority: "high",
    fromPrefix: "hr",
    replyTo: COMPANY_CONFIG.emails.hr,
    html: `<p>Hello ${parsed.data.fullName.trim()},</p><p>Thank you for applying at Tech Groww. You can inspect your live application status anytime at <a href="${statusUrl}">Application Status Lookup</a>.</p>`,
  });

  return apiOk({ applicationId, statusLookupToken, demoMode: false }, 201);
}
