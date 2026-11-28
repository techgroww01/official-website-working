"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Bell,
  ChevronDown,
  LayoutDashboard,
  LogOut,
  Menu,
  Shield,
  User,
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
    <div className="flex min-h-screen bg-[var(--portal-bg)] text-[var(--ink)] antialiased">
      <a
        href="#portal-main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-[var(--radius-sm)] focus:bg-[var(--brand-royal)] focus:px-4 focus:py-2 focus:text-white"
      >
        Skip to portal content
      </a>

      {/* Desktop Sidebar (240px) */}
      <aside className="hidden lg:flex w-60 flex-col justify-between border-r border-[var(--line-control)] bg-[var(--portal-surface)] p-4">
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-[var(--line-control)] pb-4">
            <Link href="/" aria-label="Tech Groww Home">
              <TechGrowwLogo variant="portal" size="sm" />
            </Link>
          </div>

          {/* Portal Switcher */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setSwitcherOpen((v) => !v)}
              className="flex w-full items-center justify-between rounded-[var(--radius-sm)] border border-[var(--line-control)] bg-stone-50 px-3 py-2 text-left text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] hover:bg-stone-100"
              aria-expanded={switcherOpen}
              aria-label="Switch portal view"
            >
              <span className="truncate">{PORTAL_LABELS[portal].name}</span>
              <ChevronDown className="h-4 w-4 text-[var(--text-muted)]" />
            </button>

            {switcherOpen && accessiblePortals.length > 1 && (
              <div
                role="menu"
                className="absolute top-full left-0 z-30 mt-1 w-full rounded-[var(--radius-sm)] border border-[var(--line-control)] bg-white py-1 shadow-md"
              >
                {accessiblePortals.map((p) => (
                  <Link
                    key={p}
                    href={PORTAL_LABELS[p].href}
                    onClick={() => setSwitcherOpen(false)}
                    className={`block px-3 py-2 text-xs font-medium ${
                      p === portal
                        ? "bg-blue-50 font-semibold text-[var(--brand-royal)]"
                        : "text-[var(--ink)] hover:bg-stone-50"
                    }`}
                  >
                    {PORTAL_LABELS[p].name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1" aria-label="Portal Navigation">
            {navItems.map((item) => {
              const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
              const Icon = item.icon || LayoutDashboard;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-between rounded-[var(--radius-sm)] px-3 py-2 text-sm font-medium transition-colors ${
                    active
                      ? "bg-[var(--brand-royal)] text-white shadow-xs"
                      : "text-[var(--text-muted)] hover:bg-stone-100 hover:text-[var(--ink)]"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="h-4 w-4 shrink-0" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
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
        <div className="border-t border-[var(--line-control)] pt-4 space-y-3">
          <div className="flex items-center gap-2 px-1">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-stone-100 font-mono-tech text-xs font-bold text-[var(--ink)]">
              {user.fullName.slice(0, 2).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold text-[var(--ink)]">{user.fullName}</p>
              <p className="truncate text-[11px] text-[var(--text-muted)]">{user.email}</p>
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
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Header */}
        <header className="flex h-16 items-center justify-between border-b border-[var(--line-control)] bg-[var(--portal-surface)] px-4 lg:px-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileMenuOpen((v) => !v)}
              className="lg:hidden rounded-[var(--radius-sm)] p-2 text-stone-600 hover:bg-stone-100"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
            <h1 className="font-display text-lg font-bold text-[var(--ink)]">{title}</h1>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/notifications"
              className="relative rounded-full p-2 text-[var(--text-muted)] hover:bg-stone-100 hover:text-[var(--ink)]"
              aria-label="View notifications"
            >
              <Bell className="h-4 w-4" />
            </Link>

            <div className="hidden sm:flex items-center gap-2 border-l border-[var(--line-control)] pl-4">
              <span className="rounded-full bg-stone-100 px-2 py-0.5 font-mono-tech text-[10px] font-semibold uppercase text-stone-700">
                {user.roles[0]?.replace(/_/g, " ")}
              </span>
            </div>
          </div>
        </header>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-b border-[var(--line-control)] bg-[var(--portal-surface)] p-4 space-y-3">
            <nav className="space-y-1">
              {navItems.map((item) => {
                const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
                const Icon = item.icon || LayoutDashboard;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center justify-between rounded-[var(--radius-sm)] px-3 py-2 text-sm font-medium ${
                      active
                        ? "bg-[var(--brand-royal)] text-white"
                        : "text-[var(--text-muted)] hover:bg-stone-100"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </div>
                  </Link>
                );
              })}
            </nav>

            <button
              type="button"
              onClick={handleSignOut}
              className="flex w-full items-center gap-2 rounded-[var(--radius-sm)] px-3 py-2 text-sm font-medium text-rose-700 hover:bg-rose-50"
            >
              <LogOut className="h-4 w-4" />
              <span>Sign Out</span>
            </button>
          </div>
        )}

        {/* Portal Body */}
        <main id="portal-main" className="flex-1 overflow-y-auto p-4 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
