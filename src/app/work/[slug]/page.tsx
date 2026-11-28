import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import { getPublishedWork } from "@/lib/cms/public-data";
import { SiteHeader } from "@/components/public/SiteHeader";
import { SiteFooter } from "@/components/public/SiteFooter";
import { NextTwo } from "@/components/public/NextTwo";

export async function generateStaticParams() {
  const items = await getPublishedWork();
  return items.map((w) => ({ slug: w.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const items = await getPublishedWork();
  const item = items.find((w) => w.slug === slug);
  if (!item) return { title: "Blueprint Not Found" };
  return {
    title: `${item.title} | Tech Groww Blueprint`,
    description: item.summary,
  };
}

export default async function WorkDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const items = await getPublishedWork();
  const item = items.find((w) => w.slug === slug);

  if (!item) {
    notFound();
  }

  const badge =
    item.projectType === "client_project"
      ? "APPROVED CLIENT WORK"
      : item.projectType === "internal_product"
      ? "INTERNAL PROTOTYPE"
      : "REFERENCE BLUEPRINT";

  return (
    <>
      <SiteHeader polarity="dark" />
      <main id="main" className="flex-1">
        <section className="surface-dark bg-[var(--ink)] py-16 text-white sm:py-24">
          <div className="container-arch max-w-4xl">
            <nav aria-label="Breadcrumb" className="mb-6 text-xs text-[var(--text-muted-dark)]">
              <Link href="/" className="hover:text-white">Home</Link> /{" "}
              <Link href="/work" className="hover:text-white">Work</Link> /{" "}
              <span className="text-[var(--brand-sky)]">{item.title}</span>
            </nav>

            <span className="inline-block rounded-[var(--radius-sm)] border border-[var(--brand-sky)]/40 bg-[var(--ink-elevated)] px-3 py-1 font-mono-tech text-xs text-[var(--brand-sky)]">
              {badge} · {item.industry}
            </span>
            <h1 className="font-display mt-5 text-4xl font-extrabold text-white sm:text-5xl">
              {item.title}
            </h1>
            <p className="mt-5 text-lg text-slate-300">{item.summary}</p>
          </div>
        </section>

        <section className="section-rhythm surface-light bg-[var(--paper)]">
          <div className="container-arch max-w-4xl space-y-8">
            <div className="rounded-[var(--radius-md)] border border-[var(--line)] bg-white p-7">
              <h2 className="eyebrow text-[var(--text-muted)]">Problem Statement</h2>
              <p className="mt-3 text-base leading-relaxed text-[var(--ink)]">{item.challenge}</p>
            </div>

            <div className="rounded-[var(--radius-md)] border border-[var(--line)] bg-white p-7">
              <h2 className="eyebrow text-[var(--brand-link)]">Technical Architecture</h2>
              <p className="mt-3 text-base leading-relaxed text-[var(--ink)]">{item.architecture}</p>
            </div>

            <div className="rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--paper-elevated)] p-7">
              <h2 className="eyebrow text-[var(--brand-link)]">
                {item.projectType === "client_project" ? "Verified Outcome" : "Architectural Goal"}
              </h2>
              <p className="mt-3 text-base leading-relaxed text-[var(--ink)]">{item.outcomes}</p>
            </div>

            <div>
              <h2 className="eyebrow text-[var(--text-muted)]">Architecture Stack</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {item.techStack.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-[var(--radius-sm)] border border-[var(--line-control)] bg-white px-3 py-1.5 font-mono-tech text-xs text-[var(--ink)]"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            <Link
              href="/contact"
              className="inline-flex min-h-[48px] items-center gap-2 rounded-[var(--radius-pill)] bg-[var(--brand-royal)] px-6 py-3 text-sm font-semibold text-white hover:bg-[#1e40af]"
            >
              Scope a similar system
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </section>

        <NextTwo />
      </main>
      <SiteFooter />
    </>
  );
}
