import { ShieldCheck, AlertTriangle } from "lucide-react";

export default function RecruitmentRetentionPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-xl font-bold text-[var(--ink)]">DPDP Act (2023) Automated Retention Ledger</h2>
        <p className="text-xs text-[var(--text-muted)]">
          Candidate data lifecycle management. All applicant personally identifiable information is purged after 180 days unless affirmative talent pool consent was granted.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-[var(--radius-md)] border border-[var(--line-control)] bg-[var(--portal-surface)] p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">Retention Standard</p>
          <p className="font-display mt-1 text-lg font-bold text-[var(--ink)]">180 Days (Automated)</p>
        </div>
        <div className="rounded-[var(--radius-md)] border border-[var(--line-control)] bg-[var(--portal-surface)] p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">Daily Purge Job</p>
          <p className="font-display mt-1 text-lg font-bold text-emerald-700">02:00 UTC (Cron)</p>
        </div>
        <div className="rounded-[var(--radius-md)] border border-[var(--line-control)] bg-[var(--portal-surface)] p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">Cryptographic Erasure</p>
          <p className="font-display mt-1 text-lg font-bold text-[var(--ink)]">Zero Residual PII</p>
        </div>
      </div>

      <div className="rounded-[var(--radius-md)] border border-[var(--line-control)] bg-[var(--portal-surface)] p-6 space-y-3">
        <h3 className="font-display text-base font-bold text-[var(--ink)]">Compliance Execution Status</h3>
        <p className="text-xs text-[var(--text-muted)] leading-relaxed">
          The retention engine automatically anonymizes full names, email addresses, phone numbers, and destroys private storage resume binaries when retention limits expire.
        </p>
      </div>
    </div>
  );
}
