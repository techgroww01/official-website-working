import { expect, test } from "@playwright/test";
import {
  attachRuntimeCollectors,
  preSeedCookieConsent,
} from "./helpers/fixtures";

const MEDIA_AUDIT_ROUTES = [
  "/",
  "/about",
  "/services",
  "/services/web-mobile-engineering",
  "/work",
  "/work/b2b-salesforce-portal-blueprint",
  "/insights",
  "/insights/tech-groww-2026-engineering-foundation",
  "/careers",
  "/contact",
] as const;

test.describe("Tier 4 — R3 Live Media Integrity & Reduced-Motion / Transition Safety", () => {
  test.beforeEach(async ({ page }) => {
    await preSeedCookieConsent(page, "essential");
  });

  test("T4-MEDIA-01: all rendered <img>, <video>, and non-icon <svg> graphics load cleanly with non-zero dimensions", async ({
    page,
  }) => {
    const collectors = attachRuntimeCollectors(page);

    for (const route of MEDIA_AUDIT_ROUTES) {
      await page.goto(route);

      // Scroll down to trigger any below-the-fold lazy images or video sources
      await page.evaluate(async () => {
        window.scrollTo(0, document.body.scrollHeight);
        window.scrollTo(0, 0);
      });

      const mediaReport = await page.evaluate(() => {
        const brokenImages: string[] = [];
        const missingAltImages: string[] = [];
        const imgs = Array.from(document.querySelectorAll("img"));

        for (const img of imgs) {
          const style = window.getComputedStyle(img);
          if (style.display === "none" || style.visibility === "hidden") continue;
          if (!img.complete || img.naturalWidth <= 0) {
            brokenImages.push(img.currentSrc || img.getAttribute("src") || "unknown");
          }
          const isDecorative = img.getAttribute("aria-hidden") === "true";
          const alt = img.getAttribute("alt");
          if (!isDecorative && (alt === null || (alt.trim() === "" && img.getAttribute("role") !== "presentation"))) {
            missingAltImages.push(img.currentSrc || img.getAttribute("src") || "unknown");
          }
        }

        const brokenVideos: string[] = [];
        const videos = Array.from(document.querySelectorAll("video"));
        for (const vid of videos) {
          const poster = vid.getAttribute("poster");
          const hasSource = Boolean(
            vid.currentSrc || vid.getAttribute("src") || vid.querySelector("source")?.getAttribute("src")
          );
          if (!poster || !hasSource || !vid.muted || !vid.playsInline || vid.error !== null) {
            brokenVideos.push(
              `src=${vid.currentSrc || vid.getAttribute("src") || "none"} poster=${String(poster)} muted=${vid.muted} playsInline=${vid.playsInline} error=${vid.error?.code ?? "none"}`
            );
          }
        }

        const zeroBoxSvgs: string[] = [];
        const svgs = Array.from(document.querySelectorAll("svg"));
        for (const svg of svgs) {
          const rect = svg.getBoundingClientRect();
          const style = window.getComputedStyle(svg);
          // Skip SVGs inside intentionally hidden responsive containers (e.g., hidden min-[480px]:flex on 393px viewport)
          const isHiddenSubtree =
            style.display === "none" ||
            style.visibility === "hidden" ||
            svg.closest(".hidden") !== null ||
            (svg.offsetParent === null && style.position !== "fixed");
          if (isHiddenSubtree) continue;

          const attrW = Number(svg.getAttribute("width") ?? "0");
          const attrH = Number(svg.getAttribute("height") ?? "0");
          if (attrW >= 24 || attrH >= 24 || rect.width >= 24) {
            if (rect.width <= 0 || rect.height <= 0) {
              zeroBoxSvgs.push(svg.getAttribute("aria-label") || "unnamed-svg");
            }
          }
        }

        return { brokenImages, missingAltImages, brokenVideos, zeroBoxSvgs };
      });

      expect(
        mediaReport.brokenImages,
        `Broken <img> on ${route}`
      ).toEqual([]);
      expect(
        mediaReport.missingAltImages,
        `Missing alt attribute on ${route}`
      ).toEqual([]);
      expect(
        mediaReport.brokenVideos,
        `Invalid <video> configuration/load on ${route}`
      ).toEqual([]);
      expect(
        mediaReport.zeroBoxSvgs,
        `Zero-dimension visual <svg> on ${route}`
      ).toEqual([]);
    }

    collectors.assertClean("T4-MEDIA-01 media audit");
  });

  test("T4-MOTION-01: prefers-reduced-motion: reduce disables continuous animations while preserving interactive state & route transitions", async ({
    page,
  }, testInfo) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    const collectors = attachRuntimeCollectors(page);

    await page.goto("/");

    const motionStyles = await page.evaluate(() => {
      const htmlScroll = window.getComputedStyle(document.documentElement).scrollBehavior;
      const marquee = document.querySelector(".tg-marquee-track");
      const accent = document.querySelector(".tg-accent-draw");
      const accordion = document.querySelector(".tg-accordion-panel");
      return {
        htmlScroll,
        marqueeAnim: marquee ? window.getComputedStyle(marquee).animationName : "none",
        accentAnim: accent ? window.getComputedStyle(accent).animationName : "none",
        accordionTransition: accordion
          ? window.getComputedStyle(accordion).transitionDuration
          : "0s",
      };
    });

    expect(motionStyles.htmlScroll).toBe("auto");
    expect(motionStyles.marqueeAnim).toBe("none");
    expect(motionStyles.accentAnim).toBe("none");
    expect(motionStyles.accordionTransition).toBe("0s");

    // ScrollProgress disables progress bar rendering under reduced motion
    await page.evaluate(() => window.scrollTo(0, 600));
    const fixedProgressBars = await page.locator("div.fixed.top-0.left-0.z-\\[60\\]").count();
    expect(fixedProgressBars).toBe(0);

    // Interactive widgets still toggle instantaneously and reach visible state
    const faqBtn = page.getByRole("button", {
      name: /Do you handle Salesforce/i,
    });
    await faqBtn.click();
    await expect(faqBtn).toHaveAttribute("aria-expanded", "true");
    await expect(
      page.getByText(/Salesforce Administration, production support/i)
    ).toBeVisible();

    await page
      .getByRole("radio", {
        name: /Manual spreadsheets are slowing down approvals/i,
      })
      .click();
    await expect(
      page.getByRole("link", { name: "Scope this challenge" })
    ).toHaveAttribute("href", "/contact?service=enterprise-software");

    // Verify route transitions under reduced motion never leave main#main stuck hidden
    for (const targetPath of ["/services", "/work", "/insights", "/contact"]) {
      if (testInfo.project.name === "desktop-chromium") {
        const label =
          targetPath === "/services"
            ? "Services"
            : targetPath === "/work"
            ? "Work"
            : targetPath === "/insights"
            ? "Insights"
            : "Contact";
        await page
          .getByRole("navigation", { name: "Primary Navigation" })
          .getByRole("link", { name: label, exact: true })
          .click();
      } else {
        await page.goto(targetPath);
      }
      await expect(page).toHaveURL(new RegExp(`${targetPath}$`));
      const main = page.locator("main#main");
      await expect(main).toBeVisible();
      await expect(main).toHaveCSS("opacity", "1");
      await expect(main).toHaveCSS("visibility", "visible");
      await expect(main).not.toHaveCSS("pointer-events", "none");
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    }

    collectors.assertClean("T4-MOTION-01 reduced motion");
  });
});
