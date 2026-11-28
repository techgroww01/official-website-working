"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight, Loader2 } from "lucide-react";
import { COMPANY_CONFIG } from "@/lib/company-config";
import { TechGrowwLogo } from "@/components/brand/TechGrowwLogo";

interface NewsletterResponse {
  ok?: boolean;
  error?: { message?: string };
  data?: {
    subscribed?: boolean;
    pendingConfirmation?: boolean;
    alreadyActive?: boolean;
    demoMode?: boolean;
  };
}

export function SiteFooter() {
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [statusState, setStatusState] = useState<{ text: string; isError: boolean } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleNewsletter(e: React.FormEvent) {
    e.preventDefault();
    if (!consent) {
      setStatusState({
        text: "Please confirm consent to receive updates.",
        isError: true,
      });
      return;
    }

    setSubmitting(true);
    setStatusState(null);
    try {
      const res = await fetch("/api/v1/public/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          consentSource: "footer",
          turnstileToken: "client-submitted",
        }),
      });
      const json = (await res.json()) as NewsletterResponse;
      if (!res.ok || !json.ok) {
        setStatusState({
          text: json.error?.message || "Unable to subscribe right now.",
          isError: true,
        });
      } else {
        const msg = json.data?.alreadyActive
          ? "You are already subscribed to Tech Groww Engineering Briefs."
          : json.data?.demoMode
          ? "Subscription request recorded in preview mode."
          : "Please check your email inbox to confirm your subscription.";
        setStatusState({ text: msg, isError: false });
        setEmail("");
        setConsent(false);
      }
    } catch {
      setStatusState({
        text: "Network error while subscribing.",
        isError: true,
      });
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
                className="group inline-flex min-h-[44px] items-center gap-1 text-slate-200 underline-offset-4 hover:text-[var(--brand-sky)] hover:underline"
              >
                <span>LinkedIn</span>
                <ArrowUpRight
                  className="h-3.5 w-3.5 text-[var(--text-muted-dark)] transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[var(--brand-sky)] motion-reduce:transform-none"
                  aria-hidden="true"
                />
              </a>
              <a
                href={COMPANY_CONFIG.socials.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex min-h-[44px] items-center gap-1 text-slate-200 underline-offset-4 hover:text-[var(--brand-sky)] hover:underline"
              >
                <span>Instagram</span>
                <ArrowUpRight
                  className="h-3.5 w-3.5 text-[var(--text-muted-dark)] transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[var(--brand-sky)] motion-reduce:transform-none"
                  aria-hidden="true"
                />
              </a>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-4">
            <div>
              <h2 className="eyebrow mb-4 text-[var(--brand-sky)]">Company</h2>
              <ul className="space-y-1 text-sm text-slate-300">
                <li>
                  <Link href="/about" className="inline-flex min-h-[40px] items-center hover:text-white transition-colors">
                    About Tech Groww
                  </Link>
                </li>
                <li>
                  <Link href="/work" className="inline-flex min-h-[40px] items-center hover:text-white transition-colors">
                    Reference Blueprints
                  </Link>
                </li>
                <li>
                  <Link href="/insights" className="inline-flex min-h-[40px] items-center hover:text-white transition-colors">
                    Insights &amp; Guides
                  </Link>
                </li>
                <li>
                  <Link href="/careers" className="inline-flex min-h-[40px] items-center hover:text-white transition-colors">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link
                    href="/careers/internships"
                    className="inline-flex min-h-[40px] items-center hover:text-white transition-colors"
                  >
                    Internships
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h2 className="eyebrow mb-4 text-[var(--brand-sky)]">What We Do</h2>
              <ul className="space-y-1 text-sm text-slate-300">
                <li>
                  <Link
                    href="/services/web-mobile-engineering"
                    className="inline-flex min-h-[40px] items-center hover:text-white transition-colors"
                  >
                    Websites &amp; Mobile Apps
                  </Link>
                </li>
                <li>
                  <Link
                    href="/services/salesforce-solutions"
                    className="inline-flex min-h-[40px] items-center hover:text-white transition-colors"
                  >
                    Salesforce &amp; CRM
                  </Link>
                </li>
                <li>
                  <Link
                    href="/services/ui-ux-design"
                    className="inline-flex min-h-[40px] items-center hover:text-white transition-colors"
                  >
                    UI/UX Design
                  </Link>
                </li>
                <li>
                  <Link
                    href="/services/enterprise-software"
                    className="inline-flex min-h-[40px] items-center hover:text-white transition-colors"
                  >
                    Team Portals &amp; Tools
                  </Link>
                </li>
                <li>
                  <Link
                    href="/services/it-consulting"
                    className="inline-flex min-h-[40px] items-center hover:text-white transition-colors"
                  >
                    Tech Guidance
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h2 className="eyebrow mb-4 text-[var(--brand-sky)]">Legal &amp; Reach</h2>
              <ul className="space-y-1 text-sm text-slate-300">
                <li>
                  <Link href="/privacy" className="inline-flex min-h-[40px] items-center hover:text-white transition-colors">
                    Privacy (DPDP)
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="inline-flex min-h-[40px] items-center hover:text-white transition-colors">
                    Terms of Use
                  </Link>
                </li>
                <li>
                  <Link href="/cookies" className="inline-flex min-h-[40px] items-center hover:text-white transition-colors">
                    Cookie Policy
                  </Link>
                </li>
                <li>
                  <a
                    href={`mailto:${COMPANY_CONFIG.emails.general}`}
                    className="inline-flex min-h-[40px] items-center hover:text-white transition-colors"
                  >
                    {COMPANY_CONFIG.emails.general}
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="lg:col-span-4 rounded-[var(--radius-md)] border border-white/15 bg-[var(--ink-elevated)] p-6">
            <h2 className="eyebrow text-[var(--brand-sky)]">Helpful Guides &amp; Updates</h2>
            <p className="mt-2 text-sm text-slate-300">
              Receive practical tips on growing your business online and updates from our Greater Noida studio. One-click unsubscribe anytime.
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
                  className="min-h-[44px] w-full rounded-[var(--radius-sm)] border border-white/25 bg-[var(--ink)] px-3.5 text-sm text-white placeholder:text-slate-400 transition-colors focus:border-[var(--brand-sky)]"
                />
              </div>
              <label
                htmlFor="footer-newsletter-consent"
                className="flex items-start gap-2.5 py-1 text-xs text-slate-300 cursor-pointer"
              >
                <input
                  id="footer-newsletter-consent"
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  className="mt-0.5 h-4 w-4 accent-[var(--brand-sky)]"
                />
                <span>
                  I agree to the{" "}
                  <Link href="/privacy" className="underline text-[var(--brand-sky)] hover:text-sky-200">
                    Privacy Policy
                  </Link>{" "}
                  (DPDP Act 2023).
                </span>
              </label>
              <button
                type="submit"
                disabled={submitting}
                aria-busy={submitting}
                className="inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-[var(--radius-pill)] bg-white px-5 py-2.5 text-sm font-semibold text-[var(--ink)] transition-colors hover:bg-slate-100 disabled:opacity-60"
              >
                {submitting && (
                  <Loader2 className="h-4 w-4 animate-spin motion-reduce:animate-none" aria-hidden="true" />
                )}
                <span>{submitting ? "Submitting..." : "Subscribe"}</span>
              </button>
              <AnimatePresence mode="wait">
                {statusState && (
                  <motion.p
                    key={statusState.text}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.18 }}
                    role={statusState.isError ? "alert" : "status"}
                    aria-live={statusState.isError ? "assertive" : "polite"}
                    className={`text-xs ${
                      statusState.isError ? "text-rose-300" : "text-[var(--brand-sky)]"
                    }`}
                  >
                    {statusState.text}
                  </motion.p>
                )}
              </AnimatePresence>
            </form>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-white/10 pt-8 text-xs text-[var(--text-muted-dark)] sm:flex-row sm:items-center sm:justify-between">
          <p>
            &copy; {COMPANY_CONFIG.foundedYear}{" "}
            {COMPANY_CONFIG.confirmations.legalEntityName ?? COMPANY_CONFIG.brandName}. All rights
            reserved.
          </p>
          <p>
            {COMPANY_CONFIG.hq.cityState} {COMPANY_CONFIG.hq.postalCode}, India
          </p>
        </div>
      </div>
    </footer>
  );
}
