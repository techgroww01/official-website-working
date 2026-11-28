import Link from "next/link";
import { ArrowLeft, FileText, ShieldAlert } from "lucide-react";

export default async function ApplicationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="space-y-6">
      <Link
        href="/recruitment/candidates"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--text-muted)] hover:text-[var(--brand-royal)]"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        <span>Back to Pipeline</span>
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[var(--line-control)] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono-tech text-xs font-bold text-[var(--brand-royal)]">{id}</span>
            <span className="rounded-full bg-blue-50 px-2 py-0.5 font-mono-tech text-[10px] font-semibold text-[var(--brand-royal)] uppercase">
              Interview Stage
            </span>
          </div>
          <h2 className="font-display mt-1 text-2xl font-bold text-[var(--ink)]">
            Candidate Application Review
          </h2>
          <p className="text-xs text-[var(--text-muted)] mt-1">
            Requisition: Sales Executive · Greater Noida Location
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-[var(--radius-md)] border border-[var(--line-control)] bg-[var(--portal-surface)] p-6 space-y-4">
          <h3 className="font-display text-base font-bold text-[var(--ink)]">Application Artifacts</h3>
          <div className="rounded-[var(--radius-sm)] border border-[var(--line-control)] bg-stone-50 p-4 text-xs space-y-2">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-[var(--brand-royal)]" />
              <span className="font-semibold text-[var(--ink)]">Resume Document (Magic-Byte Scanned)</span>
            </div>
            <p className="text-[11px] text-[var(--text-muted)]">
              PDF document verified free of macros or active scripts. Stored in private bucket with signed expiration tokens.
            </p>
          </div>
        </div>

        <div className="rounded-[var(--radius-md)] border border-[var(--line-control)] bg-[var(--portal-surface)] p-6 space-y-4">
          <h3 className="font-display text-base font-bold text-[var(--ink)]">Confidential Interview Scorecard</h3>
          <p className="text-xs text-[var(--text-muted)]">
            Scorecards are strictly isolated from candidate view. Ratings (1–5) and architectural evaluations are visible only to the recruitment team.
          </p>
        </div>
      </div>
    </div>
  );
}
