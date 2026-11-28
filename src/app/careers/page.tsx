import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getOpenJobs } from "@/lib/cms/public-data";
import { SiteHeader } from "@/components/public/SiteHeader";
import { SiteFooter } from "@/components/public/SiteFooter";
import { NextTwo } from "@/components/public/NextTwo";

export const metadata: Metadata = {
  title: "Careers | Join Tech Groww (Greater Noida)",
  description:
    "Explore open roles and structured 2-month internship cohorts at Tech Groww in Greater Noida.",
};

export default async function CareersPage() {
  const jobs = await getOpenJobs();

  return (
    <>
      <SiteHeader polarity="light" />
      <main id="main" className="surface-light flex-1 bg-[var(--paper)]">
        <section className="section-rhythm border-b border-[var(--line)]">
          <div className="container-arch max-w-4xl">
            <p className="eyebrow text-[var(--brand-link)]">Careers · Greater Noida, UP</p>
            <h1 className="font-display mt-4 text-4xl font-extrabold text-[var(--ink)] sm:text-6xl">
              Join a sharp team building serious systems.
            </h1>
            <p className="mt-5 text-lg text-[var(--text-muted)]">
              Every open requisition flows directly into our structured Recruitment Portal ATS with
              encrypted resume handling and transparent candidate status updates.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/careers/internships"
                className="inline-flex min-h-[44px] items-center gap-1.5 rounded-[var(--radius-pill)] border border-[var(--line-control)] bg-white px-5 py-2 text-sm font-semibold text-[var(--ink)] hover:border-[var(--brand-royal)]"
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
            </div>
          </div>
        </section>

        <section className="section-rhythm">
          <div className="container-arch">
            <div className="mb-8 flex flex-wrap items-center justify-between gap-2">
              <h2 className="font-display text-2xl font-bold text-[var(--ink)]">
                Open Requisitions (`job_postings`)
              </h2>
              <span className="font-mono-tech text-xs text-[var(--status-warn)]">
                Status confirmation gate (`C-12`)
              </span>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              {jobs.map((job) => (
                <Link
                  key={job.slug}
                  href={`/careers/${job.slug}`}
                  className="group rounded-[var(--radius-md)] border border-[var(--line-control)] bg-white p-7 transition-colors hover:border-[var(--brand-royal)]"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="eyebrow text-[var(--brand-link)]">
                      {job.postingKind === "internship" ? "Internship Cohort" : "Full-Time Role"}
                    </span>
                    <span className="font-mono-tech text-xs text-[var(--text-muted)]">
                      {job.location}
                    </span>
                  </div>
                  <h3 className="font-display mt-3 text-2xl font-bold text-[var(--ink)] group-hover:text-[var(--brand-royal)]">
                    {job.title}
                  </h3>
                  <p className="mt-2 text-sm text-[var(--text-muted)]">{job.summary}</p>
                  <p className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--brand-royal)]">
                    View JD &amp; Apply
                    <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <NextTwo />
      </main>
      <SiteFooter />
    </>
  );
}
