"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

const FAQS = [
  {
    q: "Tech Groww was founded in 2026 — why work with a newer engineering partner?",
    a: "You get direct principal involvement from scope to deployment without account-manager middle layers or padded retainers. We compete on architectural discipline, honest communication, and clean execution.",
  },
  {
    q: "Do you handle Salesforce alongside custom web and mobile development?",
    a: "Yes. Salesforce Administration, production support, Flow automation, and OmniStudio implementations are core pillars alongside custom Next.js, React Native, and PostgreSQL engineering.",
  },
  {
    q: "How do you price projects without publishing misleading packages?",
    a: "Because enterprise software and CRM scopes vary by workflows, integrations, and security boundaries, we scope transparently through either milestone-based fixed quotes or dedicated engineering retainers after discovery.",
  },
  {
    q: "Why are items on your Work page labeled Reference Blueprint?",
    a: "We never present internal prototypes or demonstration architectures as commercial client wins. Only verified, client-approved engagements are ever labeled Client Work.",
  },
  {
    q: "How is customer and applicant data protected on portals you build?",
    a: "Every portal enforces server-side RBAC, database Row-Level Security, signed private storage URLs, magic-byte file checks, and India DPDP Act 2023 retention hygiene.",
  },
];

export function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="section-rhythm surface-light border-t border-[var(--line)] bg-[var(--paper)]">
      <div className="container-arch max-w-4xl">
        <p className="eyebrow text-[var(--brand-link)]">06 · Straight Answers</p>
        <h2 className="font-display mt-2 text-3xl font-bold text-[var(--ink)] sm:text-5xl">
          Questions founders and CTOs actually ask.
        </h2>

        <div className="mt-10 divide-y divide-[var(--line)] border-y border-[var(--line)]">
          {FAQS.map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div key={item.q}>
                <button
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="flex min-h-[60px] w-full items-center justify-between gap-4 py-5 text-left"
                >
                  <span className="font-display text-lg font-bold text-[var(--ink)] sm:text-xl">
                    {item.q}
                  </span>
                  <ChevronDown
                    className={`h-5 w-5 flex-shrink-0 text-[var(--text-muted)] transition-transform ${
                      isOpen ? "rotate-180" : ""
                    }`}
                    aria-hidden="true"
                  />
                </button>
                <div className="tg-accordion-panel" data-open={isOpen ? "true" : "false"}>
                  <div className="tg-accordion-inner pb-5">
                    <p className="text-sm leading-relaxed text-[var(--text-muted)] sm:text-base">
                      {item.a}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
