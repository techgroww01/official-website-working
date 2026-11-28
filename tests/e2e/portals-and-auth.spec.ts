import { expect, test } from "@playwright/test";
import {
  AUTH_ROUTES,
  PORTAL_ROOTS,
  PORTAL_SUBROUTES,
} from "./helpers/constants";
import {
  attachRuntimeCollectors,
  preSeedCookieConsent,
  uniqueTestIp,
} from "./helpers/fixtures";

test.describe("Tier 1C, Tier 2A & Tier 3 — Portals, /notifications, Auth & Recovery", () => {
  test("T1-PORTAL-01: GET /api/v1/health returns 200 healthy status payload", async ({
    request,
  }) => {
    const res = await request.get("/api/v1/health");
    expect(res.status()).toBe(200);
    const json = (await res.json()) as {
      ok?: boolean;
      data?: { status?: string; service?: string };
    };
    expect(json.ok).toBe(true);
    expect(json.data?.status).toBe("healthy");
    expect(json.data?.service).toBe("techgroww-platform");
  });

  test("T1-PORTAL-02: all 5 portal roots redirect unauthenticated requests to /login?next=<portal> with noindex", async ({
    request,
  }) => {
    for (const root of PORTAL_ROOTS) {
      const res = await request.get(root, { maxRedirects: 0 });
      expect(res.status(), `${root} expected redirect`).toBe(307);
      const location = res.headers()["location"] ?? "";
      expect(location, `${root} redirect target`).toContain(
        `/login?next=${encodeURIComponent(root)}`
      );
      expect(res.headers()["x-robots-tag"]).toContain("noindex");
    }
  });

  test("T1-PORTAL-03: nested portal subroutes redirect unauthenticated requests to /login?next=<subroute>", async ({
    request,
  }) => {
    for (const subroute of PORTAL_SUBROUTES) {
      const res = await request.get(subroute, { maxRedirects: 0 });
      expect(res.status(), `${subroute} expected redirect`).toBe(307);
      const location = res.headers()["location"] ?? "";
      expect(location, `${subroute} redirect target`).toContain(
        `/login?next=${encodeURIComponent(subroute)}`
      );
      expect(res.headers()["x-robots-tag"]).toContain("noindex");
    }
  });

  test("T1-PORTAL-04: /notifications is auth-gated (redirects to /login?next=/notifications, never 404)", async ({
    request,
  }) => {
    const res = await request.get("/notifications", { maxRedirects: 0 });
    expect(res.status(), "/notifications must not return 404").not.toBe(404);
    expect(res.status()).toBe(307);
    const location = res.headers()["location"] ?? "";
    expect(location).toContain(
      `/login?next=${encodeURIComponent("/notifications")}`
    );
  });

  test("T1-PORTAL-05: auth entry pages render 200 with noindex, accessible H1, and /auth/callback without code redirects", async ({
    page,
    request,
  }) => {
    await preSeedCookieConsent(page, "essential");
    const collectors = attachRuntimeCollectors(page);

    for (const route of AUTH_ROUTES) {
      const res = await page.goto(route);
      expect(res?.status(), `${route} status`).toBe(200);
      expect(res?.headers()["x-robots-tag"]).toContain("noindex");
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    }

    const cbRes = await request.get("/auth/callback", { maxRedirects: 0 });
    expect(cbRes.status()).toBe(307);
    expect(cbRes.headers()["location"] ?? "").toContain(
      "/login?error=oauth_unavailable"
    );

    collectors.assertClean("auth entry pages");
  });

  test("T1-PORTAL-06: GET /api/v1/public/certificates/TG-CERT-2026-DEMO returns 200 valid JSON", async ({
    request,
  }) => {
    const res = await request.get(
      "/api/v1/public/certificates/TG-CERT-2026-DEMO"
    );
    expect(res.status()).toBe(200);
    const json = (await res.json()) as {
      ok?: boolean;
      data?: { valid?: boolean; certificateCode?: string };
    };
    expect(json.ok).toBe(true);
    expect(json.data?.valid).toBe(true);
    expect(json.data?.certificateCode).toBe("TG-CERT-2026-DEMO");
  });

  test("T2-AUTH-01: /reset-password validates length/mismatch and /login renders role=alert cleanly on unconfigured auth", async ({
    page,
    context,
  }, testInfo) => {
    await preSeedCookieConsent(page, "essential");

    await page.goto("/reset-password");
    await page.evaluate(() => {
      const form = document.querySelector("form");
      if (form) form.noValidate = true;
    });

    await page.getByLabel("New Password").fill("short123");
    await page.getByLabel("Confirm New Password").fill("short123");
    await page.getByRole("button", { name: "Update Password" }).click();
    await expect(page.getByRole("alert")).toContainText(
      /at least 12 characters/i
    );

    await page.getByLabel("New Password").fill("ValidLongPassword123!");
    await page
      .getByLabel("Confirm New Password")
      .fill("DifferentLongPassword123!");
    await page.getByRole("button", { name: "Update Password" }).click();
    await expect(page.getByRole("alert")).toContainText(/do not match/i);

    if (testInfo.project.name === "desktop-chromium") {
      await context.setExtraHTTPHeaders({
        "x-real-ip": uniqueTestIp(2, 21),
      });
      await page.goto("/login");
      await page.getByLabel("Email Address").fill("staff@techgroww.co.in");
      await page.getByLabel("Password").fill("ValidLongPassword123!");
      const [loginRes] = await Promise.all([
        page.waitForResponse(
          (r) =>
            r.url().includes("/api/v1/auth/login") &&
            r.request().method() === "POST"
        ),
        page.getByRole("button", { name: /^Sign In$/i }).click(),
      ]);
      expect([401, 503]).toContain(loginRes.status());
      await expect(page.getByRole("alert")).toBeVisible();
    }
  });

  test("T3-FLOW-06: unauthenticated /client/projects -> /login?next=... -> /forgot-password -> /login", async ({
    page,
  }) => {
    await preSeedCookieConsent(page, "essential");

    await page.goto("/client/projects");
    await expect(page).toHaveURL(/\/login\?next=%2Fclient%2Fprojects/);
    await page.getByRole("link", { name: "Forgot password?" }).click();
    await expect(page).toHaveURL(/\/forgot-password/);

    await page.getByLabel("Account Email").fill("client@example.com");
    await page.getByRole("button", { name: "Send Recovery Link" }).click();
    await page.getByRole("link", { name: "Sign In" }).click();
    await expect(page).toHaveURL(/\/login$/);
  });
});
