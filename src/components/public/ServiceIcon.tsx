import React from "react";

interface ServiceIconProps {
  slug: string;
  className?: string;
}

/** 
 * Iconly-inspired clean SVG icon per service discipline.
 * Pure geometric, single-color — adapts via currentColor.
 */
export function ServiceIcon({ slug, className = "h-7 w-7" }: ServiceIconProps) {
  const icons: Record<string, React.ReactElement> = {
    "web-mobile-engineering": (
      <svg viewBox="0 0 32 32" fill="none" aria-hidden="true" className={className}>
        <rect x="3" y="6" width="26" height="17" rx="2" stroke="currentColor" strokeWidth="1.75" />
        <line x1="10" y1="27" x2="22" y2="27" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
        <line x1="16" y1="23" x2="16" y2="27" stroke="currentColor" strokeWidth="1.75" />
        <line x1="3" y1="19" x2="29" y2="19" stroke="currentColor" strokeWidth="1.25" strokeOpacity="0.4" />
        <rect x="21" y="9" width="6" height="4" rx="1" stroke="currentColor" strokeWidth="1.25" />
        <line x1="7" y1="11" x2="17" y2="11" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
        <line x1="7" y1="14" x2="13" y2="14" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
      </svg>
    ),
    "salesforce-omnistudio": (
      <svg viewBox="0 0 32 32" fill="none" aria-hidden="true" className={className}>
        <circle cx="16" cy="16" r="11" stroke="currentColor" strokeWidth="1.75" />
        <path d="M10 16 C10 12 13 9 16 9 C19 9 22 12 22 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="16" cy="16" r="3.5" stroke="currentColor" strokeWidth="1.5" />
        <line x1="16" y1="4" x2="16" y2="6.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="16" y1="25.5" x2="16" y2="28" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="4" y1="16" x2="6.5" y2="16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="25.5" y1="16" x2="28" y2="16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    "ui-ux-design-systems": (
      <svg viewBox="0 0 32 32" fill="none" aria-hidden="true" className={className}>
        <rect x="4" y="4" width="10" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.75" />
        <rect x="18" y="4" width="10" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.75" />
        <rect x="4" y="18" width="10" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.75" />
        <circle cx="23" cy="23" r="5" stroke="currentColor" strokeWidth="1.75" />
        <line x1="21" y1="23" x2="25" y2="23" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
        <line x1="23" y1="21" x2="23" y2="25" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
      </svg>
    ),
    "enterprise-software": (
      <svg viewBox="0 0 32 32" fill="none" aria-hidden="true" className={className}>
        <rect x="4" y="8" width="24" height="16" rx="2" stroke="currentColor" strokeWidth="1.75" />
        <line x1="10" y1="14" x2="10" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <line x1="14" y1="12" x2="14" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <line x1="18" y1="15" x2="18" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <line x1="22" y1="11" x2="22" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <line x1="7" y1="4" x2="7" y2="8" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
        <line x1="25" y1="4" x2="25" y2="8" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
      </svg>
    ),
    "it-consulting": (
      <svg viewBox="0 0 32 32" fill="none" aria-hidden="true" className={className}>
        <circle cx="16" cy="10" r="5" stroke="currentColor" strokeWidth="1.75" />
        <path d="M6 26 C6 20.477 10.477 16 16 16 C21.523 16 26 20.477 26 26" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
        <line x1="16" y1="19" x2="16" y2="22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="16" cy="23.5" r="1" fill="currentColor" />
      </svg>
    ),
    "technical-seo": (
      <svg viewBox="0 0 32 32" fill="none" aria-hidden="true" className={className}>
        <circle cx="14" cy="14" r="8.5" stroke="currentColor" strokeWidth="1.75" />
        <line x1="20.5" y1="20.5" x2="27" y2="27" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <line x1="14" y1="8" x2="14" y2="20" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeOpacity="0.5" />
        <path d="M8 14 C8 11 11 8 14 8" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeOpacity="0.5" />
      </svg>
    ),
  };

  // Fallback generic icon
  const fallback = (
    <svg viewBox="0 0 32 32" fill="none" aria-hidden="true" className={className}>
      <rect x="4" y="4" width="24" height="24" rx="3" stroke="currentColor" strokeWidth="1.75" />
      <line x1="10" y1="12" x2="22" y2="12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="10" y1="16" x2="18" y2="16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="10" y1="20" x2="20" y2="20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );

  return icons[slug] ?? fallback;
}
