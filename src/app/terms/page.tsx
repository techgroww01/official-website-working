import type { Metadata } from "next";
import { COMPANY_CONFIG } from "@/lib/company-config";
import { SiteHeader } from "@/components/public/SiteHeader";
import { SiteFooter } from "@/components/public/SiteFooter";

export const metadata: Metadata = {
  title: "Terms of Use | Tech Groww Legal",
  description: "Terms governing public website access and authenticated portal usage on techgroww.co.in.",
};

export default function TermsPage() {
  return (
    <>
      <SiteHeader polarity="light" />
      <main id="main" className="surface-light flex-1 bg-[var(--paper)]">
        <section className="section-rhythm">
          <div className="container-arch max-w-[44rem] space-y-6">
            <h1 className="font-display text-4xl font-extrabold text-[var(--ink)]">Terms of Use</h1>

            <div className="space-y-4 text-sm leading-relaxed text-[var(--text-muted)]">
              <p>
                <strong className="text-[var(--ink)]">1. Informational Scope:</strong> Public service
                descriptions and Reference Blueprints on {COMPANY_CONFIG.siteUrl} are informational
                and do not constitute binding deliverables outside signed Statements of Work (SOWs).
              </p>
              <p>
                <strong className="text-[var(--ink)]">2. Acceptable Portal Use:</strong> Access to
                Client, Intern, Recruitment, Sales, and Admin CMS portals is strictly invitation-based
                and scoped per organization/role. Unauthorized scraping, credential sharing, or
                tampering is prohibited.
              </p>
              <p>
                <strong className="text-[var(--ink)]">3. Governing Law &amp; Jurisdiction:</strong>{" "}
                Governed by the laws of India. Exclusive jurisdiction:{" "}
                {COMPANY_CONFIG.confirmations.jurisdiction ?? "Greater Noida, Uttar Pradesh, India"}
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
