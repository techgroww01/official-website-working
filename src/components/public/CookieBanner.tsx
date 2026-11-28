"use client";

import React, { useEffect, useSyncExternalStore } from "react";
import Link from "next/link";

const CONSENT_COOKIE_KEY = "tg_cookie_consent_v1";
const CONSENT_EVENT = "tg-cookie-consent-updated";

function subscribeConsent(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(CONSENT_EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(CONSENT_EVENT, callback);
  };
}

function getConsentSnapshot(): string {
  try {
    return localStorage.getItem(CONSENT_COOKIE_KEY) ?? "unset";
  } catch {
    return "unset";
  }
}

function getServerConsentSnapshot(): string {
  return "server";
}

function injectGa4(id: string) {
  if (!id || document.getElementById("tg-ga4-script")) return;
  const script = document.createElement("script");
  script.id = "tg-ga4-script";
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`;
  document.head.appendChild(script);
}

export function CookieBanner({ gaMeasurementId }: { gaMeasurementId?: string }) {
  const consent = useSyncExternalStore(
    subscribeConsent,
    getConsentSnapshot,
    getServerConsentSnapshot
  );

  useEffect(() => {
    if (consent === "analytics" && gaMeasurementId) {
      injectGa4(gaMeasurementId);
    }
  }, [consent, gaMeasurementId]);

  function handleChoice(choice: "essential" | "analytics") {
    try {
      localStorage.setItem(CONSENT_COOKIE_KEY, choice);
      if (choice === "analytics" && gaMeasurementId) {
        injectGa4(gaMeasurementId);
      }
      window.dispatchEvent(new Event(CONSENT_EVENT));
    } catch {
      // Ignore storage failures
    }
  }

  if (consent !== "unset") return null;

  return (
    <aside
      aria-label="Cookie consent notice"
      className="surface-light fixed bottom-4 left-4 right-4 z-[70] mx-auto max-w-2xl rounded-[var(--radius-md)] border border-[var(--line-control)] bg-[var(--paper-elevated)] p-5 shadow-xl"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <p className="text-sm font-semibold text-[var(--ink)]">Privacy & Cookie Preferences</p>
          <p className="text-xs leading-relaxed text-[var(--text-muted)]">
            Strictly necessary session cookies keep portals secure. Analytics remain disabled unless
            you opt in.{" "}
            <Link href="/cookies" className="text-[var(--brand-link)] underline">
              Cookie Policy
            </Link>
            .
          </p>
        </div>
        <div className="flex flex-shrink-0 items-center gap-2.5">
          <button
            type="button"
            onClick={() => handleChoice("essential")}
            className="min-h-[44px] rounded-[var(--radius-pill)] border border-[var(--line-control)] bg-white px-4 py-2 text-xs font-semibold text-[var(--ink)] hover:bg-slate-50"
          >
            Essential only
          </button>
          <button
            type="button"
            onClick={() => handleChoice("analytics")}
            className="min-h-[44px] rounded-[var(--radius-pill)] bg-[var(--brand-royal)] px-4 py-2 text-xs font-semibold text-white hover:bg-[#1e40af]"
          >
            Allow analytics
          </button>
        </div>
      </div>
    </aside>
  );
}
