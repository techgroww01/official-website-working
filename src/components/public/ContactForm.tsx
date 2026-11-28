"use client";

import React, { useState } from "react";
import Link from "next/link";

interface ContactFormProps {
  defaultService?: string;
}

const SERVICE_OPTIONS = [
  { slug: "web-mobile-engineering", label: "Custom Web & Mobile Engineering" },
  { slug: "salesforce-solutions", label: "Salesforce Ecosystem (Admin / OmniStudio)" },
  { slug: "ui-ux-design", label: "UI/UX & Product Design" },
  { slug: "enterprise-software", label: "Enterprise Software Development" },
  { slug: "it-consulting", label: "IT Consulting & Discovery" },
  { slug: "digital-marketing-seo", label: "Digital Marketing & SEO Visibility" },
];

export function ContactForm({ defaultService = "web-mobile-engineering" }: ContactFormProps) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [service, setService] = useState(
    SERVICE_OPTIONS.some((o) => o.slug === defaultService)
      ? defaultService
      : "web-mobile-engineering"
  );
  const [budget, setBudget] = useState("undecided");
  const [preferredChannel, setPreferredChannel] = useState("email");
  const [message, setMessage] = useState("");
  const [privacyConsent, setPrivacyConsent] = useState(false);
  const [honeypot, setHoneypot] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ ok: boolean; text: string } | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!privacyConsent) {
      setFeedback({ ok: false, text: "Please confirm the DPDP privacy notice before submitting." });
      return;
    }

    setSubmitting(true);
    setFeedback(null);

    try {
      const res = await fetch("/api/v1/public/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          email,
          phone: phone || undefined,
          company: company || undefined,
          service,
          budget,
          preferredChannel,
          message,
          privacyConsent: true,
          websiteUrl: honeypot, // Honeypot
          turnstileToken: "client-submitted",
        }),
      });

      const json = (await res.json()) as {
        ok?: boolean;
        data?: { enquiryId?: string; delivered?: boolean; fallbackMode?: boolean };
        error?: { message?: string };
      };

      if (!res.ok || !json.ok) {
        setFeedback({
          ok: false,
          text: json.error?.message || "Unable to submit inquiry right now. Please email contact@techgroww.co.in.",
        });
      } else {
        const text = json.data?.delivered
          ? "Inquiry received and notification dispatched — our team will respond promptly."
          : "Inquiry recorded in our Sales Inbox. If email alerts are running in staging/demo mode, please also copy contact@techgroww.co.in.";
        setFeedback({ ok: true, text });
        setFullName("");
        setEmail("");
        setPhone("");
        setCompany("");
        setMessage("");
      }
    } catch {
      setFeedback({
        ok: false,
        text: "Network error submitting form. Reach us directly at contact@techgroww.co.in.",
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 rounded-[var(--radius-lg)] border border-[var(--line-control)] bg-white p-7 sm:p-9">
      {/* Honeypot trap hidden from assistive tech */}
      <div className="sr-only" aria-hidden="true">
        <label htmlFor="contact-website-hp">Leave empty</label>
        <input
          id="contact-website-hp"
          tabIndex={-1}
          autoComplete="off"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="contact-name" className="block text-sm font-semibold text-[var(--ink)]">
            Full Name *
          </label>
          <input
            id="contact-name"
            type="text"
            required
            minLength={2}
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="mt-1.5 min-h-[44px] w-full rounded-[var(--radius-sm)] border border-[var(--line-control)] bg-[var(--paper-elevated)] px-3.5 text-sm text-[var(--ink)]"
          />
        </div>
        <div>
          <label htmlFor="contact-email" className="block text-sm font-semibold text-[var(--ink)]">
            Work Email *
          </label>
          <input
            id="contact-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1.5 min-h-[44px] w-full rounded-[var(--radius-sm)] border border-[var(--line-control)] bg-[var(--paper-elevated)] px-3.5 text-sm text-[var(--ink)]"
          />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="contact-phone" className="block text-sm font-semibold text-[var(--ink)]">
            Phone / WhatsApp (Optional)
          </label>
          <input
            id="contact-phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="mt-1.5 min-h-[44px] w-full rounded-[var(--radius-sm)] border border-[var(--line-control)] bg-[var(--paper-elevated)] px-3.5 text-sm text-[var(--ink)]"
          />
        </div>
        <div>
          <label htmlFor="contact-company" className="block text-sm font-semibold text-[var(--ink)]">
            Company / Organization
          </label>
          <input
            id="contact-company"
            type="text"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            className="mt-1.5 min-h-[44px] w-full rounded-[var(--radius-sm)] border border-[var(--line-control)] bg-[var(--paper-elevated)] px-3.5 text-sm text-[var(--ink)]"
          />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-3">
        <div>
          <label htmlFor="contact-service" className="block text-sm font-semibold text-[var(--ink)]">
            Primary Discipline *
          </label>
          <select
            id="contact-service"
            value={service}
            onChange={(e) => setService(e.target.value)}
            className="mt-1.5 min-h-[44px] w-full rounded-[var(--radius-sm)] border border-[var(--line-control)] bg-[var(--paper-elevated)] px-3 text-sm text-[var(--ink)]"
          >
            {SERVICE_OPTIONS.map((opt) => (
              <option key={opt.slug} value={opt.slug}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="contact-budget" className="block text-sm font-semibold text-[var(--ink)]">
            Scope Budget Bracket
          </label>
          <select
            id="contact-budget"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            className="mt-1.5 min-h-[44px] w-full rounded-[var(--radius-sm)] border border-[var(--line-control)] bg-[var(--paper-elevated)] px-3 text-sm text-[var(--ink)]"
          >
            <option value="undecided">Evaluating scope</option>
            <option value="under_2l">Starter MVP / Audit</option>
            <option value="2l_10l">Standard Product / CRM</option>
            <option value="enterprise">Enterprise Multi-Portal</option>
          </select>
        </div>

        <div>
          <label htmlFor="contact-channel" className="block text-sm font-semibold text-[var(--ink)]">
            Preferred Channel
          </label>
          <select
            id="contact-channel"
            value={preferredChannel}
            onChange={(e) => setPreferredChannel(e.target.value)}
            className="mt-1.5 min-h-[44px] w-full rounded-[var(--radius-sm)] border border-[var(--line-control)] bg-[var(--paper-elevated)] px-3 text-sm text-[var(--ink)]"
          >
            <option value="email">Email</option>
            <option value="call">Video / Call</option>
            <option value="whatsapp">WhatsApp</option>
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="contact-message" className="block text-sm font-semibold text-[var(--ink)]">
          Project Scope &amp; Constraints *
        </label>
        <textarea
          id="contact-message"
          rows={5}
          required
          minLength={15}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Describe what bottleneck you are solving, key users/integrations, and ideal timeline..."
          className="mt-1.5 w-full rounded-[var(--radius-sm)] border border-[var(--line-control)] bg-[var(--paper-elevated)] p-3.5 text-sm text-[var(--ink)]"
        />
      </div>

      <label className="flex items-start gap-3 text-sm text-[var(--text-muted)] cursor-pointer">
        <input
          type="checkbox"
          required
          checked={privacyConsent}
          onChange={(e) => setPrivacyConsent(e.target.checked)}
          className="mt-1 h-4 w-4 accent-[var(--brand-royal)]"
        />
        <span>
          I consent to Tech Groww processing this inquiry strictly for scoping response per the{" "}
          <Link href="/privacy" className="font-medium text-[var(--brand-link)] underline">
            Privacy Policy
          </Link>
          .
        </span>
      </label>

      <button
        type="submit"
        disabled={submitting}
        className="min-h-[48px] rounded-[var(--radius-pill)] bg-[var(--brand-royal)] px-8 py-3 text-sm font-semibold text-white hover:bg-[#1e40af] disabled:opacity-60"
      >
        {submitting ? "Sending Inquiry..." : "Submit Scoped Inquiry"}
      </button>

      {feedback && (
        <div
          role="status"
          aria-live="polite"
          className={`rounded-[var(--radius-sm)] border p-4 text-sm font-medium ${
            feedback.ok
              ? "border-[var(--status-success)] bg-emerald-50 text-[var(--status-success)]"
              : "border-[var(--status-danger)] bg-rose-50 text-[var(--status-danger)]"
          }`}
        >
          {feedback.text}
        </div>
      )}
    </form>
  );
}
