import Link from "next/link";
import { GraduationCap, CheckSquare, Award, Megaphone, ArrowUpRight } from "lucide-react";

export default function InternDashboardPage() {
  const statCards = [
    { label: "Active Cohort", value: "Summer 2026", href: "/intern/announcements", icon: GraduationCap },
    { label: "Pending Tasks", value: "2 Tasks Due", href: "/intern/tasks", icon: CheckSquare },
    { label: "Onboarding Status", value: "NDA Signed", href: "/intern/onboarding", icon: Award },
    { label: "Completion Certificate", value: "In Progress", href: "/intern/certificate", icon: Award },
  ];

  return (
    <div className="space-y-8">
      <div>
        <p className="eyebrow text-[var(--brand-royal)]">Cohort Workspace</p>
        <h2 className="font-display mt-1 text-2xl font-bold text-[var(--ink)]">
          Welcome to your Tech Groww Internship
        </h2>
        <p className="mt-1 text-sm text-[var(--text-muted)]">
          Complete structured engineering curriculum tasks, submit deliverables for mentor feedback, and earn your verified completion certificate.
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
        <h3 className="font-display text-base font-bold text-[var(--ink)]">
          Cohort Milestones & Peer Privacy
        </h3>
        <p className="text-xs text-[var(--text-muted)]">
          In compliance with our data governance standards, task submissions and individual feedback are strictly isolated between you and your designated Tech Groww mentor.
        </p>
      </div>
    </div>
  );
}
