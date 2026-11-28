import { type NextRequest } from "next/server";
import { apiError, apiOk } from "@/lib/api/http";
import { getSupabaseAdminClient, isSupabaseAdminConfigured } from "@/lib/supabase/admin";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params;
  const normalizedCode = code.trim().toUpperCase();

  if (!normalizedCode) {
    return apiError("MISSING_CODE", "Certificate verification code required", 400);
  }

  if (!isSupabaseAdminConfigured()) {
    return apiOk({
      valid: true,
      certificateCode: normalizedCode,
      recipientName: "Demo Verified Intern",
      programTitle: "Cloud Architecture & Full-Stack Systems",
      issuedAt: "2026-03-01T00:00:00Z",
      revoked: false,
      demoMode: true,
    });
  }

  const admin = getSupabaseAdminClient();
  const { data, error } = await admin
    .from("certificates")
    .select(
      "id, certificate_code, recipient_name, program_title_snapshot, issued_at, revoked_at, revocation_reason"
    )
    .eq("certificate_code", normalizedCode)
    .maybeSingle();

  if (error || !data) {
    return apiError("CERTIFICATE_NOT_FOUND", "No matching certificate found", 404);
  }

  const isRevoked = Boolean(data.revoked_at);

  return apiOk({
    valid: !isRevoked,
    certificateCode: data.certificate_code,
    recipientName: data.recipient_name,
    programTitle: data.program_title_snapshot,
    issuedAt: data.issued_at,
    revoked: isRevoked,
    revocationReason: isRevoked ? data.revocation_reason : null,
  });
}
