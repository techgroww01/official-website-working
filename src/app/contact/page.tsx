import type { Metadata } from "next";
import { COMPANY_CONFIG } from "@/lib/company-config";
import { SiteHeader } from "@/components/public/SiteHeader";
import { SiteFooter } from "@/components/public/SiteFooter";
import { ContactForm } from "@/components/public/ContactForm";
import { AnimatedSection } from "@/components/public/AnimatedSection";

export const metadata: Metadata = {
  title: "Contact Tech Groww | Start a Project Inquiry",
  description:
    "Scope your web engineering, Salesforce, UI/UX, or enterprise software initiative directly with Tech Groww in Greater Noida.",
};

const PROCESS_STEPS = [
  { step: "01", label: "Send a note", desc: "Share your goal — takes under 2 minutes." },
  { step: "02", label: "Friendly chat", desc: "We reply within 1–2 business days to talk it through." },
  { step: "03", label: "Clear plan", desc: "Simple milestone breakdown with honest pricing & dates." },
  { step: "04", label: "Launch together", desc: "Weekly live previews so you stay in control." },
];

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

            {/* Left col — contact info */}
            <div className="space-y-10 lg:col-span-5">
              <AnimatedSection direction="left">
                <p className="eyebrow text-[var(--brand-link)]">Reach Out Easily · Greater Noida HQ</p>
                <h1 className="font-display mt-3 text-4xl font-extrabold text-[var(--ink)] sm:text-5xl">
                  Let&apos;s start a friendly conversation.
                </h1>
                <p className="mt-4 text-base text-[var(--text-muted)]">
                  Every message goes straight to our core team — no bots, no middlemen, just clear,
                  helpful answers tailored to your business.
                </p>
              </AnimatedSection>

              {/* Contact card */}
              <AnimatedSection delay={80} direction="left">
                <div className="space-y-6 rounded-[var(--radius-md)] border border-[var(--line-control)] bg-white p-6">
                  <div className="flex flex-wrap items-center gap-2">
                    <a
                      href={`mailto:${COMPANY_CONFIG.emails.general}`}
                      className="inline-flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded-[var(--radius-pill)] bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-700 transition-colors"
                    >
                      <span>✉️ Email Direct: {COMPANY_CONFIG.emails.general}</span>
                    </a>
                  </div>
                  <div>
                    <p className="eyebrow text-[var(--text-muted)]">Say Hello / General Inquiries</p>
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
                    <p className="eyebrow text-[var(--text-muted)]">Business Hours &amp; Inquiries</p>
                    <p className="mt-1 text-xs text-[var(--text-muted)] font-medium">
                      Monday to Friday, 9:30 AM – 6:30 PM IST · Email response within 24 business hours
                    </p>
                  </div>

                  {/* Social links */}
                  <div className="border-t border-[var(--line)] pt-4 flex flex-wrap gap-3">
                    <a
                      href={COMPANY_CONFIG.socials.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-[36px] items-center gap-1.5 text-sm font-medium text-[var(--text-muted)] hover:text-[var(--brand-link)] transition-colors"
                    >
                      <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4" aria-hidden="true">
                        <path d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.779 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z" />
                      </svg>
                      LinkedIn
                    </a>
                    <a
                      href={COMPANY_CONFIG.socials.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-[36px] items-center gap-1.5 text-sm font-medium text-[var(--text-muted)] hover:text-[var(--brand-link)] transition-colors"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="h-4 w-4" aria-hidden="true">
                        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                        <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" />
                        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                      </svg>
                      Instagram
                    </a>
                  </div>
                </div>
              </AnimatedSection>

              {/* Process steps */}
              <AnimatedSection delay={160} direction="left">
                <p className="eyebrow text-[var(--brand-link)]">What happens next</p>
                <ol className="mt-4 space-y-3">
                  {PROCESS_STEPS.map((s) => (
                    <li key={s.step} className="flex items-start gap-3">
                      <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-[var(--paper-elevated)] font-mono-tech text-xs font-semibold text-[var(--brand-cobalt)]">
                        {s.step}
                      </span>
                      <div>
                        <span className="text-sm font-semibold text-[var(--ink)]">{s.label}</span>
                        <span className="ml-1 text-sm text-[var(--text-muted)]">— {s.desc}</span>
                      </div>
                    </li>
                  ))}
                </ol>
              </AnimatedSection>
            </div>

            {/* Right col — form */}
            <AnimatedSection direction="right" className="lg:col-span-7">
              <ContactForm defaultService={service} />
            </AnimatedSection>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
