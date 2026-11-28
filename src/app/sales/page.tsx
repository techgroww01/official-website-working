import Link from "next/link";
import { TrendingUp, Inbox, DollarSign, Building2, ArrowUpRight } from "lucide-react";

export default function SalesOverviewPage() {
  const statCards = [
    { label: "New Inbound Inquiries", value: "3 Fresh Leads", href: "/sales/leads", icon: Inbox },
    { label: "Active Deals", value: "2 Opportunities", href: "/sales/opportunities", icon: DollarSign },
    { label: "Accounts in CRM", value: "6 Organizations", href: "/sales/contacts", icon: Building2 },
    { label: "Closed / Won", value: "1 Converted", href: "/sales/reports", icon: TrendingUp },
  ];

  return (
    <div className="space-y-8">
      <div>
        <p className="eyebrow text-[var(--brand-royal)]">Commercial Operations Hub</p>
        <h2 className="font-display mt-1 text-2xl font-bold text-[var(--ink)]">
          Sales CRM & Enterprise Deal Flow
        </h2>
        <p className="mt-1 text-sm text-[var(--text-muted)]">
          Manage inbound website inquiries, qualify prospective client accounts, advance pipeline stages, and convert won deals into client projects with one click.
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

      <div className="rounded-[var(--radius-md)] border border-[var(--line-control)] bg-[var(--portal-surface)] p-6 space-y-3">
        <h3 className="font-display text-base font-bold text-[var(--ink)]">
          Seamless Deal-to-Delivery Conversion
        </h3>
        <p className="text-xs text-[var(--text-muted)] leading-relaxed">
          When an opportunity reaches Closed Won, sales managers can convert it directly into a verified Client Project with initial Phase 01 milestones created automatically.
        </p>
      </div>
    </div>
  );
}
