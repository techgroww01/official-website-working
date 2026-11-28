import { COMPANY_CONFIG } from "@/lib/company-config";
import { createServerSupabaseClient, isSupabaseServerConfigured } from "@/lib/supabase/server";

export interface PublicServiceItem {
  slug: string;
  indexNumber: string;
  category: string;
  title: string;
  summary: string;
  problemStatement: string;
  solutionApproach: string;
  capabilities: string[];
  deliverables: string[];
  techTags: string[];
  faqs: { q: string; a: string }[];
}

export interface PublicWorkItem {
  slug: string;
  title: string;
  projectType: "client_project" | "internal_product" | "reference_blueprint";
  isClientApproved: boolean;
  clientDisplayName: string | null;
  industry: string;
  summary: string;
  challenge: string;
  architecture: string;
  outcomes: string;
  techStack: string[];
}

export interface PublicInsightItem {
  slug: string;
  title: string;
  categoryName: string;
  excerpt: string;
  bodyMarkdown: string;
  readingTimeMins: number;
  publishedAt: string;
  isFeatured: boolean;
}

export interface PublicJobItem {
  id: string;
  slug: string;
  title: string;
  postingKind: "job" | "internship";
  employmentType: string;
  department: string;
  location: string;
  summary: string;
  responsibilities: string;
  requirements: string;
  stipendOrRange: string | null;
}

const FALLBACK_SERVICES: PublicServiceItem[] = [
  {
    slug: "web-mobile-engineering",
    indexNumber: "01",
    category: "Engineering",
    title: "Custom Web & Mobile Engineering",
    summary:
      "Fast, accessible web platforms, client portals, and mobile applications engineered around clear domain boundaries.",
    problemStatement:
      "Fragile templates and bolted-on plugins slow down page performance, frustrate buyers, and break whenever workflows evolve.",
    solutionApproach:
      "We build server-first Next.js web platforms and cross-platform mobile experiences backed by relational PostgreSQL data models and clean APIs.",
    capabilities: [
      "Next.js App Router & SSR/ISR architecture",
      "Cross-platform iOS/Android application delivery",
      "Role-isolated web portals & customer workflows",
      "Automated testing & Core Web Vitals optimization",
    ],
    deliverables: [
      "Technical architecture specification & domain schema",
      "Accessible, responsive frontend component system",
      "Tested API layer, CI pipeline & launch runbook",
    ],
    techTags: ["Next.js 16", "React 19", "TypeScript", "React Native", "PostgreSQL"],
    faqs: [
      {
        q: "Do you reuse legacy PHP templates or off-the-shelf themes?",
        a: "No. Every production build is engineered from scratch around your actual content structure, accessibility rules, and integration scope.",
      },
      {
        q: "Can we manage content without developer tickets?",
        a: "Yes. Every corporate build pairs cleanly with our Admin CMS workflow for pages, services, insights, media, and redirects.",
      },
    ],
  },
  {
    slug: "salesforce-solutions",
    indexNumber: "02",
    category: "Salesforce",
    title: "Salesforce Ecosystem Solutions",
    summary:
      "Dedicated Salesforce Administration, production support, Flow automation, and OmniStudio implementations.",
    problemStatement:
      "Poorly structured CRM objects, brittle triggers, and unaligned lead routing leave sales and operations teams trapped in spreadsheets.",
    solutionApproach:
      "Certified-grade Salesforce hygiene combining clean object modeling, OmniStudio FlexCards/Integration Procedures, and governed release management.",
    capabilities: [
      "Salesforce Org Administration & ongoing production support",
      "OmniStudio FlexCards, OmniScripts & Integration Procedures",
      "Flow automation, validation rules & permission modeling",
      "Website-to-CRM lead & API integration pipelines",
    ],
    deliverables: [
      "CRM object/security model & sandbox release notes",
      "Tested OmniStudio components & Flow documentation",
      "Admin handover checklist & support runbook",
    ],
    techTags: ["Salesforce Admin", "OmniStudio", "Apex", "Flow Builder", "REST APIs"],
    faqs: [
      {
        q: "Can you support an active Salesforce org without disrupting live sales teams?",
        a: "Yes. All configuration and code changes are validated in sandbox environments with staged deployment checklists.",
      },
    ],
  },
  {
    slug: "ui-ux-design",
    indexNumber: "03",
    category: "Design",
    title: "UI/UX & Product Design",
    summary:
      "Clear visual hierarchy, WCAG 2.2 AA design systems, and thoughtful operational product UX without generic clutter.",
    problemStatement:
      "Generic dark-glow templates make companies look interchangeable while confusing users inside multi-step forms and portals.",
    solutionApproach:
      "Editorial brand framing for marketing surfaces paired with calm, legible daylight interfaces built for daily operational speed.",
    capabilities: [
      "Tokenized light/dark & operational portal design systems",
      "Information architecture & multi-portal user journeys",
      "WCAG 2.2 AA contrast & keyboard-navigation compliance",
      "Interactive system prototypes before engineering",
    ],
    deliverables: [
      "Design token specification & reusable UI kit",
      "Responsive desktop, tablet & mobile wireframes",
      "Accessibility & interaction documentation",
    ],
    techTags: ["Design Systems", "WCAG 2.2 AA", "Figma", "Prototyping", "UX Audit"],
    faqs: [
      {
        q: "Do you design both the public brand site and internal portals?",
        a: "Yes. We distinguish expressive editorial surfaces for buyers from clean high-efficiency UI for internal operators.",
      },
    ],
  },
  {
    slug: "enterprise-software",
    indexNumber: "04",
    category: "Software",
    title: "Enterprise Software Development",
    summary:
      "Multi-role internal platforms, client portals, approval workflows, and tenant-isolated business software.",
    problemStatement:
      "Growing teams lose accountability when approvals, files, client onboarding, and candidate pipelines live across disjointed spreadsheets.",
    solutionApproach:
      "Unified full-stack applications enforced by deny-by-default RBAC, PostgreSQL Row-Level Security, and tamper-evident audit logging.",
    capabilities: [
      "Multi-portal role-based operations platforms",
      "Tenant-isolated PostgreSQL schemas & Row-Level Security",
      "Encrypted file vaults with short-lived signed URLs",
      "Immutable audit trails & compliance-ready exports",
    ],
    deliverables: [
      "Normalized ERD & SQL migration suite",
      "Server-enforced RBAC matrix & API test coverage",
      "Role-specific portals ready for daily team operations",
    ],
    techTags: ["PostgreSQL", "RLS", "Node.js", "REST APIs", "RBAC"],
    faqs: [
      {
        q: "How do you prevent data leaks between client organizations?",
        a: "We enforce isolation both in server permission guards and directly inside PostgreSQL Row-Level Security policies.",
      },
    ],
  },
  {
    slug: "it-consulting",
    indexNumber: "05",
    category: "Advisory",
    title: "IT Consulting & Strategic Transformation",
    summary:
      "Direct principal-led architecture discovery, build-vs-buy advisory, threat modeling, and cloud modernization roadmaps.",
    problemStatement:
      "Organizations waste months and budget when vendor choices or cloud architectures are locked before constraints are tested.",
    solutionApproach:
      "Candid technical discovery producing concrete trade-off matrices, risk registers, security threat models, and realistic engineering scopes.",
    capabilities: [
      "Architecture & code-health audits",
      "Build-vs-buy & cloud TCO evaluation",
      "STRIDE threat modeling & DPDP privacy planning",
      "Scoped delivery backlogs with clear release gates",
    ],
    deliverables: [
      "Architecture Decision Records (ADRs)",
      "Security & operational readiness register",
      "Actionable workstream implementation backlog",
    ],
    techTags: ["Architecture", "Cloud TCO", "Threat Modeling", "Discovery"],
    faqs: [
      {
        q: "Can consulting engagements stand alone before committing to build?",
        a: "Yes. Architecture discovery is designed to eliminate ambiguity so you own a portable specification regardless of next steps.",
      },
    ],
  },
  {
    slug: "digital-marketing-seo",
    indexNumber: "06",
    category: "Growth",
    title: "Digital Marketing & SEO Visibility",
    summary:
      "Clean technical SEO architecture, structured schema markup, redirect hygiene, and measurable organic discoverability.",
    problemStatement:
      "Keyword-stuffed meta tags and broken URL migrations actively hurt search trust instead of attracting qualified B2B buyers.",
    solutionApproach:
      "Honest semantic HTML, verified JSON-LD schema graphs, deterministic 301 redirect maps, and fast Core Web Vitals foundations.",
    capabilities: [
      "Technical SEO & Search Console readiness",
      "Validated JSON-LD structured data integration",
      "Zero-loss 301/410 migration & redirect hygiene",
      "Consent-respecting analytics instrumentation",
    ],
    deliverables: [
      "Technical SEO & redirect verification matrix",
      "Dynamic XML sitemap & robots perimeter rules",
      "Page-level editorial metadata framework",
    ],
    techTags: ["Technical SEO", "JSON-LD", "Core Web Vitals", "Search Console"],
    faqs: [
      {
        q: "Why do you avoid automated SEO traffic guarantees?",
        a: "Credible search growth depends on honest positioning, fast architecture, and consistent domain authority — never fabricated promises.",
      },
    ],
  },
];

const FALLBACK_WORK: PublicWorkItem[] = [
  {
    slug: "b2b-salesforce-portal-blueprint",
    title: "Unified Sales-to-Client Delivery & Salesforce Operations Blueprint",
    projectType: "reference_blueprint",
    isClientApproved: false,
    clientDisplayName: null,
    industry: "B2B Operations",
    summary:
      "Architectural blueprint unifying inbound inquiry capture, Salesforce/CRM pipeline stages, and organization-isolated client delivery milestones.",
    challenge:
      "Sales inquiries and post-sale project milestones often live in disconnected spreadsheets and CRM tabs, delaying onboarding visibility.",
    architecture:
      "Event-driven PostgreSQL + Row-Level Security workspace backed by atomic opportunity-to-project conversion RPCs and signed deliverable approvals.",
    outcomes:
      "Architectural Goal: Single-source-of-truth scoping, traceable milestone approvals, and zero cross-tenant data leakage.",
    techStack: ["Next.js 16", "PostgreSQL RLS", "Salesforce", "Resend"],
  },
  {
    slug: "recruitment-dpdp-ats-blueprint",
    title: "Privacy-First Recruitment ATS & Intern Cohort Platform Blueprint",
    projectType: "reference_blueprint",
    isClientApproved: false,
    clientDisplayName: null,
    industry: "Talent & Operations",
    summary:
      "Reference architecture for role requisitions, private resume vaults, confidential scorecards, and automated 180-day DPDP retention compliance.",
    challenge:
      "Collecting candidate resumes via ad-hoc inboxes exposes personal data, loses interviewer feedback, and breaks intern onboarding consistency.",
    architecture:
      "Signed direct-to-storage uploads with magic-byte + .docx XML scanning, role-masked scorecards, and scheduled cryptographic anonymization.",
    outcomes:
      "Architectural Goal: Protect applicant personal data by design while keeping hiring and internship pipelines structured and auditable.",
    techStack: ["Supabase Storage", "TypeScript", "RBAC", "DPDP Privacy"],
  },
];

const FALLBACK_INSIGHTS: PublicInsightItem[] = [
  {
    slug: "tech-groww-2026-engineering-foundation",
    title: "Why We Built Our Platform Architecture Around Clarity and Verification",
    categoryName: "Company Updates",
    excerpt:
      "How Tech Groww approaches web engineering, Salesforce operations, and honest early-stage technical accountability in 2026.",
    bodyMarkdown:
      "### Engineering Around Real Constraints\n\nFounded in 2026 in Greater Noida, Tech Groww avoids inflated claims and generic software theatre.\n\n- **Direct Engineering Accountability:** Clients work directly with architectural leads.\n- **Salesforce + Full-Stack Cohesion:** CRM workflows and custom portals stay synchronized.\n- **Privacy & Security by Design:** Server-enforced RBAC, PostgreSQL RLS, and consent-gated analytics come standard.",
    readingTimeMins: 3,
    publishedAt: "2026-11-27T00:00:00Z",
    isFeatured: true,
  },
  {
    slug: "salesforce-omnistudio-and-web-portals",
    title: "Connecting Salesforce & OmniStudio Workflows to Customer Web Portals",
    categoryName: "Salesforce",
    excerpt:
      "Practical patterns for synchronizing inbound web leads, opportunity handoffs, and client onboarding without brittle manual spreadsheets.",
    bodyMarkdown:
      "### Bridging Front-Office Website Leads and CRM Execution\n\nWhen website contact forms dump raw emails into shared inboxes, response times slip. Atomic lead creation paired with clean CRM stages keeps qualification structured from day one.",
    readingTimeMins: 4,
    publishedAt: "2026-11-26T00:00:00Z",
    isFeatured: false,
  },
];

const FALLBACK_JOBS: PublicJobItem[] = [
  {
    id: "00000000-0000-4000-8000-000000000001",
    slug: "sales-executive-greater-noida",
    title: "Sales Executive",
    postingKind: "job",
    employmentType: "Full-time",
    department: "Sales & Growth",
    location: "Greater Noida, Uttar Pradesh",
    summary:
      "Own inbound discovery conversations, client qualification, and proposal coordination alongside our engineering principals.",
    responsibilities:
      "Qualify inbound website and LinkedIn leads, conduct structured discovery calls, maintain CRM pipeline stages, and coordinate scoping with delivery leads.",
    requirements:
      "Clear consultative B2B communication, IT/software solutions familiarity, and structured pipeline hygiene.",
    stipendOrRange: "As per discussion (Confirm active role status: C-12)",
  },
  {
    id: "00000000-0000-4000-8000-000000000002",
    slug: "sales-intern-2-month-cohort",
    title: "Sales Intern (2-Month Cohort)",
    postingKind: "internship",
    employmentType: "2-Month Internship",
    department: "Sales & Growth",
    location: "Greater Noida, Uttar Pradesh",
    summary:
      "Structured 2-month commercial internship with mentor guidance, official offer letter, and verifiable completion certificate.",
    responsibilities:
      "Support market research, structured outreach, discovery note preparation, and weekly mentored tasks inside the Intern & Sales Portals.",
    requirements:
      "Strong communication fundamentals, interest in B2B software & Salesforce solutions, and commitment to the 8-week cohort.",
    stipendOrRange: "Offer letter + verifiable completion certificate (C-12)",
  },
];

export async function getPublishedServices(): Promise<PublicServiceItem[]> {
  let items = FALLBACK_SERVICES;
  if (isSupabaseServerConfigured()) {
    try {
      const supabase = await createServerSupabaseClient();
      const { data } = await supabase
        .from("services")
        .select("slug, category, title, summary, problem_statement, solution_approach, capabilities, tech_tags, faqs, sort_order")
        .eq("status", "published")
        .is("deleted_at", null)
        .order("sort_order", { ascending: true });
      if (data && data.length > 0) {
        items = data.map((row, idx) => ({
          slug: row.slug,
          indexNumber: String(idx + 1).padStart(2, "0"),
          category: row.category,
          title: row.title,
          summary: row.summary,
          problemStatement: row.problem_statement,
          solutionApproach: row.solution_approach,
          capabilities: Array.isArray(row.capabilities) ? row.capabilities : [],
          deliverables: [
            "Architecture & technical scope specification",
            "Reviewed implementation & QA sign-off",
            "Documentation & operational handover",
          ],
          techTags: row.tech_tags ?? [],
          faqs: Array.isArray(row.faqs) ? row.faqs : [],
        }));
      }
    } catch {
      // Fallback to verified seed structure when DB unavailable
    }
  }

  return COMPANY_CONFIG.confirmations.seoServiceEnabled
    ? items
    : items.filter((s) => s.slug !== "digital-marketing-seo");
}

export async function getPublishedWork(): Promise<PublicWorkItem[]> {
  if (isSupabaseServerConfigured()) {
    try {
      const supabase = await createServerSupabaseClient();
      const { data } = await supabase
        .from("portfolio_items")
        .select("*")
        .eq("status", "published")
        .order("is_featured", { ascending: false });
      if (data && data.length > 0) {
        return data
          .filter((row) => row.project_type !== "client_project" || row.is_client_approved === true)
          .map((row) => ({
            slug: row.slug,
            title: row.title,
            projectType: row.project_type,
            isClientApproved: Boolean(row.is_client_approved),
            clientDisplayName: row.client_display_name ?? null,
            industry: row.industry,
            summary: row.summary,
            challenge: row.challenge,
            architecture: row.architecture,
            outcomes:
              row.outcomes ??
              "Architectural Goal: Designed cleanly around reliability, clarity, and security.",
            techStack: row.tech_stack ?? [],
          }));
      }
    } catch {
      // Fallback
    }
  }
  return FALLBACK_WORK;
}

export async function getPublishedInsights(): Promise<PublicInsightItem[]> {
  if (isSupabaseServerConfigured()) {
    try {
      const supabase = await createServerSupabaseClient();
      const { data } = await supabase
        .from("blog_posts")
        .select("slug, title, excerpt, body_markdown, reading_time_mins, published_at, is_featured, blog_categories(name)")
        .eq("status", "published")
        .is("deleted_at", null)
        .lte("published_at", new Date().toISOString())
        .order("published_at", { ascending: false });
      if (data && data.length > 0) {
        return data.map((row) => {
          const cat = (row as { blog_categories?: { name?: string } | null }).blog_categories;
          return {
            slug: row.slug,
            title: row.title,
            categoryName: cat?.name ?? "Engineering",
            excerpt: row.excerpt,
            bodyMarkdown: row.body_markdown,
            readingTimeMins: row.reading_time_mins,
            publishedAt: row.published_at ?? new Date().toISOString(),
            isFeatured: Boolean(row.is_featured),
          };
        });
      }
    } catch {
      // Fallback
    }
  }
  return FALLBACK_INSIGHTS;
}

export async function getOpenJobs(): Promise<PublicJobItem[]> {
  if (isSupabaseServerConfigured()) {
    try {
      const supabase = await createServerSupabaseClient();
      const { data } = await supabase
        .from("job_postings")
        .select("*")
        .eq("status", "open")
        .is("deleted_at", null)
        .order("published_at", { ascending: false });
      if (data && data.length > 0) {
        return data.map((row) => ({
          id: row.id,
          slug: row.slug,
          title: row.title,
          postingKind: row.posting_kind,
          employmentType: row.employment_type,
          department: row.department,
          location: row.location,
          summary: row.summary,
          responsibilities: row.responsibilities,
          requirements: row.requirements,
          stipendOrRange: row.stipend_or_range ?? null,
        }));
      }
    } catch {
      // Fallback
    }
  }
  return FALLBACK_JOBS;
}
