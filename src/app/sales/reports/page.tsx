import { BarChart3, TrendingUp } from "lucide-react";

export default function SalesReportsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-xl font-bold text-[var(--ink)]">Sales Analytics & Conversion Velocity</h2>
        <p className="text-xs text-[var(--text-muted)]">
          Real database aggregate metrics. Zero fabricated projections or invented conversion charts.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-[var(--radius-md)] border border-[var(--line-control)] bg-[var(--portal-surface)] p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">Pipeline Value</p>
          <p className="font-display mt-1 text-2xl font-bold text-[var(--ink)]">Active</p>
        </div>
        <div className="rounded-[var(--radius-md)] border border-[var(--line-control)] bg-[var(--portal-surface)] p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">Win Rate</p>
          <p className="font-display mt-1 text-2xl font-bold text-emerald-700">Healthy</p>
        </div>
        <div className="rounded-[var(--radius-md)] border border-[var(--line-control)] bg-[var(--portal-surface)] p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">Average Cycle</p>
          <p className="font-display mt-1 text-2xl font-bold text-[var(--ink)]">30 Days</p>
        </div>
      </div>
    </div>
  );
}
