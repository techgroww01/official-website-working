import { type NextRequest } from "next/server";
import { apiError, apiOk } from "@/lib/api/http";
import { sha256Hex } from "@/lib/security/crypto";
import { getSupabaseAdminClient, isSupabaseAdminConfigured } from "@/lib/supabase/admin";

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token")?.trim();
  if (!token) {
    return apiError("MISSING_TOKEN", "Status token is required", 400);
  }

  if (!isSupabaseAdminConfigured()) {
    return apiError("NOT_FOUND", "No live database connected in local demo mode", 404);
  }

  const admin = getSupabaseAdminClient();
  const { data, error } = await admin
    .from("applications")
    .select(
      "id, full_name, stage, created_at, job_postings(id, title, slug, posting_kind), offers(id, offer_kind, status, issued_at, expires_at)"
    )
    .eq("status_token_hash", sha256Hex(token))
    .is("anonymized_at", null)
    .maybeSingle();

  if (error || !data) {
    return apiError("NOT_FOUND", "Application status record not found or expired", 404);
  }

  return apiOk({
    id: data.id,
    fullName: data.full_name,
    stage: data.stage,
    submittedAt: data.created_at,
    job: data.job_postings,
    offer: data.offers,
  });
}
