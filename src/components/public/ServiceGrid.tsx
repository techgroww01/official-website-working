"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AnimatedSection } from "@/components/public/AnimatedSection";
import { ServiceIcon } from "@/components/public/ServiceIcon";

type Service = {
  slug: string;
  title: string;
  summary: string;
  categoryName?: string;
  category?: string;
};

interface ServiceGridProps {
  services: Service[];
}

const CATEGORIES = ["All", "Engineering", "Design", "Consulting"];

/**
 * Filterable services grid with smooth CSS transition.
 * Inspired by ssgoi.dev view transitions + recent.design card hover effects.
 */
export function ServiceGrid({ services }: ServiceGridProps) {
  const [active, setActive] = useState("All");

  const filtered =
    active === "All"
      ? services
      : services.filter(
          (s) =>
            s.categoryName?.toLowerCase().includes(active.toLowerCase()) ||
            s.title.toLowerCase().includes(active.toLowerCase())
        );

  return (
    <div>
      {/* Filter tabs */}
      <div
        role="tablist"
        aria-label="Filter services by category"
        className="mb-8 flex flex-wrap gap-2"
      >
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            role="tab"
            aria-selected={active === cat}
            onClick={() => setActive(cat)}
            className={`min-h-[36px] rounded-[var(--radius-pill)] border px-4 py-1.5 text-xs font-semibold transition-all duration-200 ${
              active === cat
                ? "border-[var(--brand-royal)] bg-[var(--brand-royal)] text-white"
                : "border-[var(--line-control)] bg-white text-[var(--text-muted)] hover:border-[var(--brand-cobalt)] hover:text-[var(--ink)]"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((service, i) => (
          <AnimatedSection key={service.slug} delay={i * 60}>
            <Link
              href={`/services/${service.slug}`}
              className="group flex h-full flex-col rounded-[var(--radius-md)] border border-[var(--line)] bg-white p-6 tg-card-interactive hover:border-[var(--brand-royal)] hover:shadow-md"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-[var(--radius-sm)] bg-[var(--paper-elevated)] text-[var(--brand-cobalt)] transition-colors group-hover:bg-[var(--brand-royal)] group-hover:text-white">
                  <ServiceIcon slug={service.slug} className="h-6 w-6" />
                </span>
                {service.categoryName && (
                  <span className="eyebrow text-[var(--brand-link)]">
                    {service.categoryName}
                  </span>
                )}
              </div>

              <h3 className="font-display mt-4 text-xl font-bold text-[var(--ink)] group-hover:text-[var(--brand-royal)] transition-colors">
                {service.title}
              </h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-[var(--text-muted)]">
                {service.summary}
              </p>

              <div className="mt-5 inline-flex items-center gap-1 text-xs font-semibold text-[var(--brand-link)] group-hover:text-[var(--brand-royal)]">
                Explore capability
                <svg viewBox="0 0 14 14" fill="none" className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:transform-none" aria-hidden="true">
                  <path d="M3 7H11M11 7L7 3M11 7L7 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </Link>
          </AnimatedSection>
        ))}
      </div>
    </div>
  );
}
