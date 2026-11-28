"use client";

import React, { useState } from "react";
import Link from "next/link";

export function ApplicationForm({ postingId, roleTitle }: { postingId: string; roleTitle: string }) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [coverNote, setCoverNote] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [privacyConsent, setPrivacyConsent] = useState(false);
  const [talentPoolConsent, setTalentPoolConsent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ ok: boolean; text: string; statusToken?: string } | null>(
    null
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file) {
      setFeedback({ ok: false, text: "Please attach your resume (PDF or DOCX, <= 5 MB)." });
      return;
    }
    if (!privacyConsent) {
      setFeedback({ ok: false, text: "Privacy consent is required to process your application." });
      return;
    }

    setSubmitting(true);
    setFeedback(null);

    try {
      // 1. Request Turnstile-verified upload intent (server generates UUID path + uploadCommitToken)
      const intentRes = await fetch("/api/v1/public/applications/upload-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          postingId,
          filename: file.name,
          mimeType: file.type || "application/pdf",
          byteSize: file.size,
          turnstileToken: "client-submitted",
        }),
      });
      const intentJson = (await intentRes.json()) as {
        ok?: boolean;
        data?: { uploadUrl?: string | null; uploadCommitToken?: string; demoMode?: boolean };
        error?: { message?: string };
      };

      if (!intentRes.ok || !intentJson.ok || !intentJson.data?.uploadCommitToken) {
        setFeedback({ ok: false, text: intentJson.error?.message || "File validation failed." });
        setSubmitting(false);
        return;
      }

      // 2. PUT direct to signed Supabase Storage URL when active
      if (intentJson.data.uploadUrl) {
        const putRes = await fetch(intentJson.data.uploadUrl, {
          method: "PUT",
          headers: { "Content-Type": file.type || "application/pdf" },
          body: file,
        });
        if (!putRes.ok) {
          setFeedback({ ok: false, text: "Resume binary upload failed. Please retry." });
          setSubmitting(false);
          return;
        }
      }

      // 3. Atomic application creation & inline server magic-byte/DOCX inspection
      const submitRes = await fetch("/api/v1/public/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          postingId,
          fullName,
          email,
          phone,
          linkedinUrl: linkedinUrl || undefined,
          coverNote,
          uploadCommitToken: intentJson.data.uploadCommitToken,
          privacyConsent: true,
          talentPoolConsent,
          turnstileToken: "client-submitted",
        }),
      });

      const submitJson = (await submitRes.json()) as {
        ok?: boolean;
        data?: { applicationId?: string; statusLookupToken?: string };
        error?: { message?: string };
      };

      if (!submitRes.ok || !submitJson.ok) {
        setFeedback({
          ok: false,
          text: submitJson.error?.message || "Unable to submit application.",
        });
      } else {
        setFeedback({
          ok: true,
          text: `Application for ${roleTitle} submitted securely.`,
          statusToken: submitJson.data?.statusLookupToken,
        });
        setFullName("");
        setEmail("");
        setPhone("");
        setLinkedinUrl("");
        setCoverNote("");
        setFile(null);
      }
    } catch {
      setFeedback({ ok: false, text: "Network error submitting application." });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 rounded-[var(--radius-lg)] border border-[var(--line-control)] bg-white p-7"
    >
      <h2 className="font-display text-2xl font-bold text-[var(--ink)]">
        Apply for {roleTitle}
      </h2>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="app-name" className="block text-sm font-semibold text-[var(--ink)]">
            Full Name *
          </label>
          <input
            id="app-name"
            type="text"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="mt-1.5 min-h-[44px] w-full rounded-[var(--radius-sm)] border border-[var(--line-control)] bg-[var(--paper-elevated)] px-3.5 text-sm"
          />
        </div>
        <div>
          <label htmlFor="app-email" className="block text-sm font-semibold text-[var(--ink)]">
            Email Address *
          </label>
          <input
            id="app-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1.5 min-h-[44px] w-full rounded-[var(--radius-sm)] border border-[var(--line-control)] bg-[var(--paper-elevated)] px-3.5 text-sm"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="app-phone" className="block text-sm font-semibold text-[var(--ink)]">
            Phone Number *
          </label>
          <input
            id="app-phone"
            type="tel"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="mt-1.5 min-h-[44px] w-full rounded-[var(--radius-sm)] border border-[var(--line-control)] bg-[var(--paper-elevated)] px-3.5 text-sm"
          />
        </div>
        <div>
          <label htmlFor="app-linkedin" className="block text-sm font-semibold text-[var(--ink)]">
            LinkedIn / Portfolio URL
          </label>
          <input
            id="app-linkedin"
            type="url"
            placeholder="https://linkedin.com/in/..."
            value={linkedinUrl}
            onChange={(e) => setLinkedinUrl(e.target.value)}
            className="mt-1.5 min-h-[44px] w-full rounded-[var(--radius-sm)] border border-[var(--line-control)] bg-[var(--paper-elevated)] px-3.5 text-sm"
          />
        </div>
      </div>

      <div>
        <label htmlFor="app-resume" className="block text-sm font-semibold text-[var(--ink)]">
          Resume (PDF or DOCX, max 5 MB; SVG banned) *
        </label>
        <input
          id="app-resume"
          type="file"
          required
          accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          className="mt-1.5 block min-h-[44px] w-full rounded-[var(--radius-sm)] border border-[var(--line-control)] bg-[var(--paper-elevated)] p-2 text-sm"
        />
      </div>

      <div>
        <label htmlFor="app-note" className="block text-sm font-semibold text-[var(--ink)]">
          Brief Cover Note
        </label>
        <textarea
          id="app-note"
          rows={4}
          value={coverNote}
          onChange={(e) => setCoverNote(e.target.value)}
          className="mt-1.5 w-full rounded-[var(--radius-sm)] border border-[var(--line-control)] bg-[var(--paper-elevated)] p-3 text-sm"
        />
      </div>

      <div className="space-y-2.5 text-xs text-[var(--text-muted)]">
        <label className="flex items-start gap-2.5 cursor-pointer">
          <input
            type="checkbox"
            required
            checked={privacyConsent}
            onChange={(e) => setPrivacyConsent(e.target.checked)}
            className="mt-0.5 h-4 w-4 accent-[var(--brand-royal)]"
          />
          <span>
            I consent to recruitment processing and 180-day automated DPDP purge for unaccepted
            applications per the{" "}
            <Link href="/privacy" className="text-[var(--brand-link)] underline">
              Privacy Policy
            </Link>
            .
          </span>
        </label>
        <label className="flex items-start gap-2.5 cursor-pointer">
          <input
            type="checkbox"
            checked={talentPoolConsent}
            onChange={(e) => setTalentPoolConsent(e.target.checked)}
            className="mt-0.5 h-4 w-4 accent-[var(--brand-royal)]"
          />
          <span>
            Optional: Retain my profile in Tech Groww&apos;s future-role talent pool beyond 180 days.
          </span>
        </label>
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="min-h-[48px] rounded-[var(--radius-pill)] bg-[var(--brand-royal)] px-8 py-3 text-sm font-semibold text-white hover:bg-[#1e40af] disabled:opacity-60"
      >
        {submitting ? "Uploading & Submitting..." : "Submit Application"}
      </button>

      {feedback && (
        <div
          role="status"
          aria-live="polite"
          className={`rounded-[var(--radius-sm)] border p-4 text-sm ${
            feedback.ok
              ? "border-[var(--status-success)] bg-emerald-50 text-[var(--status-success)]"
              : "border-[var(--status-danger)] bg-rose-50 text-[var(--status-danger)]"
          }`}
        >
          <p className="font-medium">{feedback.text}</p>
          {feedback.statusToken && (
            <p className="mt-2 text-xs">
              Save your private status link:{" "}
              <Link
                href={`/careers/status?token=${encodeURIComponent(feedback.statusToken)}`}
                className="font-semibold underline"
              >
                Track application status
              </Link>
            </p>
          )}
        </div>
      )}
    </form>
  );
}
