import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { COMPANY_CONFIG } from "@/lib/company-config";
import { validateMutationCsrf } from "@/lib/security/csrf";
import { checkRateLimit, getTrustedClientIp } from "@/lib/security/rate-limit";
import { hashClientIp } from "@/lib/security/crypto";
import { verifyTurnstileToken } from "@/lib/auth/session";
import { getSupabaseAdminClient, isSupabaseAdminConfigured } from "@/lib/supabase/admin";
import { sendTransactionalEmail } from "@/lib/email/resend";
import { appendLeadToGoogleSheet } from "@/lib/google/sheets";

const contactSchema = z
  .object({
    fullName: z.string().min(2).max(120),
    email: z.string().email(),
    phone: z.string().max(32).optional(),
    company: z.string().max(160).optional(),
    service: z.string().min(2).max(80),
    budget: z.string().max(40).optional(),
    preferredChannel: z.enum(["email", "call", "whatsapp"]).default("email"),
    message: z.string().min(15).max(4000),
    privacyConsent: z.literal(true),
    websiteUrl: z.string().optional(), // Honeypot
    turnstileToken: z.string().min(1),
  })
  .strict();

export async function POST(request: NextRequest) {
  const csrf = validateMutationCsrf(request);
  if (!csrf.ok) {
    return NextResponse.json(
      { ok: false, error: { code: "CSRF_REJECTED", message: csrf.reason } },
      { status: csrf.status ?? 403 }
    );
  }

  const ip = getTrustedClientIp(request);
  const rl = await checkRateLimit("public_contact", `${ip}:contact`);
  if (!rl.allowed) {
    return NextResponse.json(
      { ok: false, error: { code: "RATE_LIMITED", message: "Too many submissions. Try later." } },
      { status: 429, headers: { "Retry-After": String(rl.resetSeconds) } }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: { code: "INVALID_JSON" } }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: { code: "VALIDATION_ERROR", details: parsed.error.flatten() } },
      { status: 400 }
    );
  }

  // Silently accept & discard honeypot spam without polluting DB
  if (parsed.data.websiteUrl && parsed.data.websiteUrl.trim().length > 0) {
    return NextResponse.json(
      { ok: true, data: { enquiryId: "ignored", delivered: false } },
      { status: 201 }
    );
  }

  const turnstileOk = await verifyTurnstileToken(parsed.data.turnstileToken, ip);
  if (!turnstileOk) {
    return NextResponse.json(
      { ok: false, error: { code: "TURNSTILE_FAILED", message: "Verification challenge failed" } },
      { status: 400 }
    );
  }

  const ipHash = hashClientIp(ip);
  let enquiryId = "demo-local-enquiry";

  if (isSupabaseAdminConfigured()) {
    const admin = getSupabaseAdminClient();
    const { data: rpcRes, error: rpcErr } = await admin.rpc("create_enquiry_with_lead", {
      p_full_name: parsed.data.fullName,
      p_email: parsed.data.email.toLowerCase(),
      p_phone: parsed.data.phone ?? null,
      p_company_name: parsed.data.company ?? null,
      p_service_interest: parsed.data.service,
      p_budget_bracket: parsed.data.budget ?? "undecided",
      p_preferred_channel: parsed.data.preferredChannel,
      p_message: parsed.data.message,
      p_source_page: "/contact",
      p_ip_hash: ipHash,
    });

    if (rpcErr) {
      return NextResponse.json(
        { ok: false, error: { code: "DB_ERROR", message: "Unable to persist inquiry" } },
        { status: 500 }
      );
    }
    enquiryId = (rpcRes as { enquiryId?: string })?.enquiryId ?? enquiryId;
  }

  // Send Resend transactional notifications via @send.techgroww.co.in
  const [salesAlert, visitorAck] = await Promise.all([
    sendTransactionalEmail({
      to: COMPANY_CONFIG.emails.sales,
      fromPrefix: "contact",
      replyTo: parsed.data.email,
      priority: "high",
      templateKey: "sales_enquiry_alert",
      subject: `New Inquiry (${parsed.data.service}): ${parsed.data.fullName}`,
      html: `<p><strong>Name:</strong> ${parsed.data.fullName}</p><p><strong>Service:</strong> ${parsed.data.service}</p><p><strong>Channel:</strong> ${parsed.data.preferredChannel}</p><p>${parsed.data.message}</p>`,
    }),
    sendTransactionalEmail({
      to: parsed.data.email,
      fromPrefix: "noreply",
      replyTo: COMPANY_CONFIG.emails.sales,
      priority: "high",
      templateKey: "visitor_enquiry_ack",
      subject: "We received your inquiry — Tech Groww",
      html: `<p>Hi ${parsed.data.fullName},</p><p>Thank you for contacting Tech Groww regarding <strong>${parsed.data.service}</strong>. Our engineering & delivery team has logged your inquiry.</p>`,
    }),
  ]);

  // Optional non-blocking Google Sheets backup mirror
  await appendLeadToGoogleSheet({
    createdAt: new Date().toISOString(),
    fullName: parsed.data.fullName,
    email: parsed.data.email,
    phone: parsed.data.phone ?? "",
    company: parsed.data.company ?? "",
    service: parsed.data.service,
    budget: parsed.data.budget ?? "",
    channel: parsed.data.preferredChannel,
  });

  return NextResponse.json(
    {
      ok: true,
      data: {
        enquiryId,
        delivered: salesAlert.sent || visitorAck.sent,
      },
    },
    { status: 201 }
  );
}
