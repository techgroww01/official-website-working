import { type NextRequest, NextResponse } from "next/server";
import { apiError, apiOk } from "@/lib/api/http";
import { sha256Hex } from "@/lib/security/crypto";
import { getSupabaseAdminClient, isSupabaseAdminConfigured } from "@/lib/supabase/admin";

/**
 * Handles RFC 8058 One-Click List-Unsubscribe as well as browser GET clicks.
 * Strictly exempt from CSRF Origin check and Turnstile verification as required by RFC 8058.
 */
async function processUnsubscribe(token: string | null) {
  if (!token) {
    return { ok: false, error: "Missing unsubscribe token", status: 400 };
  }

  if (!isSupabaseAdminConfigured()) {
    return { ok: true, email: "demo@techgroww.co.in" };
  }

  const admin = getSupabaseAdminClient();
  const tokenHash = sha256Hex(token);

  const { data: sub, error } = await admin
    .from("newsletter_subscribers")
    .update({
      status: "unsubscribed",
      unsubscribed_at: new Date().toISOString(),
    })
    .eq("unsubscribe_token_hash", tokenHash)
    .select("email")
    .maybeSingle();

  if (error || !sub) {
    return { ok: false, error: "Subscriber not found or token expired", status: 404 };
  }

  // Also record in suppressions table
  await admin.from("email_suppressions").upsert({
    email: sub.email,
    reason: "newsletter_unsubscribe",
    source_event_id: "user_unsubscribe",
  });

  return { ok: true, email: sub.email };
}

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token")?.trim();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://techgroww.co.in";

  const res = await processUnsubscribe(token ?? null);
  if (!res.ok) {
    return NextResponse.redirect(`${siteUrl}/insights?unsub_error=invalid_token`);
  }

  return NextResponse.redirect(`${siteUrl}/insights?unsubscribed=1`);
}

/**
 * RFC 8058 One-Click POST implementation:
 * Must accept POST with body `List-Unsubscribe=One-Click` without requiring Origin check.
 */
export async function POST(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token")?.trim();
  const contentType = request.headers.get("content-type") ?? "";

  // Verify RFC 8058 payload if form-urlencoded
  if (contentType.includes("application/x-www-form-urlencoded")) {
    const rawText = await request.text();
    const params = new URLSearchParams(rawText);
    if (params.get("List-Unsubscribe") !== "One-Click") {
      return apiError("INVALID_RFC8058", "Expected List-Unsubscribe=One-Click in form body", 400);
    }
  }

  const res = await processUnsubscribe(token ?? null);
  if (!res.ok) {
    return apiError("UNSUBSCRIBE_FAILED", res.error ?? "Failed to unsubscribe", res.status ?? 400);
  }

  return apiOk({ unsubscribed: true, email: res.email });
}
