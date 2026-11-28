"use client";

import React, { useState } from "react";
import { Pause, Play } from "lucide-react";

const ITEMS = [
  "Custom Websites & Mobile Apps",
  "Salesforce & Customer Systems",
  "Clean, Easy-to-Use Design",
  "Business Dashboards & Portals",
  "Practical Tech Guidance",
  "Google Search & Online Growth",
];

export function CapabilityMarquee() {
  const [paused, setPaused] = useState(false);

  return (
    <section
      aria-label="Core engineering capabilities"
      className="surface-dark tg-marquee-root border-y border-white/10 bg-[#0B1426] py-3.5 text-white"
      data-paused={paused ? "true" : "false"}
    >
      <div className="container-arch flex items-center gap-4">
        <button
          type="button"
          onClick={() => setPaused((p) => !p)}
          aria-pressed={paused}
          aria-label={paused ? "Play scrolling capability ribbon" : "Pause scrolling capability ribbon"}
          className="inline-flex min-h-[44px] min-w-[44px] flex-shrink-0 items-center gap-1.5 rounded-[var(--radius-sm)] border border-white/25 bg-[var(--ink)] px-3 py-2 text-xs font-medium text-slate-200 hover:border-white/50 hover:text-white"
        >
          {paused ? <Play className="h-3.5 w-3.5" aria-hidden="true" /> : <Pause className="h-3.5 w-3.5" aria-hidden="true" />}
          <span>{paused ? "Play" : "Pause"}</span>
        </button>

        {/* Screen-reader accessible canonical list */}
        <ul className="sr-only">
          {ITEMS.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>

        {/* Visual continuous loop */}
        <div className="flex-1 overflow-hidden" aria-hidden="true">
          <div className="tg-marquee-track items-center gap-8 text-sm font-medium text-slate-200">
            {[...ITEMS, ...ITEMS].map((item, i) => (
              <span key={`${item}-${i}`} className="inline-flex items-center gap-8 whitespace-nowrap">
                <span>{item}</span>
                <span className="h-1.5 w-1.5 rotate-45 bg-[var(--brand-sky)]" />
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
