import { type NextRequest, NextResponse } from "next/server";
import { apiError, apiOk } from "@/lib/api/http";
import { requirePermission } from "@/lib/auth/session";
import { generateCertificatePdfBytes } from "@/lib/certificates/pdf";
import { getSupabaseAdminClient, isSupabaseAdminConfigured } from "@/lib/supabase/admin";

export async function GET(request: NextRequest) {
  const auth = await requirePermission("certificates", "read");
  if (!auth.ok) return auth.response;

  const format = request.nextUrl.searchParams.get("format");

  if (!isSupabaseAdminConfigured()) {
    if (format === "pdf") {
      return apiError(
        "CERTIFICATE_NOT_FOUND",
        "No certificate available while database is unconfigured",
        404
      );
    }

    return apiOk({ certificate: null, demoMode: true });
  }

  const admin = getSupabaseAdminClient();
  const { data: enrollments, error: enrollErr } = await admin
    .from("intern_enrollments")
    .select("id")
    .eq("user_id", auth.auth.userId);

  if (enrollErr) {
    return apiError("DB_ERROR", "Failed to load intern enrollment", 500);
  }

  const enrollmentIds = (enrollments ?? []).map((e) => e.id);
  if (enrollmentIds.length === 0) {
    return apiError("CERTIFICATE_NOT_FOUND", "No certificate found for current user", 404);
  }

  const { data: cert, error } = await admin
    .from("certificates")
    .select("certificate_code, recipient_name, program_title_snapshot, issued_at, revoked_at")
    .in("enrollment_id", enrollmentIds)
    .order("issued_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error || !cert) {
    return apiError("CERTIFICATE_NOT_FOUND", "No certificate found for current user", 404);
  }

  const isRevoked = Boolean(cert.revoked_at);

  if (format === "pdf") {
    if (isRevoked) {
      return apiError("CERTIFICATE_REVOKED", "Certificate has been revoked", 403);
    }

    const pdfBytes = await generateCertificatePdfBytes({
      certificateCode: cert.certificate_code,
      recipientName: cert.recipient_name,
      programTitle: cert.program_title_snapshot,
      issuedAtIso: cert.issued_at,
    });

    return new NextResponse(Buffer.from(pdfBytes), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${cert.certificate_code}.pdf"`,
      },
    });
  }

  return apiOk({
    certificate: {
      certificateCode: cert.certificate_code,
      recipientName: cert.recipient_name,
      programTitle: cert.program_title_snapshot,
      issuedAtIso: cert.issued_at,
      revoked: isRevoked,
    },
  });
}
