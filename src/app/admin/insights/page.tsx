import Link from "next/link";
import { BookOpen, ExternalLink } from "lucide-react";

const SEED_ARTICLES = [
  { slug: "building-zero-trust-rbac-nextjs-supabase", category: "Architecture", title: "Building a Zero-Trust 20-Role RBAC Model with Next.js 16 and Supabase", status: "published" },
  { slug: "dpdp-2023-compliance-engineering-retention", category: "Privacy", title: "Engineering for India's DPDP Act: 180-Day Automated ATS Retention", status: "published" },
  { slug: "salesforce-omnistudio-integration-procedures", category: "Salesforce", title: "Salesforce OmniStudio Integration Procedures: Clean B2B Handoffs", status: "published" },
  { slug: "micro-interactions-editorial-web-design", category: "Design", title: "Editorial Restraint in B2B Web Design: Calm Typography & Clean Motion", status: "published" },
];

export default function AdminInsightsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-xl font-bold text-[var(--ink)]">Insights & Technical Writing</h2>
        <p className="text-xs text-[var(--text-muted)]">
          Manage engineering essays, architectural briefings, and scheduled editorial publications.
        </p>
      </div>

      <div className="rounded-[var(--radius-md)] border border-[var(--line-control)] bg-[var(--portal-surface)] overflow-hidden shadow-xs">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-[var(--line-control)] bg-stone-50 font-mono-tech uppercase text-[var(--text-muted)]">
            <tr>
              <th className="px-4 py-3">Article Title</th>
              <th className="px-4 py-3">Domain</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">View</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--line-control)]">
            {SEED_ARTICLES.map((a) => (
              <tr key={a.slug} className="hover:bg-stone-50/50">
                <td className="px-4 py-3 font-semibold text-[var(--ink)]">{a.title}</td>
                <td className="px-4 py-3 font-mono-tech text-stone-600">{a.category}</td>
                <td className="px-4 py-3">
                  <span className="rounded-full bg-emerald-50 px-2 py-0.5 font-mono-tech text-[10px] font-semibold uppercase text-emerald-700">
                    {a.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/insights/${a.slug}`}
                    target="_blank"
                    className="inline-flex items-center gap-1 rounded-[var(--radius-sm)] border border-[var(--line-control)] px-2.5 py-1 text-[11px] font-medium text-[var(--ink)] hover:bg-stone-100"
                  >
                    <span>Read</span>
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
