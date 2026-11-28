import { expect, type Page, type Response } from "@playwright/test";
import { strToU8, zipSync } from "fflate";

export interface RuntimeCollectors {
  consoleErrors: string[];
  pageErrors: string[];
  serverErrors: string[];
  failedStaticAssets: string[];
  assertClean: (contextLabel: string) => void;
}

const STATIC_ASSET_PATTERN = /\/(_next\/static|images|videos|brand)\//;

export function attachRuntimeCollectors(page: Page): RuntimeCollectors {
  const consoleErrors: string[] = [];
  const pageErrors: string[] = [];
  const serverErrors: string[] = [];
  const failedStaticAssets: string[] = [];

  page.on("console", (msg) => {
    if (msg.type() === "error") {
      const text = msg.text();
      // Ignore Next.js development HMR / WebSocket reconnect noise during tests
      if (
        text.includes("_next/hmr") ||
        text.includes("WebSocket connection") ||
        text.includes("ERR_INVALID_HTTP_RESPONSE")
      ) {
        return;
      }
      consoleErrors.push(text);
    }
  });

  page.on("pageerror", (err) => {
    pageErrors.push(err.message);
  });

  page.on("response", (res: Response) => {
    const status = res.status();
    const url = res.url();
    if (status >= 500) {
      serverErrors.push(`${status} ${url}`);
    }
    if (status >= 400 && STATIC_ASSET_PATTERN.test(url)) {
      failedStaticAssets.push(`${status} ${url}`);
    }
  });

  return {
    consoleErrors,
    pageErrors,
    serverErrors,
    failedStaticAssets,
    assertClean(contextLabel: string) {
      expect(
        pageErrors,
        `Uncaught pageerror on ${contextLabel}: ${pageErrors.join(" | ")}`
      ).toEqual([]);
      expect(
        consoleErrors,
        `Console errors on ${contextLabel}: ${consoleErrors.join(" | ")}`
      ).toEqual([]);
      expect(
        serverErrors,
        `5xx responses on ${contextLabel}: ${serverErrors.join(" | ")}`
      ).toEqual([]);
      expect(
        failedStaticAssets,
        `Failed static assets on ${contextLabel}: ${failedStaticAssets.join(" | ")}`
      ).toEqual([]);
    },
  };
}

export async function preSeedCookieConsent(
  page: Page,
  choice: "essential" | "analytics" = "essential"
): Promise<void> {
  await page.addInitScript((val: string) => {
    try {
      window.localStorage.setItem("tg_cookie_consent_v1", val);
    } catch {
      // Ignore storage errors in restricted contexts
    }
  }, choice);
}

export async function assertZeroHorizontalOverflow(
  page: Page,
  contextLabel: string
): Promise<void> {
  const { scrollWidth, innerWidth } = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    innerWidth: window.innerWidth,
  }));
  expect(
    scrollWidth,
    `Horizontal overflow on ${contextLabel}: scrollWidth=${scrollWidth} > innerWidth=${innerWidth}`
  ).toBeLessThanOrEqual(innerWidth);
}

export function uniqueTestIp(tier: number, caseIndex: number): string {
  const octet3 = Math.min(254, Math.max(1, tier));
  const octet4 = Math.min(254, Math.max(1, caseIndex));
  return `10.0.${octet3}.${octet4}`;
}

export function createValidPdfBuffer(): Buffer {
  const pdf = [
    "%PDF-1.4",
    "1 0 obj",
    "<< /Type /Catalog /Pages 2 0 R >>",
    "endobj",
    "2 0 obj",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    "endobj",
    "3 0 obj",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] >>",
    "endobj",
    "xref",
    "0 4",
    "0000000000 65535 f ",
    "0000000009 00000 n ",
    "0000000058 00000 n ",
    "0000000115 00000 n ",
    "trailer",
    "<< /Size 4 /Root 1 0 R >>",
    "startxref",
    "190",
    "%%EOF",
  ].join("\n");
  return Buffer.from(pdf, "utf-8");
}

export function createValidDocxBuffer(): Buffer {
  const contentTypesXml = [
    '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>',
    '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">',
    '<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>',
    '<Default Extension="xml" ContentType="application/xml"/>',
    '<Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>',
    "</Types>",
  ].join("");

  const relsXml = [
    '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>',
    '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">',
    '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>',
    "</Relationships>",
  ].join("");

  const documentXml = [
    '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>',
    '<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">',
    "<w:body><w:p><w:r><w:t>Tech Groww Test Candidate Resume</w:t></w:r></w:p></w:body>",
    "</w:document>",
  ].join("");

  const zipped = zipSync({
    "[Content_Types].xml": strToU8(contentTypesXml),
    "_rels/.rels": strToU8(relsXml),
    "word/document.xml": strToU8(documentXml),
  });
  return Buffer.from(zipped);
}

export function createDisallowedSvgBuffer(): Buffer {
  return Buffer.from(
    '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"><circle cx="8" cy="8" r="6"/></svg>',
    "utf-8"
  );
}
