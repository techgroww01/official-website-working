"use client";

import React, { useState } from "react";
import Link from "next/link";
import { TechGrowwLogo } from "@/components/brand/TechGrowwLogo";
import { ArcSpinner } from "@/components/portal/PortalLoading";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await fetch("/api/v1/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, turnstileToken: "client-submitted" }),
      });
      const json = (await res.json()) as {
        ok?: boolean;
        error?: { message?: string };
      };
      if (!res.ok || !json.ok) {
        setErrorMsg(json.error?.message || "Unable to process password recovery request.");
      } else {
        setSent(true);
      }
    } catch {
      setErrorMsg("Unable to reach recovery service. Please try again.");
    } finally {
      setLoading(false);
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
          <span className="eyebrow text-[var(--text-muted)]">Recovery</span>
        </div>

        <h1 className="font-display text-2xl font-bold text-[var(--ink)]">
          Password Recovery
        </h1>
        <p className="mt-1.5 text-sm text-[var(--text-muted)]">
          If an active account exists for your email, a recovery link will be dispatched.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="fp-email" className="block text-sm font-semibold text-[var(--ink)]">
              Account Email
            </label>
            <input
              id="fp-email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1.5 min-h-[44px] w-full rounded-[var(--radius-sm)] border border-[var(--line-control)] bg-white px-3.5 text-sm text-[var(--ink)]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-[var(--radius-pill)] bg-[var(--brand-royal)] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#1e40af] disabled:opacity-60"
          >
            {loading && <ArcSpinner size="sm" label="Sending recovery link" />}
            <span>{loading ? "Sending..." : "Send Recovery Link"}</span>
          </button>

          {errorMsg && (
            <p role="alert" className="text-xs font-medium text-[var(--status-danger)]">
              {errorMsg}
            </p>
          )}

          {sent && (
            <p className="rounded-[var(--radius-sm)] border border-emerald-200 bg-emerald-50 p-3 text-xs font-medium text-[var(--status-success)]">
              Request processed. If an active account matches that email, check your inbox for the reset link.
            </p>
          )}
        </form>

        <div className="mt-6 flex items-center justify-between border-t border-[var(--line)] pt-4 text-xs text-[var(--text-muted)]">
          <Link href="/login" className="font-semibold text-[var(--brand-link)] hover:underline">
            Back to Sign In
          </Link>
          <Link href="/" className="font-medium text-[var(--brand-link)] hover:underline">
            Back to website
          </Link>
        </div>
      </div>
    </main>
  );
}
