"use client";

import React, { useEffect, useRef, useState } from "react";

const STAGES = [
  {
    num: "01",
    name: "Understand",
    title: "Understand the business problem",
    desc: "Direct sessions with engineering principals to uncover constraints, user workflows, and integration dependencies before touching code.",
    deliverables: ["Constraint Map", "Stakeholder Workflows", "Integration Audits"],
  },
  {
    num: "02",
    name: "Architect",
    title: "Architect & scope cleanly",
    desc: "Relational PostgreSQL models, RBAC permissions, security boundaries, and UI prototypes approved up front.",
    deliverables: ["PostgreSQL Schema", "RBAC Matrix", "Interactive Wireframes"],
  },
  {
    num: "03",
    name: "Build",
    title: "Iterative engineering build",
    desc: "Weekly staging previews tied directly to Git commits so leadership evaluates working software instead of status slides.",
    deliverables: ["Weekly Staging Previews", "Atomic Git Commits", "CI/CD Pipeline"],
  },
  {
    num: "04",
    name: "Verify",
    title: "Verify quality & security",
    desc: "Automated type safety, unit/RBAC tests, accessibility checks, and security headers verified prior to DNS cutover.",
    deliverables: ["WCAG 2.2 AA Audit", "RBAC Security Tests", "OWASP Header Checks"],
  },
  {
    num: "05",
    name: "Support",
    title: "Accountable launch & support",
    desc: "Clean production cutover, team onboarding, documented repositories, and responsive post-launch operational maintenance.",
    deliverables: ["DNS Production Cutover", "Architecture Runbook", "Post-Launch SLAs"],
  },
];

/**
 * Viewz-inspired 5-Stage Delivery Rail tracked via passive IntersectionObserver.
 */
export function DeliveryRail() {
  const [activeIdx, setActiveIdx] = useState(0);
  const refs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const idx = Number(entry.target.getAttribute("data-stage-idx"));
            if (!Number.isNaN(idx)) setActiveIdx(idx);
          }
        }
      },
      { rootMargin: "-35% 0px -35% 0px", threshold: 0.1 }
    );

    refs.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <section className="section-rhythm surface-light border-t border-[var(--line)] bg-[var(--paper)]">
      <div className="container-arch">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-28">
              <p className="eyebrow text-[var(--brand-link)]">04 · How We Deliver</p>
              <h2 className="font-display mt-2 text-3xl font-bold text-[var(--ink)] sm:text-5xl">
                Five predictable stages. Zero black-box surprises.
              </h2>
              <p className="mt-4 text-base text-[var(--text-muted)]">
                Every engagement follows an auditable path from problem framing to post-launch accountability.
              </p>

              <div className="mt-8 hidden lg:flex flex-col gap-2 border-l-2 border-[var(--line)] pl-4">
                {STAGES.map((stage, i) => (
                  <div
                    key={stage.num}
                    className={`font-mono-tech text-xs transition-colors ${
                      i === activeIdx
                        ? "font-semibold text-[var(--brand-royal)]"
                        : "text-[var(--text-muted)]"
                    }`}
                  >
                    {stage.num} {stage.name}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-6">
            {STAGES.map((stage, i) => {
              const active = i === activeIdx;
              return (
                <div
                  key={stage.num}
                  ref={(el) => {
                    refs.current[i] = el;
                  }}
                  data-stage-idx={i}
                  className={`rounded-[var(--radius-md)] border p-6 transition-all duration-200 ${
                    active
                      ? "border-[var(--brand-royal)] border-l-4 border-l-[var(--brand-royal)] bg-white shadow-sm"
                      : "border-[var(--line)] bg-white/70 hover:bg-white"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="inline-flex h-8 min-w-[36px] items-center justify-center rounded-[var(--radius-sm)] bg-[var(--ink)] px-2 font-mono-tech text-xs font-semibold text-white">
                      {stage.num}
                    </span>
                    <span className="eyebrow text-[var(--brand-link)]">{stage.name}</span>
                  </div>
                  <h3 className="font-display mt-3 text-2xl font-bold text-[var(--ink)]">
                    {stage.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--text-muted)]">
                    {stage.desc}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {stage.deliverables.map((chip) => (
                      <span
                        key={chip}
                        className="rounded-[var(--radius-sm)] border border-[var(--line)] bg-[var(--paper-elevated)] px-2.5 py-1 font-mono-tech text-[11px] text-[var(--ink)]"
                      >
                        {chip}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
