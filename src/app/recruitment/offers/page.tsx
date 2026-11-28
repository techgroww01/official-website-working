import { Award, ShieldAlert } from "lucide-react";

export default function RecruitmentOffersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-xl font-bold text-[var(--ink)]">Extended Offers & Terms</h2>
        <p className="text-xs text-[var(--text-muted)]">
          Review issued candidate offers, target start dates, and candidate response statuses.
        </p>
      </div>

      <div className="rounded-[var(--radius-md)] border border-blue-200 bg-blue-50/50 p-4 text-xs text-blue-900 flex items-center gap-3">
        <ShieldAlert className="h-5 w-5 text-[var(--brand-royal)] shrink-0" />
        <div>
          <span className="font-semibold">Compensation Governance:</span> Compensation breakdowns are masked from recruiter accounts and strictly accessible to hiring managers and administrative roles.
        </div>
      </div>

      <div className="rounded-[var(--radius-md)] border border-[var(--line-control)] bg-[var(--portal-surface)] p-8 text-center">
        <Award className="mx-auto h-10 w-10 text-[var(--text-muted)]" />
        <p className="mt-3 text-sm font-semibold text-[var(--ink)]">No Active Offers Pending Signature</p>
        <p className="mt-1 text-xs text-[var(--text-muted)]">
          Offers issued through the ATS are tracked here with automated 7-day expiration timers.
        </p>
      </div>
    </div>
  );
}
