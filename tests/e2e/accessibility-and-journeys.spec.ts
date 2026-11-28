import { expect, test } from "@playwright/test";
import { runWcag22Scan } from "./helpers/a11y";
import {
  ALL_PUBLIC_AND_AUTH_ROUTES,
  ALL_PUBLIC_ROUTES,
  AUTH_ROUTES,
} from "./helpers/constants";
import {
  attachRuntimeCollectors,
  createValidPdfBuffer,
  preSeedCookieConsent,
  uniqueTestIp,
} from "./helpers/fixtures";

test.describe("Tier 4 — WCAG 2.2 AA Accessibility, Sitewide Crawl & End-to-End Journeys", () => {
  test("T4-A11Y-01: WCAG 2.2 AA axe scan passes with zero violations across public routes, auth routes, and mobile drawer", async ({
    page,
  }, testInfo) => {
    test.slow();
    await preSeedCookieConsent(page, "essential");

    for (const route of [...ALL_PUBLIC_ROUTES, "/404-nonexistent", ...AUTH_ROUTES]) {
      await page.goto(route);
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
      await runWcag22Scan(page, `${testInfo.project.name} ${route}`);
    }

    if (testInfo.project.name === "mobile-chromium") {
      await page.goto("/");
      await page.getByRole("button", { name: "Open navigation menu" }).click();
      await expect(
        page.getByRole("dialog", { name: "Mobile navigation drawer" })
      ).toBeVisible();
      await runWcag22Scan(page, "mobile-chromium open drawer");
    }
  });

  test("T4-CONSOLE-01: full-site crawl records zero console.error, pageerror, 5xx, or broken static assets", async ({
    page,
  }) => {
    test.slow();
    await preSeedCookieConsent(page, "essential");
    const collectors = attachRuntimeCollectors(page);

    for (const route of ALL_PUBLIC_AND_AUTH_ROUTES) {
      const res = await page.goto(route);
      expect(res?.status(), `${route} expected 200`).toBe(200);
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    }

    collectors.assertClean("T4-CONSOLE-01 full-site crawl");
  });

  test("T4-JOURNEY-01: full B2B Buyer discovery-to-inquiry and Candidate application-to-status journeys", async ({
    page,
    context,
  }, testInfo) => {
    test.skip(
      testInfo.project.name !== "desktop-chromium",
      "Rate-limit isolation: full mutation journeys run on desktop-chromium"
    );

    const collectors = attachRuntimeCollectors(page);
    await context.setExtraHTTPHeaders({
      "x-real-ip": uniqueTestIp(4, 1),
    });

    // --- Part A: Prospective B2B Buyer Journey ---
    await page.goto("/");

    const cookieBanner = page.getByRole("complementary", {
      name: "Cookie consent notice",
    });
    if (await cookieBanner.isVisible()) {
      await cookieBanner.getByRole("button", { name: "Essential only" }).click();
      await expect(cookieBanner).toBeHidden();
    }

    // Inspect InteractiveBlueprint -> select Salesforce
    const blueprint = page.locator("#services-blueprint");
    await blueprint
      .getByRole("button", { name: /Salesforce Ecosystem Solutions/i })
      .first()
      .click();
    await expect(
      blueprint.getByRole("heading", {
        level: 3,
        name: /Salesforce Ecosystem Solutions/i,
      })
    ).toBeVisible();

    // Inspect Work blueprint
    await page
      .getByRole("navigation", { name: "Primary Navigation" })
      .getByRole("link", { name: "Work" })
      .click();
    await expect(page).toHaveURL(/\/work$/);
    await page
      .getByRole("link", { name: /Unified Sales-to-Client Delivery/i })
      .click();
    await expect(page).toHaveURL(/\/work\/b2b-salesforce-portal-blueprint/);

    // Read Insights article
    await page
      .getByRole("navigation", { name: "Primary Navigation" })
      .getByRole("link", { name: "Insights" })
      .click();
    await expect(page).toHaveURL(/\/insights$/);
    await page
      .getByRole("link", { name: /Salesforce OmniStudio/i })
      .click();
    await expect(page).toHaveURL(
      /\/insights\/salesforce-omnistudio-and-web-portals/
    );

    // Navigate via ProblemSelector path or Contact link with preselected service
    await page.goto("/contact?service=salesforce-solutions");
    await expect(page.getByLabel(/Primary Discipline/i)).toHaveValue(
      "salesforce-solutions"
    );

    await page.getByLabel(/Full Name/i).fill("Anirudh Deshmukh");
    await page.getByLabel(/Work Email/i).fill("anirudh@example.com");
    await page
      .getByLabel(/Project Scope/i)
      .fill(
        "Looking to build a partner portal backed by Salesforce OmniStudio and Next.js."
      );
    await page
      .getByRole("checkbox", { name: /I consent to Tech Groww/i })
      .check();

    const [contactRes] = await Promise.all([
      page.waitForResponse(
        (r) =>
          r.url().includes("/api/v1/public/contact") &&
          r.request().method() === "POST"
      ),
      page.getByRole("button", { name: /Submit Scoped Inquiry/i }).click(),
    ]);
    expect(contactRes.status()).toBe(201);
    await expect(page.getByRole("status")).toBeVisible();

    // Subscribe to newsletter in SiteFooter
    const footer = page.getByRole("contentinfo");
    await footer
      .getByLabel("Work email address")
      .fill("anirudh.brief@example.com");
    await footer.getByRole("checkbox", { name: /Privacy Policy/i }).check();
    const [subRes] = await Promise.all([
      page.waitForResponse(
        (r) =>
          r.url().includes("/api/v1/public/newsletter/subscribe") &&
          r.request().method() === "POST"
      ),
      footer.getByRole("button", { name: /^Subscribe$/i }).click(),
    ]);
    expect(subRes.status()).toBe(200);

    // --- Part B: Candidate Application Journey ---
    await footer.getByRole("link", { name: "Careers", exact: true }).click();
    await expect(page).toHaveURL(/\/careers$/);

    await page.getByRole("link", { name: /Internship/i }).first().click();
    await expect(page).toHaveURL(/\/careers\/internships/);

    await page
      .getByRole("link", { name: /Apply|Sales Intern/i })
      .first()
      .click();
    await expect(page).toHaveURL(/\/careers\/sales-intern-2-month-cohort/);

    await page.getByLabel(/Full Name/i).fill("Meera Iyer");
    await page.getByLabel(/Email Address/i).fill("meera.iyer@example.com");
    await page.getByLabel(/Phone Number/i).fill("9822334455");
    await page.getByLabel(/Resume \(PDF or DOCX/i).setInputFiles({
      name: "meera-cv.pdf",
      mimeType: "application/pdf",
      buffer: createValidPdfBuffer(),
    });
    await page
      .getByRole("checkbox", { name: /180-day automated DPDP/i })
      .check();

    const [appRes] = await Promise.all([
      page.waitForResponse(
        (r) =>
          r.url().endsWith("/api/v1/public/applications") &&
          r.request().method() === "POST"
      ),
      page.getByRole("button", { name: /Submit Application/i }).click(),
    ]);
    expect(appRes.status()).toBe(201);

    const statusLink = page.getByRole("link", {
      name: "Track application status",
    });
    await expect(statusLink).toBeVisible();
    await statusLink.click();
    await expect(page).toHaveURL(/\/careers\/status\?token=/);
    await expect(
      page.getByRole("heading", { level: 1, name: /Application Status Lookup/i })
    ).toBeVisible();

    collectors.assertClean("T4-JOURNEY-01 buyer & candidate journeys");
  });
});
