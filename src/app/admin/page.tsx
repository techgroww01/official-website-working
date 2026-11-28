import Link from "next/link";
import { ArrowUpRight, FileText, Briefcase, BookOpen, Users, ShieldAlert } from "lucide-react";

export default function AdminOverviewPage() {
  const statCards = [
    { label: "Active Services", value: "6 Live / 2 Draft", href: "/admin/services", icon: Briefcase },
    { label: "Published Pages", value: "8 Core Pages", href: "/admin/pages", icon: FileText },
    { label: "Insights Articles", value: "4 Articles", href: "/admin/insights", icon: BookOpen },
    { label: "Platform Users", value: "Staff & Admins", href: "/admin/users", icon: Users },
  ];

  return (
    <div className="space-y-8">
      <div>
        <p className="eyebrow text-[var(--brand-royal)]">Operations Overview</p>
        <h2 className="font-display mt-1 text-2xl font-bold text-[var(--ink)]">
          Platform CMS & Operations Hub
        </h2>
        <p className="mt-1 text-sm text-[var(--text-muted)]">
          Manage corporate website editorial content, service specifications, portfolio blueprints, and system governance.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.label}
              href={card.href}
              className="group rounded-[var(--radius-md)] border border-[var(--line-control)] bg-[var(--portal-surface)] p-5 transition hover:border-[var(--brand-royal)] hover:shadow-sm"
            >
              <div className="flex items-center justify-between">
                <Icon className="h-5 w-5 text-[var(--brand-royal)]" />
                <ArrowUpRight className="h-4 w-4 text-[var(--text-muted)] group-hover:text-[var(--brand-royal)]" />
              </div>
              <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                {card.label}
              </p>
              <p className="font-display mt-1 text-lg font-bold text-[var(--ink)]">{card.value}</p>
            </Link>
          );
        })}
      </div>

      <div className="rounded-[var(--radius-md)] border border-[var(--line-control)] bg-[var(--portal-surface)] p-6 space-y-4">
        <div className="flex items-center gap-2">
          <ShieldAlert className="h-5 w-5 text-amber-600" />
          <h3 className="font-display text-base font-bold text-[var(--ink)]">
            Architectural Guardrails & Verification Gates
          </h3>
        </div>
        <ul className="space-y-2 text-xs text-[var(--text-muted)]">
          <li>• Client project portfolio case studies require explicit verification (<code className="font-mono-tech">is_client_approved = true</code>) before publishing.</li>
          <li>• All published insight articles use sanitised markdown and purge edge CDN tags instantly upon release.</li>
          <li>• Super admin account deletion is strictly prohibited; MFA required on all administrative accounts.</li>
        </ul>
      </div>
    </div>
  );
}
