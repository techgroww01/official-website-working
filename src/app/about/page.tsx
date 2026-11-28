import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { COMPANY_CONFIG } from "@/lib/company-config";
import { SiteHeader } from "@/components/public/SiteHeader";
import { SiteFooter } from "@/components/public/SiteFooter";
import { NextTwo } from "@/components/public/NextTwo";

export const metadata: Metadata = {
  title: "About Tech Groww | Engineering Team & Operating Principles",
  description:
    "Founded in 2026 in Greater Noida. Learn how Tech Groww approaches web engineering, Salesforce solutions, UI/UX design, and direct technical accountability.",
};

export default function AboutPage() {
  return (
    <>
      <SiteHeader polarity="light" />
      <main id="main" className="surface-light flex-1 bg-[var(--paper)]">
        <section className="section-rhythm border-b border-[var(--line)]">
          <div className="container-arch max-w-4xl">
            <p className="eyebrow text-[var(--brand-link)]">
              About Tech Groww · Founded {COMPANY_CONFIG.foundedYear} · {COMPANY_CONFIG.hq.cityState}
            </p>
            <h1 className="font-display mt-4 text-4xl font-extrabold text-[var(--ink)] sm:text-6xl">
              Principal-led software engineering without the agency layers.
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-[var(--text-muted)]">
              Tech Groww was established in {COMPANY_CONFIG.foundedYear} in Greater Noida, Uttar
              Pradesh with a clear mandate: help startups, SMBs, and growing enterprises ship
              dependable software and Salesforce systems without inflated claims or disconnected
              delivery handoffs.
            </p>
          </div>
        </section>

        <section className="section-rhythm border-b border-[var(--line)] bg-[var(--paper-elevated)]">
          <div className="container-arch grid gap-10 md:grid-cols-2">
            <div className="rounded-[var(--radius-md)] border border-[var(--line)] bg-white p-8">
              <p className="eyebrow text-[var(--brand-link)]">Our Ethos</p>
              <h2 className="font-display mt-2 text-2xl font-bold text-[var(--ink)]">
                New, focused, and accountable to every build.
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-[var(--text-muted)]">
                Rather than fabricating a decade of corporate history or hiding behind vague metrics,
                we compete directly on system clarity: clean relational schemas, accessible interfaces,
                honest scoping, and responsive communication directly with engineers.
              </p>
            </div>

            <div className="rounded-[var(--radius-md)] border border-[var(--line)] bg-white p-8">
              <p className="eyebrow text-[var(--brand-link)]">Core Strengths</p>
              <h2 className="font-display mt-2 text-2xl font-bold text-[var(--ink)]">
                Custom Web/Mobile + Salesforce + Product Design.
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-[var(--text-muted)]">
                Where most boutique teams treat CRM setup and product engineering as separate worlds,
                we architect Salesforce (Admin, Support, OmniStudio), Next.js web platforms, and
                UI/UX design systems together cleanly.
              </p>
            </div>
          </div>
        </section>

        <section className="section-rhythm">
          <div className="container-arch">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="eyebrow text-[var(--brand-link)]">Leadership &amp; People</p>
                <h2 className="font-display mt-2 text-3xl font-bold text-[var(--ink)] sm:text-4xl">
                  Built by hands-on builders.
                </h2>
              </div>
              <Link
                href="/careers"
                className="inline-flex min-h-[44px] items-center gap-1.5 text-sm font-semibold text-[var(--brand-link)] hover:underline"
              >
                Explore open roles
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>

            <div className="mt-8 rounded-[var(--radius-md)] border border-[var(--line-control)] bg-white p-6">
              <p className="font-mono-tech text-xs font-semibold text-[var(--status-warn)]">
                TEAM PROFILE VERIFICATION GATE (`C-07`)
              </p>
              <p className="mt-2 text-sm text-[var(--text-muted)]">
                Team bios, approved designations, and portraits (`team_members.is_public = true`) are
                managed cleanly via the Admin CMS Portal (`/admin/team`) and publish here once formal
                written profile consent is toggled.
              </p>
            </div>
          </div>
        </section>

        <NextTwo
          left={{ href: "/services", eyebrow: "Capabilities", title: "Explore our 6 engineering disciplines" }}
          right={{ href: "/work", eyebrow: "Blueprints", title: "Inspect our architectural patterns" }}
        />
      </main>
      <SiteFooter />
    </>
  );
}
