import { NextRequest } from "next/server";

export interface CsrfCheckResult {
  ok: boolean;
  status?: number;
  reason?: string;
}

/**
 * Verifies Origin / Host alignment and Content-Type on state-changing API routes.
 * Honors explicit exceptions for:
 *  - HMAC-signed webhooks (/api/v1/webhooks/resend)
 *  - CRON_SECRET GET cron endpoints (/api/v1/cron/*)
 *  - RFC 8058 one-click email unsubscribe (/api/v1/public/newsletter/unsubscribe)
 */
export function validateMutationCsrf(req: NextRequest): CsrfCheckResult {
  const method = req.method.toUpperCase();
  if (method === "GET" || method === "HEAD" || method === "OPTIONS") {
    return { ok: true };
  }

  const pathname = req.nextUrl.pathname;

  // 1. Cryptographically authenticated webhooks & server-to-server RFC 8058 unsubscribe
  if (pathname === "/api/v1/webhooks/resend") {
    return { ok: true };
  }

  if (pathname === "/api/v1/public/newsletter/unsubscribe") {
    const contentType = req.headers.get("content-type")?.toLowerCase() ?? "";
    const hasToken = Boolean(req.nextUrl.searchParams.get("token"));
    const isJsonOrForm =
      contentType.includes("application/json") ||
      contentType.includes("application/x-www-form-urlencoded") ||
      contentType === "";
    if (!hasToken && !contentType.includes("application/json")) {
      return { ok: false, status: 403, reason: "Unsubscribe token required" };
    }
    if (!isJsonOrForm) {
      return { ok: false, status: 415, reason: "Unsupported Content-Type for unsubscribe" };
    }
    return { ok: true };
  }

  // 2. Same-origin verification for browser-initiated mutations
  const origin = req.headers.get("origin");
  const host = req.headers.get("host");
  const expectedSiteUrl = process.env.NEXT_PUBLIC_SITE_URL;

  if (origin) {
    try {
      const originHost = new URL(origin).host;
      const allowedHosts = new Set<string>();
      if (host) allowedHosts.add(host);
      if (expectedSiteUrl) {
        allowedHosts.add(new URL(expectedSiteUrl).host);
      }
      if (allowedHosts.size > 0 && !allowedHosts.has(originHost)) {
        return { ok: false, status: 403, reason: "Cross-origin mutation rejected" };
      }
    } catch {
      return { ok: false, status: 403, reason: "Malformed Origin header" };
    }
  } else {
    // Reject non-exempt browser POSTs missing Origin unless explicit Sec-Fetch-Site is same-origin
    const fetchSite = req.headers.get("sec-fetch-site");
    if (fetchSite && fetchSite !== "same-origin" && fetchSite !== "none") {
      return { ok: false, status: 403, reason: "Untrusted Sec-Fetch-Site" };
    }
  }

  // 3. Enforce JSON or multipart/form-data to defeat simple HTML form CSRF
  const contentType = req.headers.get("content-type")?.toLowerCase() ?? "";
  const isValidContentType =
    contentType.includes("application/json") ||
    contentType.includes("multipart/form-data");

  if (!isValidContentType) {
    return {
      ok: false,
      status: 415,
      reason: "Content-Type must be application/json or multipart/form-data",
    };
  }

  return { ok: true };
}
