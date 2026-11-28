"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, MotionConfig, motion } from "motion/react";
import {
  Bell,
  ChevronDown,
  LayoutDashboard,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { TechGrowwLogo } from "@/components/brand/TechGrowwLogo";
import type { PortalKey } from "@/lib/rbac/roles";

export interface PortalNavItem {
  href: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  badge?: string | number;
}

export interface PortalShellProps {
  portal: PortalKey;
  title: string;
  user: {
    fullName: string;
    email: string;
    roles: readonly string[];
  };
  accessiblePortals: readonly PortalKey[];
  navItems: readonly PortalNavItem[];
  children: React.ReactNode;
}

const PORTAL_LABELS: Record<PortalKey, { name: string; href: string }> = {
  admin: { name: "Admin CMS", href: "/admin" },
  sales: { name: "Sales CRM", href: "/sales" },
  recruitment: { name: "Recruitment ATS", href: "/recruitment" },
  client: { name: "Client Portal", href: "/client" },
  intern: { name: "Intern Portal", href: "/intern" },
};

const ARCHITECTURAL_EASE = [0.16, 1, 0.3, 1] as const;

export function PortalShell({
  portal,
  title,
  user,
  accessiblePortals,
  navItems,
  children,
}: PortalShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [switcherOpen, setSwitcherOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const switcherRef = useRef<HTMLDivElement>(null);
  const switcherBtnRef = useRef<HTMLButtonElement>(null);
  const mobileBtnRef = useRef<HTMLButtonElement>(null);

  const isNavItemActive = (href: string) =>
    href === `/${portal}`
      ? pathname === href
      : pathname === href || pathname.startsWith(`${href}/`);

  const hasMultiplePortals = accessiblePortals.length > 1;
  const isNotificationsActive = pathname === "/notifications";
  const primaryRoleLabel = user.roles[0]?.replace(/_/g, " ") ?? "member";
  const initials = (user.fullName.trim().slice(0, 2) || "TG").toUpperCase();

  useEffect(() => {
    if (!switcherOpen) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setSwitcherOpen(false);
        switcherBtnRef.current?.focus();
      }
    }

    function handlePointerDown(e: PointerEvent) {
      if (
        switcherRef.current &&
        e.target instanceof Node &&
        !switcherRef.current.contains(e.target)
      ) {
        setSwitcherOpen(false);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("pointerdown", handlePointerDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [switcherOpen]);

  useEffect(() => {
    if (!mobileMenuOpen) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setMobileMenuOpen(false);
        mobileBtnRef.current?.focus();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [mobileMenuOpen]);

  async function handleSignOut() {
    setLoggingOut(true);
    try {
      await fetch("/api/v1/auth/logout", { method: "POST" });
    } catch {
      // Continue redirect on error
    }
    router.push("/login");
    router.refresh();
  }

  return (
    <MotionConfig reducedMotion="user">
      <div className="surface-light flex min-h-screen bg-[var(--portal-bg)] text-[var(--ink)] antialiased">
        <a
          href="#portal-main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-[var(--radius-sm)] focus:bg-[var(--brand-royal)] focus:px-4 focus:py-2 focus:text-white"
        >
          Skip to portal content
        </a>

        {/* Desktop Sidebar (240px) */}
        <aside className="hidden w-60 flex-col justify-between border-r border-[var(--line-control)] bg-[var(--portal-surface)] p-4 lg:flex">
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-[var(--line-control)] pb-4">
              <Link href="/" aria-label="Tech Groww Home">
                <TechGrowwLogo variant="portal" size="sm" />
              </Link>
            </div>

            {/* Portal Switcher */}
            <div ref={switcherRef} className="relative">
              {hasMultiplePortals ? (
                <>
                  <button
                    ref={switcherBtnRef}
                    type="button"
                    onClick={() => setSwitcherOpen((v) => !v)}
                    className="flex w-full items-center justify-between rounded-[var(--radius-sm)] border border-[var(--line-control)] bg-stone-50 px-3 py-2 text-left text-xs font-semibold tracking-wider text-[var(--text-muted)] uppercase transition-colors hover:bg-stone-100"
                    aria-expanded={switcherOpen}
                    aria-haspopup="menu"
                    aria-label="Switch portal view"
                  >
                    <span className="truncate">{PORTAL_LABELS[portal].name}</span>
                    <ChevronDown
                      className={`h-4 w-4 text-[var(--text-muted)] transition-transform duration-150 ${
                        switcherOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  <AnimatePresence>
                    {switcherOpen && (
                      <motion.div
                        role="menu"
                        initial={{ opacity: 0, scale: 0.97, y: -4 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.97, y: -4 }}
                        transition={{ duration: 0.16, ease: ARCHITECTURAL_EASE }}
                        style={{ transformOrigin: "top" }}
                        className="absolute top-full left-0 z-30 mt-1 w-full rounded-[var(--radius-sm)] border border-[var(--line-control)] bg-white py-1 shadow-md"
                      >
                        {accessiblePortals.map((p) => (
                          <Link
                            key={p}
                            href={PORTAL_LABELS[p].href}
                            role="menuitem"
                            onClick={() => setSwitcherOpen(false)}
                            className={`block px-3 py-2 text-xs font-medium transition-colors ${
                              p === portal
                                ? "bg-sky-50 font-semibold text-[var(--brand-royal)]"
                                : "text-[var(--ink)] hover:bg-stone-50"
                            }`}
                          >
                            {PORTAL_LABELS[p].name}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              ) : (
                <div className="flex w-full items-center justify-between rounded-[var(--radius-sm)] border border-[var(--line)] bg-[var(--portal-bg)] px-3 py-2 text-xs font-semibold tracking-wider text-[var(--text-muted)] uppercase">
                  <span className="truncate">{PORTAL_LABELS[portal].name}</span>
                </div>
              )}
            </div>

            {/* Navigation Links */}
            <nav className="space-y-1" aria-label="Portal Navigation">
              {navItems.map((item) => {
                const active = isNavItemActive(item.href);
                const Icon = item.icon || LayoutDashboard;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={`relative flex items-center justify-between rounded-[var(--radius-sm)] px-3 py-2 text-sm font-medium transition-colors ${
                      active
                        ? "text-white"
                        : "text-[var(--text-muted)] hover:bg-stone-100 hover:text-[var(--ink)]"
                    }`}
                  >
                    {active && (
                      <motion.span
                        layoutId="portal-nav-active"
                        transition={{
                          type: "spring",
                          stiffness: 420,
                          damping: 34,
                          mass: 0.8,
                        }}
                        className="absolute inset-0 rounded-[var(--radius-sm)] bg-[var(--brand-royal)] shadow-xs"
                        aria-hidden="true"
                      />
                    )}
                    <div className="relative z-10 flex items-center gap-2.5">
                      <Icon className="h-4 w-4 shrink-0" />
                      <span>{item.label}</span>
                    </div>
                    {item.badge !== undefined && (
                      <span
                        className={`relative z-10 rounded-full px-2 py-0.5 font-mono-tech text-xs font-semibold tabular-nums ${
                          active
                            ? "bg-white/20 text-white"
                            : "bg-stone-200 text-stone-700"
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* User Card & Sign Out */}
          <div className="space-y-3 border-t border-[var(--line-control)] pt-4">
            <div className="flex items-center gap-2 px-1">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-stone-100 font-mono-tech text-xs font-bold text-[var(--ink)]">
                {initials}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-semibold text-[var(--ink)]">
                  {user.fullName}
                </p>
                <p className="truncate text-[11px] text-[var(--text-muted)]">
                  {user.email}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleSignOut}
              disabled={loggingOut}
              className="flex w-full items-center gap-2 rounded-[var(--radius-sm)] px-3 py-1.5 text-xs font-medium text-rose-700 hover:bg-rose-50 disabled:opacity-50"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>{loggingOut ? "Signing out..." : "Sign Out"}</span>
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
          {/* Top Header */}
          <header className="flex h-16 items-center justify-between border-b border-[var(--line-control)] bg-[var(--portal-surface)] px-4 lg:px-8">
            <div className="flex min-w-0 items-center gap-3">
              <button
                ref={mobileBtnRef}
                type="button"
                onClick={() => setMobileMenuOpen((v) => !v)}
                aria-expanded={mobileMenuOpen}
                aria-controls="portal-mobile-drawer"
                aria-label="Toggle navigation menu"
                className="rounded-[var(--radius-sm)] p-2 text-stone-600 hover:bg-stone-100 lg:hidden"
              >
                {mobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </button>
              <h1 className="truncate font-display text-lg font-bold text-[var(--ink)]">
                {title}
              </h1>
            </div>

            <div className="flex shrink-0 items-center gap-4">
              <Link
                href="/notifications"
                aria-label="View notifications"
                aria-current={isNotificationsActive ? "page" : undefined}
                className={`relative rounded-full p-2 transition-colors ${
                  isNotificationsActive
                    ? "bg-sky-50 text-[var(--brand-royal)] ring-1 ring-[var(--brand-cobalt)]"
                    : "text-[var(--text-muted)] hover:bg-stone-100 hover:text-[var(--ink)]"
                }`}
              >
                <Bell className="h-4 w-4" />
              </Link>

              <div className="hidden items-center gap-2 border-l border-[var(--line-control)] pl-4 sm:flex">
                <span className="rounded-full bg-stone-100 px-2.5 py-0.5 font-mono-tech text-[10px] font-semibold text-stone-700 uppercase">
                  {primaryRoleLabel}
                </span>
              </div>
            </div>
          </header>

          {/* Mobile Navigation Drawer */}
          <AnimatePresence initial={false}>
            {mobileMenuOpen && (
              <motion.div
                id="portal-mobile-drawer"
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.18, ease: ARCHITECTURAL_EASE }}
                className="space-y-4 border-b border-[var(--line-control)] bg-[var(--portal-surface)] p-4 lg:hidden"
              >
                {/* Mobile User Summary */}
                <div className="flex items-center justify-between gap-3 rounded-[var(--radius-sm)] border border-[var(--line)] bg-[var(--portal-bg)] px-3 py-2.5">
                  <div className="flex min-w-0 items-center gap-2.5">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white font-mono-tech text-xs font-bold text-[var(--ink)] ring-1 ring-[var(--line)]">
                      {initials}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-xs font-semibold text-[var(--ink)]">
                        {user.fullName}
                      </p>
                      <p className="truncate text-[11px] text-[var(--text-muted)]">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <span className="shrink-0 rounded-full bg-white px-2 py-0.5 font-mono-tech text-[10px] font-semibold text-stone-700 uppercase ring-1 ring-[var(--line)]">
                    {primaryRoleLabel}
                  </span>
                </div>

                {/* Mobile Portal Switcher */}
                {hasMultiplePortals ? (
                  <div className="space-y-1.5">
                    <p className="px-1 font-mono-tech text-[10px] font-semibold tracking-wider text-[var(--text-muted)] uppercase">
                      Switch Portal
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {accessiblePortals.map((p) => (
                        <Link
                          key={p}
                          href={PORTAL_LABELS[p].href}
                          onClick={() => setMobileMenuOpen(false)}
                          className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
                            p === portal
                              ? "border-[var(--brand-royal)] bg-sky-50 text-[var(--brand-royal)]"
                              : "border-[var(--line)] bg-white text-[var(--ink)] hover:bg-stone-50"
                          }`}
                        >
                          {PORTAL_LABELS[p].name}
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="rounded-[var(--radius-sm)] border border-[var(--line)] bg-[var(--portal-bg)] px-3 py-1.5 text-xs font-semibold tracking-wider text-[var(--text-muted)] uppercase">
                    {PORTAL_LABELS[portal].name}
                  </div>
                )}

                <nav className="space-y-1" aria-label="Mobile Portal Navigation">
                  {navItems.map((item) => {
                    const active = isNavItemActive(item.href);
                    const Icon = item.icon || LayoutDashboard;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        aria-current={active ? "page" : undefined}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center justify-between rounded-[var(--radius-sm)] px-3 py-2 text-sm font-medium ${
                          active
                            ? "bg-[var(--brand-royal)] text-white"
                            : "text-[var(--text-muted)] hover:bg-stone-100 hover:text-[var(--ink)]"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <Icon className="h-4 w-4 shrink-0" />
                          <span>{item.label}</span>
                        </div>
                        {item.badge !== undefined && (
                          <span
                            className={`rounded-full px-2 py-0.5 font-mono-tech text-xs font-semibold tabular-nums ${
                              active
                                ? "bg-white/20 text-white"
                                : "bg-stone-200 text-stone-700"
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </nav>

                <button
                  type="button"
                  onClick={handleSignOut}
                  disabled={loggingOut}
                  className="flex w-full items-center gap-2 rounded-[var(--radius-sm)] px-3 py-2 text-sm font-medium text-rose-700 hover:bg-rose-50 disabled:opacity-50"
                >
                  <LogOut className="h-4 w-4" />
                  <span>{loggingOut ? "Signing out..." : "Sign Out"}</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Portal Body */}
          <main id="portal-main" className="flex-1 overflow-y-auto p-4 lg:p-8">
            <motion.div
              key={pathname}
              initial={{ opacity: 0.92, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.16, ease: ARCHITECTURAL_EASE }}
            >
              {children}
            </motion.div>
          </main>
        </div>
      </div>
    </MotionConfig>
  );
}
