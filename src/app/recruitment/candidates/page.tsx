import Link from "next/link";
import { Users, ArrowUpRight } from "lucide-react";

const CANDIDATES = [
  { id: "cand-01", name: "Ananya Sharma", role: "Sales Executive", stage: "interview", appliedDate: "2 days ago" },
  { id: "cand-02", name: "Rohan Verma", role: "Sales Intern", stage: "review", appliedDate: "4 days ago" },
  { id: "cand-03", name: "Pooja Gupta", role: "Sales Executive", stage: "offered", appliedDate: "1 week ago" },
  { id: "cand-04", name: "Amit Kumar", role: "Sales Intern", stage: "applied", appliedDate: "1 day ago" },
];

export default function RecruitmentCandidatesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-xl font-bold text-[var(--ink)]">Candidate Pipeline & Applications</h2>
        <p className="text-xs text-[var(--text-muted)]">
          Inspect candidate submissions, update pipeline stages, and submit confidential evaluation scorecards.
        </p>
      </div>

      <div className="rounded-[var(--radius-md)] border border-[var(--line-control)] bg-[var(--portal-surface)] overflow-hidden shadow-xs">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-[var(--line-control)] bg-stone-50 font-mono-tech uppercase text-[var(--text-muted)]">
            <tr>
              <th className="px-4 py-3">Candidate Name</th>
              <th className="px-4 py-3">Requisition</th>
              <th className="px-4 py-3">Pipeline Stage</th>
              <th className="px-4 py-3">Applied</th>
              <th className="px-4 py-3 text-right">Review</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--line-control)]">
            {CANDIDATES.map((c) => (
              <tr key={c.id} className="hover:bg-stone-50/50">
                <td className="px-4 py-3 font-semibold text-[var(--ink)]">{c.name}</td>
                <td className="px-4 py-3 font-mono-tech text-stone-600">{c.role}</td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2 py-0.5 font-mono-tech text-[10px] font-semibold uppercase ${
                      c.stage === "offered"
                        ? "bg-purple-50 text-purple-700"
                        : c.stage === "interview"
                        ? "bg-blue-50 text-[var(--brand-royal)]"
                        : "bg-stone-100 text-stone-600"
                    }`}
                  >
                    {c.stage}
                  </span>
                </td>
                <td className="px-4 py-3 font-mono-tech text-[11px] text-[var(--text-muted)]">{c.appliedDate}</td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/recruitment/applications/${c.id}`}
                    className="inline-flex items-center gap-1 rounded-[var(--radius-sm)] border border-[var(--line-control)] px-2.5 py-1 text-[11px] font-medium text-[var(--ink)] hover:bg-stone-100"
                  >
                    <span>Inspect</span>
                    <ArrowUpRight className="h-3 w-3" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
