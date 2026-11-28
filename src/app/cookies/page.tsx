import type { Metadata } from "next";
import { SiteHeader } from "@/components/public/SiteHeader";
import { SiteFooter } from "@/components/public/SiteFooter";

export const metadata: Metadata = {
  title: "Cookie Policy | Tech Groww Legal",
  description: "Essential authentication cookies and consent-gated analytics disclosures on Tech Groww.",
};

export default function CookiesPage() {
  return (
    <>
      <SiteHeader polarity="light" />
      <main id="main" className="surface-light flex-1 bg-[var(--paper)]">
        <section className="section-rhythm">
          <div className="container-arch max-w-[44rem] space-y-6">
            <div className="rounded-[var(--radius-sm)] border border-[var(--status-warn)] bg-amber-50 p-4 text-xs font-medium text-[var(--status-warn)]">
              [COMPANY CONFIRMATION REQUIRED: Legal entity sign-off required prior to launch — C-01 /
              C-10.]
            </div>

            <h1 className="font-display text-4xl font-extrabold text-[var(--ink)]">
              Cookie Policy
            </h1>

            <div className="space-y-4 text-sm leading-relaxed text-[var(--text-muted)]">
              <p>
                <strong className="text-[var(--ink)]">Strictly Necessary Cookies:</strong> Used by
                Supabase SSR authentication (`HttpOnly`, `Secure`, `SameSite=Lax`) and Cloudflare
                Turnstile anti-bot checks. These cannot be disabled without breaking portal sign-in.
              </p>
              <p>
                <strong className="text-[var(--ink)]">Optional Analytics (`GA4`):</strong> Strictly
                blocked by default until you click <em>Allow analytics</em> in the preference
                banner. Zero third-party advertising or retargeting pixels are loaded at launch.
              </p>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
