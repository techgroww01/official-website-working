import { type NextRequest, NextResponse } from "next/server";
import { apiError } from "@/lib/api/http";
import { sha256Hex } from "@/lib/security/crypto";
import { getSupabaseAdminClient, isSupabaseAdminConfigured } from "@/lib/supabase/admin";

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token")?.trim();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://techgroww.co.in";

  if (!token) {
    return apiError("MISSING_TOKEN", "Confirmation token required", 400);
  }

  if (!isSupabaseAdminConfigured()) {
    return NextResponse.redirect(`${siteUrl}/insights?subscribed=1`);
  }

  const admin = getSupabaseAdminClient();
  const tokenHash = sha256Hex(token);

  const { data: subscriber, error } = await admin
    .from("newsletter_subscribers")
    .update({
      status: "active",
      confirmed_at: new Date().toISOString(),
      confirm_token_hash: null,
    })
    .eq("confirm_token_hash", tokenHash)
    .select("id, email")
    .maybeSingle();

  if (error || !subscriber) {
    return NextResponse.redirect(`${siteUrl}/insights?sub_error=invalid_token`);
  }

  return NextResponse.redirect(`${siteUrl}/insights?subscribed=1`);
}
