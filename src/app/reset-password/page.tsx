"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { TechGrowwLogo } from "@/components/brand/TechGrowwLogo";
import { ArcSpinner } from "@/components/portal/PortalLoading";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password.length < 12) {
      setErrorMsg("Password must be at least 12 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match.");
      return;
    }

    setSubmitting(true);
    setErrorMsg(null);

    try {
      const res = await fetch("/api/v1/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const json = (await res.json()) as { ok?: boolean; error?: { message?: string } };
      if (!res.ok || !json.ok) {
        setErrorMsg(json.error?.message || "Failed to update password.");
      } else {
        setSuccess(true);
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      }
    } catch {
      setErrorMsg("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main
      id="main"
      className="surface-light flex min-h-screen flex-col items-center justify-center bg-[var(--portal-bg)] px-4 py-12"
    >
      <div className="w-full max-w-md rounded-[var(--radius-lg)] border border-[var(--line-control)] bg-[var(--portal-surface)] p-8 shadow-sm">
        <div className="mb-8 flex items-center justify-between">
          <Link href="/" aria-label="Tech Groww Home">
            <TechGrowwLogo variant="portal" size="md" />
          </Link>
          <span className="eyebrow text-[var(--text-muted)]">Security</span>
        </div>

        <h1 className="font-display text-2xl font-bold tracking-tight text-[var(--ink)]">
          Set New Password
        </h1>
        <p className="mt-1.5 text-sm text-[var(--text-muted)]">
          Choose a secure password of at least 12 characters.
        </p>

        {errorMsg && (
          <div
            role="alert"
            className="mt-4 rounded-[var(--radius-sm)] border border-rose-200 bg-rose-50 p-3 text-xs font-medium text-[var(--status-danger)]"
          >
            {errorMsg}
          </div>
        )}

        {success ? (
          <div className="mt-6 rounded-[var(--radius-sm)] border border-emerald-200 bg-emerald-50 p-4 text-sm font-medium text-[var(--status-success)]">
            Password updated successfully. Redirecting to sign in...
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-[var(--ink)]"
              >
                New Password
              </label>
              <input
                id="password"
                type="password"
                required
                minLength={12}
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1.5 block min-h-[44px] w-full rounded-[var(--radius-sm)] border border-[var(--line-control)] bg-white px-3.5 text-sm text-[var(--ink)]"
              />
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-semibold text-[var(--ink)]"
              >
                Confirm New Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                required
                minLength={12}
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="mt-1.5 block min-h-[44px] w-full rounded-[var(--radius-sm)] border border-[var(--line-control)] bg-white px-3.5 text-sm text-[var(--ink)]"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-[var(--radius-pill)] bg-[var(--brand-royal)] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#1e40af] disabled:opacity-60"
            >
              {submitting && <ArcSpinner size="sm" label="Updating password" />}
              <span>{submitting ? "Updating..." : "Update Password"}</span>
            </button>
          </form>
        )}

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
