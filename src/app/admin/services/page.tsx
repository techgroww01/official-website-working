import Link from "next/link";
import { Briefcase, ExternalLink } from "lucide-react";

const SEED_SERVICES = [
  { slug: "web-mobile-engineering", category: "Engineering", title: "Custom Web & Mobile Engineering", status: "published" },
  { slug: "salesforce-solutions", category: "Salesforce", title: "Salesforce Ecosystem Solutions", status: "published" },
  { slug: "ui-ux-design", category: "Design", title: "UI/UX & Product Design", status: "published" },
  { slug: "enterprise-software", category: "Software", title: "Enterprise Software Development", status: "published" },
  { slug: "it-consulting", category: "Advisory", title: "IT Consulting & Strategic Transformation", status: "published" },
  { slug: "digital-marketing-seo", category: "Growth", title: "Digital Marketing & SEO Visibility", status: "published" },
  { slug: "ai-solutions", category: "Emerging", title: "AI & Workflow Intelligence", status: "draft (Gated C-06)" },
  { slug: "business-automation", category: "Emerging", title: "Business Process Automation", status: "draft (Gated C-06)" },
];

export default function AdminServicesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-xl font-bold text-[var(--ink)]">Service Offerings & Capabilities</h2>
        <p className="text-xs text-[var(--text-muted)]">
          Configure verified capabilities, technical stacks, problem statements, and public service routes.
        </p>
      </div>

      <div className="rounded-[var(--radius-md)] border border-[var(--line-control)] bg-[var(--portal-surface)] overflow-hidden shadow-xs">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-[var(--line-control)] bg-stone-50 font-mono-tech uppercase text-[var(--text-muted)]">
            <tr>
              <th className="px-4 py-3">Service Title</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Public Slug</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">View</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--line-control)]">
            {SEED_SERVICES.map((s) => (
              <tr key={s.slug} className="hover:bg-stone-50/50">
                <td className="px-4 py-3 font-semibold text-[var(--ink)]">{s.title}</td>
                <td className="px-4 py-3 font-mono-tech text-stone-600">{s.category}</td>
                <td className="px-4 py-3 font-mono-tech text-stone-600">/services/{s.slug}</td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2 py-0.5 font-mono-tech text-[10px] font-semibold uppercase ${
                      s.status.includes("published")
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-amber-50 text-amber-700"
                    }`}
                  >
                    {s.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/services/${s.slug}`}
                    target="_blank"
                    className="inline-flex items-center gap-1 rounded-[var(--radius-sm)] border border-[var(--line-control)] px-2.5 py-1 text-[11px] font-medium text-[var(--ink)] hover:bg-stone-100"
                  >
                    <span>Inspect</span>
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
