import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

const LEGACY_REDIRECTS: Record<string, { destination: string; status: 301 | 302 | 410 }> = {
  "/about.php": { destination: "/about", status: 301 },
  "/services.php": { destination: "/services", status: 301 },
  "/services/web-development": { destination: "/services/web-mobile-engineering", status: 301 },
  "/services/software-development": { destination: "/services/enterprise-software", status: 301 },
  "/services/digital-marketing": { destination: "/services/digital-marketing-seo", status: 301 },
  "/services/automation": { destination: "/services/enterprise-software", status: 301 },
  "/services/ai-solutions": { destination: "/services/it-consulting", status: 301 },
  "/portfolio": { destination: "/work", status: 301 },
  "/portfolio.php": { destination: "/work", status: 301 },
  "/contact.php": { destination: "/contact", status: 301 },
  "/privacy-policy": { destination: "/privacy", status: 301 },
  "/admin/login.php": { destination: "/410-gone", status: 410 },
};

const PORTAL_PREFIXES = ["/admin", "/sales", "/recruitment", "/client", "/intern"];
const NOINDEX_PREFIXES = [
  ...PORTAL_PREFIXES,
  "/login",
  "/forgot-password",
  "/reset-password",
  "/invite",
  "/auth",
  "/careers/status",
  "/api",
];

function buildCsp(nonce: string): string {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://*.supabase.co";
  return [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' https://challenges.cloudflare.com https://www.googletagmanager.com`,
    "style-src 'self' 'unsafe-inline'",
    `img-src 'self' data: blob: ${supabaseUrl}`,
    "font-src 'self' data:",
    `connect-src 'self' ${supabaseUrl} https://challenges.cloudflare.com https://www.google-analytics.com`,
    "frame-src https://challenges.cloudflare.com",
    "frame-ancestors 'none'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join("; ");
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Evaluate redirects BEFORE portal auth guards so /admin/login.php cleanly returns 410 Gone
  const redirectRule = LEGACY_REDIRECTS[pathname.toLowerCase()];
  if (redirectRule) {
    if (redirectRule.status === 410) {
      return new NextResponse("Gone — legacy endpoint retired.", {
        status: 410,
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "X-Robots-Tag": "noindex, nofollow",
        },
      });
    }
    const targetUrl = new URL(redirectRule.destination, request.url);
    return NextResponse.redirect(targetUrl, { status: redirectRule.status });
  }

  // 2. Dynamic per-request nonce CSP
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);

  let response = NextResponse.next({
    request: { headers: requestHeaders },
  });

  const applySecurityHeaders = (res: NextResponse) => {
    res.headers.set("Content-Security-Policy", buildCsp(nonce));

    const host = request.headers.get("host") || "";
    const isPreviewHost = host.endsWith(".vercel.app");
    const isNoindexRoute = NOINDEX_PREFIXES.some((prefix) => pathname.startsWith(prefix));
    if (isPreviewHost || isNoindexRoute) {
      res.headers.set("X-Robots-Tag", "noindex, nofollow");
    }
    return res;
  };

  // 3. Optional Wave A contingency portal disable check (default true = all 5 live)
  if (pathname.startsWith("/client") && process.env.PORTAL_CLIENT_ENABLED === "false") {
    return applySecurityHeaders(new NextResponse("Client Portal disabled by deployment flag.", { status: 404 }));
  }
  if (pathname.startsWith("/intern") && process.env.PORTAL_INTERN_ENABLED === "false") {
    return applySecurityHeaders(new NextResponse("Intern Portal disabled by deployment flag.", { status: 404 }));
  }

  // 4. Refresh Supabase session & enforce Edge gate on authenticated portal pages
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const isPortalPage = PORTAL_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );

  if (
    supabaseUrl &&
    supabaseAnon &&
    !supabaseUrl.includes("your-project-ref") &&
    !supabaseUrl.includes("example.supabase.co")
  ) {
    const supabase = createServerClient(supabaseUrl, supabaseAnon, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request: { headers: requestHeaders } });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    });

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (isPortalPage && !user) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("next", pathname);
      return applySecurityHeaders(NextResponse.redirect(loginUrl));
    }
  } else if (isPortalPage) {
    // Redirect unconfigured portal access cleanly to /login where guidance is shown
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return applySecurityHeaders(NextResponse.redirect(loginUrl));
  }

  return applySecurityHeaders(response);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|brand/.*\\.(?:svg|png|jpg|jpeg|webp)).*)",
  ],
};
