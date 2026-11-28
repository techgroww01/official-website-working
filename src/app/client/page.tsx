import Link from "next/link";
import { FolderKanban, CheckCircle2, CreditCard, LifeBuoy, ArrowUpRight } from "lucide-react";

export default function ClientOverviewPage() {
  const statCards = [
    { label: "Active Engagements", value: "1 In Flight", href: "/client/projects", icon: FolderKanban },
    { label: "Pending Deliverable Reviews", value: "0 Awaiting Action", href: "/client/projects", icon: CheckCircle2 },
    { label: "Open Support Requests", value: "0 Tickets", href: "/client/tickets", icon: LifeBuoy },
    { label: "Billing & Invoices", value: "In Good Standing", href: "/client/billing", icon: CreditCard },
  ];

  return (
    <div className="space-y-8">
      <div>
        <p className="eyebrow text-[var(--brand-royal)]">Client Operations Hub</p>
        <h2 className="font-display mt-1 text-2xl font-bold text-[var(--ink)]">
          Welcome to Your Project Workspace
        </h2>
        <p className="mt-1 text-sm text-[var(--text-muted)]">
          Inspect live delivery milestones, review architecture deliverables, coordinate with your Tech Groww engagement lead, and manage team accounts.
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

      <div className="rounded-[var(--radius-md)] border border-[var(--line-control)] bg-[var(--portal-surface)] p-6">
        <h3 className="font-display text-base font-bold text-[var(--ink)] mb-4">
          Current Engagement Spotlight
        </h3>
        <div className="rounded-[var(--radius-sm)] border border-[var(--line-control)] bg-stone-50/50 p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono-tech text-xs font-bold text-[var(--brand-royal)]">ENG-2026-01</span>
              <span className="rounded-full bg-blue-50 px-2 py-0.5 font-mono-tech text-[10px] font-semibold text-[var(--brand-royal)] uppercase">
                Phase 01: Discovery
              </span>
            </div>
            <p className="font-display mt-1 text-base font-bold text-[var(--ink)]">
              Enterprise Operations & Architecture Implementation
            </p>
            <p className="text-xs text-[var(--text-muted)] mt-1">
              Architecture baseline, requirements alignment, and sprint kickoff.
            </p>
          </div>
          <Link
            href="/client/projects/ENG-2026-01"
            className="inline-flex items-center gap-1.5 rounded-[var(--radius-sm)] bg-[var(--brand-royal)] px-4 py-2 text-xs font-semibold text-white hover:bg-blue-800 self-start sm:self-auto"
          >
            <span>Inspect Project</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
