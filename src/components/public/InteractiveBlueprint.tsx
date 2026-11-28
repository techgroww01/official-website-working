"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, ChevronDown, Layers } from "lucide-react";
import type { PublicServiceItem } from "@/lib/cms/public-data";
import { ServiceIcon } from "@/components/public/ServiceIcon";

/**
 * 1Centre-inspired live interactive system blueprint split:
 * - >= 1024px desktop: numbered editorial index triggers sticky architectural blueprint preview
 * - < 1024px tablet/mobile: tap-accessible expandable accordion + direct service route link
 */
export function InteractiveBlueprint({ services }: { services: PublicServiceItem[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = services[activeIndex] ?? services[0];

  if (!active) return null;

  return (
    <section id="services-blueprint" className="section-rhythm surface-light bg-[var(--paper)]">
      <div className="container-arch">
        <div className="mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow text-[var(--brand-link)]">02 · Interactive Services Blueprint</p>
            <h2 className="font-display mt-2 text-3xl font-bold text-[var(--ink)] sm:text-5xl">
              Built around real business bottlenecks.
            </h2>
          </div>
          <Link
            href="/services"
            className="inline-flex min-h-[44px] items-center gap-2 text-sm font-semibold text-[var(--brand-link)] hover:underline"
          >
            View all service specifications
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>

        {/* Mobile & Tablet (< 1024px): Tap Accordion */}
        <div className="space-y-3 lg:hidden">
          {services.map((service, idx) => {
            const isOpen = idx === activeIndex;
            return (
              <div
                key={service.slug}
                className="rounded-[var(--radius-md)] border border-[var(--line-control)] bg-[var(--paper-elevated)]"
              >
                <button
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() => setActiveIndex(isOpen ? -1 : idx)}
                  className="flex min-h-[56px] w-full items-center justify-between gap-4 px-5 py-4 text-left"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-mono-tech text-xs text-[var(--brand-link)]">
                      {service.indexNumber}
                    </span>
                    <span className="font-display text-lg font-bold text-[var(--ink)]">
                      {service.title}
                    </span>
                  </div>
                  <ChevronDown
                    className={`h-5 w-5 flex-shrink-0 text-[var(--text-muted)] transition-transform ${
                      isOpen ? "rotate-180" : ""
                    }`}
                    aria-hidden="true"
                  />
                </button>
                <div className="tg-accordion-panel" data-open={isOpen ? "true" : "false"}>
                  <div className="tg-accordion-inner px-5 pb-5">
                    <p className="text-sm text-[var(--text-muted)]">{service.summary}</p>
                    <p className="mt-3 text-sm font-medium text-[var(--ink)]">
                      Approach: {service.solutionApproach}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {service.techTags.slice(0, 4).map((tag) => (
                        <span
                          key={tag}
                          className="rounded-[var(--radius-sm)] border border-[var(--line)] bg-white px-2.5 py-1 font-mono-tech text-[11px] text-[var(--ink)]"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <Link
                      href={`/services/${service.slug}`}
                      className="mt-5 inline-flex min-h-[44px] items-center gap-1.5 text-sm font-semibold text-[var(--brand-royal)]"
                    >
                      Explore {service.title}
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Desktop (>= 1024px): Split Sticky Interactive Blueprint */}
        <div className="hidden lg:grid lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5 divide-y divide-[var(--line)] border-y border-[var(--line)]">
            {services.map((service, idx) => {
              const isSelected = idx === activeIndex;
              return (
                <button
                  key={service.slug}
                  type="button"
                  onMouseEnter={() => setActiveIndex(idx)}
                  onFocus={() => setActiveIndex(idx)}
                  onClick={() => setActiveIndex(idx)}
                  aria-current={isSelected ? "true" : undefined}
                  className={`flex w-full items-start justify-between gap-4 px-5 py-5 text-left transition-all ${
                    isSelected
                      ? "bg-white shadow-xs border-l-4 border-l-[var(--brand-royal)] text-[var(--ink)]"
                      : "border-l-4 border-l-transparent hover:bg-[var(--paper-elevated)]/80 text-[var(--ink)]"
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <span
                        className={`font-mono-tech text-xs ${
                          isSelected ? "text-[var(--brand-royal)] font-semibold" : "text-[var(--text-muted)]"
                        }`}
                      >
                        {service.indexNumber}
                      </span>
                      <span className="font-display text-xl font-bold text-[var(--ink)]">
                        {service.title}
                      </span>
                    </div>
                    <p className="pl-7 text-sm text-[var(--text-muted)] line-clamp-2">
                      {service.summary}
                    </p>
                  </div>
                  <ArrowRight
                    className={`mt-1 h-4 w-4 flex-shrink-0 transition-transform ${
                      isSelected ? "translate-x-1 text-[var(--brand-royal)]" : "text-[var(--text-muted)]"
                    }`}
                    aria-hidden="true"
                  />
                </button>
              );
            })}
          </div>

          <div className="lg:col-span-7">
            <div className="sticky top-24 rounded-[var(--radius-lg)] border border-[var(--line-control)] bg-[var(--paper-elevated)] p-8 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--line)] pb-4">
                <span className="eyebrow text-[var(--brand-link)]">
                  System Blueprint {active.indexNumber} · {active.category}
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-[var(--line)] bg-white px-3 py-1 font-mono-tech text-xs text-[var(--status-success)]">
                  <span className="h-2 w-2 rounded-full bg-[var(--status-success)]" aria-hidden="true" />
                  Scoped Architecture
                </span>
              </div>

              <div className="flex items-center gap-4 mt-5">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-[var(--radius-sm)] bg-white text-[var(--brand-royal)] shadow-xs border border-[var(--line)]">
                  <ServiceIcon slug={active.slug} className="h-6 w-6" />
                </div>
                <h3 className="font-display text-3xl font-bold text-[var(--ink)]">
                  {active.title}
                </h3>
              </div>

              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                <div className="rounded-[var(--radius-md)] border border-[var(--line)] bg-white p-4">
                  <p className="eyebrow text-[var(--text-muted)]">01 · Business Bottleneck</p>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--ink)]">
                    {active.problemStatement}
                  </p>
                </div>
                <div className="rounded-[var(--radius-md)] border border-[var(--line)] bg-white p-4">
                  <p className="eyebrow text-[var(--brand-link)]">02 · Architectural Solution</p>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--ink)]">
                    {active.solutionApproach}
                  </p>
                </div>
              </div>

              <div className="mt-6">
                <p className="eyebrow text-[var(--text-muted)]">Core Capabilities Included</p>
                <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                  {active.capabilities.map((cap) => (
                    <li key={cap} className="flex items-start gap-2 text-sm text-[var(--ink)]">
                      <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 bg-[var(--brand-royal)]" aria-hidden="true" />
                      <span>{cap}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-[var(--line)] pt-5">
                <div className="flex flex-wrap gap-2">
                  {active.techTags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-[var(--radius-sm)] border border-[var(--line)] bg-white px-2.5 py-1 font-mono-tech text-xs text-[var(--ink)]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-3">
                  <Link
                    href={`/services/${active.slug}`}
                    className="inline-flex min-h-[44px] items-center gap-2 rounded-[var(--radius-pill)] bg-[var(--brand-royal)] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#1e40af]"
                  >
                    Full Blueprint
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
