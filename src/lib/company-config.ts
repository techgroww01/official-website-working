/**
 * Canonical verified Tech Groww public identity & contact configuration.
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
  confirmations: {
    legalEntityName: process.env.NEXT_PUBLIC_LEGAL_ENTITY_NAME || null,
    canonicalPhone: process.env.NEXT_PUBLIC_CANONICAL_PHONE || null,
    businessHours: process.env.NEXT_PUBLIC_BUSINESS_HOURS || null,
    seoServiceEnabled: process.env.NEXT_PUBLIC_SEO_SERVICE_LIVE !== "false",
    aiServicesEnabled: process.env.NEXT_PUBLIC_AI_SERVICES_LIVE === "true",
    attendanceEnabled: process.env.INTERN_ATTENDANCE_ENABLED === "true",
    grievanceOfficer: process.env.NEXT_PUBLIC_GRIEVANCE_OFFICER || null,
    jurisdiction: process.env.NEXT_PUBLIC_LEGAL_JURISDICTION || null,
    targetInquirySla: process.env.NEXT_PUBLIC_INQUIRY_SLA || null,
  },
  allowedStaffOAuthDomain: process.env.GOOGLE_WORKSPACE_ALLOWED_DOMAIN || "techgroww.co.in",
} as const;
