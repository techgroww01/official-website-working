import Link from "next/link";
import { FolderKanban, ArrowUpRight, CheckCircle2 } from "lucide-react";

const PROJECTS = [
  {
    id: "ENG-2026-01",
    name: "Enterprise Operations & Architecture Implementation",
    phase: "Phase 01: Discovery",
    status: "Active",
    lead: "Engineering Operations Lead",
    milestoneCount: 3,
  },
];

export default function ClientProjectsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-xl font-bold text-[var(--ink)]">Engagements & Delivery Milestones</h2>
        <p className="text-xs text-[var(--text-muted)]">
          Track phase progression, review deliverables, and inspect signed completion records.
        </p>
      </div>

      <div className="rounded-[var(--radius-md)] border border-[var(--line-control)] bg-[var(--portal-surface)] overflow-hidden shadow-xs">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-[var(--line-control)] bg-stone-50 font-mono-tech uppercase text-[var(--text-muted)]">
            <tr>
              <th className="px-4 py-3">Project Code</th>
              <th className="px-4 py-3">Engagement Name</th>
              <th className="px-4 py-3">Current Phase</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--line-control)]">
            {PROJECTS.map((p) => (
              <tr key={p.id} className="hover:bg-stone-50/50">
                <td className="px-4 py-3 font-mono-tech font-bold text-[var(--brand-royal)]">{p.id}</td>
                <td className="px-4 py-3 font-semibold text-[var(--ink)]">{p.name}</td>
                <td className="px-4 py-3 font-mono-tech text-stone-600">{p.phase}</td>
                <td className="px-4 py-3">
                  <span className="rounded-full bg-emerald-50 px-2 py-0.5 font-mono-tech text-[10px] font-semibold uppercase text-emerald-700">
                    {p.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/client/projects/${p.id}`}
                    className="inline-flex items-center gap-1 rounded-[var(--radius-sm)] border border-[var(--line-control)] px-2.5 py-1 text-[11px] font-medium text-[var(--ink)] hover:bg-stone-100"
                  >
                    <span>View Project</span>
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
