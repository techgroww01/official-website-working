import type { Metadata } from "next";
import { SiteHeader } from "@/components/public/SiteHeader";
import { SiteFooter } from "@/components/public/SiteFooter";
import { sha256Hex } from "@/lib/security/crypto";
import { getSupabaseAdminClient, isSupabaseAdminConfigured } from "@/lib/supabase/admin";

export const metadata: Metadata = {
  title: "Application Status | Tech Groww Careers",
  robots: { index: false, follow: false },
};

export default async function CandidateStatusPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

  let record: {
    id: string;
    fullName: string;
    stage: string;
    jobTitle: string;
  } | null = null;

  if (token && isSupabaseAdminConfigured()) {
    const admin = getSupabaseAdminClient();
    const tokenHash = sha256Hex(token);
    const { data } = await admin
      .from("applications")
      .select("id, full_name, stage, anonymized_at, job_postings(title)")
      .eq("status_token_hash", tokenHash)
      .is("anonymized_at", null)
      .maybeSingle();

    if (data) {
      const job = (data as { job_postings?: { title?: string } | null }).job_postings;
      record = {
        id: data.id,
        fullName: data.full_name,
        stage: data.stage,
        jobTitle: job?.title ?? "Tech Groww Role",
      };
    }
  }

  return (
    <>
      <SiteHeader polarity="light" />
      <main id="main" className="surface-light flex-1 bg-[var(--paper)]">
        <section className="section-rhythm">
          <div className="container-arch max-w-2xl">
            <p className="eyebrow text-[var(--brand-link)]">Candidate Portal · noindex</p>
            <h1 className="font-display mt-3 text-3xl font-extrabold text-[var(--ink)] sm:text-4xl">
              Application Status Lookup
            </h1>

            {!token ? (
              <p className="mt-4 text-sm text-[var(--text-muted)]">
                Open the private status link included in your application confirmation receipt to
                inspect live stage progress or respond to an extended offer. Internal interviewer
                notes are strictly confidential and never displayed here.
              </p>
            ) : !record ? (
              <div className="mt-6 rounded-[var(--radius-md)] border border-[var(--line-control)] bg-white p-6">
                <p className="text-sm font-medium text-[var(--ink)]">
                  No active application matched this status token (it may have expired under our
                  180-day DPDP retention schedule or belong to a staging preview).
                </p>
              </div>
            ) : (
              <div className="mt-6 rounded-[var(--radius-md)] border border-[var(--line-control)] bg-white p-7 space-y-4">
                <div>
                  <p className="eyebrow text-[var(--text-muted)]">Candidate</p>
                  <p className="font-display text-xl font-bold text-[var(--ink)]">{record.fullName}</p>
                </div>
                <div>
                  <p className="eyebrow text-[var(--text-muted)]">Role Applied</p>
                  <p className="text-sm font-semibold text-[var(--ink)]">{record.jobTitle}</p>
                </div>
                <div>
                  <p className="eyebrow text-[var(--text-muted)]">Current Pipeline Stage</p>
                  <span className="mt-1 inline-block rounded-full bg-blue-50 px-3 py-1 font-mono-tech text-xs font-semibold uppercase text-[var(--brand-royal)]">
                    {record.stage}
                  </span>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
