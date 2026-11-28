import { DollarSign, CheckCircle2 } from "lucide-react";

const DEALS = [
  { id: "opp-01", title: "Apex Logistics Fleet Portal", org: "Apex Logistics", value: "INR 18,50,000", stage: "proposal", closeDate: "March 2026" },
  { id: "opp-02", title: "FinGrowth OmniStudio Modernization", org: "FinGrowth Solutions", value: "INR 28,00,000", stage: "won", closeDate: "February 2026" },
];

export default function SalesOpportunitiesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-xl font-bold text-[var(--ink)]">Enterprise Deals & Opportunity Pipeline</h2>
        <p className="text-xs text-[var(--text-muted)]">
          Track stage progression, estimated contract values, and trigger project provisioning.
        </p>
      </div>

      <div className="rounded-[var(--radius-md)] border border-[var(--line-control)] bg-[var(--portal-surface)] overflow-hidden shadow-xs">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-[var(--line-control)] bg-stone-50 font-mono-tech uppercase text-[var(--text-muted)]">
            <tr>
              <th className="px-4 py-3">Opportunity Title</th>
              <th className="px-4 py-3">Account Organization</th>
              <th className="px-4 py-3">Estimated Value</th>
              <th className="px-4 py-3">Pipeline Stage</th>
              <th className="px-4 py-3">Target Close</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--line-control)]">
            {DEALS.map((d) => (
              <tr key={d.id} className="hover:bg-stone-50/50">
                <td className="px-4 py-3 font-semibold text-[var(--ink)]">{d.title}</td>
                <td className="px-4 py-3 font-mono-tech text-stone-600">{d.org}</td>
                <td className="px-4 py-3 font-mono-tech font-bold text-[var(--ink)]">{d.value}</td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2 py-0.5 font-mono-tech text-[10px] font-semibold uppercase ${
                      d.stage === "won"
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-blue-50 text-[var(--brand-royal)]"
                    }`}
                  >
                    {d.stage}
                  </span>
                </td>
                <td className="px-4 py-3 font-mono-tech text-stone-500">{d.closeDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
