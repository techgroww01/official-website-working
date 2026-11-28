"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const PROBLEMS = [
  {
    id: "web-mobile-engineering",
    prompt: "We need a fast, modern website or mobile app",
    recommendation: "Custom Websites & Mobile Apps built around your customers",
  },
  {
    id: "salesforce-solutions",
    prompt: "Our Salesforce or sales follow-up feels messy",
    recommendation: "Salesforce Setup, Cleanup & Ongoing Team Support",
  },
  {
    id: "enterprise-software",
    prompt: "Manual spreadsheets are slowing our team down",
    recommendation: "Custom Team Dashboards & Automated Approval Portals",
  },
  {
    id: "ui-ux-design",
    prompt: "Our website or app looks outdated and hard to use",
    recommendation: "Clean, Trustworthy UI/UX Design built for real buyers",
  },
  {
    id: "it-consulting",
    prompt: "We need honest advice before spending our budget",
    recommendation: "Practical Tech Guidance & Step-by-Step Project Planning",
  },
];

/**
 * Plain-English interactive problem solver that helps any visitor pick what they need.
 */
export function ProblemSelector() {
  const [selectedId, setSelectedId] = useState(PROBLEMS[0]!.id);
  const current = PROBLEMS.find((p) => p.id === selectedId) ?? PROBLEMS[0]!;

  return (
    <section className="section-rhythm surface-light border-t border-[var(--line)] bg-[var(--paper-elevated)]">
      <div className="container-arch">
        <p className="eyebrow text-[var(--brand-link)]">03 · Quick Project Finder</p>
        <h2 className="font-display mt-2 text-3xl font-bold text-[var(--ink)] sm:text-5xl">
          What would you like to improve first?
        </h2>
        <p className="mt-3 max-w-2xl text-base text-[var(--text-muted)]">
          Pick the challenge closest to yours, and we&apos;ll pre-fill a simple note so you can reach out in seconds.
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

        <div className="mt-8 flex flex-col items-start justify-between gap-6 rounded-[var(--radius-md)] border border-[var(--line)] bg-white p-6 sm:p-7 shadow-xs sm:flex-row sm:items-center">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="eyebrow text-[var(--brand-link)]">Best Way We Can Help</span>
              <span className="rounded-full bg-emerald-50 text-emerald-700 px-2.5 py-0.5 text-[11px] font-medium border border-emerald-200">
                Free Initial Chat
              </span>
            </div>
            <p className="font-display text-xl sm:text-2xl font-bold text-[var(--ink)]">
              {current.recommendation}
            </p>
            <p className="text-xs sm:text-sm text-[var(--text-muted)]">
              Includes a clear plan, honest budget range, and weekly progress previews you can test yourself.
            </p>
          </div>
          <Link
            href={`/contact?service=${encodeURIComponent(current.id)}`}
            className="group inline-flex min-h-[48px] flex-shrink-0 items-center gap-2 rounded-[var(--radius-pill)] bg-[var(--ink)] px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[var(--ink-elevated)] hover:-translate-y-0.5 motion-reduce:transform-none"
          >
            <span>Talk to us about this</span>
            <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transform-none" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
