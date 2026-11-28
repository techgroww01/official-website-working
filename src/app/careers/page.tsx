import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, MapPin, Briefcase, Clock } from "lucide-react";
import { getOpenJobs } from "@/lib/cms/public-data";
import { SiteHeader } from "@/components/public/SiteHeader";
import { SiteFooter } from "@/components/public/SiteFooter";
import { NextTwo } from "@/components/public/NextTwo";
import { AnimatedSection } from "@/components/public/AnimatedSection";

export const metadata: Metadata = {
  title: "Careers | Join Tech Groww (Greater Noida)",
  description:
    "Explore open roles and structured 2-month internship cohorts at Tech Groww in Greater Noida.",
};

const WHY_JOIN = [
  {
    icon: <Briefcase className="h-5 w-5" aria-hidden="true" />,
    title: "Real systems, real ownership",
    body: "You ship to production. No sandbox projects, no filler tickets — from day one you contribute to live client and internal platforms.",
  },
  {
    icon: <Clock className="h-5 w-5" aria-hidden="true" />,
    title: "Structured internship track",
    body: "Our 2-month cohort has defined milestones, weekly principal reviews, and a verifiable completion certificate generated from our Intern Portal.",
  },
  {
    icon: <MapPin className="h-5 w-5" aria-hidden="true" />,
    title: "Greater Noida, hybrid-first",
    body: "Based in Greater Noida, UP. Flexible working arrangements — remote-first build days, in-person architecture and design sessions.",
  },
];

export default async function CareersPage() {
  const jobs = await getOpenJobs();

  return (
    <>
      <SiteHeader polarity="light" />
      <main id="main" className="surface-light flex-1 bg-[var(--paper)]">

        {/* Hero */}
        <section className="section-rhythm border-b border-[var(--line)]">
          <div className="container-arch max-w-4xl">
            <AnimatedSection>
              <p className="eyebrow text-[var(--brand-link)]">Careers · Greater Noida, UP</p>
              <h1 className="font-display mt-4 text-4xl font-extrabold text-[var(--ink)] sm:text-6xl">
                Join a sharp team building serious systems.
              </h1>
              <p className="mt-5 text-lg text-[var(--text-muted)]">
                Every open requisition flows directly into our structured Recruitment Portal ATS with
                encrypted resume handling and transparent candidate status updates.
              </p>
            </AnimatedSection>
            <AnimatedSection delay={100} className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/careers/internships"
                className="inline-flex min-h-[44px] items-center gap-1.5 rounded-[var(--radius-pill)] border border-[var(--line-control)] bg-white px-5 py-2 text-sm font-semibold text-[var(--ink)] hover:border-[var(--brand-royal)] transition-colors"
              >
                2-Month Internship Track
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link
                href="/careers/status"
                className="inline-flex min-h-[44px] items-center px-4 text-sm font-semibold text-[var(--brand-link)] hover:underline"
              >
                Check existing application status
              </Link>
            </AnimatedSection>
          </div>
        </section>

        {/* Why join */}
        <section className="section-rhythm border-b border-[var(--line)] bg-[var(--paper-elevated)]">
          <div className="container-arch">
            <AnimatedSection>
              <p className="eyebrow text-[var(--brand-link)]">Why Tech Groww</p>
              <h2 className="font-display mt-2 text-3xl font-bold text-[var(--ink)] sm:text-4xl">
                What working here actually looks like.
              </h2>
            </AnimatedSection>
            <div className="mt-10 grid gap-5 sm:grid-cols-3">
              {WHY_JOIN.map((item, i) => (
                <AnimatedSection key={item.title} delay={i * 80}>
                  <div className="flex flex-col rounded-[var(--radius-md)] border border-[var(--line)] bg-white p-6 h-full tg-card-interactive hover:border-[var(--brand-cobalt)] hover:shadow-md">
                    <span className="flex h-10 w-10 items-center justify-center rounded-[var(--radius-sm)] bg-[var(--paper-elevated)] text-[var(--brand-cobalt)]">
                      {item.icon}
                    </span>
                    <h3 className="font-display mt-4 text-lg font-bold text-[var(--ink)]">{item.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-[var(--text-muted)]">{item.body}</p>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>

        {/* Open roles */}
        <section className="section-rhythm">
          <div className="container-arch">
            <AnimatedSection>
              <div className="mb-8 flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="eyebrow text-[var(--brand-link)]">Open Positions</p>
                  <h2 className="font-display mt-1 text-2xl font-bold text-[var(--ink)]">
                    Current requisitions
                  </h2>
                </div>
                <span className="font-mono-tech text-xs text-[var(--brand-link)]">
                  Active Hiring Cycles · Direct Engineering Review
                </span>
              </div>
            </AnimatedSection>

            <div className="grid gap-5 md:grid-cols-2">
              {jobs.map((job, i) => (
                <AnimatedSection key={job.slug} delay={i * 60}>
                  <Link
                    href={`/careers/${job.slug}`}
                    className="group flex h-full flex-col rounded-[var(--radius-md)] border border-[var(--line-control)] bg-white p-7 tg-card-interactive hover:border-[var(--brand-royal)] hover:shadow-md"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="eyebrow text-[var(--brand-link)]">
                        {job.postingKind === "internship" ? "Internship Cohort" : "Full-Time Role"}
                      </span>
                      <span className="font-mono-tech text-xs text-[var(--text-muted)]">
                        {job.location}
                      </span>
                    </div>
                    <h3 className="font-display mt-3 text-2xl font-bold text-[var(--ink)] group-hover:text-[var(--brand-royal)] transition-colors">
                      {job.title}
                    </h3>
                    <p className="mt-2 flex-1 text-sm text-[var(--text-muted)]">{job.summary}</p>
                    <p className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--brand-royal)]">
                      View JD &amp; Apply
                      <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transform-none" aria-hidden="true" />
                    </p>
                  </Link>
                </AnimatedSection>
              ))}

              {jobs.length === 0 && (
                <AnimatedSection className="col-span-full">
                  <div className="rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--paper-elevated)] p-8 text-center">
                    <p className="font-display text-lg font-bold text-[var(--ink)]">No open roles right now.</p>
                    <p className="mt-2 text-sm text-[var(--text-muted)]">
                      Follow us on{" "}
                      <a
                        href="https://www.linkedin.com/company/tech-growww"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[var(--brand-link)] hover:underline"
                      >
                        LinkedIn
                      </a>{" "}
                      to be notified when new positions open.
                    </p>
                  </div>
                </AnimatedSection>
              )}
            </div>
          </div>
        </section>

        {/* CTA dark band */}
        <section className="surface-dark bg-[var(--ink)] py-14 text-white">
          <div className="container-arch text-center">
            <AnimatedSection>
              <p className="eyebrow text-[var(--brand-sky)]">Interested but don&apos;t see your role?</p>
              <h2 className="font-display mt-3 text-2xl font-bold text-white">
                Send us a speculative application.
              </h2>
              <p className="mt-3 text-sm text-slate-300">
                We review speculative applications as part of every hiring cycle. Email a brief introduction and your area of focus to{" "}
                <a href="mailto:hr@techgroww.co.in" className="text-[var(--brand-sky)] underline underline-offset-2 hover:no-underline">
                  hr@techgroww.co.in
                </a>
              </p>
            </AnimatedSection>
          </div>
        </section>

        <NextTwo />
      </main>
      <SiteFooter />
    </>
  );
}
