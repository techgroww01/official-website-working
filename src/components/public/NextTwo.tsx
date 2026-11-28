import React from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export function NextTwo({
  left = { href: "/about", eyebrow: "Company", title: "Meet the ethos & engineering mindset" },
  right = { href: "/work", eyebrow: "Architecture", title: "Explore our Reference Blueprints" },
}: {
  left?: { href: string; eyebrow: string; title: string };
  right?: { href: string; eyebrow: string; title: string };
}) {
  return (
    <section className="surface-dark border-t border-white/10 bg-[var(--ink)] py-16 text-white">
      <div className="container-arch">
        <div className="mb-12 flex flex-col gap-6 border-b border-white/15 pb-12 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow text-[var(--brand-sky)]">Ready When You Are</p>
            <h2 className="font-display mt-2 text-3xl font-bold text-white sm:text-5xl">
              Tell us what needs to move forward.
            </h2>
          </div>
          <Link
            href="/contact"
            className="inline-flex min-h-[48px] flex-shrink-0 items-center gap-2 rounded-[var(--radius-pill)] bg-white px-7 py-3 text-sm font-semibold text-[var(--ink)] hover:bg-slate-100"
          >
            Start a project
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Link
            href={left.href}
            className="group flex min-h-[120px] items-center justify-between rounded-[var(--radius-md)] border border-white/15 bg-[var(--ink-elevated)] p-6 transition-colors hover:border-[var(--brand-sky)]"
          >
            <div>
              <span className="eyebrow text-[var(--brand-sky)]">{left.eyebrow}</span>
              <p className="font-display mt-2 text-xl font-bold text-white sm:text-2xl">
                {left.title}
              </p>
            </div>
            <ArrowUpRight
              className="h-5 w-5 flex-shrink-0 text-[var(--text-muted-dark)] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[var(--brand-sky)]"
              aria-hidden="true"
            />
          </Link>

          <Link
            href={right.href}
            className="group flex min-h-[120px] items-center justify-between rounded-[var(--radius-md)] border border-white/15 bg-[var(--ink-elevated)] p-6 transition-colors hover:border-[var(--brand-sky)]"
          >
            <div>
              <span className="eyebrow text-[var(--brand-sky)]">{right.eyebrow}</span>
              <p className="font-display mt-2 text-xl font-bold text-white sm:text-2xl">
                {right.title}
              </p>
            </div>
            <ArrowUpRight
              className="h-5 w-5 flex-shrink-0 text-[var(--text-muted-dark)] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[var(--brand-sky)]"
              aria-hidden="true"
            />
          </Link>
        </div>
      </div>
    </section>
  );
}
