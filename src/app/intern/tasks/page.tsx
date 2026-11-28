import Link from "next/link";
import { CheckSquare, Clock, FileText, ArrowUpRight } from "lucide-react";

const DEMO_TASKS = [
  {
    id: "task-01",
    title: "Week 1: TypeScript Strict Mode & Domain Models",
    instructions: "Design strongly typed domain models for customer order workflows with exhaustive Discriminated Unions.",
    status: "completed",
    feedback: "Exemplary type safety and error boundary modeling.",
    rating: 5,
  },
  {
    id: "task-02",
    title: "Week 2: Next.js Server Components & Data Fetching",
    instructions: "Build an accessible data table using Server Components, streaming Suspense boundaries, and pagination.",
    status: "in_review",
    feedback: "Awaiting mentor evaluation.",
    rating: null,
  },
  {
    id: "task-03",
    title: "Week 3: PostgreSQL Schema Design & RLS Policies",
    instructions: "Author declarative migrations for multi-tenant organizations with strict row-level security tests.",
    status: "todo",
    feedback: null,
    rating: null,
  },
];

export default function InternTasksPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-xl font-bold text-[var(--ink)]">Curriculum Tasks & Project Submissions</h2>
        <p className="text-xs text-[var(--text-muted)]">
          Inspect weekly engineering assignments and submit your deliverables. Peer isolation enforced: only you and your mentor see your submissions.
        </p>
      </div>

      <div className="space-y-4">
        {DEMO_TASKS.map((t) => (
          <div
            key={t.id}
            className="rounded-[var(--radius-md)] border border-[var(--line-control)] bg-[var(--portal-surface)] p-6 space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <h3 className="font-display text-base font-bold text-[var(--ink)]">{t.title}</h3>
                <p className="text-xs text-[var(--text-muted)] mt-1">{t.instructions}</p>
              </div>
              <span
                className={`self-start sm:self-auto rounded-full px-2.5 py-1 font-mono-tech text-[10px] font-semibold uppercase ${
                  t.status === "completed"
                    ? "bg-emerald-50 text-emerald-700"
                    : t.status === "in_review"
                    ? "bg-amber-50 text-amber-700"
                    : "bg-stone-100 text-stone-600"
                }`}
              >
                {t.status.replace(/_/g, " ")}
              </span>
            </div>

            {t.feedback && (
              <div className="rounded-[var(--radius-sm)] border border-[var(--line-control)] bg-stone-50 p-3 text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-[var(--ink)]">Mentor Evaluation</span>
                  {t.rating && (
                    <span className="font-mono-tech text-amber-600 font-bold">
                      {t.rating} / 5 Stars
                    </span>
                  )}
                </div>
                <p className="text-[var(--text-muted)]">{t.feedback}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
