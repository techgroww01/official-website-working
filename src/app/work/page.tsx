import type { Metadata } from "next";
import { getPublishedWork } from "@/lib/cms/public-data";
import { SiteHeader } from "@/components/public/SiteHeader";
import { SiteFooter } from "@/components/public/SiteFooter";
import { WorkFilterGrid } from "@/components/public/WorkFilterGrid";
import { NextTwo } from "@/components/public/NextTwo";
import { AnimatedSection } from "@/components/public/AnimatedSection";

export const metadata: Metadata = {
  title: "Work & Reference Blueprints | Tech Groww",
  description:
    "Explore Tech Groww technical architecture blueprints and approved client engagements with full factual transparency.",
};

export default async function WorkPage() {
  const items = await getPublishedWork();

  return (
    <>
      <SiteHeader polarity="light" />
      <main id="main" className="surface-light flex-1 bg-[var(--paper)]">

        {/* Hero */}
        <section className="section-rhythm border-b border-[var(--line)]">
          <div className="container-arch max-w-4xl">
            <AnimatedSection>
              <p className="eyebrow text-[var(--brand-link)]">Our Work &amp; Examples</p>
              <h1 className="font-display mt-4 text-4xl font-extrabold text-[var(--ink)] sm:text-6xl">
                Honest solutions, never fake claims.
              </h1>
              <p className="mt-6 text-lg leading-relaxed text-[var(--text-muted)]">
                We believe in complete transparency. We only publish client names with written permission.
                Meanwhile, explore our interactive sample solutions demonstrating how we organize websites,
                customer portals, and business workflows cleanly.
              </p>
            </AnimatedSection>
          </div>
        </section>

        {/* Transparency notice */}
        <div className="border-b border-[var(--line)] bg-[var(--paper-elevated)]">
          <div className="container-arch py-5">
            <AnimatedSection>
              <div className="flex flex-wrap items-center gap-3 text-sm">
                <span className="font-mono-tech text-xs font-semibold text-[var(--brand-link)]">TRANSPARENCY POLICY</span>
                <span className="text-[var(--text-muted)]">
                  Items marked <strong className="text-[var(--ink)]">Reference Blueprint</strong> are
                  internal architectural demonstrations. <strong className="text-[var(--ink)]">Client Work</strong> items
                  are published strictly following formal client approval.
                </span>
              </div>
            </AnimatedSection>
          </div>
        </div>

        {/* Work grid */}
        <section className="section-rhythm">
          <div className="container-arch">
            <WorkFilterGrid items={items} />
          </div>
        </section>

        <NextTwo
          left={{ href: "/services", eyebrow: "Capabilities", title: "Explore our 6 engineering disciplines" }}
          right={{ href: "/careers", eyebrow: "Join Us", title: "View open roles & internships" }}
        />
      </main>
      <SiteFooter />
    </>
  );
}
