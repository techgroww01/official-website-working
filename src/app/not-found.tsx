import Link from "next/link";
import { SiteHeader } from "@/components/public/SiteHeader";
import { SiteFooter } from "@/components/public/SiteFooter";

export default function NotFoundPage() {
  return (
    <>
      <SiteHeader polarity="dark" />
      <main id="main" className="surface-dark flex flex-1 items-center bg-[var(--ink)] py-24 text-white">
        <div className="container-arch max-w-3xl">
          <p className="eyebrow text-[var(--brand-sky)]">Error 404 · Route Not Found</p>
          <h1 className="font-display mt-4 text-5xl font-extrabold text-white sm:text-7xl">
            That page isn&apos;t here.
          </h1>
          <p className="mt-5 text-lg text-slate-300">
            Legacy PHP endpoints from earlier site versions redirect automatically or have been
            retired. Explore our current capabilities or get in touch below.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/services"
              className="inline-flex min-h-[48px] items-center rounded-[var(--radius-pill)] bg-white px-6 py-3 text-sm font-semibold text-[var(--ink)] hover:bg-slate-100"
            >
              Explore Services
            </Link>
            <Link
              href="/work"
              className="inline-flex min-h-[48px] items-center rounded-[var(--radius-pill)] border border-white/30 px-6 py-3 text-sm font-semibold text-white hover:border-white"
            >
              Reference Blueprints
            </Link>
            <Link
              href="/contact"
              className="inline-flex min-h-[48px] items-center rounded-[var(--radius-pill)] border border-white/30 px-6 py-3 text-sm font-semibold text-white hover:border-white"
            >
              Contact Tech Groww
            </Link>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
