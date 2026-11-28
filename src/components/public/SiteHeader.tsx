"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { Menu, X, ArrowUpRight, MessageCircle } from "lucide-react";
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

  const triggerRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mobileOpen) {
      document.body.style.overflow = "";
      return;
    }

    document.body.style.overflow = "hidden";

    const focusTimer = window.requestAnimationFrame(() => {
      const container = drawerRef.current;
      if (!container) return;
      const focusables = container.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      focusables[0]?.focus();
    });

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setOpenForPathname(null);
        window.requestAnimationFrame(() => {
          triggerRef.current?.focus();
        });
        return;
      }

      if (e.key === "Tab" && drawerRef.current) {
        const focusables = Array.from(
          drawerRef.current.querySelectorAll<HTMLElement>(
            'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
          )
        );
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (!first || !last) return;

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.cancelAnimationFrame(focusTimer);
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
                aria-current={active ? "page" : undefined}
                className={`relative inline-flex min-h-[44px] items-center text-sm font-medium transition-colors ${
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
                {active && (
                  <motion.span
                    layoutId="header-active-nav"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    aria-hidden="true"
                    className={`absolute inset-x-0 bottom-[6px] h-[2px] rounded-full ${
                      isDark ? "bg-[var(--brand-sky)]" : "bg-[var(--brand-cobalt)]"
                    }`}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="hidden lg:flex items-center gap-3">
          <Link
            href="/contact?service=inquiry"
            aria-label="Direct inquiry to Tech Groww team"
            className={`inline-flex min-h-[42px] items-center gap-1.5 rounded-[var(--radius-pill)] border px-3.5 py-2 text-xs font-semibold transition-all duration-200 hover:-translate-y-0.5 motion-reduce:transform-none ${
              isDark
                ? "border-emerald-500/40 bg-emerald-950/40 text-emerald-300 hover:bg-emerald-900/60"
                : "border-emerald-600/30 bg-emerald-50 text-emerald-800 hover:bg-emerald-100"
            }`}
          >
            <MessageCircle className="h-3.5 w-3.5 text-emerald-400" aria-hidden="true" />
            <span>Quick Inquiry</span>
          </Link>
          <Link
            href="/login"
            className={`inline-flex min-h-[44px] items-center px-2 text-sm font-medium transition-colors ${
              isDark
                ? "text-[var(--text-muted-dark)] hover:text-white"
                : "text-[var(--text-muted)] hover:text-[var(--ink)]"
            }`}
          >
            Portal Sign In
          </Link>
          <Link
            href="/contact"
            className={`group inline-flex min-h-[44px] items-center gap-1.5 rounded-[var(--radius-pill)] px-5 py-2.5 text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5 motion-reduce:transform-none ${
              isDark
                ? "bg-white text-[var(--ink)] hover:bg-slate-100"
                : "bg-[var(--brand-royal)] text-white hover:bg-[#1e40af]"
            }`}
          >
            Start a project
            <ArrowUpRight
              className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transform-none"
              aria-hidden="true"
            />
          </Link>
        </div>

        <button
          ref={triggerRef}
          type="button"
          onClick={() => setOpenForPathname((prev) => (prev === pathname ? null : pathname))}
          aria-expanded={mobileOpen}
          aria-controls="mobile-nav-drawer"
          aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
          className={`lg:hidden inline-flex h-[44px] w-[44px] items-center justify-center rounded-[var(--radius-sm)] border transition-colors ${
            isDark
              ? "border-white/25 text-white hover:bg-white/10"
              : "border-[var(--line-control)] text-[var(--ink)] hover:bg-[var(--paper-elevated)]"
          }`}
        >
          {mobileOpen ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            id="mobile-nav-drawer"
            ref={drawerRef}
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation drawer"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="surface-dark fixed inset-x-0 top-[72px] bottom-0 z-50 flex flex-col justify-between bg-[var(--ink)] px-6 py-8 text-white lg:hidden overflow-y-auto"
          >
            <nav aria-label="Mobile Navigation" className="flex flex-col gap-2">
              {NAV_LINKS.map((item, idx) => {
                const active =
                  pathname === item.href ||
                  (item.href !== "/" && pathname.startsWith(`${item.href}/`));
                return (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      duration: 0.2,
                      delay: Math.min(idx * 0.03, 0.15),
                      ease: [0.16, 1, 0.3, 1],
                    }}
                  >
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      onClick={() => setOpenForPathname(null)}
                      className={`group flex min-h-[48px] items-center justify-between border-b border-white/10 py-3 font-display text-2xl font-bold tracking-tight transition-colors ${
                        active
                          ? "text-[var(--brand-sky)]"
                          : "text-white hover:text-[var(--brand-sky)]"
                      }`}
                    >
                      <span>{item.label}</span>
                      <ArrowUpRight
                        className="h-5 w-5 text-[var(--brand-sky)] transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transform-none"
                        aria-hidden="true"
                      />
                    </Link>
                  </motion.div>
                );
              })}
            </nav>

            <div className="mt-8 flex flex-col gap-3">
              <Link
                href="/contact"
                onClick={() => setOpenForPathname(null)}
                className="group flex min-h-[48px] items-center justify-center gap-2 rounded-[var(--radius-pill)] bg-white px-6 py-3 font-semibold text-[var(--ink)] transition-colors hover:bg-slate-100"
              >
                Start a project
                <ArrowUpRight
                  className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transform-none"
                  aria-hidden="true"
                />
              </Link>
              <Link
                href="/login"
                onClick={() => setOpenForPathname(null)}
                className="flex min-h-[48px] items-center justify-center rounded-[var(--radius-pill)] border border-white/30 px-6 py-3 text-sm font-medium text-slate-200 transition-colors hover:border-white/60 hover:text-white"
              >
                Client / Intern / Staff Sign In
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
