import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { COMPANY_CONFIG } from "@/lib/company-config";
import { getOpenJobs } from "@/lib/cms/public-data";
import { SiteHeader } from "@/components/public/SiteHeader";
import { SiteFooter } from "@/components/public/SiteFooter";
import { ApplicationForm } from "@/components/public/ApplicationForm";

export async function generateStaticParams() {
  const jobs = await getOpenJobs();
  return jobs.map((j) => ({ slug: j.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const jobs = await getOpenJobs();
  const job = jobs.find((j) => j.slug === slug);
  if (!job) return { title: "Role Not Found" };
  return {
    title: `${job.title} | Careers at Tech Groww`,
    description: job.summary,
  };
}

export default async function CareerDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const jobs = await getOpenJobs();
  const job = jobs.find((j) => j.slug === slug);
  if (!job) notFound();

  const jobPostingJsonLd = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.title,
    description: `${job.summary} ${job.responsibilities}`,
    employmentType: job.postingKind === "internship" ? "INTERN" : "FULL_TIME",
    datePosted: "2026-11-27",
    validThrough: "2027-03-31",
    hiringOrganization: {
      "@type": "Organization",
      name: COMPANY_CONFIG.brandName,
      sameAs: COMPANY_CONFIG.siteUrl,
    },
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Greater Noida",
        addressRegion: "Uttar Pradesh",
        postalCode: COMPANY_CONFIG.hq.postalCode,
        addressCountry: "IN",
      },
    },
  };

  return (
    <>
      <SiteHeader polarity="light" />
      <main id="main" className="surface-light flex-1 bg-[var(--paper)]">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jobPostingJsonLd) }}
        />

        <section className="section-rhythm">
          <div className="container-arch grid gap-12 lg:grid-cols-12">
            <div className="space-y-8 lg:col-span-6">
              <nav aria-label="Breadcrumb" className="text-xs text-[var(--text-muted)]">
                <Link href="/careers" className="hover:underline">Careers</Link> /{" "}
                <span className="text-[var(--brand-link)]">{job.title}</span>
              </nav>

              <div>
                <p className="eyebrow text-[var(--brand-link)]">
                  {job.employmentType} · {job.department}
                </p>
                <h1 className="font-display mt-2 text-4xl font-extrabold text-[var(--ink)]">
                  {job.title}
                </h1>
                <p className="mt-2 font-mono-tech text-xs text-[var(--text-muted)]">
                  Location: {job.location}
                </p>
              </div>

              <div className="space-y-6 rounded-[var(--radius-md)] border border-[var(--line)] bg-white p-6">
                <div>
                  <h2 className="eyebrow text-[var(--text-muted)]">Role Summary</h2>
                  <p className="mt-2 text-sm text-[var(--ink)]">{job.summary}</p>
                </div>
                <div>
                  <h2 className="eyebrow text-[var(--text-muted)]">Key Responsibilities</h2>
                  <p className="mt-2 text-sm text-[var(--ink)]">{job.responsibilities}</p>
                </div>
                <div>
                  <h2 className="eyebrow text-[var(--text-muted)]">Requirements</h2>
                  <p className="mt-2 text-sm text-[var(--ink)]">{job.requirements}</p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6">
              <ApplicationForm postingId={job.id} roleTitle={job.title} />
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
