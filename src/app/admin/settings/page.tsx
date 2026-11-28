import { Settings, ShieldAlert, Key } from "lucide-react";

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-xl font-bold text-[var(--ink)]">Platform Settings & Contingency Flags</h2>
        <p className="text-xs text-[var(--text-muted)]">
          Manage system toggles, official channels, and emergency operational controls.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-[var(--radius-md)] border border-[var(--line-control)] bg-[var(--portal-surface)] p-6 space-y-4">
          <h3 className="font-display text-base font-bold text-[var(--ink)]">Official Channels & Contact Points</h3>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-[var(--line-control)]">
              <span className="text-[var(--text-muted)]">General Inquiries</span>
              <span className="font-mono-tech font-semibold">contact@techgroww.co.in</span>
            </div>
            <div className="flex justify-between py-1 border-b border-[var(--line-control)]">
              <span className="text-[var(--text-muted)]">Sales & Engagement</span>
              <span className="font-mono-tech font-semibold">sales@techgroww.co.in</span>
            </div>
            <div className="flex justify-between py-1 border-b border-[var(--line-control)]">
              <span className="text-[var(--text-muted)]">Recruitment & Careers</span>
              <span className="font-mono-tech font-semibold">hr@techgroww.co.in</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-[var(--text-muted)]">Official LinkedIn</span>
              <span className="font-mono-tech font-semibold">company/tech-growww</span>
            </div>
          </div>
        </div>

        <div className="rounded-[var(--radius-md)] border border-[var(--line-control)] bg-[var(--portal-surface)] p-6 space-y-4">
          <h3 className="font-display text-base font-bold text-[var(--ink)]">Operational Contingency Flags</h3>
          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-[var(--ink)]">Client Portal Enabled</p>
                <p className="text-[var(--text-muted)]">Controls active client access to delivery milestones</p>
              </div>
              <span className="rounded-full bg-emerald-50 px-2 py-0.5 font-mono-tech text-[10px] font-semibold text-emerald-700">ENABLED</span>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-[var(--ink)]">Intern Portal Enabled</p>
                <p className="text-[var(--text-muted)]">Controls intern dashboard and certificate issuance</p>
              </div>
              <span className="rounded-full bg-emerald-50 px-2 py-0.5 font-mono-tech text-[10px] font-semibold text-emerald-700">ENABLED</span>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-[var(--ink)]">Intern Attendance Feature</p>
                <p className="text-[var(--text-muted)]">Daily cohort ledger (disabled in initial launch per spec)</p>
              </div>
              <span className="rounded-full bg-stone-100 px-2 py-0.5 font-mono-tech text-[10px] font-semibold text-stone-600">DISABLED</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
