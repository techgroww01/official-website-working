"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

const FAQS = [
  {
    q: "Tech Groww was founded in 2026 — why work with a newer team?",
    a: "You get direct attention from our core team from day one to launch — without middlemen, inflated agency prices, or being handed off to juniors. We win trust through clear communication and dependable work.",
  },
  {
    q: "Do you handle Salesforce alongside custom websites and mobile apps?",
    a: "Yes. Setting up and supporting Salesforce for sales teams is one of our core strengths, right alongside building custom websites, customer portals, and mobile apps.",
  },
  {
    q: "How do you price projects without confusing packages?",
    a: "Every business has different needs. After a quick discovery chat, we give you a clear, fixed-milestone quote or monthly plan with zero hidden charges so you know exactly what you're paying for.",
  },
  {
    q: "Why are items on your Work page labeled Reference Blueprint?",
    a: "We believe in 100% honesty. We only display client names with their permission, so our sample blueprints openly show the quality and style of systems we design for businesses.",
  },
  {
    q: "How do you keep our customer and business data safe?",
    a: "Every portal and website we build protects customer information with strict privacy controls, private file storage, and compliance with India's DPDP Act 2023.",
  },
];

export function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="section-rhythm surface-light border-t border-[var(--line)] bg-[var(--paper)]">
      <div className="container-arch max-w-4xl">
        <p className="eyebrow text-[var(--brand-link)]">06 · Straight Answers</p>
        <h2 className="font-display mt-2 text-3xl font-bold text-[var(--ink)] sm:text-5xl">
          Common questions, answered simply.
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
