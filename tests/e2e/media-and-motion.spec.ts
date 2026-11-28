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

      // Scroll incrementally with paint frames so IntersectionObserver / lazy media triggers fire reliably
      await page.evaluate(async () => {
        const nextFrame = () =>
          new Promise<void>((resolve) => {
            window.requestAnimationFrame(() => resolve());
          });
        const maxScroll = Math.max(
          0,
          document.documentElement.scrollHeight - window.innerHeight
        );
        const steps = 4;
        for (let i = 1; i <= steps; i++) {
          window.scrollTo(0, Math.round((maxScroll * i) / steps));
          await nextFrame();
        }
        window.scrollTo(0, 0);
        await nextFrame();
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
          // Walk ancestors via computed styles so responsive containers (e.g., hidden min-[480px]:flex) are skipped only when actually hidden
          let isHiddenSubtree = false;
          let cur: Element | null = svg;
          while (cur) {
            const cs = window.getComputedStyle(cur);
            if (cs.display === "none" || cs.visibility === "hidden") {
              isHiddenSubtree = true;
              break;
            }
            cur = cur.parentElement;
          }
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

    const htmlScroll = await page.evaluate(
      () => window.getComputedStyle(document.documentElement).scrollBehavior
    );
    expect(htmlScroll).toBe("auto");

    // Verify CapabilityMarquee continuous animation is disabled without silent fallback or CSS class coupling
    const marqueeRegion = page.getByRole("region", {
      name: "Core engineering capabilities",
    });
    await expect(marqueeRegion).toHaveAttribute("data-paused", "false");
    const marqueeTrackAnim = await marqueeRegion.evaluate((region) => {
      const track = region.querySelector('div[aria-hidden="true"] > div');
      if (!track) return null;
      return window.getComputedStyle(track).animationName;
    });
    expect(marqueeTrackAnim, "CapabilityMarquee visual track must exist").not.toBeNull();
    expect(marqueeTrackAnim).toBe("none");

    // Verify no elements inside <main> retain active CSS animations under reduced motion
    const activeMainCssAnimations = await page.evaluate(() => {
      const main = document.querySelector("main#main");
      if (!main) return ["missing-main"];
      const active: string[] = [];
      for (const el of Array.from(main.querySelectorAll("*"))) {
        const animName = window.getComputedStyle(el).animationName;
        if (animName && animName !== "none") {
          active.push(`${el.tagName.toLowerCase()}:${animName}`);
        }
      }
      return active;
    });
    expect(activeMainCssAnimations).toEqual([]);

    // Verify FaqAccordion panel transition is disabled via ARIA button -> sibling panel
    const faqBtn = page.getByRole("button", {
      name: /Do you handle Salesforce/i,
    });
    const accordionTransition = await faqBtn.evaluate((btn) => {
      const panel = btn.nextElementSibling;
      if (!panel) return null;
      return window.getComputedStyle(panel).transitionDuration;
    });
    expect(accordionTransition, "FaqAccordion panel must exist").not.toBeNull();
    expect(accordionTransition).toBe("0s");

    // ScrollProgress disables fixed top-edge progress bar under reduced motion (opaque-box computed-style check)
    await page.evaluate(async () => {
      window.scrollTo(0, 600);
      await new Promise<void>((resolve) => {
        window.requestAnimationFrame(() => resolve());
      });
    });
    const fixedTopProgressBarCount = await page.evaluate(() => {
      let count = 0;
      for (const el of Array.from(document.body.querySelectorAll("*"))) {
        const cs = window.getComputedStyle(el);
        if (
          cs.position !== "fixed" ||
          cs.display === "none" ||
          cs.visibility === "hidden" ||
          cs.opacity === "0"
        ) {
          continue;
        }
        const rect = el.getBoundingClientRect();
        if (
          rect.top >= 0 &&
          rect.top <= 4 &&
          rect.left <= 4 &&
          rect.height > 0 &&
          rect.height <= 4 &&
          rect.width >= window.innerWidth * 0.5
        ) {
          count += 1;
        }
      }
      return count;
    });
    expect(fixedTopProgressBarCount).toBe(0);

    // Interactive widgets still toggle instantaneously and reach visible state
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
