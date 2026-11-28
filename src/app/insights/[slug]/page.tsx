import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPublishedInsights } from "@/lib/cms/public-data";
import { renderSafeMarkdown } from "@/lib/markdown";
import { SiteHeader } from "@/components/public/SiteHeader";
import { SiteFooter } from "@/components/public/SiteFooter";
import { NextTwo } from "@/components/public/NextTwo";

export async function generateStaticParams() {
  const posts = await getPublishedInsights();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const posts = await getPublishedInsights();
  const post = posts.find((p) => p.slug === slug);
  if (!post) return { title: "Article Not Found" };
  return {
    title: `${post.title} | Tech Groww Insights`,
    description: post.excerpt,
  };
}

export default async function InsightDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const posts = await getPublishedInsights();
  const post = posts.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  const safeHtml = await renderSafeMarkdown(post.bodyMarkdown);

  return (
    <>
      <SiteHeader polarity="light" />
      <main id="main" className="surface-light flex-1 bg-[var(--paper)]">
        <article className="section-rhythm">
          <div className="container-arch max-w-[44rem]">
            <nav aria-label="Breadcrumb" className="mb-6 text-xs text-[var(--text-muted)]">
              <Link href="/" className="hover:underline">Home</Link> /{" "}
              <Link href="/insights" className="hover:underline">Insights</Link> /{" "}
              <span className="text-[var(--brand-link)]">{post.categoryName}</span>
            </nav>

            <p className="eyebrow text-[var(--brand-link)]">
              {post.categoryName} · {post.readingTimeMins} min read
            </p>
            <h1 className="font-display mt-3 text-4xl font-extrabold text-[var(--ink)] sm:text-5xl">
              {post.title}
            </h1>
            <p className="mt-4 text-lg text-[var(--text-muted)]">{post.excerpt}</p>

            <div
              className="prose prose-slate mt-10 max-w-none space-y-4 border-t border-[var(--line)] pt-8 text-base leading-relaxed text-[var(--ink)]"
              dangerouslySetInnerHTML={{ __html: safeHtml }}
            />
          </div>
        </article>

        <NextTwo />
      </main>
      <SiteFooter />
    </>
  );
}
