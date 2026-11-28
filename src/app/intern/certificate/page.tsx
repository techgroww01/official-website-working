import { Award, CheckCircle, Download, ExternalLink } from "lucide-react";
import Link from "next/link";

export default function InternCertificatePage() {
  const certificate = {
    code: "TG-CERT-2026-DEMO",
    recipient: "Enrolled Engineering Intern",
    program: "Cloud Architecture & Full-Stack Systems Cohort",
    status: "Issued",
    issuedAt: "2026-03-01",
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-xl font-bold text-[var(--ink)]">Verifiable Completion Certificate</h2>
        <p className="text-xs text-[var(--text-muted)]">
          Official tamper-resistant credential generated upon successful completion of curriculum milestones and mentor evaluation.
        </p>
      </div>

      <div className="rounded-[var(--radius-md)] border border-[var(--line-control)] bg-[var(--portal-surface)] p-8 max-w-2xl mx-auto space-y-6 text-center">
        <Award className="mx-auto h-12 w-12 text-[var(--brand-royal)]" />
        <div>
          <span className="rounded-full bg-emerald-50 px-3 py-1 font-mono-tech text-xs font-semibold uppercase text-emerald-700">
            Official Credential
          </span>
          <h3 className="font-display mt-3 text-2xl font-bold text-[var(--ink)]">
            Certificate of Internship Completion
          </h3>
          <p className="text-xs text-[var(--text-muted)] mt-1">
            Issued to <span className="font-semibold text-[var(--ink)]">{certificate.recipient}</span> for successfully completing the <span className="font-semibold text-[var(--ink)]">{certificate.program}</span>.
          </p>
        </div>

        <div className="rounded-[var(--radius-sm)] border border-[var(--line-control)] bg-stone-50 p-4 font-mono-tech text-xs text-stone-700 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <span>Verification Code: <strong className="text-[var(--brand-royal)]">{certificate.code}</strong></span>
          <span>Date: {certificate.issuedAt}</span>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href={`/api/v1/public/certificates/${certificate.code}`}
            target="_blank"
            className="inline-flex items-center gap-1.5 rounded-[var(--radius-sm)] bg-[var(--brand-royal)] px-4 py-2 text-xs font-semibold text-white hover:bg-blue-800"
          >
            <span>Verify Public Credential</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
