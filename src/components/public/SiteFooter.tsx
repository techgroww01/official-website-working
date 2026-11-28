"use client";

import React, { useState } from "react";
import Link from "next/link";
import { COMPANY_CONFIG } from "@/lib/company-config";
import { TechGrowwLogo } from "@/components/brand/TechGrowwLogo";

export function SiteFooter() {
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleNewsletter(e: React.FormEvent) {
    e.preventDefault();
    if (!consent) {
      setStatusMsg("Please confirm consent to receive updates.");
      return;
    }
    setSubmitting(true);
    setStatusMsg(null);
    try {
      const res = await fetch("/api/v1/public/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, consent: true, source: "footer" }),
      });
      const json = (await res.json()) as { ok?: boolean; error?: { message?: string }; data?: { message?: string } };
      if (!res.ok || !json.ok) {
        setStatusMsg(json.error?.message || "Unable to subscribe right now.");
      } else {
        setStatusMsg(json.data?.message || "Subscription recorded. Thank you.");
        setEmail("");
      }
    } catch {
      setStatusMsg("Network error while subscribing.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <footer className="surface-dark border-t border-white/10 bg-[var(--ink)] text-white">
      <div className="container-arch py-16">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4 space-y-4">
            <TechGrowwLogo variant="dark" size="md" />
            <p className="max-w-sm text-sm leading-relaxed text-[var(--text-muted-dark)]">
              {COMPANY_CONFIG.tagline} Founded {COMPANY_CONFIG.foundedYear} in{" "}
              {COMPANY_CONFIG.hq.displayLabel}.
            </p>
            <div className="flex flex-wrap gap-4 pt-1 text-sm">
              <a
                href={COMPANY_CONFIG.socials.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[44px] items-center text-slate-200 underline-offset-4 hover:text-[var(--brand-sky)] hover:underline"
              >
                LinkedIn
              </a>
              <a
                href={COMPANY_CONFIG.socials.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[44px] items-center text-slate-200 underline-offset-4 hover:text-[var(--brand-sky)] hover:underline"
              >
                Instagram
              </a>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-4">
            <div>
              <h2 className="eyebrow mb-4 text-[var(--brand-sky)]">Company</h2>
              <ul className="space-y-2 text-sm text-slate-300">
                <li>
                  <Link href="/about" className="inline-flex min-h-[36px] items-center hover:text-white">
                    About Tech Groww
                  </Link>
                </li>
                <li>
                  <Link href="/work" className="inline-flex min-h-[36px] items-center hover:text-white">
                    Reference Blueprints
                  </Link>
                </li>
                <li>
                  <Link href="/insights" className="inline-flex min-h-[36px] items-center hover:text-white">
                    Insights & Guides
                  </Link>
                </li>
                <li>
                  <Link href="/careers" className="inline-flex min-h-[36px] items-center hover:text-white">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link
                    href="/careers/internships"
                    className="inline-flex min-h-[36px] items-center hover:text-white"
                  >
                    Internships
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h2 className="eyebrow mb-4 text-[var(--brand-sky)]">Capabilities</h2>
              <ul className="space-y-2 text-sm text-slate-300">
                <li>
                  <Link
                    href="/services/web-mobile-engineering"
                    className="inline-flex min-h-[36px] items-center hover:text-white"
                  >
                    Web & Mobile
                  </Link>
                </li>
                <li>
                  <Link
                    href="/services/salesforce-solutions"
                    className="inline-flex min-h-[36px] items-center hover:text-white"
                  >
                    Salesforce & OmniStudio
                  </Link>
                </li>
                <li>
                  <Link
                    href="/services/ui-ux-design"
                    className="inline-flex min-h-[36px] items-center hover:text-white"
                  >
                    UI/UX Design
                  </Link>
                </li>
                <li>
                  <Link
                    href="/services/enterprise-software"
                    className="inline-flex min-h-[36px] items-center hover:text-white"
                  >
                    Enterprise Software
                  </Link>
                </li>
                <li>
                  <Link
                    href="/services/it-consulting"
                    className="inline-flex min-h-[36px] items-center hover:text-white"
                  >
                    IT Consulting
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h2 className="eyebrow mb-4 text-[var(--brand-sky)]">Legal & Reach</h2>
              <ul className="space-y-2 text-sm text-slate-300">
                <li>
                  <Link href="/privacy" className="inline-flex min-h-[36px] items-center hover:text-white">
                    Privacy (DPDP)
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="inline-flex min-h-[36px] items-center hover:text-white">
                    Terms of Use
                  </Link>
                </li>
                <li>
                  <Link href="/cookies" className="inline-flex min-h-[36px] items-center hover:text-white">
                    Cookie Policy
                  </Link>
                </li>
                <li>
                  <a
                    href={`mailto:${COMPANY_CONFIG.emails.general}`}
                    className="inline-flex min-h-[36px] items-center hover:text-white"
                  >
                    {COMPANY_CONFIG.emails.general}
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="lg:col-span-4 rounded-[var(--radius-md)] border border-white/15 bg-[var(--ink-elevated)] p-6">
            <h2 className="eyebrow text-[var(--brand-sky)]">Engineering Briefs</h2>
            <p className="mt-2 text-sm text-slate-300">
              Receive occasional technical notes and hiring updates. One-click unsubscribe anytime.
            </p>
            <form onSubmit={handleNewsletter} className="mt-4 space-y-3">
              <div>
                <label htmlFor="footer-newsletter-email" className="sr-only">
                  Work email address
                </label>
                <input
                  id="footer-newsletter-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  className="min-h-[44px] w-full rounded-[var(--radius-sm)] border border-white/25 bg-[var(--ink)] px-3.5 text-sm text-white placeholder:text-slate-400"
                />
              </div>
              <label className="flex items-start gap-2.5 text-xs text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  className="mt-0.5 h-4 w-4 accent-[var(--brand-sky)]"
                />
                <span>
                  I agree to the{" "}
                  <Link href="/privacy" className="underline text-[var(--brand-sky)]">
                    Privacy Policy
                  </Link>{" "}
                  (DPDP Act 2023).
                </span>
              </label>
              <button
                type="submit"
                disabled={submitting}
                className="min-h-[44px] w-full rounded-[var(--radius-pill)] bg-white px-5 py-2.5 text-sm font-semibold text-[var(--ink)] transition-colors hover:bg-slate-100 disabled:opacity-60"
              >
                {submitting ? "Submitting..." : "Subscribe"}
              </button>
              {statusMsg && (
                <p aria-live="polite" className="text-xs text-[var(--brand-sky)]">
                  {statusMsg}
                </p>
              )}
            </form>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-white/10 pt-8 text-xs text-[var(--text-muted-dark)] sm:flex-row sm:items-center sm:justify-between">
          <p>
            &copy; {COMPANY_CONFIG.foundedYear}{" "}
            {COMPANY_CONFIG.confirmations.legalEntityName ??
              "Tech Groww [Legal Entity Confirmation Pending — C-01]"}
            . All rights reserved.
          </p>
          <p>
            {COMPANY_CONFIG.hq.cityState} {COMPANY_CONFIG.hq.postalCode}, India
          </p>
        </div>
      </div>
    </footer>
  );
}
