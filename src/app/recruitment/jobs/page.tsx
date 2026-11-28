import Link from "next/link";
import { Briefcase, ExternalLink } from "lucide-react";

const JOBS = [
  {
    slug: "sales-executive-greater-noida",
    title: "Sales Executive",
    kind: "Full-Time Job",
    location: "Greater Noida, UP",
    status: "open",
  },
  {
    slug: "sales-intern-2-month-cohort",
    title: "Sales Intern (2-Month Cohort)",
    kind: "Internship",
    location: "Greater Noida, UP",
    status: "open",
  },
];

export default function RecruitmentJobsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-xl font-bold text-[var(--ink)]">Job & Internship Requisitions</h2>
        <p className="text-xs text-[var(--text-muted)]">
          Manage open positions published to the public Careers portal.
        </p>
      </div>

      <div className="rounded-[var(--radius-md)] border border-[var(--line-control)] bg-[var(--portal-surface)] overflow-hidden shadow-xs">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-[var(--line-control)] bg-stone-50 font-mono-tech uppercase text-[var(--text-muted)]">
            <tr>
              <th className="px-4 py-3">Role Title</th>
              <th className="px-4 py-3">Classification</th>
              <th className="px-4 py-3">Location</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Public View</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--line-control)]">
            {JOBS.map((j) => (
              <tr key={j.slug} className="hover:bg-stone-50/50">
                <td className="px-4 py-3 font-semibold text-[var(--ink)]">{j.title}</td>
                <td className="px-4 py-3 font-mono-tech text-stone-600">{j.kind}</td>
                <td className="px-4 py-3 font-mono-tech text-stone-600">{j.location}</td>
                <td className="px-4 py-3">
                  <span className="rounded-full bg-emerald-50 px-2 py-0.5 font-mono-tech text-[10px] font-semibold uppercase text-emerald-700">
                    {j.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/careers/${j.slug}`}
                    target="_blank"
                    className="inline-flex items-center gap-1 rounded-[var(--radius-sm)] border border-[var(--line-control)] px-2.5 py-1 text-[11px] font-medium text-[var(--ink)] hover:bg-stone-100"
                  >
                    <span>View Posting</span>
                    <ExternalLink className="h-3 w-3" />
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
