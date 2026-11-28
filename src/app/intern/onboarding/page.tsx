import { CheckCircle2, ShieldCheck } from "lucide-react";

export default function InternOnboardingPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-xl font-bold text-[var(--ink)]">Internship Onboarding & Policies</h2>
        <p className="text-xs text-[var(--text-muted)]">
          Review accepted agreements, data handling principles, and cohort conduct standards.
        </p>
      </div>

      <div className="rounded-[var(--radius-md)] border border-[var(--line-control)] bg-[var(--portal-surface)] p-6 space-y-4">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-emerald-600" />
          <h3 className="font-display text-base font-bold text-[var(--ink)]">
            Onboarding Agreements Signed
          </h3>
        </div>

        <div className="space-y-3 text-xs">
          <div className="flex items-center justify-between p-3 rounded-[var(--radius-sm)] border border-[var(--line-control)] bg-stone-50">
            <div>
              <p className="font-semibold text-[var(--ink)]">Mutual Non-Disclosure Agreement (NDA)</p>
              <p className="text-[var(--text-muted)]">Protects proprietary client architectures and internal systems</p>
            </div>
            <span className="rounded-full bg-emerald-50 px-2.5 py-1 font-mono-tech text-[10px] font-semibold text-emerald-700">
              ACCEPTED
            </span>
          </div>

          <div className="flex items-center justify-between p-3 rounded-[var(--radius-sm)] border border-[var(--line-control)] bg-stone-50">
            <div>
              <p className="font-semibold text-[var(--ink)]">Cohort Conduct & Work Product Policy</p>
              <p className="text-[var(--text-muted)]">Standards for source control, intellectual property, and peer respect</p>
            </div>
            <span className="rounded-full bg-emerald-50 px-2.5 py-1 font-mono-tech text-[10px] font-semibold text-emerald-700">
              ACCEPTED
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
