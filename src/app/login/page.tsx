"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { TechGrowwLogo } from "@/components/brand/TechGrowwLogo";
import { createBrowserSupabaseClient, isSupabasePublicConfigured } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleEmailLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await fetch("/api/v1/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, turnstileToken: "client-submitted" }),
      });
      const json = (await res.json()) as {
        ok?: boolean;
        data?: { redirectTo?: string };
        error?: { message?: string };
      };
      if (!res.ok || !json.ok) {
        setErrorMsg(json.error?.message || "Invalid credentials or inactive account.");
      } else {
        router.push(json.data?.redirectTo || "/admin");
        router.refresh();
      }
    } catch {
      setErrorMsg("Unable to reach authentication service.");
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleWorkspace() {
    if (!isSupabasePublicConfigured()) {
      setErrorMsg("Supabase Auth is not configured in local environment (.env.local).");
      return;
    }
    const supabase = createBrowserSupabaseClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: { hd: "techgroww.co.in", prompt: "select_account" },
      },
    });
    if (error) {
      setErrorMsg(error.message);
    }
  }

  return (
    <main
      id="main"
      className="surface-light flex min-h-screen flex-col items-center justify-center bg-[var(--portal-bg)] px-4 py-12"
    >
      <div className="w-full max-w-md rounded-[var(--radius-lg)] border border-[var(--line-control)] bg-[var(--portal-surface)] p-8 shadow-sm">
        <div className="mb-8 flex items-center justify-between">
          <Link href="/" aria-label="Back to Tech Groww public site">
            <TechGrowwLogo variant="portal" size="md" />
          </Link>
          <span className="eyebrow text-[var(--text-muted)]">Portal Sign In</span>
        </div>

        <h1 className="font-display text-2xl font-bold text-[var(--ink)]">
          Sign in to Tech Groww
        </h1>
        <p className="mt-1.5 text-sm text-[var(--text-muted)]">
          Unified sign-in for Staff (`@techgroww.co.in`), Client, and Intern portals.
        </p>

        <button
          type="button"
          onClick={handleGoogleWorkspace}
          className="mt-6 flex min-h-[44px] w-full items-center justify-center gap-2 rounded-[var(--radius-sm)] border border-[var(--line-control)] bg-white px-4 py-2.5 text-sm font-semibold text-[var(--ink)] hover:bg-slate-50"
        >
          Continue with Google Workspace (@techgroww.co.in)
        </button>

        <div className="my-6 flex items-center gap-3 text-xs text-[var(--text-muted)]">
          <div className="h-px flex-1 bg-[var(--line)]" />
          <span>OR EMAIL &amp; PASSWORD</span>
          <div className="h-px flex-1 bg-[var(--line)]" />
        </div>

        <form onSubmit={handleEmailLogin} className="space-y-4">
          <div>
            <label htmlFor="login-email" className="block text-sm font-semibold text-[var(--ink)]">
              Email Address
            </label>
            <input
              id="login-email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1.5 min-h-[44px] w-full rounded-[var(--radius-sm)] border border-[var(--line-control)] bg-white px-3.5 text-sm"
            />
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="login-password"
                className="block text-sm font-semibold text-[var(--ink)]"
              >
                Password
              </label>
              <Link
                href="/forgot-password"
                className="text-xs font-medium text-[var(--brand-link)] hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            {/* Paste & password managers explicitly enabled (WCAG 2.2 SC 3.3.8) */}
            <input
              id="login-password"
              type="password"
              required
              minLength={12}
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1.5 min-h-[44px] w-full rounded-[var(--radius-sm)] border border-[var(--line-control)] bg-white px-3.5 text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="min-h-[44px] w-full rounded-[var(--radius-pill)] bg-[var(--brand-royal)] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#1e40af] disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>

          {errorMsg && (
            <p role="alert" className="text-xs font-medium text-[var(--status-danger)]">
              {errorMsg}
            </p>
          )}
        </form>
      </div>
    </main>
  );
}
