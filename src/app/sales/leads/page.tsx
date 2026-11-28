import Link from "next/link";
import { Inbox, ArrowUpRight } from "lucide-react";

const LEADS = [
  { id: "lead-01", name: "Vikram Malhotra", company: "Apex Logistics", service: "Custom Web & Mobile Engineering", budget: "INR 15L - 25L", stage: "new", date: "1 day ago" },
  { id: "lead-02", name: "Neha Singhania", company: "FinGrowth Solutions", service: "Salesforce Ecosystem Solutions", budget: "INR 25L+", stage: "contacted", date: "3 days ago" },
  { id: "lead-03", name: "Suresh Menon", company: "OmniHealth", service: "UI/UX & Product Design", budget: "INR 8L - 15L", stage: "qualified", date: "5 days ago" },
];

export default function SalesLeadsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-xl font-bold text-[var(--ink)]">Inbound Leads Queue</h2>
        <p className="text-xs text-[var(--text-muted)]">
          Captures inbound submissions from the public Contact page and Google Sheets backup mirror.
        </p>
      </div>

      <div className="rounded-[var(--radius-md)] border border-[var(--line-control)] bg-[var(--portal-surface)] overflow-hidden shadow-xs">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-[var(--line-control)] bg-stone-50 font-mono-tech uppercase text-[var(--text-muted)]">
            <tr>
              <th className="px-4 py-3">Inquirer Name</th>
              <th className="px-4 py-3">Company</th>
              <th className="px-4 py-3">Service Interest</th>
              <th className="px-4 py-3">Budget Bracket</th>
              <th className="px-4 py-3">Stage</th>
              <th className="px-4 py-3 text-right">Received</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--line-control)]">
            {LEADS.map((l) => (
              <tr key={l.id} className="hover:bg-stone-50/50">
                <td className="px-4 py-3 font-semibold text-[var(--ink)]">{l.name}</td>
                <td className="px-4 py-3 font-mono-tech text-stone-600">{l.company}</td>
                <td className="px-4 py-3 font-semibold text-[var(--ink)]">{l.service}</td>
                <td className="px-4 py-3 font-mono-tech text-stone-600">{l.budget}</td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2 py-0.5 font-mono-tech text-[10px] font-semibold uppercase ${
                      l.stage === "new"
                        ? "bg-blue-50 text-[var(--brand-royal)]"
                        : "bg-emerald-50 text-emerald-700"
                    }`}
                  >
                    {l.stage}
                  </span>
                </td>
                <td className="px-4 py-3 text-right font-mono-tech text-stone-500">{l.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
