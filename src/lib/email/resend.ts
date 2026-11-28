import { Resend } from "resend";
import { getSupabaseAdminClient, isSupabaseAdminConfigured } from "@/lib/supabase/admin";

export type EmailPriority = "critical" | "high" | "medium";

export interface SendTransactionalOptions {
  to: string;
  subject: string;
  html: string;
  templateKey: string;
  priority: EmailPriority;
  fromPrefix?: "noreply" | "contact" | "hr" | "security";
  replyTo?: string;
}

export interface SendEmailResult {
  sent: boolean;
  deferred?: boolean;
  suppressed?: boolean;
  configured: boolean;
  providerMessageId?: string;
}

const DEFAULT_FROM_DOMAIN = "send.techgroww.co.in";

function buildSenderAddress(prefix: "noreply" | "contact" | "hr" | "security" = "noreply"): string {
  const configuredFrom = process.env.RESEND_FROM_EMAIL;
  if (prefix === "noreply" && configuredFrom) return configuredFrom;
  return `Tech Groww <${prefix}@${DEFAULT_FROM_DOMAIN}>`;
}

/**
 * Resend transactional dispatch enforcing:
 *  1) @send.techgroww.co.in From + @techgroww.co.in Reply-To separation
 *  2) Canonical email_suppressions check
 *  3) 80/100 (Medium defer) & 90/100 (High defer -> final 10 reserved for Critical) guard
 */
export async function sendTransactionalEmail(
  opts: SendTransactionalOptions
): Promise<SendEmailResult> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return { sent: false, configured: false };
  }

  const recipient = opts.to.trim().toLowerCase();

  if (isSupabaseAdminConfigured()) {
    const admin = getSupabaseAdminClient();

    // 1. Check canonical suppression list
    const { data: suppressed } = await admin
      .from("email_suppressions")
      .select("email")
      .eq("email", recipient)
      .maybeSingle();

    if (suppressed && opts.priority !== "critical") {
      return { sent: false, suppressed: true, configured: true };
    }

    // 2. Enforce UTC daily 100/day free-tier reserve
    const startOfUtcDay = new Date();
    startOfUtcDay.setUTCHours(0, 0, 0, 0);

    const { count } = await admin
      .from("email_events")
      .select("id", { count: "exact", head: true })
      .eq("email_kind", "transactional")
      .in("status", ["sent", "delivered"])
      .gte("created_at", startOfUtcDay.toISOString());

    const dailySent = count ?? 0;
    const shouldDefer =
      (opts.priority === "medium" && dailySent >= 80) ||
      (opts.priority === "high" && dailySent >= 90);

    if (shouldDefer) {
      const tomorrowUtc = new Date(startOfUtcDay.getTime() + 86_400_000).toISOString();
      await admin.from("email_events").insert({
        email_kind: "transactional",
        priority: opts.priority,
        recipient_email: recipient,
        template_key: opts.templateKey,
        status: "deferred_quota",
        next_retry_at: tomorrowUtc,
        payload: { subject: opts.subject, deferredReason: "daily_quota_reserve" },
      });
      return { sent: false, deferred: true, configured: true };
    }
  }

  try {
    const resend = new Resend(apiKey);
    const { data, error } = await resend.emails.send({
      from: buildSenderAddress(opts.fromPrefix ?? "noreply"),
      to: [recipient],
      replyTo: opts.replyTo ?? "contact@techgroww.co.in",
      subject: opts.subject,
      html: opts.html,
    });

    if (error || !data?.id) {
      if (isSupabaseAdminConfigured()) {
        await getSupabaseAdminClient().from("email_events").insert({
          email_kind: "transactional",
          priority: opts.priority,
          recipient_email: recipient,
          template_key: opts.templateKey,
          status: "failed",
          last_error: error?.message ?? "Unknown Resend error",
          payload: { templateKey: opts.templateKey },
        });
      }
      return { sent: false, configured: true };
    }

    if (isSupabaseAdminConfigured()) {
      await getSupabaseAdminClient().from("email_events").insert({
        provider_message_id: data.id,
        email_kind: "transactional",
        priority: opts.priority,
        recipient_email: recipient,
        template_key: opts.templateKey,
        status: "sent",
        occurred_at: new Date().toISOString(),
        payload: { templateKey: opts.templateKey },
      });
    }

    return { sent: true, configured: true, providerMessageId: data.id };
  } catch {
    return { sent: false, configured: true };
  }
}
