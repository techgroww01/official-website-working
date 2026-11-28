import type { Metadata } from "next";
import { COMPANY_CONFIG } from "@/lib/company-config";
import { SiteHeader } from "@/components/public/SiteHeader";
import { SiteFooter } from "@/components/public/SiteFooter";
import { ContactForm } from "@/components/public/ContactForm";

export const metadata: Metadata = {
  title: "Contact Tech Groww | Start a Project Inquiry",
  description:
    "Scope your web engineering, Salesforce, UI/UX, or enterprise software initiative directly with Tech Groww in Greater Noida.",
};

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ service?: string }>;
}) {
  const { service } = await searchParams;

  return (
    <>
      <SiteHeader polarity="light" />
      <main id="main" className="surface-light flex-1 bg-[var(--paper)]">
        <section className="section-rhythm">
          <div className="container-arch grid gap-12 lg:grid-cols-12">
            <div className="space-y-8 lg:col-span-5">
              <div>
                <p className="eyebrow text-[var(--brand-link)]">Direct Channels · Greater Noida HQ</p>
                <h1 className="font-display mt-3 text-4xl font-extrabold text-[var(--ink)] sm:text-5xl">
                  Start a focused conversation.
                </h1>
                <p className="mt-4 text-base text-[var(--text-muted)]">
                  Every submission enters our Sales Portal inbox cleanly so our engineering and
                  delivery team reviews your constraints directly. Mutual NDA ready on request.
                </p>
              </div>

              <div className="space-y-5 rounded-[var(--radius-md)] border border-[var(--line-control)] bg-white p-6">
                <div>
                  <p className="eyebrow text-[var(--text-muted)]">General &amp; Scoping Email</p>
                  <a
                    href={`mailto:${COMPANY_CONFIG.emails.general}`}
                    className="mt-1 inline-flex min-h-[36px] items-center font-semibold text-[var(--brand-link)] hover:underline"
                  >
                    {COMPANY_CONFIG.emails.general}
                  </a>
                </div>
                <div>
                  <p className="eyebrow text-[var(--text-muted)]">Sales Inquiries</p>
                  <a
                    href={`mailto:${COMPANY_CONFIG.emails.sales}`}
                    className="mt-1 inline-flex min-h-[36px] items-center font-semibold text-[var(--brand-link)] hover:underline"
                  >
                    {COMPANY_CONFIG.emails.sales}
                  </a>
                </div>
                <div>
                  <p className="eyebrow text-[var(--text-muted)]">Headquarters</p>
                  <p className="mt-1 text-sm text-[var(--ink)]">
                    {COMPANY_CONFIG.hq.displayLabel}
                  </p>
                </div>
                <div>
                  <p className="eyebrow text-[var(--text-muted)]">Phone &amp; Business Hours</p>
                  <p className="mt-1 text-xs text-[var(--status-warn)] font-medium">
                    {COMPANY_CONFIG.confirmations.canonicalPhone
                      ? `${COMPANY_CONFIG.confirmations.canonicalPhone}`
                      : "[COMPANY CONFIRMATION REQUIRED: Official phone & hours — C-02 / C-05]"}
                  </p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7">
              <ContactForm defaultService={service} />
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
