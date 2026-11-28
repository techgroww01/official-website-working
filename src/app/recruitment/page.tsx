import Link from "next/link";
import { Users, Briefcase, Calendar, ShieldCheck, ArrowUpRight } from "lucide-react";

export default function RecruitmentOverviewPage() {
  const statCards = [
    { label: "Active Requisitions", value: "2 Open Roles", href: "/recruitment/jobs", icon: Briefcase },
    { label: "Candidates in Pipeline", value: "4 Candidates", href: "/recruitment/candidates", icon: Users },
    { label: "Interviews This Week", value: "1 Scheduled", href: "/recruitment/interviews", icon: Calendar },
    { label: "DPDP Retention Compliance", value: "100% On Schedule", href: "/recruitment/retention", icon: ShieldCheck },
  ];

  return (
    <div className="space-y-8">
      <div>
        <p className="eyebrow text-[var(--brand-royal)]">Talent Operations Hub</p>
        <h2 className="font-display mt-1 text-2xl font-bold text-[var(--ink)]">
          Recruitment & Cohort Admissions ATS
        </h2>
        <p className="mt-1 text-sm text-[var(--text-muted)]">
          Manage job openings, review candidate resumes in secure sandboxes, conduct interviews with confidential scorecards, and enforce DPDP 180-day retention policies.
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
          Privacy-by-Design ATS Architecture
        </h3>
        <p className="text-xs text-[var(--text-muted)] leading-relaxed">
          All applicant personal data is retained under strict 180-day automated anonymization. Interview evaluation notes remain strictly confidential between recruiters and hiring managers.
        </p>
      </div>
    </div>
  );
}
