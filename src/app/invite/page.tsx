"use client";

import React, { useState } from "react";
import Link from "next/link";
import { TechGrowwLogo } from "@/components/brand/TechGrowwLogo";

export default function InviteAcceptPage() {
  const [token, setToken] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<{ ok: boolean; msg: string } | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleAccept(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    try {
      const urlToken = new URLSearchParams(window.location.search).get("token") || token;
      const res = await fetch("/api/v1/invitations/accept", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: urlToken, fullName, password }),
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
    <main className="surface-light flex min-h-screen items-center justify-center bg-[var(--portal-bg)] px-4">
      <div className="w-full max-w-md rounded-[var(--radius-lg)] border border-[var(--line-control)] bg-white p-8">
        <TechGrowwLogo variant="portal" size="md" />
        <h1 className="font-display mt-6 text-2xl font-bold text-[var(--ink)]">
          Accept Portal Invitation
        </h1>
        <p className="mt-1.5 text-sm text-[var(--text-muted)]">
          Single-use 72-hour tokenized onboarding. Minimum 12-character password required.
        </p>

        <form onSubmit={handleAccept} className="mt-6 space-y-4">
          <div>
            <label htmlFor="inv-token" className="block text-sm font-semibold">
              Invite Token (if not in URL)
            </label>
            <input
              id="inv-token"
              type="text"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="Paste token from email if needed"
              className="mt-1 min-h-[44px] w-full rounded-[var(--radius-sm)] border border-[var(--line-control)] px-3 text-sm"
            />
          </div>
          <div>
            <label htmlFor="inv-name" className="block text-sm font-semibold">
              Full Name
            </label>
            <input
              id="inv-name"
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="mt-1 min-h-[44px] w-full rounded-[var(--radius-sm)] border border-[var(--line-control)] px-3 text-sm"
            />
          </div>
          <div>
            <label htmlFor="inv-pass" className="block text-sm font-semibold">
              Set Password (12+ chars)
            </label>
            <input
              id="inv-pass"
              type="password"
              required
              minLength={12}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 min-h-[44px] w-full rounded-[var(--radius-sm)] border border-[var(--line-control)] px-3 text-sm"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="min-h-[44px] w-full rounded-[var(--radius-pill)] bg-[var(--brand-royal)] px-5 py-2.5 text-sm font-semibold text-white"
          >
            {loading ? "Activating..." : "Activate Account"}
          </button>
          {status && (
            <p className={`text-xs font-medium ${status.ok ? "text-[var(--status-success)]" : "text-[var(--status-danger)]"}`}>
              {status.msg}{" "}
              {status.ok && (
                <Link href="/login" className="underline">
                  Go to Sign In
                </Link>
              )}
            </p>
          )}
        </form>
      </div>
    </main>
  );
}
