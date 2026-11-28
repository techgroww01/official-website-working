"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { TechGrowwLogo } from "@/components/brand/TechGrowwLogo";

const NAV_LINKS = [
  { href: "/services", label: "Services" },
  { href: "/work", label: "Work" },
  { href: "/about", label: "About" },
  { href: "/insights", label: "Insights" },
  { href: "/careers", label: "Careers" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader({ polarity = "dark" }: { polarity?: "dark" | "light" }) {
  const pathname = usePathname();
  const [openForPathname, setOpenForPathname] = useState<string | null>(null);
  const mobileOpen = openForPathname === pathname;

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenForPathname(null);
    };
    window.addEventListener("keydown", onKeyDown);
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const isDark = polarity === "dark";

  return (
    <header
      className={`sticky top-0 z-50 h-[72px] border-b backdrop-blur-md transition-colors ${
        isDark
          ? "surface-dark bg-[#070D19]/90 border-white/10 text-white"
          : "surface-light bg-[#F5F2EB]/92 border-[var(--line)] text-[var(--ink)]"
      }`}
    >
      <div className="container-arch flex h-full items-center justify-between gap-4">
        <Link
          href="/"
          aria-label="Tech Groww Home"
          className="inline-flex min-h-[44px] items-center rounded-[var(--radius-sm)]"
        >
          <TechGrowwLogo variant={isDark ? "dark" : "light"} size="md" />
        </Link>

        <nav aria-label="Primary Navigation" className="hidden lg:flex items-center gap-7">
          {NAV_LINKS.map((item) => {
            const active =
              pathname === item.href ||
              (item.href !== "/" && pathname.startsWith(`${item.href}/`));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`inline-flex min-h-[44px] items-center text-sm font-medium transition-colors ${
                  active
                    ? isDark
                      ? "text-[var(--brand-sky)]"
                      : "text-[var(--brand-link)] font-semibold"
                    : isDark
                    ? "text-slate-200 hover:text-white"
                    : "text-[var(--ink)] hover:text-[var(--brand-link)]"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden lg:flex items-center gap-4">
          <Link
            href="/login"
            className={`inline-flex min-h-[44px] items-center px-3 text-sm font-medium ${
              isDark
                ? "text-[var(--text-muted-dark)] hover:text-white"
                : "text-[var(--text-muted)] hover:text-[var(--ink)]"
            }`}
          >
            Portal Sign In
          </Link>
          <Link
            href="/contact"
            className={`inline-flex min-h-[44px] items-center gap-1.5 rounded-[var(--radius-pill)] px-5 py-2.5 text-sm font-semibold transition-transform hover:-translate-y-0.5 ${
              isDark
                ? "bg-white text-[var(--ink)] hover:bg-slate-100"
                : "bg-[var(--brand-royal)] text-white hover:bg-[#1e40af]"
            }`}
          >
            Start a project
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setOpenForPathname((prev) => (prev === pathname ? null : pathname))}
          aria-expanded={mobileOpen}
          aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
          className={`lg:hidden inline-flex h-[44px] w-[44px] items-center justify-center rounded-[var(--radius-sm)] border ${
            isDark
              ? "border-white/25 text-white hover:bg-white/10"
              : "border-[var(--line-control)] text-[var(--ink)] hover:bg-[var(--paper-elevated)]"
          }`}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {mobileOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation drawer"
          className="surface-dark fixed inset-x-0 top-[72px] bottom-0 z-50 flex flex-col justify-between bg-[var(--ink)] px-6 py-8 text-white lg:hidden overflow-y-auto"
        >
          <nav aria-label="Mobile Navigation" className="flex flex-col gap-2">
            {NAV_LINKS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpenForPathname(null)}
                className="flex min-h-[48px] items-center justify-between border-b border-white/10 py-3 font-display text-2xl font-bold tracking-tight text-white hover:text-[var(--brand-sky)]"
              >
                <span>{item.label}</span>
                <ArrowUpRight className="h-5 w-5 text-[var(--brand-sky)]" aria-hidden="true" />
              </Link>
            ))}
          </nav>

          <div className="mt-8 flex flex-col gap-3">
            <Link
              href="/contact"
              onClick={() => setOpenForPathname(null)}
              className="flex min-h-[48px] items-center justify-center gap-2 rounded-[var(--radius-pill)] bg-white px-6 py-3 font-semibold text-[var(--ink)]"
            >
              Start a project
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link
              href="/login"
              onClick={() => setOpenForPathname(null)}
              className="flex min-h-[48px] items-center justify-center rounded-[var(--radius-pill)] border border-white/30 px-6 py-3 text-sm font-medium text-slate-200"
            >
              Client / Intern / Staff Sign In
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
