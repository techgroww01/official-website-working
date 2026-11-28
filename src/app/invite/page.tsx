"use client";

import React, { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { TechGrowwLogo } from "@/components/brand/TechGrowwLogo";
import { ArcSpinner } from "@/components/portal/PortalLoading";

function InviteAcceptForm() {
  const searchParams = useSearchParams();
  const queryToken = searchParams.get("token") ?? "";

  const [token, setToken] = useState(queryToken);
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<{ ok: boolean; msg: string } | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (queryToken) {
      setToken(queryToken);
    }
  }, [queryToken]);

  async function handleAccept(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    try {
      const resolvedToken = queryToken || token;
      const res = await fetch("/api/v1/invitations/accept", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: resolvedToken, fullName, password }),
      });
      const json = (await res.json()) as { ok?: boolean; error?: { message?: string } };
      if (!res.ok || !json.ok) {
        setStatus({ ok: false, msg: json.error?.message || "Invalid or expired invitation." });
      } else {
        setStatus({ ok: true, msg: "Account activated cleanly. You may now sign in." });
      }
    } catch {
      setStatus({ ok: false, msg: "Network error accepting invite." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md rounded-[var(--radius-lg)] border border-[var(--line-control)] bg-[var(--portal-surface)] p-8 shadow-sm">
      <div className="mb-8 flex items-center justify-between">
        <Link href="/" aria-label="Back to Tech Groww public site">
          <TechGrowwLogo variant="portal" size="md" />
        </Link>
        <span className="eyebrow text-[var(--text-muted)]">Invitation</span>
      </div>

      <h1 className="font-display text-2xl font-bold text-[var(--ink)]">
        Accept Portal Invitation
      </h1>
      <p className="mt-1.5 text-sm text-[var(--text-muted)]">
        Single-use 72-hour tokenized onboarding. Minimum 12-character password required.
      </p>

      {queryToken && (
        <div className="mt-4 rounded-[var(--radius-sm)] border border-sky-200 bg-sky-50 px-3.5 py-2 text-xs font-medium text-sky-900">
          Invitation token detected from your onboarding link.
        </div>
      )}

      <form onSubmit={handleAccept} className="mt-6 space-y-4">
        <div>
          <label htmlFor="inv-token" className="block text-sm font-semibold text-[var(--ink)]">
            Invite Token {queryToken ? "(from URL)" : "(if not in URL)"}
          </label>
          <input
            id="inv-token"
            type="text"
            required
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="Paste token from email if needed"
            className="mt-1.5 min-h-[44px] w-full rounded-[var(--radius-sm)] border border-[var(--line-control)] bg-white px-3.5 font-mono-tech text-xs text-[var(--ink)]"
          />
        </div>
        <div>
          <label htmlFor="inv-name" className="block text-sm font-semibold text-[var(--ink)]">
            Full Name
          </label>
          <input
            id="inv-name"
            type="text"
            required
            autoComplete="name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="mt-1.5 min-h-[44px] w-full rounded-[var(--radius-sm)] border border-[var(--line-control)] bg-white px-3.5 text-sm text-[var(--ink)]"
          />
        </div>
        <div>
          <label htmlFor="inv-pass" className="block text-sm font-semibold text-[var(--ink)]">
            Set Password (12+ chars)
          </label>
          <input
            id="inv-pass"
            type="password"
            required
            minLength={12}
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1.5 min-h-[44px] w-full rounded-[var(--radius-sm)] border border-[var(--line-control)] bg-white px-3.5 text-sm text-[var(--ink)]"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-[var(--radius-pill)] bg-[var(--brand-royal)] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#1e40af] disabled:opacity-60"
        >
          {loading && <ArcSpinner size="sm" label="Activating account" />}
          <span>{loading ? "Activating..." : "Activate Account"}</span>
        </button>

        {status && (
          <p
            role={status.ok ? "status" : "alert"}
            className={`text-xs font-medium ${
              status.ok ? "text-[var(--status-success)]" : "text-[var(--status-danger)]"
            }`}
          >
            {status.msg}{" "}
            {status.ok && (
              <Link href="/login" className="font-semibold underline">
                Go to Sign In
              </Link>
            )}
          </p>
        )}
      </form>

      <div className="mt-6 flex items-center justify-between border-t border-[var(--line)] pt-4 text-xs text-[var(--text-muted)]">
        <Link href="/login" className="font-semibold text-[var(--brand-link)] hover:underline">
          Already activated? Sign In
        </Link>
        <Link href="/" className="font-medium text-[var(--brand-link)] hover:underline">
          Back to website
        </Link>
      </div>
    </div>
  );
}

export default function InviteAcceptPage() {
  return (
    <main
      id="main"
      className="surface-light flex min-h-screen flex-col items-center justify-center bg-[var(--portal-bg)] px-4 py-12"
    >
      <Suspense
        fallback={
          <div className="w-full max-w-md rounded-[var(--radius-lg)] border border-[var(--line-control)] bg-[var(--portal-surface)] p-8 text-center text-sm text-[var(--text-muted)] shadow-sm">
            Loading invitation form...
          </div>
        }
      >
        <InviteAcceptForm />
      </Suspense>
    </main>
  );
}
