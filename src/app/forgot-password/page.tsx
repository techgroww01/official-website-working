"use client";

import React, { useState } from "react";
import Link from "next/link";
import { TechGrowwLogo } from "@/components/brand/TechGrowwLogo";
import { createBrowserSupabaseClient, isSupabasePublicConfigured } from "@/lib/supabase/client";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (isSupabasePublicConfigured()) {
      const supabase = createBrowserSupabaseClient();
      await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/login`,
      });
    }
    setSent(true);
  }

  return (
    <main className="surface-light flex min-h-screen items-center justify-center bg-[var(--portal-bg)] px-4">
      <div className="w-full max-w-md rounded-[var(--radius-lg)] border border-[var(--line-control)] bg-white p-8">
        <TechGrowwLogo variant="portal" size="md" />
        <h1 className="font-display mt-6 text-2xl font-bold text-[var(--ink)]">
          Password Recovery
        </h1>
        <p className="mt-1.5 text-sm text-[var(--text-muted)]">
          If an active account exists for your email, a recovery link will be dispatched.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="fp-email" className="block text-sm font-semibold">
              Account Email
            </label>
            <input
              id="fp-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 min-h-[44px] w-full rounded-[var(--radius-sm)] border border-[var(--line-control)] px-3 text-sm"
            />
          </div>
          <button
            type="submit"
            className="min-h-[44px] w-full rounded-[var(--radius-pill)] bg-[var(--brand-royal)] px-5 py-2.5 text-sm font-semibold text-white"
          >
            Send Recovery Link
          </button>
          {sent && (
            <p className="text-xs font-medium text-[var(--status-success)]">
              Request processed. Check your inbox or return to{" "}
              <Link href="/login" className="underline">
                Sign In
              </Link>
              .
            </p>
          )}
        </form>
      </div>
    </main>
  );
}
