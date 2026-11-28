import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getPublishedServices } from "@/lib/cms/public-data";
import { SiteHeader } from "@/components/public/SiteHeader";
import { SiteFooter } from "@/components/public/SiteFooter";
import { InteractiveBlueprint } from "@/components/public/InteractiveBlueprint";
import { ProblemSelector } from "@/components/public/ProblemSelector";
import { NextTwo } from "@/components/public/NextTwo";

export const metadata: Metadata = {
  title: "Services | Web, Mobile, Salesforce & UI/UX — Tech Groww",
  description:
    "Explore Tech Groww capabilities across Web & Mobile Engineering, Salesforce & OmniStudio, UI/UX Design, Enterprise Software, IT Consulting, and Technical SEO.",
};

export default async function ServicesDirectoryPage() {
  const services = await getPublishedServices();

  return (
    <>
      <SiteHeader polarity="light" />
      <main id="main" className="surface-light flex-1 bg-[var(--paper)]">
        <section className="section-rhythm border-b border-[var(--line)]">
          <div className="container-arch max-w-4xl">
            <p className="eyebrow text-[var(--brand-link)]">Engineering Capabilities</p>
            <h1 className="font-display mt-4 text-4xl font-extrabold text-[var(--ink)] sm:text-6xl">
              Focused capabilities scoped around business reality.
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-[var(--text-muted)]">
              Every service line combines principal-level system architecture, transparent code
              ownership, and pragmatic delivery timelines.
            </p>
          </div>
        </section>

        <InteractiveBlueprint services={services} />

        {/* Engagement Models Comparison */}
        <section className="section-rhythm border-t border-[var(--line)] bg-white">
          <div className="container-arch">
            <p className="eyebrow text-[var(--brand-link)]">Engagement Models</p>
            <h2 className="font-display mt-2 text-3xl font-bold text-[var(--ink)] sm:text-4xl">
              Two transparent ways to collaborate.
            </h2>

            <div className="mt-10 grid gap-6 md:grid-cols-2">
              <div className="rounded-[var(--radius-md)] border border-[var(--line-control)] bg-[var(--paper-elevated)] p-8">
                <span className="eyebrow text-[var(--brand-link)]">Model 01</span>
                <h3 className="font-display mt-2 text-2xl font-bold text-[var(--ink)]">
                  Milestone Fixed-Scope Delivery
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-[var(--text-muted)]">
                  Best for well-defined corporate websites, MVP launches, Salesforce implementations,
                  and fixed-backlog portal builds with clear sign-off gates.
                </p>
                <Link
                  href="/contact"
                  className="mt-6 inline-flex min-h-[44px] items-center gap-1.5 text-sm font-semibold text-[var(--brand-royal)] hover:underline"
                >
                  Request milestone estimate
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>

              <div className="rounded-[var(--radius-md)] border border-[var(--line-control)] bg-[var(--paper-elevated)] p-8">
                <span className="eyebrow text-[var(--brand-link)]">Model 02</span>
                <h3 className="font-display mt-2 text-2xl font-bold text-[var(--ink)]">
                  Dedicated Engineering &amp; Support Retainer
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-[var(--text-muted)]">
                  Designed for ongoing Salesforce Admin/OmniStudio evolution, iterative product
                  engineering, security hardening, and continuous platform operations.
                </p>
                <Link
                  href="/contact"
                  className="mt-6 inline-flex min-h-[44px] items-center gap-1.5 text-sm font-semibold text-[var(--brand-royal)] hover:underline"
                >
                  Discuss monthly capacity
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        <ProblemSelector />
        <NextTwo />
      </main>
      <SiteFooter />
    </>
  );
}
