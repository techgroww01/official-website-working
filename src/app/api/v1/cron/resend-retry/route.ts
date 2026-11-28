import { type NextRequest } from "next/server";
import { apiError, apiOk, verifyCronSecret } from "@/lib/api/http";
import { sendTransactionalEmail } from "@/lib/email/resend";
import { getSupabaseAdminClient, isSupabaseAdminConfigured } from "@/lib/supabase/admin";

export async function GET(request: NextRequest) {
  if (!verifyCronSecret(request)) {
    return apiError("UNAUTHORIZED_CRON", "Invalid cron authorization header", 401);
  }

  if (!isSupabaseAdminConfigured()) {
    return apiOk({ retriedCount: 0, demoMode: true });
  }

  const admin = getSupabaseAdminClient();
  const now = new Date().toISOString();

  // Find emails that were deferred due to daily quota reserve
  const { data: deferredList } = await admin
    .from("email_events")
    .select("id, recipient_email, template_key, priority, payload, retry_count")
    .eq("status", "deferred_quota")
    .lte("next_retry_at", now)
    .lt("retry_count", 3)
    .limit(20);

  if (!deferredList || deferredList.length === 0) {
    return apiOk({ retriedCount: 0 });
  }

  let retriedCount = 0;
  for (const item of deferredList) {
    const payload = item.payload as { subject?: string; html?: string } | null;
    const res = await sendTransactionalEmail({
      to: item.recipient_email,
      subject: payload?.subject ?? "Tech Groww Notification",
      html: payload?.html ?? "<p>Notification from Tech Groww</p>",
      templateKey: item.template_key,
      priority: item.priority as "critical" | "high" | "medium",
    });

    if (res.sent) {
      await admin
        .from("email_events")
        .update({
          status: "sent",
          provider_message_id: res.providerMessageId,
          retry_count: item.retry_count + 1,
        })
        .eq("id", item.id);
      retriedCount++;
    } else {
      await admin
        .from("email_events")
        .update({ retry_count: item.retry_count + 1 })
        .eq("id", item.id);
    }
  }

  return apiOk({ retriedCount, candidateCount: deferredList.length });
}
