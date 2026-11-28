import type { Metadata } from "next";
import { getPublishedWork } from "@/lib/cms/public-data";
import { SiteHeader } from "@/components/public/SiteHeader";
import { SiteFooter } from "@/components/public/SiteFooter";
import { WorkFilterGrid } from "@/components/public/WorkFilterGrid";
import { NextTwo } from "@/components/public/NextTwo";

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
        <section className="section-rhythm border-b border-[var(--line)]">
          <div className="container-arch max-w-4xl">
            <p className="eyebrow text-[var(--brand-link)]">Engineering Proof · Zero Disguised Demos</p>
            <h1 className="font-display mt-4 text-4xl font-extrabold text-[var(--ink)] sm:text-6xl">
              Work &amp; Reference Blueprints.
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-[var(--text-muted)]">
              Commercial client work is published strictly after written client approval. Every
              architectural pattern below is transparently badged as a Reference Blueprint or
              Internal Prototype.
            </p>
          </div>
        </section>

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
