import { Plus, Edit2, ExternalLink } from "lucide-react";
import Link from "next/link";

const STATIC_PAGES = [
  { slug: "home", title: "Homepage", path: "/", status: "published" },
  { slug: "about", title: "About Us", path: "/about", status: "published" },
  { slug: "services", title: "Services Catalog", path: "/services", status: "published" },
  { slug: "work", title: "Work & Blueprints", path: "/work", status: "published" },
  { slug: "insights", title: "Insights & Technical Briefings", path: "/insights", status: "published" },
  { slug: "careers", title: "Careers ATS", path: "/careers", status: "published" },
  { slug: "contact", title: "Contact & Project Inquiries", path: "/contact", status: "published" },
  { slug: "privacy", title: "Privacy Policy", path: "/privacy", status: "published" },
  { slug: "terms", title: "Terms and Conditions", path: "/terms", status: "published" },
  { slug: "cookies", title: "Cookie Policy", path: "/cookies", status: "published" },
];

export default function AdminPagesPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="font-display text-xl font-bold text-[var(--ink)]">Pages & Layout CMS</h2>
          <p className="text-xs text-[var(--text-muted)]">
            Manage section copy, metadata schemas, and revisions across public marketing routes.
          </p>
        </div>
      </div>

      <div className="rounded-[var(--radius-md)] border border-[var(--line-control)] bg-[var(--portal-surface)] overflow-hidden shadow-xs">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-[var(--line-control)] bg-stone-50 font-mono-tech uppercase text-[var(--text-muted)]">
            <tr>
              <th className="px-4 py-3">Page Name</th>
              <th className="px-4 py-3">Public Route</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--line-control)]">
            {STATIC_PAGES.map((page) => (
              <tr key={page.slug} className="hover:bg-stone-50/50">
                <td className="px-4 py-3 font-semibold text-[var(--ink)]">{page.title}</td>
                <td className="px-4 py-3 font-mono-tech text-stone-600">{page.path}</td>
                <td className="px-4 py-3">
                  <span className="rounded-full bg-emerald-50 px-2 py-0.5 font-mono-tech text-[10px] font-semibold uppercase text-emerald-700">
                    {page.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={page.path}
                    target="_blank"
                    className="inline-flex items-center gap-1 rounded-[var(--radius-sm)] border border-[var(--line-control)] px-2.5 py-1 text-[11px] font-medium text-[var(--ink)] hover:bg-stone-100"
                  >
                    <span>View Live</span>
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
