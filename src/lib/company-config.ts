/**
 * Canonical verified Tech Groww public identity & contact configuration.
 * Strictly governed by docs/techgroww/COMPANY_INFORMATION_VERIFICATION.md & 21_PRELAUNCH_VERIFICATION_CHECKLIST.md.
 * Zero unverified metrics, hubs, or personal developer contacts.
 */
export const COMPANY_CONFIG = {
  brandName: "Tech Groww",
  wordmark: "TECH GROWW",
  tagline: "Technology That Drives Growth.",
  foundedYear: 2026,
  hq: {
    cityState: "Greater Noida, Uttar Pradesh",
    postalCode: "203209",
    country: "IN",
    displayLabel: "Greater Noida, Uttar Pradesh 203209, India",
  },
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://techgroww.co.in",
  emails: {
    general: "contact@techgroww.co.in",
    sales: "sales@techgroww.co.in",
    hr: "hr@techgroww.co.in",
  },
  socials: {
    linkedin: "https://www.linkedin.com/company/tech-growww",
    instagram: "https://www.instagram.com/info_techgroww.co.in/",
  },
  // C-02 / C-01 / C-05 / C-07 / C-10 / C-13 owner gates
  confirmations: {
    legalEntityName: process.env.NEXT_PUBLIC_LEGAL_ENTITY_NAME || null, // C-01
    canonicalPhone: process.env.NEXT_PUBLIC_CANONICAL_PHONE || null, // C-02 (+91 number gated until confirmed)
    businessHours: process.env.NEXT_PUBLIC_BUSINESS_HOURS || null, // C-05
    seoServiceEnabled: process.env.NEXT_PUBLIC_SEO_SERVICE_LIVE !== "false", // C-06 (S-POST)
    aiServicesEnabled: process.env.NEXT_PUBLIC_AI_SERVICES_LIVE === "true", // C-06 (draft by default)
    attendanceEnabled: process.env.INTERN_ATTENDANCE_ENABLED === "true", // C-09
    grievanceOfficer: process.env.NEXT_PUBLIC_GRIEVANCE_OFFICER || null, // C-10
    jurisdiction: process.env.NEXT_PUBLIC_LEGAL_JURISDICTION || null, // C-10
    targetInquirySla: process.env.NEXT_PUBLIC_INQUIRY_SLA || null, // C-13
  },
  allowedStaffOAuthDomain: process.env.GOOGLE_WORKSPACE_ALLOWED_DOMAIN || "techgroww.co.in",
} as const;
