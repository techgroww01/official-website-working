import type { Metadata } from "next";
import { COMPANY_CONFIG } from "@/lib/company-config";
import { SiteHeader } from "@/components/public/SiteHeader";
import { SiteFooter } from "@/components/public/SiteFooter";

export const metadata: Metadata = {
  title: "Privacy Policy (DPDP Act 2023) | Tech Groww Legal",
  description:
    "How Tech Groww collects, secures, retains, and erases personal data under India DPDP Act 2023.",
};

export default function PrivacyPage() {
  return (
    <>
      <SiteHeader polarity="light" />
      <main id="main" className="surface-light flex-1 bg-[var(--paper)]">
        <section className="section-rhythm">
          <div className="container-arch max-w-[44rem] space-y-6">
            <div className="rounded-[var(--radius-sm)] border border-[var(--status-warn)] bg-amber-50 p-4 text-xs font-medium text-[var(--status-warn)]">
              [COMPANY CONFIRMATION REQUIRED: Official legal entity name (`C-01`), Grievance Officer
              (`C-10`), and legal counsel sign-off required prior to production cutover.]
            </div>

            <h1 className="font-display text-4xl font-extrabold text-[var(--ink)]">
              Privacy Policy &amp; DPDP Act 2023 Notice
            </h1>

            <div className="space-y-4 text-sm leading-relaxed text-[var(--ink)]">
              <p>
                <strong>Data Fiduciary:</strong>{" "}
                {COMPANY_CONFIG.confirmations.legalEntityName ??
                  "Tech Groww [Registered Legal Entity Name Pending C-01]"}
                , {COMPANY_CONFIG.hq.displayLabel}.
              </p>
              <h2 className="font-display pt-4 text-xl font-bold">1. Lawful Purposes</h2>
              <p className="text-[var(--text-muted)]">
                Personal data submitted via Project Inquiry (`/contact`), Job/Internship Applications
                (`/careers`), Newsletter (`/privacy`), or authenticated Portals is processed strictly
                for scoping engagements, evaluating candidatures, delivering contracted services, or
                sending explicit opt-in updates.
              </p>
              <h2 className="font-display pt-4 text-xl font-bold">2. Exact Retention Schedule</h2>
              <ul className="list-disc pl-5 text-[var(--text-muted)] space-y-1">
                <li>
                  Unaccepted recruitment applications &amp; uploaded resumes: purged after{" "}
                  <strong>180 days</strong> unless the applicant explicitly opts into talent-pool
                  retention.
                </li>
                <li>
                  Inactive sales enquiries without commercial conversion: reviewed and archived at{" "}
                  <strong>24 months</strong>.
                </li>
                <li>
                  Security telemetry (`audit_logs`): stripped of raw personal PII diffs and retained
                  for <strong>365 days</strong> for forensic integrity.
                </li>
              </ul>
              <h2 className="font-display pt-4 text-xl font-bold">3. Named Sub-Processors</h2>
              <p className="text-[var(--text-muted)]">
                Vercel (hosting &amp; edge security), Supabase (PostgreSQL database, Auth, encrypted
                private storage buckets), Resend (transactional &amp; opt-in broadcast delivery),
                Google Workspace (corporate mailboxes &amp; staff SSO), Cloudflare Turnstile (bot
                prevention), and Google Analytics 4 (strictly unloaded unless explicitly opted in).
              </p>
              <h2 className="font-display pt-4 text-xl font-bold">
                4. Data Principal Rights &amp; Grievance Officer
              </h2>
              <p className="text-[var(--text-muted)]">
                You may request access, correction, consent withdrawal, or erasure by writing to{" "}
                <a
                  href={`mailto:${COMPANY_CONFIG.emails.general}`}
                  className="text-[var(--brand-link)] underline"
                >
                  {COMPANY_CONFIG.emails.general}
                </a>
                . Grievance Officer:{" "}
                {COMPANY_CONFIG.confirmations.grievanceOfficer ??
                  "[COMPANY CONFIRMATION REQUIRED: Grievance Officer Name & Official Email — C-10]"}
                .
              </p>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
