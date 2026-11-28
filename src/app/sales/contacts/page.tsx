import { Building2 } from "lucide-react";

const ORGS = [
  { id: "org-01", name: "Apex Logistics", industry: "Supply Chain", type: "prospect", country: "India" },
  { id: "org-02", name: "FinGrowth Solutions", industry: "Fintech", type: "client", country: "India" },
  { id: "org-03", name: "OmniHealth", industry: "Healthcare", type: "prospect", country: "India" },
];

export default function SalesContactsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-xl font-bold text-[var(--ink)]">Client Accounts & Organizations</h2>
        <p className="text-xs text-[var(--text-muted)]">
          Manage corporate prospect and client account profiles in CRM.
        </p>
      </div>

      <div className="rounded-[var(--radius-md)] border border-[var(--line-control)] bg-[var(--portal-surface)] overflow-hidden shadow-xs">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-[var(--line-control)] bg-stone-50 font-mono-tech uppercase text-[var(--text-muted)]">
            <tr>
              <th className="px-4 py-3">Organization Name</th>
              <th className="px-4 py-3">Industry</th>
              <th className="px-4 py-3">Account Type</th>
              <th className="px-4 py-3">Country</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--line-control)]">
            {ORGS.map((o) => (
              <tr key={o.id} className="hover:bg-stone-50/50">
                <td className="px-4 py-3 font-semibold text-[var(--ink)]">{o.name}</td>
                <td className="px-4 py-3 font-mono-tech text-stone-600">{o.industry}</td>
                <td className="px-4 py-3">
                  <span className="rounded-full bg-stone-100 px-2 py-0.5 font-mono-tech text-[10px] font-semibold uppercase text-stone-700">
                    {o.type}
                  </span>
                </td>
                <td className="px-4 py-3 font-mono-tech text-stone-500">{o.country}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
