import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getOpenJobs } from "@/lib/cms/public-data";
import { SiteHeader } from "@/components/public/SiteHeader";
import { SiteFooter } from "@/components/public/SiteFooter";
import { NextTwo } from "@/components/public/NextTwo";

export const metadata: Metadata = {
  title: "Internship Program | Tech Groww Cohorts",
  description:
    "Mentored 2-month Tech Groww internship cohorts featuring structured tasks, official offer letters, and verifiable completion certificates.",
};

export default async function InternshipsPage() {
  const jobs = await getOpenJobs();
  const internRoles = jobs.filter((j) => j.postingKind === "internship");

  return (
    <>
      <SiteHeader polarity="dark" />
      <main id="main" className="flex-1">
        <section className="surface-dark bg-[var(--ink)] py-16 text-white sm:py-24">
          <div className="container-arch max-w-4xl">
            <p className="eyebrow text-[var(--brand-sky)]">Mentored Cohorts · Greater Noida</p>
            <h1 className="font-display mt-4 text-4xl font-extrabold text-white sm:text-6xl">
              Structured 2-Month Internships with Real Mentorship.
            </h1>
            <p className="mt-5 text-lg text-slate-300">
              Accepted interns onboard inside our dedicated Intern Portal (/intern) with cohort
              checklists, assigned mentor tasks, private review rubrics, an official offer letter,
              and a verifiable PDF completion certificate.
            </p>
          </div>
        </section>

        <section className="section-rhythm surface-light bg-[var(--paper)]">
          <div className="container-arch max-w-4xl space-y-6">
            <h2 className="font-display text-3xl font-bold text-[var(--ink)]">
              Open Internship Tracks
            </h2>
            {internRoles.map((role) => (
              <div
                key={role.slug}
                className="flex flex-col justify-between gap-4 rounded-[var(--radius-md)] border border-[var(--line-control)] bg-white p-7 sm:flex-row sm:items-center"
              >
                <div>
                  <span className="eyebrow text-[var(--brand-link)]">{role.employmentType}</span>
                  <h3 className="font-display mt-1 text-2xl font-bold text-[var(--ink)]">
                    {role.title}
                  </h3>
                  <p className="mt-2 max-w-xl text-sm text-[var(--text-muted)]">{role.summary}</p>
                </div>
                <Link
                  href={`/careers/${role.slug}`}
                  className="inline-flex min-h-[44px] flex-shrink-0 items-center gap-2 rounded-[var(--radius-pill)] bg-[var(--brand-royal)] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#1e40af]"
                >
                  Apply Now
                  <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
            ))}
          </div>
        </section>

        <NextTwo />
      </main>
      <SiteFooter />
    </>
  );
}
