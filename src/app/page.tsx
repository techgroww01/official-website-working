import React from "react";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, ShieldCheck, Sparkles, Users, Layers } from "lucide-react";
import { COMPANY_CONFIG } from "@/lib/company-config";
import { getPublishedInsights, getPublishedServices } from "@/lib/cms/public-data";
import { SiteHeader } from "@/components/public/SiteHeader";
import { SiteFooter } from "@/components/public/SiteFooter";
import { ScrollProgress } from "@/components/public/ScrollProgress";
import { InteractiveHeroLogo } from "@/components/public/InteractiveHeroLogo";
import { CapabilityMarquee } from "@/components/public/CapabilityMarquee";
import { InteractiveBlueprint } from "@/components/public/InteractiveBlueprint";
import { ProblemSelector } from "@/components/public/ProblemSelector";
import { DeliveryRail } from "@/components/public/DeliveryRail";
import { FaqAccordion } from "@/components/public/FaqAccordion";
import { NextTwo } from "@/components/public/NextTwo";
import { HeroAnimated } from "@/components/public/HeroAnimated";
import { AnimatedSection } from "@/components/public/AnimatedSection";
import { TrustBar } from "@/components/public/TrustBar";
import { StudioShowcase } from "@/components/public/StudioShowcase";

const PILLARS = [
  {
    num: "01",
    title: "Your goals come first",
    body: "We listen to where your daily operations feel stuck before suggesting tools. Every feature exists to save time or help you win more customers.",
  },
  {
    num: "02",
    title: "Simple, reliable foundations",
    body: "Clean, organized systems planned honestly around your real budget and timeline — never over-complicated with buzzwords.",
  },
  {
    num: "03",
    title: "Talk directly with the builders",
    body: "No middlemen translating your ideas. You work directly with the specialists designing, writing, and launching your product.",
  },
  {
    num: "04",
    title: "Support that stays after launch",
    body: "Clear milestones, thorough testing before going live, simple guides for your staff, and dependable ongoing care.",
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
        {/* 1. Hero Section — Balanced, elegant spacing without large dead gaps */}
        <section className="surface-dark relative overflow-hidden bg-[var(--ink)] pt-4 pb-12 text-white sm:pt-6 sm:pb-16">
          {/* Ambient radial glow */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-40 left-1/2 h-[550px] w-[650px] -translate-x-1/2 rounded-full"
            style={{ background: "radial-gradient(ellipse at center, rgba(2,132,199,0.14) 0%, transparent 70%)" }}
          />

          <div className="container-arch relative z-10 grid items-center gap-8 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <HeroAnimated />
            </div>

            {/* Interactive & Animated Official Company Logo */}
            <div className="flex justify-center lg:col-span-5 lg:justify-end">
              <InteractiveHeroLogo />
            </div>
          </div>
        </section>

        {/* 2. Pausable Capability Ribbon (WCAG 2.2.2) */}
        <CapabilityMarquee />

        {/* 2b. Trust Feature Bar */}
        <TrustBar
          items={[
            {
              icon: <Sparkles className="h-5 w-5" aria-hidden="true" />,
              label: "Talk Directly to the Makers",
              sub: "No middlemen or confusing handoffs. Work straight with the people crafting your product.",
            },
            {
              icon: <ShieldCheck className="h-5 w-5" aria-hidden="true" />,
              label: "100% Honest Commitments",
              sub: "Clear pricing, realistic timelines, and verified work — never inflated claims.",
            },
            {
              icon: <Layers className="h-5 w-5" aria-hidden="true" />,
              label: "All-in-One Team Portals",
              sub: "Easy-to-use dashboards tailored for your clients, sales team, and internal staff.",
            },
            {
              icon: <Users className="h-5 w-5" aria-hidden="true" />,
              label: "Dependable Ongoing Care",
              sub: "We train your team, launch smoothly, and stay available whenever you need support.",
            },
          ]}
        />

        {/* 3. Real Studio Showcase (1080p Video + Authentic Indian Touch Photo Gallery) */}
        <StudioShowcase />

        {/* 4. Four Operating Pillars */}
        <section className="section-rhythm surface-light border-b border-[var(--line)] bg-[var(--paper-elevated)]">
          <div className="container-arch">
            <AnimatedSection>
              <p className="eyebrow text-[var(--brand-link)]">01 · Why Clients Trust Us</p>
              <h2 className="font-display mt-2 max-w-3xl text-3xl font-bold text-[var(--ink)] sm:text-5xl">
                No confusing jargon. No empty promises. Just honest work that helps you grow.
              </h2>
            </AnimatedSection>

            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {PILLARS.map((pillar, i) => (
                <AnimatedSection key={pillar.num} delay={i * 70}>
                  <article className="group flex flex-col justify-between rounded-xl border border-[var(--line)] bg-white p-6 shadow-xs transition-all duration-200 hover:-translate-y-1 hover:border-[var(--brand-royal)] hover:shadow-md h-full">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-[var(--paper-elevated)] font-mono-tech text-xs font-bold text-[var(--brand-link)] border border-[var(--line)]">
                          {pillar.num}
                        </span>
                        <span className="h-1.5 w-1.5 rounded-full bg-[var(--brand-sky)] opacity-0 transition-opacity group-hover:opacity-100" />
                      </div>
                      <h3 className="font-display mt-4 text-xl font-bold text-[var(--ink)] group-hover:text-[var(--brand-royal)] transition-colors">
                        {pillar.title}
                      </h3>
                    </div>
                    <p className="mt-4 text-sm leading-relaxed text-[var(--text-muted)]">
                      {pillar.body}
                    </p>
                  </article>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>

        {/* 5. Interactive Services Blueprint */}
        <InteractiveBlueprint services={services} />

        {/* 6. Problem-First Diagnostic Selector */}
        <ProblemSelector />

        {/* 7. Scroll-Tracked 5-Stage Delivery Rail */}
        <DeliveryRail />

        {/* 8. Honest Work Teaser */}
        <section className="section-rhythm surface-dark bg-[var(--ink)] text-white">
          <div className="container-arch flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <p className="eyebrow text-[var(--brand-sky)]">05 · Our Work &amp; Examples</p>
              <h2 className="font-display mt-2 text-3xl font-bold text-white sm:text-5xl">
                Honest proof, never fake portfolios.
              </h2>
              <p className="mt-4 text-base leading-relaxed text-slate-300">
                We only share client project names after they give us written permission. Meanwhile,
                explore our sample solutions designed to show how we organize portals,
                websites, and business workflows cleanly.
              </p>
            </div>
            <Link
              href="/work"
              className="inline-flex min-h-[48px] flex-shrink-0 items-center gap-2 rounded-[var(--radius-pill)] border border-white/30 px-7 py-3 text-sm font-semibold text-white hover:border-[var(--brand-sky)] hover:text-[var(--brand-sky)]"
            >
              See Sample Solutions
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </section>

        {/* 9. Latest Guides & Company Updates */}
        <section className="section-rhythm surface-light bg-[var(--paper-elevated)]">
          <div className="container-arch">
            <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="eyebrow text-[var(--brand-link)]">Helpful Guides &amp; News</p>
                <h2 className="font-display mt-2 text-3xl font-bold text-[var(--ink)] sm:text-4xl">
                  Insights &amp; company updates.
                </h2>
              </div>
              <Link
                href="/insights"
                className="inline-flex min-h-[44px] items-center gap-2 text-sm font-semibold text-[var(--brand-link)] hover:underline"
              >
                Read all guides
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

        {/* 10. Straight-Answers FAQ */}
        <FaqAccordion />

        {/* 11. NextTwo Conversion Footer Band */}
        <NextTwo />
      </main>

      <SiteFooter />
    </>
  );
}
