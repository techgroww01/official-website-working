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
    const demoCert = {
      certificateCode: "TG-CERT-2026-DEMO",
      recipientName: auth.auth.fullName || "Enrolled Intern",
      programTitle: "Cloud Architecture & Full-Stack Systems",
      issuedAtIso: "2026-03-01T00:00:00Z",
    };

    if (format === "pdf") {
      const pdfBytes = await generateCertificatePdfBytes(demoCert);
      return new NextResponse(Buffer.from(pdfBytes), {
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `attachment; filename="${demoCert.certificateCode}.pdf"`,
        },
      });
    }

    return apiOk(demoCert);
  }

  const admin = getSupabaseAdminClient();
  const { data: cert, error } = await admin
    .from("certificates")
    .select("certificate_code, recipient_name, program_title_snapshot, issued_at, revoked_at")
    .eq("enrollment_id", auth.auth.userId)
    .maybeSingle();

  if (error || !cert) {
    return apiError("CERTIFICATE_NOT_FOUND", "No certificate found for current user", 404);
  }

  if (format === "pdf") {
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

  return apiOk(cert);
}
