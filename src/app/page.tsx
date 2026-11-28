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
import { HeroAnimated } from "@/components/public/HeroAnimated";
import { AnimatedSection } from "@/components/public/AnimatedSection";
import { TrustBar } from "@/components/public/TrustBar";
import { ShieldCheck, Code2, Users, Cpu } from "lucide-react";

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
        {/* 1. Editorial Dark Ink Hero — Premium architectural spacing */}
        <section className="surface-dark relative overflow-hidden bg-[var(--ink)] pt-10 pb-16 text-white sm:pt-14 sm:pb-20">
          {/* Subtle top accent hairline */}
          <div className="tg-accent-draw h-[1px] w-full bg-gradient-to-r from-transparent via-[var(--brand-sky)]/40 to-transparent mb-8" />

          {/* Architectural grid background */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 tg-hero-grid opacity-60"
          />
          {/* Radial glow */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-40 left-1/2 h-[600px] w-[700px] -translate-x-1/2 rounded-full"
            style={{ background: "radial-gradient(ellipse at center, rgba(2,132,199,0.12) 0%, transparent 70%)" }}
          />

          <div className="container-arch relative z-10 grid items-center gap-12 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <HeroAnimated />
            </div>

            {/* GrowthSignal vector architectural diagram */}
            <div className="hidden md:flex justify-center lg:col-span-4 lg:justify-end">
              <GrowthSignal className="h-52 w-52 sm:h-64 sm:w-64 lg:h-72 lg:w-72 drop-shadow-[0_0_24px_rgba(56,189,248,0.12)]" />
            </div>
          </div>
        </section>

        {/* 2. Pausable Capability Ribbon (WCAG 2.2.2) */}
        <CapabilityMarquee />

        {/* 2b. Trust / Differentiator Feature Bar */}
        <TrustBar
          items={[
            {
              icon: <Code2 className="h-5 w-5" aria-hidden="true" />,
              label: "Direct Principal Engineering",
              sub: "Collaborate directly with the developers writing and reviewing the production codebase.",
            },
            {
              icon: <ShieldCheck className="h-5 w-5" aria-hidden="true" />,
              label: "Zero Fabricated Claims",
              sub: "Honest scopes, certified DPDP 2023 compliance, and verifiable case studies.",
            },
            {
              icon: <Cpu className="h-5 w-5" aria-hidden="true" />,
              label: "Multi-Portal Architecture",
              sub: "Purpose-built RBAC portals for Clients, Interns, Sales, Recruitment, and Admin.",
            },
            {
              icon: <Users className="h-5 w-5" aria-hidden="true" />,
              label: "Launch Accountability",
              sub: "Documented repositories, automated QA pipelines, and responsive post-launch support.",
            },
          ]}
        />

        {/* 3. Four Operating Pillars */}
        <section className="section-rhythm surface-light border-b border-[var(--line)] bg-[var(--paper-elevated)]">
          <div className="container-arch">
            <AnimatedSection>
              <p className="eyebrow text-[var(--brand-link)]">01 · What Defines Us</p>
              <h2 className="font-display mt-2 max-w-3xl text-3xl font-bold text-[var(--ink)] sm:text-5xl">
                No inflated history. No agency theatre. Just serious engineering.
              </h2>
            </AnimatedSection>

            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {PILLARS.map((pillar, i) => (
                <AnimatedSection key={pillar.num} delay={i * 70}>
                  <article className="flex flex-col justify-between border-t-2 border-[var(--ink)] pt-5 h-full">
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
                </AnimatedSection>
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
              {insights.slice(0, 2).map((post, i) => (
                <AnimatedSection key={post.slug} delay={i * 100}>
                  <Link
                    href={`/insights/${post.slug}`}
                    className="group flex h-full flex-col rounded-[var(--radius-md)] border border-[var(--line)] bg-white p-6 tg-card-interactive hover:border-[var(--brand-royal)] hover:shadow-lg"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="eyebrow text-[var(--brand-link)]">{post.categoryName}</span>
                      <span className="font-mono-tech text-xs text-[var(--text-muted)]">
                        {post.readingTimeMins} min read
                      </span>
                    </div>
                    <h3 className="font-display mt-3 text-2xl font-bold text-[var(--ink)] group-hover:text-[var(--brand-royal)] transition-colors">
                      {post.title}
                    </h3>
                    <p className="mt-2 flex-1 text-sm text-[var(--text-muted)]">{post.excerpt}</p>
                    <div className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-[var(--brand-link)] group-hover:text-[var(--brand-royal)]">
                      Read article
                      <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:transform-none" aria-hidden="true" />
                    </div>
                  </Link>
                </AnimatedSection>
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
