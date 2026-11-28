export const SERVICE_SLUGS = [
  "web-mobile-engineering",
  "salesforce-solutions",
  "ui-ux-design",
  "enterprise-software",
  "it-consulting",
  "digital-marketing-seo",
] as const;

export const WORK_SLUGS = [
  "b2b-salesforce-portal-blueprint",
  "recruitment-dpdp-ats-blueprint",
] as const;

export const INSIGHT_SLUGS = [
  "tech-groww-2026-engineering-foundation",
  "salesforce-omnistudio-and-web-portals",
] as const;

export const JOB_SLUGS = [
  "sales-executive-greater-noida",
  "sales-intern-2-month-cohort",
] as const;

export const STATIC_PUBLIC_ROUTES = [
  "/",
  "/about",
  "/services",
  "/work",
  "/insights",
  "/careers",
  "/careers/internships",
  "/careers/status",
  "/contact",
  "/privacy",
  "/terms",
  "/cookies",
] as const;

export const ALL_PUBLIC_ROUTES: readonly string[] = [
  ...STATIC_PUBLIC_ROUTES,
  ...SERVICE_SLUGS.map((s) => `/services/${s}`),
  ...WORK_SLUGS.map((s) => `/work/${s}`),
  ...INSIGHT_SLUGS.map((s) => `/insights/${s}`),
  ...JOB_SLUGS.map((s) => `/careers/${s}`),
];

export const AUTH_ROUTES = [
  "/login",
  "/forgot-password",
  "/reset-password",
  "/invite",
] as const;

export const ALL_PUBLIC_AND_AUTH_ROUTES: readonly string[] = [
  ...ALL_PUBLIC_ROUTES,
  ...AUTH_ROUTES,
];

export const PORTAL_ROOTS = [
  "/admin",
  "/sales",
  "/recruitment",
  "/client",
  "/intern",
] as const;

export const PORTAL_SUBROUTES = [
  "/admin/users",
  "/admin/services",
  "/admin/insights",
  "/sales/leads",
  "/recruitment/candidates",
  "/client/projects",
  "/client/projects/ENG-2026-01",
  "/intern/tasks",
  "/intern/certificate",
] as const;

export interface LegacyRedirectCase {
  from: string;
  to: string;
  status: 301 | 410;
}

export const LEGACY_REDIRECTS: readonly LegacyRedirectCase[] = [
  { from: "/about.php", to: "/about", status: 301 },
  { from: "/services.php", to: "/services", status: 301 },
  {
    from: "/services/web-development",
    to: "/services/web-mobile-engineering",
    status: 301,
  },
  {
    from: "/services/software-development",
    to: "/services/enterprise-software",
    status: 301,
  },
  {
    from: "/services/digital-marketing",
    to: "/services/digital-marketing-seo",
    status: 301,
  },
  {
    from: "/services/automation",
    to: "/services/enterprise-software",
    status: 301,
  },
  {
    from: "/services/ai-solutions",
    to: "/services/it-consulting",
    status: 301,
  },
  { from: "/portfolio", to: "/work", status: 301 },
  { from: "/portfolio.php", to: "/work", status: 301 },
  { from: "/contact.php", to: "/contact", status: 301 },
  { from: "/privacy-policy", to: "/privacy", status: 301 },
  { from: "/admin/login.php", to: "", status: 410 },
];

export const R1_VERIFIED = {
  brandName: "Tech Groww",
  tagline: "Technology That Drives Growth.",
  foundedYear: "2026",
  hqDisplay: "Greater Noida, Uttar Pradesh 203209",
  emails: {
    general: "contact@techgroww.co.in",
    sales: "sales@techgroww.co.in",
    hr: "hr@techgroww.co.in",
  },
  socials: {
    linkedin: "https://www.linkedin.com/company/tech-growww",
    instagram: "https://www.instagram.com/info_techgroww.co.in/",
  },
} as const;

export interface ForbiddenPattern {
  label: string;
  regex: RegExp;
}

export const FORBIDDEN_PERSONAL_AND_DEMO_PATTERNS: readonly ForbiddenPattern[] = [
  { label: "personal email", regex: /umesh\.code1@gmail\.com/i },
  { label: "personal/demo user name", regex: /\bUmesh Patel\b/i },
  { label: "demo client email", regex: /client@acme\.com/i },
  { label: "fabricated client Apex Logistics", regex: /\bApex Logistics\b/i },
  { label: "fabricated client FinGrowth", regex: /\bFinGrowth\b/i },
  { label: "fabricated client OmniHealth", regex: /\bOmniHealth\b/i },
  { label: "fabricated person Ananya Sharma", regex: /\bAnanya Sharma\b/i },
  { label: "unverified +91 phone", regex: /\+91[\s-]?\d{5}/ },
];

export const FORBIDDEN_INTERNAL_LEAK_PATTERNS: readonly ForbiddenPattern[] = [
  { label: "confirmation gate marker C-01..C-13", regex: /\bC-(?:0[1-9]|1[0-3])\b/ },
  { label: "company confirmation banner", regex: /\[COMPANY CONFIRMATION REQUIRED/i },
  { label: "raw DB table job_postings", regex: /\bjob_postings\b/ },
  { label: "raw DB column team_members.is_public", regex: /team_members\.is_public/ },
  { label: "raw DB table audit_logs", regex: /\baudit_logs\b/ },
  { label: "raw DB column is_client_approved", regex: /\bis_client_approved\b/ },
  { label: "internal portal path /admin/team", regex: /\/admin\/team\b/ },
  { label: "literal markdown backtick", regex: /`/ },
];

export const PROTECTED_PORTAL_GET_ENDPOINTS = [
  "/api/v1/notifications",
  "/api/v1/admin/users",
  "/api/v1/admin/services",
  "/api/v1/admin/insights",
  "/api/v1/admin/pages",
  "/api/v1/admin/portfolio",
  "/api/v1/admin/audit",
  "/api/v1/sales/leads",
  "/api/v1/sales/opportunities",
  "/api/v1/sales/reports",
  "/api/v1/recruitment/applications",
  "/api/v1/recruitment/jobs",
  "/api/v1/recruitment/offers",
  "/api/v1/recruitment/retention",
  "/api/v1/client/projects",
  "/api/v1/client/billing",
  "/api/v1/client/deliverables",
  "/api/v1/client/tickets",
  "/api/v1/intern/tasks",
  "/api/v1/intern/submissions",
  "/api/v1/intern/certificate",
] as const;

export const PROTECTED_PORTAL_MUTATION_ENDPOINTS = [
  { method: "PATCH" as const, path: "/api/v1/notifications" },
  { method: "POST" as const, path: "/api/v1/admin/users" },
  { method: "POST" as const, path: "/api/v1/sales/leads" },
  { method: "POST" as const, path: "/api/v1/sales/convert" },
  { method: "PATCH" as const, path: "/api/v1/recruitment/applications" },
  { method: "POST" as const, path: "/api/v1/media/upload-url" },
  { method: "POST" as const, path: "/api/v1/media/commit" },
] as const;

export const CRON_ENDPOINTS = [
  "/api/v1/cron/publish-scheduled",
  "/api/v1/cron/resend-retry",
  "/api/v1/cron/retention-purge",
  "/api/v1/cron/storage-backup",
] as const;
