import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Shield, Users, Zap, FileCheck } from "lucide-react";
import { COMPANY_CONFIG } from "@/lib/company-config";
import { SiteHeader } from "@/components/public/SiteHeader";
import { SiteFooter } from "@/components/public/SiteFooter";
import { NextTwo } from "@/components/public/NextTwo";
import { AnimatedSection } from "@/components/public/AnimatedSection";

export const metadata: Metadata = {
  title: "About Tech Groww | Engineering Team & Operating Principles",
  description:
    "Founded in 2026 in Greater Noida. Learn how Tech Groww approaches web engineering, Salesforce solutions, UI/UX design, and direct technical accountability.",
};

const PRINCIPLES = [
  {
    icon: <Shield className="h-5 w-5" aria-hidden="true" />,
    title: "No agency layers",
    body: "You work directly with the engineer scoping, designing, and shipping your system. No account managers translating requirements across teams.",
  },
  {
    icon: <FileCheck className="h-5 w-5" aria-hidden="true" />,
    title: "Verifiable delivery",
    body: "Every milestone comes with working software on staging, automated type checks, and documented test coverage — not status slides.",
  },
  {
    icon: <Zap className="h-5 w-5" aria-hidden="true" />,
    title: "Practical architecture",
    body: "Clean PostgreSQL schemas, strict RBAC access boundaries, and readable TypeScript codebases scoped honestly around your budget and timeline.",
  },
  {
    icon: <Users className="h-5 w-5" aria-hidden="true" />,
    title: "Honest scoping",
    body: "We tell you what we can and cannot build in a given timeline. No inflated estimates, no scope theatre, no surprise post-launch invoices.",
  },
];

export default function AboutPage() {
  return (
    <>
      <SiteHeader polarity="light" />
      <main id="main" className="surface-light flex-1 bg-[var(--paper)]">

        {/* Hero */}
        <section className="section-rhythm border-b border-[var(--line)]">
          <div className="container-arch max-w-4xl">
            <AnimatedSection>
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
            </AnimatedSection>
          </div>
        </section>

        {/* Principles grid */}
        <section className="section-rhythm border-b border-[var(--line)] bg-[var(--paper-elevated)]">
          <div className="container-arch">
            <AnimatedSection>
              <p className="eyebrow text-[var(--brand-link)]">Operating Principles</p>
              <h2 className="font-display mt-2 text-3xl font-bold text-[var(--ink)] sm:text-4xl">
                How we build, ship, and support.
              </h2>
            </AnimatedSection>

            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {PRINCIPLES.map((p, i) => (
                <AnimatedSection key={p.title} delay={i * 70}>
                  <div className="flex flex-col rounded-[var(--radius-md)] border border-[var(--line)] bg-white p-6 h-full tg-card-interactive hover:border-[var(--brand-cobalt)] hover:shadow-md">
                    <span className="flex h-10 w-10 items-center justify-center rounded-[var(--radius-sm)] bg-[var(--paper-elevated)] text-[var(--brand-cobalt)]">
                      {p.icon}
                    </span>
                    <h3 className="font-display mt-4 text-lg font-bold text-[var(--ink)]">
                      {p.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-[var(--text-muted)]">{p.body}</p>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>

        {/* Ethos two-col */}
        <section className="section-rhythm border-b border-[var(--line)]">
          <div className="container-arch grid gap-10 md:grid-cols-2">
            <AnimatedSection direction="left">
              <div className="rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--paper-elevated)] p-8 h-full">
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
            </AnimatedSection>

            <AnimatedSection direction="right">
              <div className="rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--paper-elevated)] p-8 h-full">
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
            </AnimatedSection>
          </div>
        </section>

        {/* Team */}
        <section className="section-rhythm">
          <div className="container-arch">
            <AnimatedSection>
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
            </AnimatedSection>

            <AnimatedSection delay={100} className="mt-8">
              <div className="rounded-[var(--radius-md)] border border-[var(--line-control)] bg-[var(--paper-elevated)] p-6">
                <p className="font-display text-sm font-semibold text-[var(--ink)]">
                  Leadership Profiles &amp; Direct Engagement
                </p>
                <p className="mt-2 text-sm text-[var(--text-muted)]">
                  Our engineering principals collaborate directly on client engagements from initial technical architecture through production delivery and ongoing maintenance.
                </p>
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* Contact strip */}
        <section className="section-rhythm surface-dark bg-[var(--ink)] text-white">
          <div className="container-arch text-center">
            <AnimatedSection>
              <p className="eyebrow text-[var(--brand-sky)]">Work With Us</p>
              <h2 className="font-display mt-3 text-3xl font-bold text-white sm:text-4xl">
                Have a project in mind?
              </h2>
              <p className="mt-4 text-base text-slate-300">
                Reach us at{" "}
                <a
                  href={`mailto:${COMPANY_CONFIG.emails.general}`}
                  className="text-[var(--brand-sky)] underline underline-offset-2 hover:no-underline"
                >
                  {COMPANY_CONFIG.emails.general}
                </a>
                {" "}or use the project brief form.
              </p>
              <Link
                href="/contact"
                className="mt-7 inline-flex min-h-[48px] items-center gap-2 rounded-[var(--radius-pill)] bg-white px-7 py-3 text-sm font-semibold text-[var(--ink)] hover:-translate-y-0.5 hover:bg-slate-100 transition-all duration-200 motion-reduce:transform-none"
              >
                Start a conversation
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </AnimatedSection>
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
