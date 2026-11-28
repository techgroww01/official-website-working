import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, ShieldCheck, Users, HeartHandshake, FileCheck, MessageCircle, MapPin, Mail } from "lucide-react";
import { COMPANY_CONFIG } from "@/lib/company-config";
import { SiteHeader } from "@/components/public/SiteHeader";
import { SiteFooter } from "@/components/public/SiteFooter";
import { NextTwo } from "@/components/public/NextTwo";
import { AnimatedSection } from "@/components/public/AnimatedSection";

export const metadata: Metadata = {
  title: "About Tech Groww | Greater Noida Team & Culture",
  description:
    "Founded in 2026 in Greater Noida, Uttar Pradesh. Meet the team crafting websites, mobile apps, and business systems with personal care and zero confusing jargon.",
};

const PRINCIPLES = [
  {
    icon: <Users className="h-5 w-5" aria-hidden="true" />,
    title: "Talk straight to the makers",
    body: "You work directly with the designers and developers building your product. No middle account managers or lost-in-translation handoffs.",
  },
  {
    icon: <FileCheck className="h-5 w-5" aria-hidden="true" />,
    title: "Weekly live progress",
    body: "Every milestone comes with a working link you can click and test on your phone and laptop — not static slides or empty promises.",
  },
  {
    icon: <ShieldCheck className="h-5 w-5" aria-hidden="true" />,
    title: "Honest advice, no buzzwords",
    body: "We recommend what actually serves your business and fits your budget, without trying to push complicated, costly tools you do not need.",
  },
  {
    icon: <HeartHandshake className="h-5 w-5" aria-hidden="true" />,
    title: "Support that stays with you",
    body: "We train your team step-by-step before going live, launch smoothly, and remain just a phone call or WhatsApp message away.",
  },
];

export default function AboutPage() {
  return (
    <>
      <SiteHeader polarity="light" />
      <main id="main" className="surface-light flex-1 bg-[var(--paper)]">

        {/* Hero Section */}
        <section className="section-rhythm border-b border-[var(--line)]">
          <div className="container-arch">
            <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
              <div className="lg:col-span-7">
                <AnimatedSection>
                  <div className="inline-flex items-center gap-2 rounded-full border border-amber-300/70 bg-amber-50 px-3.5 py-1 text-xs font-semibold text-amber-800">
                    <span className="text-sm">🇮🇳</span>
                    <span>Greater Noida, Uttar Pradesh · Founded {COMPANY_CONFIG.foundedYear}</span>
                  </div>
                  <h1 className="font-display mt-4 text-4xl font-extrabold text-[var(--ink)] sm:text-6xl tracking-tight leading-[1.1]">
                    Crafting digital products with personal care.
                  </h1>
                  <p className="mt-5 text-lg leading-relaxed text-[var(--text-muted)]">
                    Tech Groww was established in Greater Noida to bring honesty, hospitality, and
                    top-tier digital craft to Indian startups, local businesses, and ambitious teams
                    worldwide. We believe good technology should feel simple, work dependably, and
                    help your business grow every single day.
                  </p>

                  <div className="mt-7 flex flex-wrap items-center gap-3.5">
                    <Link
                      href="/contact?service=consultation"
                      className="inline-flex min-h-[46px] items-center gap-2 rounded-[var(--radius-pill)] bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-emerald-700 transition-colors"
                    >
                      <MessageCircle className="h-4 w-4" aria-hidden="true" />
                      <span>Direct Project Inquiry</span>
                    </Link>
                    <Link
                      href="/contact"
                      className="inline-flex min-h-[46px] items-center gap-2 rounded-[var(--radius-pill)] border border-[var(--line-control)] bg-white px-6 py-2.5 text-sm font-semibold text-[var(--ink)] hover:border-[var(--brand-royal)] hover:text-[var(--brand-royal)] transition-colors shadow-xs"
                    >
                      <span>Visit our studio</span>
                      <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                    </Link>
                  </div>
                </AnimatedSection>
              </div>

              {/* Hero Image */}
              <div className="lg:col-span-5">
                <AnimatedSection delay={150}>
                  <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-[var(--line)] shadow-md">
                    <Image
                      src="/images/client-consultation.jpg"
                      alt="Consultation over chai at Tech Groww Greater Noida studio"
                      fill
                      priority
                      sizes="(max-width: 1024px) 100vw, 40vw"
                      className="object-cover"
                    />
                    <div className="absolute bottom-3 left-3 rounded-md bg-black/65 backdrop-blur-xs px-3 py-1.5 text-xs font-semibold text-white">
                      📍 Greater Noida Studio · Warm Chai &amp; Collaboration
                    </div>
                  </div>
                </AnimatedSection>
              </div>
            </div>
          </div>
        </section>

        {/* Operating Principles */}
        <section className="section-rhythm border-b border-[var(--line)] bg-[var(--paper-elevated)]">
          <div className="container-arch">
            <AnimatedSection>
              <p className="eyebrow text-[var(--brand-link)]">Our Operating Principles</p>
              <h2 className="font-display mt-2 text-3xl font-bold text-[var(--ink)] sm:text-4xl">
                How we work with you every day.
              </h2>
            </AnimatedSection>

            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {PRINCIPLES.map((p, i) => (
                <AnimatedSection key={p.title} delay={i * 70}>
                  <div className="flex flex-col justify-between rounded-xl border border-[var(--line)] bg-white p-6 h-full shadow-xs transition-all duration-200 hover:-translate-y-1 hover:border-[var(--brand-royal)] hover:shadow-md">
                    <div>
                      <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--paper-elevated)] text-[var(--brand-link)]">
                        {p.icon}
                      </span>
                      <h3 className="font-display mt-4 text-lg font-bold text-[var(--ink)]">
                        {p.title}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-[var(--text-muted)]">{p.body}</p>
                    </div>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>

        {/* Studio Culture & Photo Gallery */}
        <section className="section-rhythm border-b border-[var(--line)]">
          <div className="container-arch">
            <div className="grid gap-8 md:grid-cols-2 items-center">
              <AnimatedSection direction="left">
                <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl border border-[var(--line)] shadow-sm">
                  <Image
                    src="/images/team-strategy.jpg"
                    alt="Tech Groww team planning business milestones"
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                  />
                </div>
              </AnimatedSection>

              <AnimatedSection direction="right">
                <div className="rounded-2xl border border-[var(--line)] bg-[var(--paper-elevated)] p-7 sm:p-9">
                  <p className="eyebrow text-[var(--brand-link)]">Our Commitment</p>
                  <h3 className="font-display mt-2 text-2xl font-bold text-[var(--ink)] sm:text-3xl">
                    Focused, attentive, and proud of every launch.
                  </h3>
                  <p className="mt-4 text-sm leading-relaxed text-[var(--text-muted)]">
                    We don&apos;t take on 50 projects at once to outsource them to subcontractors.
                    We take on a curated set of clients so we can give your project our full attention,
                    refine every detail, and ensure your system runs smoothly from day one.
                  </p>
                  <div className="mt-6 pt-5 border-t border-[var(--line)] flex flex-wrap items-center gap-4 text-xs font-semibold text-[var(--ink)]">
                    <span className="flex items-center gap-1.5 text-emerald-700">
                      <MapPin className="h-4 w-4" aria-hidden="true" />
                      Greater Noida HQ (Pincode 203209)
                    </span>
                    <span className="flex items-center gap-1.5 text-[var(--brand-link)]">
                      <Mail className="h-4 w-4" aria-hidden="true" />
                      {COMPANY_CONFIG.emails.general}
                    </span>
                  </div>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </section>

        {/* Direct Contact CTA Banner */}
        <section className="section-rhythm surface-dark bg-[var(--ink)] text-white">
          <div className="container-arch text-center max-w-2xl">
            <AnimatedSection>
              <p className="eyebrow text-[var(--brand-sky)]">Let&apos;s Connect</p>
              <h2 className="font-display mt-3 text-3xl font-bold text-white sm:text-4xl">
                Ready to talk about your next project?
              </h2>
              <p className="mt-4 text-base text-slate-300">
                Give us a call, drop us a WhatsApp message, or email us at{" "}
                <a
                  href={`mailto:${COMPANY_CONFIG.emails.general}`}
                  className="text-[var(--brand-sky)] underline underline-offset-2 hover:no-underline font-medium"
                >
                  {COMPANY_CONFIG.emails.general}
                </a>
                . We respond quickly.
              </p>
              <div className="mt-7 flex flex-wrap justify-center items-center gap-3">
                <Link
                  href="/contact"
                  className="inline-flex min-h-[48px] items-center gap-2 rounded-[var(--radius-pill)] bg-white px-7 py-3 text-sm font-semibold text-[var(--ink)] hover:bg-slate-100 transition-colors"
                >
                  Start a conversation
                  <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                </Link>
                <a
                  href="https://wa.me/919205694145"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-[48px] items-center gap-2 rounded-[var(--radius-pill)] bg-emerald-600 px-6 py-3 text-sm font-semibold text-white hover:bg-emerald-700 transition-colors"
                >
                  <MessageCircle className="h-4 w-4" aria-hidden="true" />
                  <span>WhatsApp Us</span>
                </a>
              </div>
            </AnimatedSection>
          </div>
        </section>

        <NextTwo
          left={{ href: "/services", eyebrow: "Services", title: "Explore what we build for you" }}
          right={{ href: "/work", eyebrow: "Examples", title: "See our sample solutions" }}
        />
      </main>
      <SiteFooter />
    </>
  );
}
