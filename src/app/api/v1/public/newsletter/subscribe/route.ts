import { type NextRequest } from "next/server";
import { z } from "zod";
import { apiError, apiOk, formatZodError, parseJsonBody } from "@/lib/api/http";
import { verifyTurnstileToken } from "@/lib/auth/session";
import { COMPANY_CONFIG } from "@/lib/company-config";
import { sendTransactionalEmail } from "@/lib/email/resend";
import { generateOpaqueToken, sha256Hex } from "@/lib/security/crypto";
import { validateMutationCsrf } from "@/lib/security/csrf";
import { checkRateLimit, getTrustedClientIp } from "@/lib/security/rate-limit";
import { getSupabaseAdminClient, isSupabaseAdminConfigured } from "@/lib/supabase/admin";

const subscribeSchema = z
  .object({
    email: z.string().email().max(160),
    consentSource: z.string().max(64).default("footer"),
    turnstileToken: z.string().min(1),
  })
  .strict();

export async function POST(request: NextRequest) {
  const csrf = validateMutationCsrf(request);
  if (!csrf.ok) return apiError("CSRF_REJECTED", csrf.reason ?? "Origin invalid", csrf.status ?? 403);

  const ip = getTrustedClientIp(request);
  const rl = await checkRateLimit("public_contact", `${ip}:newsletter_sub`);
  if (!rl.allowed) return apiError("RATE_LIMITED", "Too many attempts. Try later.", 429);

  const parsedBody = await parseJsonBody(request);
  if (!parsedBody.ok) return apiError("INVALID_JSON", "Invalid JSON payload", 400);

  const parsed = subscribeSchema.safeParse(parsedBody.data);
  if (!parsed.success) {
    return apiError("VALIDATION_ERROR", "Valid email is required", 400, formatZodError(parsed.error));
  }

  const turnstileOk = await verifyTurnstileToken(parsed.data.turnstileToken, ip);
  if (!turnstileOk) return apiError("TURNSTILE_FAILED", "Security challenge failed", 400);

  const email = parsed.data.email.trim().toLowerCase();
  const confirmToken = generateOpaqueToken(32);
  const unsubscribeToken = generateOpaqueToken(32);

  if (!isSupabaseAdminConfigured()) {
    return apiOk({ subscribed: true, pendingConfirmation: true, demoMode: true });
  }

  const admin = getSupabaseAdminClient();
  const { data: existing } = await admin
    .from("newsletter_subscribers")
    .select("status, unsubscribe_token_hash")
    .eq("email", email)
    .maybeSingle();

  if (existing && existing.status === "active") {
    return apiOk({ subscribed: true, alreadyActive: true });
  }

  const confirmHash = sha256Hex(confirmToken);
  const unsubHash = sha256Hex(unsubscribeToken);

  await admin.from("newsletter_subscribers").upsert(
    {
      email,
      status: "pending",
      confirm_token_hash: confirmHash,
      unsubscribe_token_hash: unsubHash,
      consent_source: parsed.data.consentSource,
      consented_at: new Date().toISOString(),
    },
    { onConflict: "email" }
  );

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://techgroww.co.in";
  const confirmUrl = `${siteUrl}/api/v1/public/newsletter/confirm?token=${confirmToken}`;

  await sendTransactionalEmail({
    to: email,
    subject: "Confirm your Tech Groww Architecture Briefing subscription",
    templateKey: "newsletter_confirm",
    priority: "medium",
    fromPrefix: "contact",
    replyTo: COMPANY_CONFIG.emails.general,
    html: `<p>Please confirm your email subscription by clicking <a href="${confirmUrl}">Confirm Subscription</a>.</p>`,
  });

  return apiOk({ subscribed: true, pendingConfirmation: true });
}
