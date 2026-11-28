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
    category: "Web & Apps",
    title: "Custom Web & Mobile Engineering",
    summary:
      "Fast, reliable websites, customer portals, and mobile apps designed around what your customers actually need.",
    problemStatement:
      "Slow templates and messy plugins frustrate visitors, hurt trust, and break whenever your business grows.",
    solutionApproach:
      "We build modern, fast-loading websites and phone apps from the ground up — easy for your team to manage and simple for buyers to use.",
    capabilities: [
      "Fast custom websites built for every screen",
      "iPhone & Android mobile apps",
      "Private login portals for your clients",
      "Smooth performance & reliable hosting setup",
    ],
    deliverables: [
      "Full website or app plan tailored to your business",
      "Responsive mobile, tablet & desktop screens",
      "Complete testing & guided launch support",
    ],
    techTags: ["Custom Websites", "Mobile Apps", "Client Portals", "Fast Loading"],
    faqs: [
      {
        q: "Do you reuse old templates or off-the-shelf themes?",
        a: "No. Every project is crafted around your brand, your customers, and your business goals.",
      },
      {
        q: "Can we update text and pages easily without needing a developer every time?",
        a: "Yes. We give you a simple, friendly dashboard so your team can update pages, services, and posts anytime.",
      },
    ],
  },
  {
    slug: "salesforce-solutions",
    indexNumber: "02",
    category: "Salesforce & CRM",
    title: "Salesforce Ecosystem Solutions",
    summary:
      "Hands-on Salesforce setup, cleanup, automation, and friendly ongoing support for growing sales teams.",
    problemStatement:
      "Confusing screens, broken follow-up steps, and scattered customer records leave sales teams stuck back in spreadsheets.",
    solutionApproach:
      "We organize your Salesforce setup so inquiries go straight to the right person and every follow-up runs smoothly.",
    capabilities: [
      "Salesforce organization & ongoing team support",
      "Custom easy-to-use sales screens & guided forms",
      "Automatic reminders & clean lead routing",
      "Connect your website inquiries directly to Salesforce",
    ],
    deliverables: [
      "Clean customer records & team permissions setup",
      "Tested custom screens & automated follow-up flows",
      "Simple team guide & ongoing support plan",
    ],
    techTags: ["Salesforce Setup", "Lead Tracking", "Team Automation", "Ongoing Support"],
    faqs: [
      {
        q: "Can you improve our existing Salesforce setup without interrupting our sales team?",
        a: "Yes. We test all improvements safely in a private practice copy before bringing them live for your team.",
      },
    ],
  },
  {
    slug: "ui-ux-design",
    indexNumber: "03",
    category: "Design",
    title: "UI/UX & Product Design",
    summary:
      "Clean, inviting screen designs and user-friendly layouts that help customers trust you and take action.",
    problemStatement:
      "Cluttered pages and confusing forms make great businesses look outdated and cause visitors to leave without reaching out.",
    solutionApproach:
      "We design calm, attractive, easy-to-navigate screens that make your brand memorable and effortless to use.",
    capabilities: [
      "Cohesive visual style & brand colors",
      "Simple, logical navigation & booking flows",
      "Accessible readability for every user",
      "Clickable screen previews before building starts",
    ],
    deliverables: [
      "Reusable design kit & brand guidelines",
      "Mobile, tablet & desktop screen mockups",
      "Clear visual guide for future growth",
    ],
    techTags: ["Modern Design", "Easy Navigation", "Screen Previews", "Mobile Friendly"],
    faqs: [
      {
        q: "Do you design both public websites and private team dashboards?",
        a: "Yes. We make public websites welcoming for buyers, and internal dashboards calm and fast for daily work.",
      },
    ],
  },
  {
    slug: "enterprise-software",
    indexNumber: "04",
    category: "Business Tools",
    title: "Enterprise Software Development",
    summary:
      "Custom internal workspaces, approval dashboards, and private portals that replace scattered spreadsheets.",
    problemStatement:
      "Growing teams waste hours chasing approvals, files, client updates, and hiring records across messy spreadsheets and chats.",
    solutionApproach:
      "We bring everything together into one private, role-based workspace where everyone sees exactly what they need.",
    capabilities: [
      "Separate portals for staff, clients, sales & hiring",
      "Strict privacy so each person sees only their work",
      "Private, safe document & file sharing",
      "Clear activity logs & instant progress exports",
    ],
    deliverables: [
      "Clean data setup & reliable cloud hosting",
      "Role-based permissions & thorough safety testing",
      "Ready-to-use team portals with onboarding help",
    ],
    techTags: ["Team Dashboards", "Client Portals", "Safe File Sharing", "Workflows"],
    faqs: [
      {
        q: "How do you make sure client or staff information stays private?",
        a: "Every portal checks who is logged in on every screen and action so no one can ever view another person's private files.",
      },
    ],
  },
  {
    slug: "it-consulting",
    indexNumber: "05",
    category: "Guidance",
    title: "IT Consulting & Strategic Transformation",
    summary:
      "Honest, practical technology advice, project planning, and budget-smart guidance before you build.",
    problemStatement:
      "Companies lose months and money when they pick the wrong tools or lock into expensive plans without a clear roadmap.",
    solutionApproach:
      "Plain-English discovery sessions that give you clear options, honest cost comparisons, and a realistic step-by-step plan.",
    capabilities: [
      "Honest review of your current website or tools",
      "Build-vs-buy advice to save unnecessary costs",
      "Privacy & data-safety planning",
      "Step-by-step launch plan with clear milestones",
    ],
    deliverables: [
      "Clear written recommendation & plan",
      "Safety & readiness checklist",
      "Practical action steps for your team",
    ],
    techTags: ["Honest Advice", "Project Planning", "Cost Savings", "Roadmaps"],
    faqs: [
      {
        q: "Can we book a planning session first before committing to a big build?",
        a: "Yes. Starting with clear planning removes guesswork, and you keep the full roadmap regardless of what you decide next.",
      },
    ],
  },
  {
    slug: "digital-marketing-seo",
    indexNumber: "06",
    category: "Growth",
    title: "Digital Marketing & SEO Visibility",
    summary:
      "Clean Google search setup, helpful site structure, and honest ways to help the right customers find you.",
    problemStatement:
      "Gimmicky keywords and broken links hurt your search rankings instead of bringing genuine customers to your door.",
    solutionApproach:
      "Clear page structure, clean link management, fast page loading, and privacy-respecting visitor insights.",
    capabilities: [
      "Google Search readiness & clean indexing",
      "Rich business info cards for search engines",
      "Smooth link updates with zero broken pages",
      "Simple, privacy-friendly visitor tracking",
    ],
    deliverables: [
      "Complete page title & search checkup",
      "Automatic search sitemap & link setup",
      "Clear content writing checklist",
    ],
    techTags: ["Google Search", "Clean Links", "Fast Pages", "Organic Growth"],
    faqs: [
      {
        q: "Why do you avoid fake overnight traffic promises?",
        a: "Lasting search visibility comes from clear messaging, fast websites, and trustworthy content — never cheap shortcuts.",
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
    stipendOrRange: "As per discussion",
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
    stipendOrRange: "Offer letter + verifiable completion certificate",
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
