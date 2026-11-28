import { expect, test } from "@playwright/test";
import {
  ALL_PUBLIC_AND_AUTH_ROUTES,
  ALL_PUBLIC_ROUTES,
  FORBIDDEN_INTERNAL_LEAK_PATTERNS,
  FORBIDDEN_PERSONAL_AND_DEMO_PATTERNS,
  INSIGHT_SLUGS,
  JOB_SLUGS,
  LEGACY_REDIRECTS,
  R1_VERIFIED,
  SERVICE_SLUGS,
  WORK_SLUGS,
} from "./helpers/constants";
import {
  assertZeroHorizontalOverflow,
  attachRuntimeCollectors,
  preSeedCookieConsent,
} from "./helpers/fixtures";

test.describe("Tier 1A/1B & Tier 2B/2D — Public Routes, R1 Brand Hygiene & Responsive Layout", () => {
  test.beforeEach(async ({ page }) => {
    await preSeedCookieConsent(page, "essential");
  });

  test("T1-NAV-01: homepage renders dark header, hero H1, #main landmark, and footer with 200 status", async ({
    page,
  }) => {
    const collectors = attachRuntimeCollectors(page);
    const res = await page.goto("/");
    expect(res?.status()).toBe(200);

    await expect(page.getByRole("banner")).toBeVisible();
    await expect(page.locator("main#main")).toBeVisible();
    await expect(
      page.getByRole("heading", {
        level: 1,
        name: /Technology that drives growth\./i,
      })
    ).toBeVisible();
    await expect(page.getByRole("contentinfo")).toBeVisible();

    collectors.assertClean("/");
  });

  test("T1-NAV-02: primary navigation links navigate cleanly to 200 pages with H1 and #main", async ({
    page,
  }, testInfo) => {
    test.skip(
      testInfo.project.name !== "desktop-chromium",
      "Desktop Primary Navigation bar is visible at >= 1024px"
    );

    const collectors = attachRuntimeCollectors(page);
    await page.goto("/");

    const nav = page.getByRole("navigation", { name: "Primary Navigation" });
    const navItems = [
      { label: "Services", path: "/services" },
      { label: "Work", path: "/work" },
      { label: "About", path: "/about" },
      { label: "Insights", path: "/insights" },
      { label: "Careers", path: "/careers" },
      { label: "Contact", path: "/contact" },
    ];

    for (const item of navItems) {
      await nav.getByRole("link", { name: item.label, exact: true }).click();
      await expect(page).toHaveURL(new RegExp(`${item.path}$`));
      await expect(page.locator("main#main")).toBeVisible();
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    }

    collectors.assertClean("desktop primary nav walk");
  });

  test("T1-NAV-03: all 6 canonical /services/[slug] pages render breadcrumb, H1, deliverables, stack, and CTA", async ({
    page,
  }) => {
    const collectors = attachRuntimeCollectors(page);

    for (const slug of SERVICE_SLUGS) {
      const res = await page.goto(`/services/${slug}`);
      expect(res?.status(), `/services/${slug} status`).toBe(200);
      await expect(page.getByRole("navigation", { name: "Breadcrumb" })).toBeVisible();
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
      await expect(
        page.getByRole("heading", { name: /Core Deliverables/i })
      ).toBeVisible();
      await expect(
        page.getByRole("heading", { name: /Technology & Platform Stack/i })
      ).toBeVisible();
      await expect(
        page.getByRole("link", { name: /Request Scope Call/i })
      ).toHaveAttribute("href", `/contact?service=${slug}`);
    }

    collectors.assertClean("/services/[slug]");
  });

  test("T1-NAV-04: canonical /work/[slug] blueprint pages render REFERENCE BLUEPRINT badge and sections", async ({
    page,
  }) => {
    const collectors = attachRuntimeCollectors(page);

    for (const slug of WORK_SLUGS) {
      const res = await page.goto(`/work/${slug}`);
      expect(res?.status(), `/work/${slug} status`).toBe(200);
      await expect(page.getByText(/REFERENCE BLUEPRINT/i).first()).toBeVisible();
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
      await expect(
        page.getByRole("heading", { name: /Problem Statement/i })
      ).toBeVisible();
      await expect(
        page.getByRole("heading", { name: /Technical Architecture/i })
      ).toBeVisible();
      await expect(
        page.getByRole("heading", { name: /Architectural Goal/i })
      ).toBeVisible();
      await expect(
        page.getByRole("link", { name: /Scope a similar system/i })
      ).toHaveAttribute("href", "/contact");
    }

    collectors.assertClean("/work/[slug]");
  });

  test("T1-NAV-05: canonical /insights/[slug] pages render sanitized HTML without raw markdown syntax", async ({
    page,
  }) => {
    const collectors = attachRuntimeCollectors(page);

    for (const slug of INSIGHT_SLUGS) {
      const res = await page.goto(`/insights/${slug}`);
      expect(res?.status(), `/insights/${slug} status`).toBe(200);
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
      const articleText = await page.locator("article").innerText();
      expect(articleText).not.toMatch(/^#{1,6}\s/m);
      expect(articleText).not.toContain("**");
      expect(articleText).not.toContain("`");
      const renderedHeadings = await page.locator("article h2, article h3").count();
      expect(renderedHeadings).toBeGreaterThan(0);
    }

    collectors.assertClean("/insights/[slug]");
  });

  test("T1-NAV-06: /careers, /careers/internships, and canonical /careers/[slug] pages render JD and JobPosting JSON-LD", async ({
    page,
  }) => {
    const collectors = attachRuntimeCollectors(page);

    const careersRes = await page.goto("/careers");
    expect(careersRes?.status()).toBe(200);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

    const internRes = await page.goto("/careers/internships");
    expect(internRes?.status()).toBe(200);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

    for (const slug of JOB_SLUGS) {
      const res = await page.goto(`/careers/${slug}`);
      expect(res?.status(), `/careers/${slug} status`).toBe(200);
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
      await expect(
        page.getByRole("heading", { name: /Role Summary/i })
      ).toBeVisible();
      await expect(
        page.getByRole("button", { name: /Submit Application/i })
      ).toBeVisible();

      const jsonLdScripts = await page
        .locator('script[type="application/ld+json"]')
        .allInnerTexts();
      const hasJobPosting = jsonLdScripts.some((raw) => {
        const parsed = JSON.parse(raw) as { "@type"?: string };
        return parsed["@type"] === "JobPosting";
      });
      expect(hasJobPosting, `JobPosting JSON-LD missing on /careers/${slug}`).toBe(
        true
      );
    }

    collectors.assertClean("/careers");
  });

  test("T1-NAV-07: legal routes (/privacy, /terms, /cookies) and /contact render 200 cleanly", async ({
    page,
  }) => {
    const collectors = attachRuntimeCollectors(page);

    for (const path of ["/privacy", "/terms", "/cookies", "/contact"]) {
      const res = await page.goto(path);
      expect(res?.status(), `${path} status`).toBe(200);
      await expect(page.locator("main#main")).toBeVisible();
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    }

    collectors.assertClean("legal and contact routes");
  });

  test("T1-NAV-08: legacy URLs return 301 canonical redirects and /admin/login.php returns 410 Gone", async ({
    request,
  }) => {
    for (const entry of LEGACY_REDIRECTS) {
      const res = await request.get(entry.from, { maxRedirects: 0 });
      expect(res.status(), `${entry.from} expected ${entry.status}`).toBe(
        entry.status
      );
      if (entry.status === 301) {
        const location = res.headers()["location"] ?? "";
        expect(location.endsWith(entry.to), `${entry.from} -> ${location}`).toBe(
          true
        );
      } else {
        expect(res.headers()["x-robots-tag"]).toContain("noindex");
        const body = await res.text();
        expect(body).toContain("Gone");
      }
    }
  });

  test("T1-NAV-09: /robots.txt and /sitemap.xml return 200 with canonical directives and slugs", async ({
    request,
  }) => {
    const robotsRes = await request.get("/robots.txt");
    expect(robotsRes.status()).toBe(200);
    const robotsText = await robotsRes.text();
    for (const disallowed of [
      "/admin",
      "/sales",
      "/recruitment",
      "/client",
      "/intern",
      "/login",
      "/careers/status",
      "/api",
    ]) {
      expect(robotsText).toContain(`Disallow: ${disallowed}`);
    }
    expect(robotsText).toContain("sitemap.xml");

    const sitemapRes = await request.get("/sitemap.xml");
    expect(sitemapRes.status()).toBe(200);
    const sitemapText = await sitemapRes.text();
    for (const slug of [...SERVICE_SLUGS, ...WORK_SLUGS, ...INSIGHT_SLUGS, ...JOB_SLUGS]) {
      expect(sitemapText).toContain(slug);
    }
  });

  test("T1-NAV-10: Skip to main content link is keyboard-focusable and targets #main", async ({
    page,
  }) => {
    await page.goto("/");
    const skipLink = page.getByRole("link", { name: "Skip to main content" });
    await skipLink.focus();
    await expect(skipLink).toBeFocused();
    await expect(skipLink).toHaveAttribute("href", "#main");
    await expect(page.locator("#main")).toBeVisible();
  });

  test("T1-R1-01 & T1-R1-05: R1 verified brand details, contact emails, socials, and Organization JSON-LD", async ({
    page,
  }) => {
    await page.goto("/");

    const footer = page.getByRole("contentinfo");
    await expect(footer).toContainText(R1_VERIFIED.tagline);
    await expect(footer).toContainText(R1_VERIFIED.hqDisplay);
    await expect(footer).toContainText(R1_VERIFIED.emails.general);
    await expect(
      footer.getByRole("link", { name: "LinkedIn" })
    ).toHaveAttribute("href", R1_VERIFIED.socials.linkedin);
    await expect(
      footer.getByRole("link", { name: "Instagram" })
    ).toHaveAttribute("href", R1_VERIFIED.socials.instagram);

    const jsonLdRaw = await page
      .locator('script[type="application/ld+json"]')
      .first()
      .innerText();
    const orgSchema = JSON.parse(jsonLdRaw) as {
      "@type"?: string;
      name?: string;
      foundingDate?: string;
      address?: { postalCode?: string; addressLocality?: string };
      contactPoint?: { email?: string; telephone?: string };
      sameAs?: string[];
    };
    expect(orgSchema["@type"]).toBe("Organization");
    expect(orgSchema.name).toBe(R1_VERIFIED.brandName);
    expect(orgSchema.foundingDate).toBe(R1_VERIFIED.foundedYear);
    expect(orgSchema.address?.postalCode).toBe("203209");
    expect(orgSchema.contactPoint?.email).toBe(R1_VERIFIED.emails.general);
    expect(orgSchema.contactPoint?.telephone).toBeUndefined();
    expect(orgSchema.sameAs).toContain(R1_VERIFIED.socials.linkedin);
    expect(orgSchema.sameAs).toContain(R1_VERIFIED.socials.instagram);

    await page.goto("/contact");
    await expect(page.locator("main#main")).toContainText(
      R1_VERIFIED.emails.general
    );
    await expect(page.locator("main#main")).toContainText(
      R1_VERIFIED.emails.sales
    );
  });

  test("T1-R1-02: SVG brand logo in header/footer and /icon.svg /brand/*.svg render cleanly", async ({
    page,
    request,
  }) => {
    await page.goto("/");
    const headerLogoSvg = page
      .getByRole("banner")
      .getByRole("link", { name: "Tech Groww Home" })
      .locator("svg")
      .first();
    const headerBox = await headerLogoSvg.boundingBox();
    expect(headerBox).not.toBeNull();
    expect(headerBox?.width ?? 0).toBeGreaterThan(0);
    expect(headerBox?.height ?? 0).toBeGreaterThan(0);

    const footerLogoSvg = page
      .getByRole("contentinfo")
      .locator("svg")
      .first();
    const footerBox = await footerLogoSvg.boundingBox();
    expect(footerBox).not.toBeNull();
    expect(footerBox?.width ?? 0).toBeGreaterThan(0);
    expect(footerBox?.height ?? 0).toBeGreaterThan(0);

    for (const assetPath of [
      "/icon.svg",
      "/brand/mark.svg",
      "/brand/lockup-horizontal-dark.svg",
    ]) {
      const res = await request.get(assetPath);
      expect(res.status(), `${assetPath} status`).toBe(200);
      expect(res.headers()["content-type"]).toContain("svg");
      const text = await res.text();
      expect(text).toContain("<svg");
      expect(text).not.toContain("C-11");
    }
  });

  test("T1-R1-03 & T1-R1-04: zero personal, fabricated demo, C-01..C-13, raw DB, or backtick leaks across public & auth pages", async ({
    page,
  }) => {
    const routesToCheck = [...ALL_PUBLIC_ROUTES, "/login"];
    for (const route of routesToCheck) {
      await page.goto(route);
      const bodyText = await page.locator("body").innerText();

      for (const pattern of FORBIDDEN_PERSONAL_AND_DEMO_PATTERNS) {
        expect(
          bodyText,
          `Forbidden ${pattern.label} leaked on ${route}`
        ).not.toMatch(pattern.regex);
      }

      for (const pattern of FORBIDDEN_INTERNAL_LEAK_PATTERNS) {
        expect(
          bodyText,
          `Forbidden ${pattern.label} leaked on ${route}`
        ).not.toMatch(pattern.regex);
      }
    }
  });

  test("T2-ROUTE-01..04: unknown service, work, insight, career slugs and unknown path return HTTP 404 UI", async ({
    page,
  }) => {
    const missingRoutes = [
      "/services/nonexistent-service-xyz",
      "/work/nonexistent-blueprint",
      "/insights/nonexistent-article",
      "/careers/nonexistent-role",
      "/totally-unknown-route",
    ];

    for (const route of missingRoutes) {
      const res = await page.goto(route);
      expect(res?.status(), `${route} expected HTTP 404`).toBe(404);
      await expect(
        page.getByRole("heading", { level: 1, name: /That page isn't here\./i })
      ).toBeVisible();
      await expect(
        page.getByRole("link", { name: "Explore Services" })
      ).toBeVisible();
    }
  });

  test("T2-TOKEN-01: /careers/status handles missing and invalid ?token= cleanly with HTTP 200", async ({
    page,
  }) => {
    const collectors = attachRuntimeCollectors(page);

    const noTokenRes = await page.goto("/careers/status");
    expect(noTokenRes?.status()).toBe(200);
    await expect(
      page.getByRole("heading", { level: 1, name: /Application Status Lookup/i })
    ).toBeVisible();
    await expect(
      page.getByText(/Open the private status link included in your application/i)
    ).toBeVisible();

    const badTokenRes = await page.goto("/careers/status?token=invalid-token-123");
    expect(badTokenRes?.status()).toBe(200);
    await expect(
      page.getByText(/No active application matched this status token/i)
    ).toBeVisible();

    collectors.assertClean("/careers/status");
  });

  test("T2-RESP-01..03: zero horizontal overflow across all public and auth routes on current viewport", async ({
    page,
  }, testInfo) => {
    for (const route of ALL_PUBLIC_AND_AUTH_ROUTES) {
      await page.goto(route);
      await assertZeroHorizontalOverflow(
        page,
        `${testInfo.project.name} ${route}`
      );
    }
  });

  test("T2-RESP-04 & T2-RESP-05: responsive nav breakpoint and >=44px mobile touch targets", async ({
    page,
  }, testInfo) => {
    await page.goto("/");
    const primaryNav = page.getByRole("navigation", {
      name: "Primary Navigation",
    });
    const menuToggle = page.getByRole("button", {
      name: /Open navigation menu|Close navigation menu/i,
    });

    if (testInfo.project.name === "desktop-chromium") {
      await expect(primaryNav).toBeVisible();
      await expect(menuToggle).toBeHidden();
    } else {
      await expect(primaryNav).toBeHidden();
      await expect(menuToggle).toBeVisible();
      const menuBox = await menuToggle.boundingBox();
      expect(menuBox?.width ?? 0).toBeGreaterThanOrEqual(44);
      expect(menuBox?.height ?? 0).toBeGreaterThanOrEqual(44);
    }

    if (testInfo.project.name === "mobile-chromium") {
      const pauseBtn = page.getByRole("button", {
        name: /Pause scrolling capability ribbon|Play scrolling capability ribbon/i,
      });
      const pauseBox = await pauseBtn.boundingBox();
      expect(pauseBox?.width ?? 0).toBeGreaterThanOrEqual(44);
      expect(
        pauseBox?.height ?? 0,
        "CapabilityMarquee pause button must meet 44px mobile touch target"
      ).toBeGreaterThanOrEqual(44);

      const radioButtons = page
        .getByRole("radiogroup", { name: "Operational bottleneck options" })
        .getByRole("radio");
      const radioCount = await radioButtons.count();
      for (let i = 0; i < radioCount; i++) {
        const box = await radioButtons.nth(i).boundingBox();
        expect(box?.height ?? 0).toBeGreaterThanOrEqual(44);
      }

      const faqButtons = page.getByRole("button", {
        name: /Tech Groww was founded|Do you handle Salesforce|How do you price/i,
      });
      const faqCount = await faqButtons.count();
      for (let i = 0; i < faqCount; i++) {
        const box = await faqButtons.nth(i).boundingBox();
        expect(box?.height ?? 0).toBeGreaterThanOrEqual(44);
      }
    }
  });
});
