import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getPublishedInsights } from "@/lib/cms/public-data";
import { SiteHeader } from "@/components/public/SiteHeader";
import { SiteFooter } from "@/components/public/SiteFooter";
import { NextTwo } from "@/components/public/NextTwo";
import { AnimatedSection } from "@/components/public/AnimatedSection";

export const metadata: Metadata = {
  title: "Insights & Updates | Tech Groww Engineering Journal",
  description:
    "Engineering guides, Salesforce architecture insights, and verified updates from Tech Groww.",
};

export default async function InsightsPage() {
  const posts = await getPublishedInsights();

  return (
    <>
      <SiteHeader polarity="light" />
      <main id="main" className="surface-light flex-1 bg-[var(--paper)]">

        {/* Hero */}
        <section className="section-rhythm border-b border-[var(--line)]">
          <div className="container-arch max-w-4xl">
            <AnimatedSection>
              <p className="eyebrow text-[var(--brand-link)]">Engineering Journal</p>
              <h1 className="font-display mt-4 text-4xl font-extrabold text-[var(--ink)] sm:text-6xl">
                Insights &amp; company updates.
              </h1>
              <p className="mt-5 text-lg text-[var(--text-muted)]">
                Technical perspectives across custom software, Salesforce architecture, and
                privacy-first web platforms.
              </p>
            </AnimatedSection>
          </div>
        </section>

        {/* Articles grid */}
        <section className="section-rhythm">
          <div className="container-arch">
            {posts.length === 0 ? (
              <AnimatedSection>
                <div className="rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--paper-elevated)] p-10 text-center">
                  <p className="font-display text-lg font-bold text-[var(--ink)]">
                    First articles coming soon.
                  </p>
                  <p className="mt-2 text-sm text-[var(--text-muted)]">
                    Our engineering team is drafting the first batch of architecture insights.
                  </p>
                </div>
              </AnimatedSection>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {posts.map((post, i) => (
                  <AnimatedSection key={post.slug} delay={i * 55}>
                    <Link
                      href={`/insights/${post.slug}`}
                      className="group flex h-full flex-col rounded-[var(--radius-md)] border border-[var(--line-control)] bg-white p-7 tg-card-interactive hover:border-[var(--brand-royal)] hover:shadow-lg"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="eyebrow text-[var(--brand-link)]">{post.categoryName}</span>
                        <span className="font-mono-tech text-xs text-[var(--text-muted)]">
                          {post.readingTimeMins} min
                        </span>
                      </div>
                      <h2 className="font-display mt-3 flex-1 text-xl font-bold text-[var(--ink)] group-hover:text-[var(--brand-royal)] transition-colors leading-snug">
                        {post.title}
                      </h2>
                      <p className="mt-3 text-sm leading-relaxed text-[var(--text-muted)] line-clamp-3">
                        {post.excerpt}
                      </p>
                      <div className="mt-5 inline-flex items-center gap-1 text-xs font-semibold text-[var(--brand-link)] group-hover:text-[var(--brand-royal)]">
                        Read article
                        <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:transform-none" aria-hidden="true" />
                      </div>
                    </Link>
                  </AnimatedSection>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Newsletter CTA */}
        <section className="section-rhythm surface-dark bg-[var(--ink)] text-white">
          <div className="container-arch">
            <AnimatedSection>
              <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div className="max-w-xl">
                  <p className="eyebrow text-[var(--brand-sky)]">Engineering newsletter</p>
                  <h2 className="font-display mt-2 text-2xl font-bold text-white">
                    Get architecture insights in your inbox.
                  </h2>
                  <p className="mt-2 text-sm text-slate-300">
                    Low-volume, technically rigorous. Unsubscribe with one click (RFC 8058).
                  </p>
                </div>
                <Link
                  href="/contact"
                  className="inline-flex min-h-[48px] flex-shrink-0 items-center gap-2 rounded-[var(--radius-pill)] border border-white/30 px-7 py-3 text-sm font-semibold text-white hover:border-[var(--brand-sky)] hover:text-[var(--brand-sky)] transition-colors"
                >
                  Subscribe
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
            </AnimatedSection>
          </div>
        </section>

        <NextTwo />
      </main>
      <SiteFooter />
    </>
  );
}
