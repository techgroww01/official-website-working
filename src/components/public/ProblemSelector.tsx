"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const PROBLEMS = [
  {
    id: "web-mobile-engineering",
    prompt: "We need a fast custom web app or customer portal",
    recommendation: "Custom Web & Mobile Engineering (Next.js / React Native / PostgreSQL)",
  },
  {
    id: "salesforce-solutions",
    prompt: "Our Salesforce CRM, Flows, or OmniStudio setup is stalled",
    recommendation: "Salesforce Ecosystem Solutions (Admin, OmniStudio & Support)",
  },
  {
    id: "enterprise-software",
    prompt: "Manual spreadsheets are slowing down approvals & internal teams",
    recommendation: "Enterprise Software Development (RBAC Portals & Automated Pipelines)",
  },
  {
    id: "ui-ux-design",
    prompt: "Our product UX feels cluttered and outdated for serious buyers",
    recommendation: "UI/UX & Product Design (WCAG 2.2 AA Design Systems)",
  },
  {
    id: "it-consulting",
    prompt: "We need architecture discovery before committing budget",
    recommendation: "IT Consulting & Strategic Transformation",
  },
];

/**
 * Jamie Windell-inspired problem-first diagnostic router.
 */
export function ProblemSelector() {
  const [selectedId, setSelectedId] = useState(PROBLEMS[0]!.id);
  const current = PROBLEMS.find((p) => p.id === selectedId) ?? PROBLEMS[0]!;

  return (
    <section className="section-rhythm surface-light border-t border-[var(--line)] bg-[var(--paper-elevated)]">
      <div className="container-arch">
        <p className="eyebrow text-[var(--brand-link)]">03 · Problem-First Scoping</p>
        <h2 className="font-display mt-2 text-3xl font-bold text-[var(--ink)] sm:text-5xl">
          What are you trying to solve right now?
        </h2>
        <p className="mt-3 max-w-2xl text-base text-[var(--text-muted)]">
          Select the operational bottleneck closest to yours to pre-fill a focused engineering conversation.
        </p>

        <div className="mt-8 flex flex-wrap gap-3" role="radiogroup" aria-label="Operational bottleneck options">
          {PROBLEMS.map((item) => {
            const active = item.id === selectedId;
            return (
              <button
                key={item.id}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => setSelectedId(item.id)}
                className={`min-h-[44px] rounded-[var(--radius-pill)] border px-5 py-2.5 text-left text-sm font-medium transition-colors ${
                  active
                    ? "border-[var(--brand-royal)] bg-[var(--brand-royal)] text-white"
                    : "border-[var(--line-control)] bg-white text-[var(--ink)] hover:border-[var(--brand-royal)]"
                }`}
              >
                {item.prompt}
              </button>
            );
          })}
        </div>

        <div className="mt-8 flex flex-col items-start justify-between gap-4 rounded-[var(--radius-md)] border border-[var(--line-control)] bg-white p-6 sm:flex-row sm:items-center">
          <div>
            <p className="eyebrow text-[var(--text-muted)]">Recommended Engagement Track</p>
            <p className="font-display mt-1 text-xl font-bold text-[var(--ink)]">
              {current.recommendation}
            </p>
          </div>
          <Link
            href={`/contact?service=${encodeURIComponent(current.id)}`}
            className="inline-flex min-h-[44px] flex-shrink-0 items-center gap-2 rounded-[var(--radius-pill)] bg-[var(--ink)] px-6 py-3 text-sm font-semibold text-white hover:bg-[var(--ink-elevated)]"
          >
            Scope this challenge
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
