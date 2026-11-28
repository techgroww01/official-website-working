import Link from "next/link";
import { ArrowLeft, CheckCircle2, Clock, FileText, Download } from "lucide-react";

export default async function ClientProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const milestones = [
    {
      id: "m1",
      title: "01 Understand & Discovery Sign-off",
      description: "Architecture baseline, requirements alignment, and sprint kickoff.",
      status: "in_progress",
      deliverables: [
        { id: "d1", title: "Enterprise Architecture Blueprint v1.0", type: "PDF Document", status: "ready_for_review" },
        { id: "d2", title: "Data Model & RBAC Specifications", type: "Schema Specification", status: "in_progress" },
      ],
    },
    {
      id: "m2",
      title: "02 Architect & Experience Prototype",
      description: "Relational schema, technical interfaces, and UI specifications.",
      status: "not_started",
      deliverables: [],
    },
    {
      id: "m3",
      title: "03 Core Engineering Build",
      description: "Iterative production implementation and staging previews.",
      status: "not_started",
      deliverables: [],
    },
  ];

  return (
    <div className="space-y-6">
      <Link
        href="/client/projects"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--text-muted)] hover:text-[var(--brand-royal)]"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        <span>Back to Projects</span>
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[var(--line-control)] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono-tech text-xs font-bold text-[var(--brand-royal)]">{id}</span>
            <span className="rounded-full bg-blue-50 px-2 py-0.5 font-mono-tech text-[10px] font-semibold text-[var(--brand-royal)] uppercase">
              Discovery Phase
            </span>
          </div>
          <h2 className="font-display mt-1 text-2xl font-bold text-[var(--ink)]">
            Enterprise Operations & Architecture Implementation
          </h2>
          <p className="text-xs text-[var(--text-muted)] mt-1">
            Assigned Lead: Engineering Operations Lead · Greater Noida Tech Team
          </p>
        </div>
      </div>

      {/* Milestones & Deliverables Roadmap */}
      <div className="space-y-4">
        <h3 className="font-display text-base font-bold text-[var(--ink)]">Delivery Milestones & Artifacts</h3>

        <div className="space-y-4">
          {milestones.map((m) => (
            <div
              key={m.id}
              className="rounded-[var(--radius-md)] border border-[var(--line-control)] bg-[var(--portal-surface)] p-6 space-y-4"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-display text-base font-bold text-[var(--ink)]">{m.title}</h4>
                  <p className="text-xs text-[var(--text-muted)] mt-1">{m.description}</p>
                </div>
                <span
                  className={`rounded-full px-2.5 py-1 font-mono-tech text-[10px] font-semibold uppercase ${
                    m.status === "in_progress"
                      ? "bg-blue-50 text-[var(--brand-royal)]"
                      : "bg-stone-100 text-stone-600"
                  }`}
                >
                  {m.status.replace(/_/g, " ")}
                </span>
              </div>

              {m.deliverables.length > 0 && (
                <div className="border-t border-[var(--line-control)] pt-4 space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                    Milestone Deliverables
                  </p>
                  <div className="space-y-2">
                    {m.deliverables.map((d) => (
                      <div
                        key={d.id}
                        className="flex items-center justify-between rounded-[var(--radius-sm)] border border-[var(--line-control)] bg-stone-50 p-3 text-xs"
                      >
                        <div className="flex items-center gap-2.5">
                          <FileText className="h-4 w-4 text-[var(--brand-royal)]" />
                          <div>
                            <p className="font-semibold text-[var(--ink)]">{d.title}</p>
                            <p className="text-[11px] text-[var(--text-muted)]">{d.type}</p>
                          </div>
                        </div>
                        <span className="rounded-full bg-amber-50 px-2 py-0.5 font-mono-tech text-[10px] font-semibold uppercase text-amber-800">
                          {d.status.replace(/_/g, " ")}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
