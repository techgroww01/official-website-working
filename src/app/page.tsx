import React from "react";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { COMPANY_CONFIG } from "@/lib/company-config";
import { getPublishedInsights, getPublishedServices } from "@/lib/cms/public-data";
import { SiteHeader } from "@/components/public/SiteHeader";
import { SiteFooter } from "@/components/public/SiteFooter";
import { ScrollProgress } from "@/components/public/ScrollProgress";
import { GrowthSignal } from "@/components/public/GrowthSignal";
import { CapabilityMarquee } from "@/components/public/CapabilityMarquee";
import { InteractiveBlueprint } from "@/components/public/InteractiveBlueprint";
import { ProblemSelector } from "@/components/public/ProblemSelector";
import { DeliveryRail } from "@/components/public/DeliveryRail";
import { FaqAccordion } from "@/components/public/FaqAccordion";
import { NextTwo } from "@/components/public/NextTwo";

const PILLARS = [
  {
    num: "01",
    title: "Business-first problem framing",
    body: "We diagnose operational friction before suggesting frameworks. Every feature must justify how it serves your buyers or internal team.",
  },
  {
    num: "02",
    title: "Practical, buildable architecture",
    body: "Clean PostgreSQL schemas, strict access boundaries, and readable TypeScript codebases scoped honestly around real budgets and timelines.",
  },
  {
    num: "03",
    title: "Direct principal collaboration",
    body: "No account-manager layers translating requirements. You collaborate straight with the engineers designing and shipping your platform.",
  },
  {
    num: "04",
    title: "End-to-end launch accountability",
    body: "Clear deliverables, verifiable QA checks, transparent documentation, and responsible post-launch maintenance.",
  },
];

export default async function HomePage() {
  const [services, insights] = await Promise.all([
    getPublishedServices(),
    getPublishedInsights(),
  ]);

  return (
    <>
      <ScrollProgress />
      <SiteHeader polarity="dark" />

      <main id="main" className="flex-1">
        {/* 1. Editorial Dark Ink Hero — SSR H1 immediately visible at opacity: 1 for fast LCP */}
        <section className="surface-dark relative overflow-hidden bg-[var(--ink)] pt-14 pb-20 text-white sm:pt-20 sm:pb-24">
          <div className="tg-accent-draw h-[2px] w-full bg-gradient-to-r from-[var(--brand-sky)] via-[var(--brand-cobalt)] to-transparent mb-10" />

          <div className="container-arch grid items-center gap-12 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <p className="eyebrow text-[var(--brand-sky)]">
                Greater Noida, Uttar Pradesh · Founded {COMPANY_CONFIG.foundedYear}
              </p>

              <h1 className="font-display mt-5 text-[clamp(2.65rem,7.2vw,5.75rem)] font-extrabold leading-[0.94] tracking-[-0.045em] text-white">
                Technology that drives growth.
              </h1>

              <p className="mt-6 max-w-2xl text-[clamp(1.02rem,1.4vw,1.18rem)] leading-relaxed text-slate-300">
                Engineering software, Salesforce workflows, and digital products around real business
                bottlenecks — direct principal accountability from scope to support.
              </p>

              <div className="mt-9 flex flex-wrap items-center gap-4">
                <Link
                  href="/contact"
                  className="inline-flex min-h-[48px] items-center gap-2 rounded-[var(--radius-pill)] bg-white px-7 py-3 text-sm font-semibold text-[var(--ink)] transition-transform hover:-translate-y-0.5 hover:bg-slate-100"
                >
                  Start a project
                  <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                </Link>
                <a
                  href="#services-blueprint"
                  className="inline-flex min-h-[48px] items-center gap-2 rounded-[var(--radius-pill)] border border-white/30 px-6 py-3 text-sm font-semibold text-white hover:border-white"
                >
                  Explore blueprint
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </a>
              </div>

              {/* Super 8 Studio-inspired 3-item balanced metadata strip */}
              <dl className="mt-12 grid grid-cols-1 gap-4 border-t border-white/15 pt-6 sm:grid-cols-3">
                <div>
                  <dt className="eyebrow text-[var(--text-muted-dark)]">Founded</dt>
                  <dd className="mt-1 font-display text-lg font-bold text-white">
                    {COMPANY_CONFIG.foundedYear}
                  </dd>
                </div>
                <div>
                  <dt className="eyebrow text-[var(--text-muted-dark)]">Headquarters</dt>
                  <dd className="mt-1 font-display text-lg font-bold text-white">
                    Greater Noida, UP
                  </dd>
                </div>
                <div>
                  <dt className="eyebrow text-[var(--text-muted-dark)]">Core Focus</dt>
                  <dd className="mt-1 font-display text-lg font-bold text-white">
                    Web, Salesforce &amp; Software
                  </dd>
                </div>
              </dl>
            </div>

            {/* GrowthSignal vector architectural diagram (hidden < 480px, compact on mobile/tablet, hero split desktop) */}
            <div className="hidden min-[480px]:flex justify-center lg:col-span-4 lg:justify-end">
              <GrowthSignal className="h-44 w-44 sm:h-56 sm:w-56 lg:h-80 lg:w-80" />
            </div>
          </div>
        </section>

        {/* 2. Pausable Capability Ribbon (WCAG 2.2.2) */}
        <CapabilityMarquee />

        {/* 3. Four Operating Pillars */}
        <section className="section-rhythm surface-light border-b border-[var(--line)] bg-[var(--paper-elevated)]">
          <div className="container-arch">
            <p className="eyebrow text-[var(--brand-link)]">01 · What Defines Us</p>
            <h2 className="font-display mt-2 max-w-3xl text-3xl font-bold text-[var(--ink)] sm:text-5xl">
              No inflated history. No agency theatre. Just serious engineering.
            </h2>

            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {PILLARS.map((pillar) => (
                <article
                  key={pillar.num}
                  className="flex flex-col justify-between border-t-2 border-[var(--ink)] pt-5"
                >
                  <div>
                    <span className="font-mono-tech text-xs font-medium text-[var(--brand-link)]">
                      {pillar.num}
                    </span>
                    <h3 className="font-display mt-3 text-xl font-bold text-[var(--ink)]">
                      {pillar.title}
                    </h3>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-[var(--text-muted)]">
                    {pillar.body}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* 4. Interactive Services Blueprint */}
        <InteractiveBlueprint services={services} />

        {/* 5. Problem-First Diagnostic Selector */}
        <ProblemSelector />

        {/* 6. Scroll-Tracked 5-Stage Delivery Rail */}
        <DeliveryRail />

        {/* 7. Honest Work / Reference Blueprints Teaser */}
        <section className="section-rhythm surface-dark bg-[var(--ink)] text-white">
          <div className="container-arch flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <p className="eyebrow text-[var(--brand-sky)]">05 · Reference Architectures</p>
              <h2 className="font-display mt-2 text-3xl font-bold text-white sm:text-5xl">
                Real proof, never disguised demos.
              </h2>
              <p className="mt-4 text-base leading-relaxed text-slate-300">
                Commercial client engagements appear on our Work page strictly after written approval.
                Until then, inspect our transparent architectural blueprints built to demonstrate
                real multi-portal and Salesforce system design.
              </p>
            </div>
            <Link
              href="/work"
              className="inline-flex min-h-[48px] flex-shrink-0 items-center gap-2 rounded-[var(--radius-pill)] border border-white/30 px-7 py-3 text-sm font-semibold text-white hover:border-[var(--brand-sky)] hover:text-[var(--brand-sky)]"
            >
              Inspect Reference Blueprints
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </section>

        {/* 8. Latest Insights & Company Updates */}
        <section className="section-rhythm surface-light bg-[var(--paper-elevated)]">
          <div className="container-arch">
            <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="eyebrow text-[var(--brand-link)]">Engineering Journal</p>
                <h2 className="font-display mt-2 text-3xl font-bold text-[var(--ink)] sm:text-4xl">
                  Insights &amp; company updates.
                </h2>
              </div>
              <Link
                href="/insights"
                className="inline-flex min-h-[44px] items-center gap-2 text-sm font-semibold text-[var(--brand-link)] hover:underline"
              >
                All insights
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {insights.slice(0, 2).map((post) => (
                <Link
                  key={post.slug}
                  href={`/insights/${post.slug}`}
                  className="group rounded-[var(--radius-md)] border border-[var(--line)] bg-white p-6 transition-colors hover:border-[var(--brand-royal)]"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="eyebrow text-[var(--brand-link)]">{post.categoryName}</span>
                    <span className="font-mono-tech text-xs text-[var(--text-muted)]">
                      {post.readingTimeMins} min read
                    </span>
                  </div>
                  <h3 className="font-display mt-3 text-2xl font-bold text-[var(--ink)] group-hover:text-[var(--brand-royal)]">
                    {post.title}
                  </h3>
                  <p className="mt-2 text-sm text-[var(--text-muted)]">{post.excerpt}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* 9. Straight-Answers FAQ */}
        <FaqAccordion />

        {/* 10. NextTwo Conversion Footer Band */}
        <NextTwo />
      </main>

      <SiteFooter />
    </>
  );
}
