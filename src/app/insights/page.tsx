import type { Metadata } from "next";
import Link from "next/link";
import { getPublishedInsights } from "@/lib/cms/public-data";
import { SiteHeader } from "@/components/public/SiteHeader";
import { SiteFooter } from "@/components/public/SiteFooter";
import { NextTwo } from "@/components/public/NextTwo";

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
        <section className="section-rhythm border-b border-[var(--line)]">
          <div className="container-arch max-w-4xl">
            <p className="eyebrow text-[var(--brand-link)]">Engineering Journal</p>
            <h1 className="font-display mt-4 text-4xl font-extrabold text-[var(--ink)] sm:text-6xl">
              Insights &amp; company updates.
            </h1>
            <p className="mt-5 text-lg text-[var(--text-muted)]">
              Technical perspectives across custom software, Salesforce architecture, and privacy-first
              web platforms.
            </p>
          </div>
        </section>

        <section className="section-rhythm">
          <div className="container-arch grid gap-6 md:grid-cols-2">
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={`/insights/${post.slug}`}
                className="group rounded-[var(--radius-md)] border border-[var(--line-control)] bg-white p-7 transition-colors hover:border-[var(--brand-royal)]"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="eyebrow text-[var(--brand-link)]">{post.categoryName}</span>
                  <span className="font-mono-tech text-xs text-[var(--text-muted)]">
                    {post.readingTimeMins} min read
                  </span>
                </div>
                <h2 className="font-display mt-3 text-2xl font-bold text-[var(--ink)] group-hover:text-[var(--brand-royal)]">
                  {post.title}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-[var(--text-muted)]">
                  {post.excerpt}
                </p>
              </Link>
            ))}
          </div>
        </section>

        <NextTwo />
      </main>
      <SiteFooter />
    </>
  );
}
