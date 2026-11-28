"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { TechGrowwLogo } from "@/components/brand/TechGrowwLogo";

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
        <div className="mb-6 flex items-center justify-between">
          <Link href="/" aria-label="Tech Groww Home">
            <TechGrowwLogo variant="portal" size="md" />
          </Link>
          <span className="rounded-full bg-blue-50 px-2.5 py-1 font-mono-tech text-xs font-semibold text-[var(--brand-royal)]">
            Security
          </span>
        </div>

        <h1 className="font-display text-2xl font-bold tracking-tight text-[var(--ink)]">
          Set New Password
        </h1>
        <p className="mt-1 text-sm text-[var(--text-muted)]">
          Choose a secure password of at least 12 characters.
        </p>

        {errorMsg && (
          <div role="alert" className="mt-4 rounded-[var(--radius-sm)] border border-rose-200 bg-rose-50 p-3 text-xs text-rose-800">
            {errorMsg}
          </div>
        )}

        {success ? (
          <div className="mt-6 rounded-[var(--radius-sm)] border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
            Password updated successfully. Redirecting to sign in...
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label htmlFor="password" className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                New Password
              </label>
              <input
                id="password"
                type="password"
                required
                minLength={12}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full rounded-[var(--radius-sm)] border border-[var(--line-control)] bg-white px-3 py-2 text-sm text-[var(--ink)] focus:border-[var(--brand-royal)] focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                Confirm New Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                required
                minLength={12}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="mt-1 block w-full rounded-[var(--radius-sm)] border border-[var(--line-control)] bg-white px-3 py-2 text-sm text-[var(--ink)] focus:border-[var(--brand-royal)] focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="flex w-full min-h-[44px] items-center justify-center rounded-[var(--radius-sm)] bg-[var(--brand-royal)] px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-800 disabled:opacity-50"
            >
              {submitting ? "Updating..." : "Update Password"}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
