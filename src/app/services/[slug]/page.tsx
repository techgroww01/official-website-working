import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import { getPublishedServices } from "@/lib/cms/public-data";
import { SiteHeader } from "@/components/public/SiteHeader";
import { SiteFooter } from "@/components/public/SiteFooter";
import { NextTwo } from "@/components/public/NextTwo";

export async function generateStaticParams() {
  const services = await getPublishedServices();
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const services = await getPublishedServices();
  const item = services.find((s) => s.slug === slug);
  if (!item) return { title: "Service Not Found" };
  return {
    title: `${item.title} | Tech Groww Services`,
    description: item.summary,
  };
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const services = await getPublishedServices();
  const service = services.find((s) => s.slug === slug);

  if (!service) {
    notFound();
  }

  return (
    <>
      <SiteHeader polarity="dark" />
      <main id="main" className="flex-1">
        <section className="surface-dark bg-[var(--ink)] py-16 text-white sm:py-24">
          <div className="container-arch">
            <nav aria-label="Breadcrumb" className="mb-6 text-xs text-[var(--text-muted-dark)]">
              <Link href="/" className="hover:text-white">Home</Link> /{" "}
              <Link href="/services" className="hover:text-white">Services</Link> /{" "}
              <span className="text-[var(--brand-sky)]">{service.title}</span>
            </nav>

            <p className="eyebrow text-[var(--brand-sky)]">
              Discipline {service.indexNumber} · {service.category}
            </p>
            <h1 className="font-display mt-4 max-w-4xl text-4xl font-extrabold text-white sm:text-6xl">
              {service.title}
            </h1>
            <p className="mt-5 max-w-2xl text-lg text-slate-300">{service.summary}</p>
          </div>
        </section>

        <section className="section-rhythm surface-light bg-[var(--paper)]">
          <div className="container-arch grid gap-12 lg:grid-cols-12">
            <div className="space-y-10 lg:col-span-8">
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="rounded-[var(--radius-md)] border border-[var(--line)] bg-white p-6">
                  <h2 className="eyebrow text-[var(--text-muted)]">Business Problem</h2>
                  <p className="mt-3 text-sm leading-relaxed text-[var(--ink)]">
                    {service.problemStatement}
                  </p>
                </div>
                <div className="rounded-[var(--radius-md)] border border-[var(--line)] bg-white p-6">
                  <h2 className="eyebrow text-[var(--brand-link)]">Architectural Approach</h2>
                  <p className="mt-3 text-sm leading-relaxed text-[var(--ink)]">
                    {service.solutionApproach}
                  </p>
                </div>
              </div>

              <div>
                <h2 className="font-display text-2xl font-bold text-[var(--ink)]">
                  Core Deliverables
                </h2>
                <ul className="mt-4 space-y-3 border-t border-[var(--line)] pt-4">
                  {service.deliverables.map((deliv) => (
                    <li key={deliv} className="flex items-start gap-3 text-sm text-[var(--ink)]">
                      <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 bg-[var(--brand-royal)]" aria-hidden="true" />
                      <span>{deliv}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h2 className="font-display text-2xl font-bold text-[var(--ink)]">
                  Technology &amp; Platform Stack
                </h2>
                <div className="mt-4 flex flex-wrap gap-2">
                  {service.techTags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-[var(--radius-sm)] border border-[var(--line-control)] bg-white px-3 py-1.5 font-mono-tech text-xs text-[var(--ink)]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {service.faqs.length > 0 && (
                <div>
                  <h2 className="font-display text-2xl font-bold text-[var(--ink)]">
                    Service Questions
                  </h2>
                  <div className="mt-4 space-y-4">
                    {service.faqs.map((faq) => (
                      <div
                        key={faq.q}
                        className="rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--paper-elevated)] p-5"
                      >
                        <h3 className="font-display text-lg font-bold text-[var(--ink)]">{faq.q}</h3>
                        <p className="mt-2 text-sm text-[var(--text-muted)]">{faq.a}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <aside className="lg:col-span-4">
              <div className="sticky top-24 rounded-[var(--radius-lg)] border border-[var(--line-control)] bg-white p-7">
                <p className="eyebrow text-[var(--brand-link)]">Start Scoping</p>
                <h2 className="font-display mt-2 text-2xl font-bold text-[var(--ink)]">
                  Discuss your {service.title} goals.
                </h2>
                <p className="mt-3 text-sm text-[var(--text-muted)]">
                  Share your current workflow or constraints directly with our engineering team.
                </p>
                <Link
                  href={`/contact?service=${encodeURIComponent(service.slug)}`}
                  className="mt-6 flex min-h-[48px] w-full items-center justify-center gap-2 rounded-[var(--radius-pill)] bg-[var(--brand-royal)] px-6 py-3 text-sm font-semibold text-white hover:bg-[#1e40af]"
                >
                  Request Scope Call
                  <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
            </aside>
          </div>
        </section>

        <NextTwo />
      </main>
      <SiteFooter />
    </>
  );
}
