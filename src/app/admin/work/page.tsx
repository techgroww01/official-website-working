import Link from "next/link";
import { ShieldAlert, ExternalLink } from "lucide-react";

const SEED_WORK = [
  {
    slug: "b2b-salesforce-portal-blueprint",
    title: "Unified Sales-to-Client Delivery & Salesforce Operations Blueprint",
    type: "reference_blueprint",
    isApproved: false,
    status: "published",
  },
  {
    slug: "recruitment-dpdp-ats-blueprint",
    title: "Privacy-First Recruitment ATS & Intern Cohort Platform Blueprint",
    type: "reference_blueprint",
    isApproved: false,
    status: "published",
  },
];

export default function AdminWorkPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-xl font-bold text-[var(--ink)]">Work & Architecture Portfolio</h2>
        <p className="text-xs text-[var(--text-muted)]">
          Manage Reference Blueprints and Client Project case studies. Client engagements require verified approval prior to publication.
        </p>
      </div>

      <div className="rounded-[var(--radius-md)] border border-amber-200 bg-amber-50/60 p-4 text-xs text-amber-900 flex items-start gap-3">
        <ShieldAlert className="h-4 w-4 shrink-0 text-amber-700 mt-0.5" />
        <div>
          <span className="font-semibold">Zero-Fabrication Policy:</span> Reference Blueprints represent architectural solutions and research designs. Client case studies are strictly gated behind <code className="font-mono-tech">is_client_approved = true</code>.
        </div>
      </div>

      <div className="rounded-[var(--radius-md)] border border-[var(--line-control)] bg-[var(--portal-surface)] overflow-hidden shadow-xs">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-[var(--line-control)] bg-stone-50 font-mono-tech uppercase text-[var(--text-muted)]">
            <tr>
              <th className="px-4 py-3">Project Title</th>
              <th className="px-4 py-3">Classification</th>
              <th className="px-4 py-3">Approval Gate</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">View</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--line-control)]">
            {SEED_WORK.map((item) => (
              <tr key={item.slug} className="hover:bg-stone-50/50">
                <td className="px-4 py-3 font-semibold text-[var(--ink)]">{item.title}</td>
                <td className="px-4 py-3 font-mono-tech text-stone-600 uppercase">{item.type.replace(/_/g, " ")}</td>
                <td className="px-4 py-3">
                  <span className="font-mono-tech text-[10px] text-stone-500">
                    {item.type === "reference_blueprint" ? "N/A (Blueprint)" : item.isApproved ? "Approved" : "Pending"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className="rounded-full bg-emerald-50 px-2 py-0.5 font-mono-tech text-[10px] font-semibold uppercase text-emerald-700">
                    {item.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/work/${item.slug}`}
                    target="_blank"
                    className="inline-flex items-center gap-1 rounded-[var(--radius-sm)] border border-[var(--line-control)] px-2.5 py-1 text-[11px] font-medium text-[var(--ink)] hover:bg-stone-100"
                  >
                    <span>View</span>
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
