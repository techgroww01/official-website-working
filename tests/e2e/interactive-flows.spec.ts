import { expect, test } from "@playwright/test";
import {
  attachRuntimeCollectors,
  createDisallowedSvgBuffer,
  createValidDocxBuffer,
  createValidPdfBuffer,
  preSeedCookieConsent,
  uniqueTestIp,
} from "./helpers/fixtures";

test.describe("Tier 1D/1E, Tier 2A & Tier 3 — Interactive Widgets, Loading States, Forms & Pairwise Flows", () => {
  test("T1-UI-01: CapabilityMarquee pause/play toggles aria-pressed, data-paused, and CSS animationPlayState", async ({
    page,
  }) => {
    await preSeedCookieConsent(page, "essential");
    await page.goto("/");

    const region = page.getByRole("region", {
      name: "Core engineering capabilities",
    });
    const toggle = region.getByRole("button", {
      name: /Pause scrolling capability ribbon/i,
    });

    await expect(toggle).toHaveAttribute("aria-pressed", "false");
    await expect(region).toHaveAttribute("data-paused", "false");

    await toggle.click();
    const playToggle = region.getByRole("button", {
      name: /Play scrolling capability ribbon/i,
    });
    await expect(playToggle).toHaveAttribute("aria-pressed", "true");
    await expect(region).toHaveAttribute("data-paused", "true");

    const pausedState = await region.evaluate((el) => {
      const track = el.querySelector('div[aria-hidden="true"] > div');
      return track ? window.getComputedStyle(track).animationPlayState : null;
    });
    expect(pausedState).toBe("paused");

    await playToggle.click();
    await expect(
      region.getByRole("button", { name: /Pause scrolling capability ribbon/i })
    ).toHaveAttribute("aria-pressed", "false");
  });

  test("T1-UI-02 & T1-UI-03: InteractiveBlueprint switches disciplines on desktop split and mobile/tablet accordion", async ({
    page,
  }, testInfo) => {
    await preSeedCookieConsent(page, "essential");
    await page.goto("/");

    const blueprint = page.locator("#services-blueprint");

    if (testInfo.project.name === "desktop-chromium") {
      const webBtn = blueprint
        .getByRole("button", { name: /Custom Web & Mobile Engineering/i })
        .first();
      await expect(webBtn).toHaveAttribute("aria-current", "true");

      const sfBtn = blueprint
        .getByRole("button", { name: /Salesforce Ecosystem Solutions/i })
        .first();
      await sfBtn.click();
      await expect(sfBtn).toHaveAttribute("aria-current", "true");
      await expect(
        blueprint.getByRole("heading", {
          level: 3,
          name: /Salesforce Ecosystem Solutions/i,
        })
      ).toBeVisible();
      await expect(
        blueprint.getByRole("link", { name: "Full Blueprint" })
      ).toHaveAttribute("href", "/services/salesforce-solutions");
    } else {
      const sfAccordionBtn = blueprint
        .getByRole("button", { name: /Salesforce Ecosystem Solutions/i })
        .first();
      await sfAccordionBtn.click();
      await expect(sfAccordionBtn).toHaveAttribute("aria-expanded", "true");
      const exploreLink = blueprint.getByRole("link", {
        name: /Explore Salesforce Ecosystem Solutions/i,
      });
      await expect(exploreLink).toBeVisible();
      await expect(exploreLink).toHaveAttribute(
        "href",
        "/services/salesforce-solutions"
      );
    }
  });

  test("T1-UI-04: ProblemSelector updates radio aria-checked and Scope CTA href across all 5 bottlenecks", async ({
    page,
  }) => {
    await preSeedCookieConsent(page, "essential");
    await page.goto("/");

    const group = page.getByRole("radiogroup", {
      name: "Operational bottleneck options",
    });
    const radios = group.getByRole("radio");
    const count = await radios.count();
    expect(count).toBe(5);
    await expect(radios.first()).toHaveAttribute("aria-checked", "true");

    const expectedHrefs = [
      "/contact?service=web-mobile-engineering",
      "/contact?service=salesforce-solutions",
      "/contact?service=enterprise-software",
      "/contact?service=ui-ux-design",
      "/contact?service=it-consulting",
    ];

    const scopeCta = page.getByRole("link", { name: "Scope this challenge" });
    for (let i = 0; i < count; i++) {
      await radios.nth(i).click();
      await expect(radios.nth(i)).toHaveAttribute("aria-checked", "true");
      await expect(scopeCta).toHaveAttribute("href", expectedHrefs[i]!);
    }
  });

  test("T1-UI-05: DeliveryRail renders all 5 stages cleanly when scrolled into view", async ({
    page,
  }) => {
    await preSeedCookieConsent(page, "essential");
    await page.goto("/");

    const stageHeadings = [
      /Understand the business problem/i,
      /Architect & scope cleanly/i,
      /Iterative engineering build/i,
      /Verify quality & security/i,
      /Accountable launch & support/i,
    ];

    for (const pattern of stageHeadings) {
      const heading = page.getByRole("heading", { name: pattern });
      await heading.scrollIntoViewIfNeeded();
      await expect(heading).toBeVisible();
    }
  });

  test("T1-UI-06: FaqAccordion toggles aria-expanded and settles cleanly", async ({
    page,
  }) => {
    await preSeedCookieConsent(page, "essential");
    await page.goto("/");

    const firstFaq = page.getByRole("button", {
      name: /Tech Groww was founded in 2026/i,
    });
    const thirdFaq = page.getByRole("button", {
      name: /How do you price projects/i,
    });

    await expect(firstFaq).toHaveAttribute("aria-expanded", "true");
    await expect(thirdFaq).toHaveAttribute("aria-expanded", "false");

    await thirdFaq.click();
    await expect(thirdFaq).toHaveAttribute("aria-expanded", "true");
    await expect(firstFaq).toHaveAttribute("aria-expanded", "false");

    await thirdFaq.click();
    await expect(thirdFaq).toHaveAttribute("aria-expanded", "false");
  });

  test("T1-UI-07: WorkFilterGrid switches category tabs and filters visible cards", async ({
    page,
  }) => {
    await preSeedCookieConsent(page, "essential");
    await page.goto("/work");

    const tablist = page.getByRole("tablist", {
      name: "Filter work by category",
    });
    const allTab = tablist.getByRole("tab", { name: "All" });
    const blueprintTab = tablist.getByRole("tab", {
      name: "Reference Blueprints",
    });
    const internalTab = tablist.getByRole("tab", {
      name: "Internal Products",
    });

    await expect(allTab).toHaveAttribute("aria-selected", "true");
    await blueprintTab.click();
    await expect(blueprintTab).toHaveAttribute("aria-selected", "true");
    await expect(
      page.getByRole("link", { name: /Unified Sales-to-Client Delivery/i })
    ).toBeVisible();

    await internalTab.click();
    await expect(internalTab).toHaveAttribute("aria-selected", "true");
    await expect(
      page.getByText(/No items currently published in this category/i)
    ).toBeVisible();

    await allTab.click();
    await expect(allTab).toHaveAttribute("aria-selected", "true");
  });

  test("T1-UI-08: CookieBanner persists Essential only and Allow analytics in localStorage across reloads", async ({
    browser,
  }) => {
    const ctxEssential = await browser.newContext();
    const page1 = await ctxEssential.newPage();
    await page1.goto("/");
    const banner1 = page1.getByRole("complementary", {
      name: "Cookie consent notice",
    });
    await expect(banner1).toBeVisible();
    await banner1.getByRole("button", { name: "Essential only" }).click();
    await expect(banner1).toBeHidden();
    const stored1 = await page1.evaluate(() =>
      window.localStorage.getItem("tg_cookie_consent_v1")
    );
    expect(stored1).toBe("essential");
    expect(await page1.locator("#tg-ga4-script").count()).toBe(0);
    await page1.reload();
    await expect(banner1).toBeHidden();
    await ctxEssential.close();

    const ctxAnalytics = await browser.newContext();
    const page2 = await ctxAnalytics.newPage();
    await page2.goto("/");
    const banner2 = page2.getByRole("complementary", {
      name: "Cookie consent notice",
    });
    await expect(banner2).toBeVisible();
    await banner2.getByRole("button", { name: "Allow analytics" }).click();
    await expect(banner2).toBeHidden();
    const stored2 = await page2.evaluate(() =>
      window.localStorage.getItem("tg_cookie_consent_v1")
    );
    expect(stored2).toBe("analytics");
    await ctxAnalytics.close();
  });

  test("T1-UI-09: SSR H1 settles immediately without stuck aria-busy overlays", async ({
    page,
  }) => {
    await preSeedCookieConsent(page, "essential");
    await page.goto("/");

    const h1 = page.getByRole("heading", {
      level: 1,
      name: /Technology that drives growth\./i,
    });
    await expect(h1).toBeVisible();
    await expect(h1).toHaveCSS("opacity", "1");
    await expect(page.locator('[aria-busy="true"]')).toHaveCount(0);
  });

  test("T1-FORM-01: ContactForm happy path submits 201 and displays role=status confirmation", async ({
    page,
    context,
  }, testInfo) => {
    test.skip(
      testInfo.project.name !== "desktop-chromium",
      "Rate-limit isolation: form mutation happy path runs on desktop-chromium with unique IP"
    );

    await preSeedCookieConsent(page, "essential");
    await context.setExtraHTTPHeaders({
      "x-real-ip": uniqueTestIp(1, 10),
    });

    await page.goto("/contact");
    await page.getByLabel(/Full Name/i).fill("Aarav Mehta");
    await page.getByLabel(/Work Email/i).fill("aarav@example.com");
    await page.getByLabel(/Company \/ Organization/i).fill("Example Logistics");
    await page
      .getByLabel(/Project Scope/i)
      .fill(
        "We need a custom Next.js customer portal integrated with Salesforce CRM workflows."
      );
    await page
      .getByRole("checkbox", { name: /I consent to Tech Groww/i })
      .check();

    const [res] = await Promise.all([
      page.waitForResponse(
        (r) =>
          r.url().includes("/api/v1/public/contact") &&
          r.request().method() === "POST"
      ),
      page.getByRole("button", { name: /Submit Scoped Inquiry/i }).click(),
    ]);

    expect(res.status()).toBe(201);
    const statusBanner = page.getByRole("status");
    await expect(statusBanner).toBeVisible();
    await expect(statusBanner).toContainText(/Inquiry/i);
  });

  test("T1-FORM-02: SiteFooter newsletter subscribes cleanly (200) matching API Zod schema", async ({
    page,
    context,
  }, testInfo) => {
    test.skip(
      testInfo.project.name !== "desktop-chromium",
      "Rate-limit isolation: newsletter happy path runs on desktop-chromium with unique IP"
    );

    await preSeedCookieConsent(page, "essential");
    await context.setExtraHTTPHeaders({
      "x-real-ip": uniqueTestIp(1, 11),
    });

    await page.goto("/");
    const footer = page.getByRole("contentinfo");
    await footer
      .getByLabel("Work email address")
      .fill("briefings@example.com");
    await footer.getByRole("checkbox", { name: /Privacy Policy/i }).check();

    const [res] = await Promise.all([
      page.waitForResponse(
        (r) =>
          r.url().includes("/api/v1/public/newsletter/subscribe") &&
          r.request().method() === "POST"
      ),
      footer.getByRole("button", { name: /^Subscribe$/i }).click(),
    ]);

    expect(res.status()).toBe(200);
    await expect(footer).toContainText(/Subscription|confirm/i);
  });

  test("T1-FORM-03: ApplicationForm happy path with valid PDF submits 201 and renders status link", async ({
    page,
    context,
  }, testInfo) => {
    test.skip(
      testInfo.project.name !== "desktop-chromium",
      "Rate-limit isolation: application upload happy path runs on desktop-chromium"
    );

    await preSeedCookieConsent(page, "essential");
    await context.setExtraHTTPHeaders({
      "x-real-ip": uniqueTestIp(1, 12),
    });

    await page.goto("/careers/sales-executive-greater-noida");
    await page.getByLabel(/Full Name/i).fill("Priya Verma");
    await page.getByLabel(/Email Address/i).fill("priya.verma@example.com");
    await page.getByLabel(/Phone Number/i).fill("9876543210");
    await page.getByLabel(/Resume \(PDF or DOCX/i).setInputFiles({
      name: "resume.pdf",
      mimeType: "application/pdf",
      buffer: createValidPdfBuffer(),
    });
    await page
      .getByRole("checkbox", { name: /180-day automated DPDP/i })
      .check();

    const [res] = await Promise.all([
      page.waitForResponse(
        (r) =>
          r.url().endsWith("/api/v1/public/applications") &&
          r.request().method() === "POST"
      ),
      page.getByRole("button", { name: /Submit Application/i }).click(),
    ]);

    expect(res.status()).toBe(201);
    const statusBox = page.getByRole("status");
    await expect(statusBox).toBeVisible();
    await expect(
      statusBox.getByRole("link", { name: "Track application status" })
    ).toHaveAttribute("href", /\/careers\/status\?token=/);
  });

  test("T1-FORM-04: ApplicationForm happy path with valid DOCX ZIP archive succeeds (201)", async ({
    page,
    context,
  }, testInfo) => {
    test.skip(
      testInfo.project.name !== "desktop-chromium",
      "Rate-limit isolation: DOCX upload happy path runs on desktop-chromium"
    );

    await preSeedCookieConsent(page, "essential");
    await context.setExtraHTTPHeaders({
      "x-real-ip": uniqueTestIp(1, 13),
    });

    await page.goto("/careers/sales-intern-2-month-cohort");
    await page.getByLabel(/Full Name/i).fill("Rohan Kulkarni");
    await page.getByLabel(/Email Address/i).fill("rohan.k@example.com");
    await page.getByLabel(/Phone Number/i).fill("9123456789");
    await page.getByLabel(/Resume \(PDF or DOCX/i).setInputFiles({
      name: "resume.docx",
      mimeType:
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      buffer: createValidDocxBuffer(),
    });
    await page
      .getByRole("checkbox", { name: /180-day automated DPDP/i })
      .check();

    const [res] = await Promise.all([
      page.waitForResponse(
        (r) =>
          r.url().endsWith("/api/v1/public/applications") &&
          r.request().method() === "POST"
      ),
      page.getByRole("button", { name: /Submit Application/i }).click(),
    ]);

    expect(res.status()).toBe(201);
    await expect(page.getByRole("status")).toContainText(/submitted securely/i);
  });

  test("T1-FORM-05: ForgotPasswordPage submits cleanly and shows Sign In link", async ({
    page,
    context,
  }, testInfo) => {
    test.skip(
      testInfo.project.name !== "desktop-chromium",
      "Rate-limit isolation: forgot-password form submission runs on desktop-chromium with unique IP"
    );

    await preSeedCookieConsent(page, "essential");
    await context.setExtraHTTPHeaders({
      "x-real-ip": uniqueTestIp(1, 14),
    });

    await page.goto("/forgot-password");
    await page.getByLabel("Account Email").fill("user@example.com");
    const [res] = await Promise.all([
      page.waitForResponse(
        (r) =>
          r.url().includes("/api/v1/auth/forgot-password") &&
          r.request().method() === "POST"
      ),
      page.getByRole("button", { name: "Send Recovery Link" }).click(),
    ]);
    expect(res.status()).toBe(200);
    await expect(page.getByText(/Request processed\./i)).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Sign In" })
    ).toHaveAttribute("href", "/login");
  });

  test("T2-FORM-01, T2-FORM-03, T2-FORM-04, T2-FORM-05: client-side guards and disallowed .svg rejection", async ({
    page,
    context,
  }, testInfo) => {
    test.skip(
      testInfo.project.name !== "desktop-chromium",
      "Validation boundary UI suite runs on desktop-chromium"
    );

    await preSeedCookieConsent(page, "essential");
    await context.setExtraHTTPHeaders({
      "x-real-ip": uniqueTestIp(2, 10),
    });

    // ContactForm missing DPDP consent guard (bypass HTML5 required via novalidate check or direct button after filling inputs except consent)
    await page.goto("/contact");
    await page.evaluate(() => {
      const form = document.querySelector("form");
      if (form) form.noValidate = true;
    });
    await page.getByLabel(/Full Name/i).fill("Aarav Mehta");
    await page.getByLabel(/Work Email/i).fill("aarav@example.com");
    await page
      .getByLabel(/Project Scope/i)
      .fill("Need a custom B2B platform architecture review.");
    await page.getByRole("button", { name: /Submit Scoped Inquiry/i }).click();
    await expect(page.getByRole("status")).toContainText(
      /Please confirm the DPDP privacy notice/i
    );

    // SiteFooter newsletter missing consent guard
    const footer = page.getByRole("contentinfo");
    await footer.getByLabel("Work email address").fill("user@example.com");
    await footer.getByRole("button", { name: /^Subscribe$/i }).click();
    await expect(footer).toContainText(
      /Please confirm consent to receive updates/i
    );

    // ApplicationForm missing file guard & disallowed .svg upload (415)
    await page.goto("/careers/sales-executive-greater-noida");
    await page.evaluate(() => {
      const forms = document.querySelectorAll("main form");
      forms.forEach((f) => {
        (f as HTMLFormElement).noValidate = true;
      });
    });
    await page.getByLabel(/Full Name/i).fill("Test Applicant");
    await page.getByLabel(/Email Address/i).fill("applicant@example.com");
    await page.getByLabel(/Phone Number/i).fill("9988776655");
    await page
      .getByRole("checkbox", { name: /180-day automated DPDP/i })
      .check();
    await page.getByRole("button", { name: /Submit Application/i }).click();
    await expect(page.getByRole("status")).toContainText(
      /Please attach your resume/i
    );

    await page.getByLabel(/Resume \(PDF or DOCX/i).setInputFiles({
      name: "malicious.svg",
      mimeType: "image/svg+xml",
      buffer: createDisallowedSvgBuffer(),
    });
    const [uploadIntentRes] = await Promise.all([
      page.waitForResponse((r) =>
        r.url().includes("/api/v1/public/applications/upload-url")
      ),
      page.getByRole("button", { name: /Submit Application/i }).click(),
    ]);
    expect(uploadIntentRes.status()).toBe(415);
    await expect(page.getByRole("status")).toContainText(
      /SVG uploads are prohibited/i
    );
  });

  test("T2-LOAD-01: deterministic loading-state disabled button during flight and re-enablement on error", async ({
    page,
  }, testInfo) => {
    test.skip(
      testInfo.project.name !== "desktop-chromium",
      "Loading state route-deferral test runs on desktop-chromium"
    );

    await preSeedCookieConsent(page, "essential");

    let releaseRoute!: () => void;
    const holdPromise = new Promise<void>((resolve) => {
      releaseRoute = resolve;
    });

    await page.route("**/api/v1/public/contact", async (route) => {
      await holdPromise;
      await route.fulfill({
        status: 503,
        contentType: "application/json",
        body: JSON.stringify({
          ok: false,
          error: { message: "Temporary service maintenance." },
        }),
      });
    });

    await page.goto("/contact");
    await page.getByLabel(/Full Name/i).fill("Loading Test");
    await page.getByLabel(/Work Email/i).fill("loading@example.com");
    await page
      .getByLabel(/Project Scope/i)
      .fill("Verifying deterministic loading button disabled state.");
    await page
      .getByRole("checkbox", { name: /I consent to Tech Groww/i })
      .check();

    await page.getByRole("button", { name: /Submit Scoped Inquiry/i }).click();
    const loadingBtn = page.getByRole("button", { name: /Sending Inquiry/i });
    await expect(loadingBtn).toBeVisible();
    await expect(loadingBtn).toBeDisabled();

    releaseRoute();

    const restoredBtn = page.getByRole("button", {
      name: /Submit Scoped Inquiry/i,
    });
    await expect(restoredBtn).toBeVisible();
    await expect(restoredBtn).toBeEnabled();
    await expect(page.getByRole("status")).toContainText(
      /Temporary service maintenance/i
    );
  });

  test("T3-FLOW-01: ProblemSelector -> /contact?service=salesforce-solutions pre-fill -> submit", async ({
    page,
    context,
  }, testInfo) => {
    test.skip(
      testInfo.project.name !== "desktop-chromium",
      "Rate-limit isolation: pairwise submission flow runs on desktop-chromium"
    );

    await preSeedCookieConsent(page, "essential");
    await context.setExtraHTTPHeaders({
      "x-real-ip": uniqueTestIp(3, 1),
    });

    await page.goto("/");
    await page
      .getByRole("radio", {
        name: /Our Salesforce CRM, Flows, or OmniStudio setup is stalled/i,
      })
      .click();
    await page.getByRole("link", { name: "Scope this challenge" }).click();
    await expect(page).toHaveURL(/\/contact\?service=salesforce-solutions/);
    await expect(page.getByLabel(/Primary Discipline/i)).toHaveValue(
      "salesforce-solutions"
    );

    await page.getByLabel(/Full Name/i).fill("Vikram Nair");
    await page.getByLabel(/Work Email/i).fill("vikram@example.com");
    await page
      .getByLabel(/Project Scope/i)
      .fill("Need OmniStudio integration and Sales Cloud Flow refactor.");
    await page
      .getByRole("checkbox", { name: /I consent to Tech Groww/i })
      .check();
    await page.getByRole("button", { name: /Submit Scoped Inquiry/i }).click();
    await expect(page.getByRole("status")).toBeVisible();
  });

  test("T3-FLOW-02: WorkFilterGrid -> /work/[slug] -> Scope a similar system -> /contact", async ({
    page,
  }) => {
    await preSeedCookieConsent(page, "essential");
    await page.goto("/work");

    await page
      .getByRole("tab", { name: "Reference Blueprints" })
      .click();
    await page
      .getByRole("link", { name: /Unified Sales-to-Client Delivery/i })
      .click();
    await expect(page).toHaveURL(/\/work\/b2b-salesforce-portal-blueprint/);
    await page.getByRole("link", { name: "Scope a similar system" }).click();
    await expect(page).toHaveURL(/\/contact$/);
  });

  test("T3-FLOW-03: /services -> InteractiveBlueprint -> /services/enterprise-software -> /contact?service=enterprise-software", async ({
    page,
  }, testInfo) => {
    await preSeedCookieConsent(page, "essential");
    await page.goto("/services");

    const blueprint = page.locator("#services-blueprint");
    const entBtn = blueprint
      .getByRole("button", { name: /Enterprise Software Development/i })
      .first();
    await entBtn.click();

    if (testInfo.project.name === "desktop-chromium") {
      await blueprint.getByRole("link", { name: "Full Blueprint" }).click();
    } else {
      await blueprint
        .getByRole("link", { name: /Explore Enterprise Software Development/i })
        .click();
    }

    await expect(page).toHaveURL(/\/services\/enterprise-software/);
    await expect(
      page.getByRole("navigation", { name: "Breadcrumb" })
    ).toContainText("Enterprise Software Development");
    await page.getByRole("link", { name: /Request Scope Call/i }).click();
    await expect(page).toHaveURL(/\/contact\?service=enterprise-software/);
    await expect(page.getByLabel(/Primary Discipline/i)).toHaveValue(
      "enterprise-software"
    );
  });

  test("T3-FLOW-04: Mobile drawer Escape/navigation close and CookieBanner persistence across pages", async ({
    page,
  }, testInfo) => {
    test.skip(
      testInfo.project.name !== "mobile-chromium",
      "Mobile drawer flow is specific to < 1024px mobile viewport"
    );

    await page.goto("/");
    const banner = page.getByRole("complementary", {
      name: "Cookie consent notice",
    });
    await expect(banner).toBeVisible();
    await banner.getByRole("button", { name: "Allow analytics" }).click();
    await expect(banner).toBeHidden();

    const openBtn = page.getByRole("button", { name: "Open navigation menu" });
    await openBtn.click();
    const drawer = page.getByRole("dialog", {
      name: "Mobile navigation drawer",
    });
    await expect(drawer).toBeVisible();
    const overflowWhileOpen = await page.evaluate(
      () => document.body.style.overflow
    );
    expect(overflowWhileOpen).toBe("hidden");

    await page.keyboard.press("Escape");
    await expect(drawer).toBeHidden();
    const overflowAfterEsc = await page.evaluate(
      () => document.body.style.overflow
    );
    expect(overflowAfterEsc).toBe("");

    await openBtn.click();
    await expect(drawer).toBeVisible();
    await drawer.getByRole("link", { name: "Insights" }).click();
    await expect(page).toHaveURL(/\/insights$/);
    await expect(drawer).toBeHidden();
    await expect(banner).toBeHidden();

    await page.goto("/about");
    await expect(banner).toBeHidden();
  });

  test("T3-FLOW-05: /careers -> /careers/internships -> /careers/[slug] -> upload & submit -> /careers/status", async ({
    page,
    context,
  }, testInfo) => {
    test.skip(
      testInfo.project.name !== "desktop-chromium",
      "Rate-limit isolation: candidate end-to-end flow runs on desktop-chromium"
    );

    await preSeedCookieConsent(page, "essential");
    await context.setExtraHTTPHeaders({
      "x-real-ip": uniqueTestIp(3, 5),
    });

    await page.goto("/careers");
    await page.getByRole("link", { name: /Internship/i }).first().click();
    await expect(page).toHaveURL(/\/careers\/internships/);

    await page
      .getByRole("link", { name: /Apply|Sales Intern/i })
      .first()
      .click();
    await expect(page).toHaveURL(/\/careers\/sales-intern-2-month-cohort/);

    await page.getByLabel(/Full Name/i).fill("Sneha Kapoor");
    await page.getByLabel(/Email Address/i).fill("sneha.kapoor@example.com");
    await page.getByLabel(/Phone Number/i).fill("9811223344");
    await page.getByLabel(/Resume \(PDF or DOCX/i).setInputFiles({
      name: "sneha-resume.pdf",
      mimeType: "application/pdf",
      buffer: createValidPdfBuffer(),
    });
    await page
      .getByRole("checkbox", { name: /180-day automated DPDP/i })
      .check();
    await page.getByRole("button", { name: /Submit Application/i }).click();

    const trackLink = page.getByRole("link", {
      name: "Track application status",
    });
    await expect(trackLink).toBeVisible();
    await trackLink.click();
    await expect(page).toHaveURL(/\/careers\/status\?token=/);
    await expect(
      page.getByRole("heading", { level: 1, name: /Application Status Lookup/i })
    ).toBeVisible();
  });

  test("T3-FLOW-07: multi-route App Router transition walk leaves main#main visible and settled", async ({
    page,
  }, testInfo) => {
    test.skip(
      testInfo.project.name !== "desktop-chromium",
      "Desktop Primary Navigation walk runs on desktop-chromium"
    );

    await preSeedCookieConsent(page, "essential");
    const collectors = attachRuntimeCollectors(page);
    await page.goto("/");

    const hops = [
      {
        click: () =>
          page
            .getByRole("navigation", { name: "Primary Navigation" })
            .getByRole("link", { name: "Services" })
            .click(),
        url: /\/services$/,
      },
      {
        click: () =>
          page
            .locator("#services-blueprint")
            .getByRole("link", { name: "Full Blueprint" })
            .click(),
        url: /\/services\/web-mobile-engineering$/,
      },
      {
        click: () =>
          page
            .getByRole("navigation", { name: "Primary Navigation" })
            .getByRole("link", { name: "Work" })
            .click(),
        url: /\/work$/,
      },
      {
        click: () =>
          page
            .getByRole("link", { name: /Unified Sales-to-Client Delivery/i })
            .click(),
        url: /\/work\/b2b-salesforce-portal-blueprint$/,
      },
      {
        click: () =>
          page
            .getByRole("navigation", { name: "Primary Navigation" })
            .getByRole("link", { name: "Insights" })
            .click(),
        url: /\/insights$/,
      },
      {
        click: () =>
          page
            .getByRole("link", {
              name: /Why We Built Our Platform Architecture/i,
            })
            .click(),
        url: /\/insights\/tech-groww-2026-engineering-foundation$/,
      },
    ];

    for (const hop of hops) {
      await hop.click();
      await expect(page).toHaveURL(hop.url);
      const main = page.locator("main#main");
      await expect(main).toBeVisible();
      await expect(main).toHaveCSS("opacity", "1");
      await expect(main).toHaveCSS("visibility", "visible");
      await expect(main).not.toHaveCSS("pointer-events", "none");
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
      await expect(page.locator('[aria-busy="true"]')).toHaveCount(0);
    }

    collectors.assertClean("T3-FLOW-07 transition walk");
  });
});
