import React from "react";

/**
 * Architectural GrowthSignal vector motif derived directly from techgroww_logo.svg
 * upward delta & chevron wing geometry. Pure geometric hairlines — zero constellation dots.
 */
export function GrowthSignal({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 360 360"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      {/* Subtle architectural frame lines */}
      <line x1="20" y1="312" x2="340" y2="312" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
      <line x1="180" y1="24" x2="180" y2="328" stroke="rgba(56,189,248,0.22)" strokeWidth="1" strokeDasharray="4 6" />

      {/* Outer nested delta signal */}
      <polygon
        points="180,36 52,248 122,248 180,152 238,248 308,248"
        stroke="rgba(56,189,248,0.35)"
        strokeWidth="1.25"
        fill="rgba(2,132,199,0.06)"
      />
      {/* Mid upward facet */}
      <polygon
        points="180,84 96,222 146,222 180,166 214,222 264,222"
        stroke="#38BDF8"
        strokeWidth="1.5"
        fill="rgba(56,189,248,0.08)"
      />
      {/* Center spine */}
      <line x1="180" y1="36" x2="180" y2="210" stroke="#38BDF8" strokeWidth="1.5" />

      {/* Splayed structural chevron wings */}
      <polyline
        points="24,296 180,206 336,296"
        stroke="#0284C7"
        strokeWidth="2"
      />
      <polyline
        points="64,312 180,242 296,312"
        stroke="#1D4ED8"
        strokeWidth="1.5"
      />
    </svg>
  );
}
