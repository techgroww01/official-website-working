"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { PublicWorkItem } from "@/lib/cms/public-data";

export function WorkFilterGrid({ items }: { items: PublicWorkItem[] }) {
  const hasApprovedClientWork = items.some(
    (item) => item.projectType === "client_project" && item.isClientApproved
  );

  const tabs: { key: "all" | PublicWorkItem["projectType"]; label: string }[] = [
    { key: "all", label: "All" },
    ...(hasApprovedClientWork ? [{ key: "client_project" as const, label: "Client Work" }] : []),
    { key: "reference_blueprint", label: "Reference Blueprints" },
    { key: "internal_product", label: "Internal Products" },
  ];

  const [filter, setFilter] = useState<"all" | PublicWorkItem["projectType"]>("all");

  const visible =
    filter === "all" ? items : items.filter((item) => item.projectType === filter);

  return (
    <div>
      <div className="flex flex-wrap gap-2.5" role="tablist" aria-label="Filter work by category">
        {tabs.map((tab) => {
          const active = filter === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setFilter(tab.key)}
              className={`min-h-[44px] rounded-[var(--radius-pill)] border px-5 py-2 text-sm font-medium transition-colors ${
                active
                  ? "border-[var(--brand-royal)] bg-[var(--brand-royal)] text-white"
                  : "border-[var(--line-control)] bg-white text-[var(--ink)] hover:border-[var(--brand-royal)]"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {visible.length === 0 ? (
        <div className="mt-10 rounded-[var(--radius-md)] border border-[var(--line-control)] bg-white p-8">
          <p className="text-sm text-[var(--text-muted)]">
            No items currently published in this category. Inspect our Reference Blueprints or
            contact us to request an architecture walkthrough.
          </p>
        </div>
      ) : (
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {visible.map((item) => {
            const badgeLabel =
              item.projectType === "client_project"
                ? "CLIENT WORK"
                : item.projectType === "internal_product"
                ? "INTERNAL PROTOTYPE"
                : "REFERENCE BLUEPRINT";

            return (
              <Link
                key={item.slug}
                href={`/work/${item.slug}`}
                className="group flex flex-col justify-between rounded-[var(--radius-md)] border border-[var(--line-control)] bg-white p-7 transition-colors hover:border-[var(--brand-royal)]"
              >
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="rounded-[var(--radius-sm)] border border-[var(--line)] bg-[var(--paper)] px-2.5 py-1 font-mono-tech text-[11px] font-semibold text-[var(--brand-link)]">
                      {badgeLabel}
                    </span>
                    <span className="font-mono-tech text-xs text-[var(--text-muted)]">
                      {item.industry}
                    </span>
                  </div>
                  <h2 className="font-display mt-4 text-2xl font-bold text-[var(--ink)] group-hover:text-[var(--brand-royal)]">
                    {item.title}
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed text-[var(--text-muted)]">
                    {item.summary}
                  </p>
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-[var(--line)] pt-4">
                  <div className="flex flex-wrap gap-2">
                    {item.techStack.slice(0, 3).map((tech) => (
                      <span
                        key={tech}
                        className="font-mono-tech text-xs text-[var(--text-muted)]"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                  <ArrowUpRight
                    className="h-4 w-4 text-[var(--brand-link)]"
                    aria-hidden="true"
                  />
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
