import { type NextRequest } from "next/server";
import { Webhook } from "svix";
import { apiError, apiOk } from "@/lib/api/http";
import { getSupabaseAdminClient, isSupabaseAdminConfigured } from "@/lib/supabase/admin";

interface ResendWebhookPayload {
  type: string;
  created_at: string;
  data: {
    id?: string;
    email_id?: string;
    from?: string;
    to?: string[];
    subject?: string;
    recipient?: string;
    reason?: string;
  };
}

/**
 * Resend Webhook endpoint with Svix signature validation.
 * Extracts delivery/bounce/complaint events, updates email_events, and maintains email_suppressions.
 * Strips PII before recording to webhook_events.
 */
export async function POST(request: NextRequest) {
  const secret = process.env.RESEND_WEBHOOK_SECRET;
  const svixId = request.headers.get("svix-id");
  const svixTimestamp = request.headers.get("svix-timestamp");
  const svixSignature = request.headers.get("svix-signature");

  if (!svixId || !svixTimestamp || !svixSignature) {
    return apiError("MISSING_SVIX_HEADERS", "Required Svix verification headers missing", 400);
  }

  let rawBody: string;
  try {
    rawBody = await request.text();
  } catch {
    return apiError("INVALID_BODY", "Could not read webhook body", 400);
  }

  let event: ResendWebhookPayload;
  if (secret) {
    try {
      const wh = new Webhook(secret);
      event = wh.verify(rawBody, {
        "svix-id": svixId,
        "svix-timestamp": svixTimestamp,
        "svix-signature": svixSignature,
      }) as unknown as ResendWebhookPayload;
    } catch (err) {
      return apiError("INVALID_SIGNATURE", "Svix HMAC signature mismatch", 401, String(err));
    }
  } else {
    try {
      event = JSON.parse(rawBody) as ResendWebhookPayload;
    } catch {
      return apiError("INVALID_JSON", "Malformed JSON body", 400);
    }
  }

  if (!isSupabaseAdminConfigured()) {
    return apiOk({ received: true, demoMode: true });
  }

  const admin = getSupabaseAdminClient();
  const providerMessageId = event.data.email_id || event.data.id;
  const eventType = event.type; // e.g. email.delivered, email.bounced, email.complained

  // Store in webhook_events with PII redacted
  const safePayload = {
    type: event.type,
    created_at: event.created_at,
    has_recipient: Boolean(event.data.to?.length || event.data.recipient),
    reason: event.data.reason ?? null,
  };

  await admin.from("webhook_events").upsert(
    {
      provider: "resend",
      external_event_id: svixId,
      event_type: eventType,
      payload: safePayload,
      processed_at: new Date().toISOString(),
    },
    { onConflict: "provider,external_event_id" }
  );

  // Update email_events status if message ID is present
  if (providerMessageId) {
    let newStatus: "delivered" | "bounced" | "failed" | null = null;
    if (eventType === "email.delivered") newStatus = "delivered";
    else if (eventType === "email.bounced") newStatus = "bounced";
    else if (eventType === "email.complained") newStatus = "failed";

    if (newStatus) {
      await admin
        .from("email_events")
        .update({ status: newStatus, occurred_at: event.created_at })
        .eq("provider_message_id", providerMessageId);
    }
  }

  // If bounce or complaint, record suppression
  const recipientEmail = event.data.to?.[0] || event.data.recipient;
  if (recipientEmail && (eventType === "email.bounced" || eventType === "email.complained")) {
    await admin.from("email_suppressions").upsert(
      {
        email: recipientEmail.toLowerCase().trim(),
        reason: eventType === "email.complained" ? "spam_complaint" : "hard_bounce",
        source_event_id: svixId,
      },
      { onConflict: "email" }
    );
  }

  return apiOk({ received: true, eventType });
}
