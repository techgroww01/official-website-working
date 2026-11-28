import { type NextRequest } from "next/server";
import { z } from "zod";
import { apiError, apiOk, formatZodError, parseJsonBody } from "@/lib/api/http";
import { verifyTurnstileToken } from "@/lib/auth/session";
import { sendTransactionalEmail } from "@/lib/email/resend";
import { validateMutationCsrf } from "@/lib/security/csrf";
import { checkRateLimit, getTrustedClientIp } from "@/lib/security/rate-limit";
import { createServerSupabaseClient } from "@/lib/supabase/server";

const forgotSchema = z
  .object({
    email: z.string().email(),
    turnstileToken: z.string().min(1),
  })
  .strict();

export async function POST(request: NextRequest) {
  const csrf = validateMutationCsrf(request);
  if (!csrf.ok) return apiError("CSRF_REJECTED", csrf.reason ?? "Origin invalid", csrf.status ?? 403);

  const ip = getTrustedClientIp(request);
  const rl = await checkRateLimit("auth_login", `${ip}:forgot_pw`);
  if (!rl.allowed) return apiError("RATE_LIMITED", "Too many password reset requests", 429);

  const parsedBody = await parseJsonBody(request);
  if (!parsedBody.ok) return apiError("INVALID_JSON", "Invalid JSON payload", 400);

  const parsed = forgotSchema.safeParse(parsedBody.data);
  if (!parsed.success) {
    return apiError("VALIDATION_ERROR", "Valid email is required", 400, formatZodError(parsed.error));
  }

  const turnstileOk = await verifyTurnstileToken(parsed.data.turnstileToken, ip);
  if (!turnstileOk) return apiError("TURNSTILE_FAILED", "Security challenge failed", 400);

  const email = parsed.data.email.trim().toLowerCase();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://techgroww.co.in";

  try {
    const supabase = await createServerSupabaseClient();
    await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${siteUrl}/reset-password`,
    });
  } catch {
    // Silently continue to prevent email enumeration
  }

  return apiOk({ requested: true, message: "If an active account exists, a reset link was dispatched." });
}
