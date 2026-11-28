import { expect, test } from "@playwright/test";
import {
  CRON_ENDPOINTS,
  PROTECTED_PORTAL_GET_ENDPOINTS,
  PROTECTED_PORTAL_MUTATION_ENDPOINTS,
} from "./helpers/constants";
import { uniqueTestIp } from "./helpers/fixtures";

test.describe("Tier 1C & Tier 2A/2B/2C — API Security, Validation & Upload Contracts", () => {
  test.beforeEach(({}, testInfo) => {
    test.skip(
      testInfo.project.name !== "desktop-chromium",
      "Stateless API contract suite runs once on desktop-chromium with unique x-real-ip headers"
    );
  });

  test("T2-FORM-02: /api/v1/public/contact honeypot ignores silently (201) and strict Zod rejects invalid payloads (400)", async ({
    request,
  }) => {
    const honeypotRes = await request.post("/api/v1/public/contact", {
      headers: {
        "Content-Type": "application/json",
        "x-real-ip": uniqueTestIp(2, 1),
      },
      data: {
        fullName: "Bot User",
        email: "bot@example.com",
        service: "web-mobile-engineering",
        preferredChannel: "email",
        message: "Automated bot message exceeding fifteen characters.",
        privacyConsent: true,
        websiteUrl: "https://spam.example.com",
        turnstileToken: "client-submitted",
      },
    });
    expect(honeypotRes.status()).toBe(201);
    const hpJson = (await honeypotRes.json()) as {
      ok?: boolean;
      data?: { enquiryId?: string; delivered?: boolean };
    };
    expect(hpJson.ok).toBe(true);
    expect(hpJson.data?.enquiryId).toBe("ignored");
    expect(hpJson.data?.delivered).toBe(false);

    const invalidRes = await request.post("/api/v1/public/contact", {
      headers: {
        "Content-Type": "application/json",
        "x-real-ip": uniqueTestIp(2, 2),
      },
      data: {
        fullName: "Aarav",
        email: "aarav@example.com",
        service: "web-mobile-engineering",
        preferredChannel: "email",
        message: "Short",
        privacyConsent: false,
        extraStrictField: "disallowed",
        turnstileToken: "client-submitted",
      },
    });
    expect(invalidRes.status()).toBe(400);
    const errJson = (await invalidRes.json()) as {
      ok?: boolean;
      error?: { code?: string };
    };
    expect(errJson.ok).toBe(false);
    expect(errJson.error?.code).toBe("VALIDATION_ERROR");
  });

  test("T2-FORM-03: /api/v1/public/newsletter/subscribe rejects legacy payload & invalid email (400), accepts valid strict schema (200)", async ({
    request,
  }) => {
    const legacyRes = await request.post("/api/v1/public/newsletter/subscribe", {
      headers: {
        "Content-Type": "application/json",
        "x-real-ip": uniqueTestIp(2, 3),
      },
      data: {
        email: "legacy@example.com",
        consent: true,
        source: "footer",
      },
    });
    expect(legacyRes.status()).toBe(400);

    const badEmailRes = await request.post(
      "/api/v1/public/newsletter/subscribe",
      {
        headers: {
          "Content-Type": "application/json",
          "x-real-ip": uniqueTestIp(2, 4),
        },
        data: {
          email: "not-an-email",
          consentSource: "footer",
          turnstileToken: "client-submitted",
        },
      }
    );
    expect(badEmailRes.status()).toBe(400);

    const validRes = await request.post("/api/v1/public/newsletter/subscribe", {
      headers: {
        "Content-Type": "application/json",
        "x-real-ip": uniqueTestIp(2, 5),
      },
      data: {
        email: "valid.brief@example.com",
        consentSource: "footer",
        turnstileToken: "client-submitted",
      },
    });
    expect(validRes.status()).toBe(200);
    const okJson = (await validRes.json()) as {
      ok?: boolean;
      data?: { subscribed?: boolean };
    };
    expect(okJson.ok).toBe(true);
    expect(okJson.data?.subscribed).toBe(true);
  });

  test("T2-FORM-05 & T2-FORM-06: /api/v1/public/applications/upload-url enforces .svg ban (415), >5MB (413), 0B (400), and 5MB exact (200)", async ({
    request,
  }) => {
    const svgRes = await request.post("/api/v1/public/applications/upload-url", {
      headers: {
        "Content-Type": "application/json",
        "x-real-ip": uniqueTestIp(2, 6),
      },
      data: {
        postingId: "00000000-0000-4000-8000-000000000001",
        filename: "payload.svg",
        mimeType: "image/svg+xml",
        byteSize: 1024,
        turnstileToken: "client-submitted",
      },
    });
    expect(svgRes.status()).toBe(415);

    const txtRes = await request.post("/api/v1/public/applications/upload-url", {
      headers: {
        "Content-Type": "application/json",
        "x-real-ip": uniqueTestIp(2, 7),
      },
      data: {
        postingId: "00000000-0000-4000-8000-000000000001",
        filename: "notes.txt",
        mimeType: "text/plain",
        byteSize: 1024,
        turnstileToken: "client-submitted",
      },
    });
    expect(txtRes.status()).toBe(415);

    const oversizedRes = await request.post(
      "/api/v1/public/applications/upload-url",
      {
        headers: {
          "Content-Type": "application/json",
          "x-real-ip": uniqueTestIp(2, 8),
        },
        data: {
          postingId: "00000000-0000-4000-8000-000000000001",
          filename: "huge.pdf",
          mimeType: "application/pdf",
          byteSize: 5 * 1024 * 1024 + 1,
          turnstileToken: "client-submitted",
        },
      }
    );
    expect(oversizedRes.status()).toBe(413);

    const zeroByteRes = await request.post(
      "/api/v1/public/applications/upload-url",
      {
        headers: {
          "Content-Type": "application/json",
          "x-real-ip": uniqueTestIp(2, 9),
        },
        data: {
          postingId: "00000000-0000-4000-8000-000000000001",
          filename: "empty.pdf",
          mimeType: "application/pdf",
          byteSize: 0,
          turnstileToken: "client-submitted",
        },
      }
    );
    expect(zeroByteRes.status()).toBe(400);

    const exactFiveMbRes = await request.post(
      "/api/v1/public/applications/upload-url",
      {
        headers: {
          "Content-Type": "application/json",
          "x-real-ip": uniqueTestIp(2, 10),
        },
        data: {
          postingId: "00000000-0000-4000-8000-000000000001",
          filename: "exact5mb.pdf",
          mimeType: "application/pdf",
          byteSize: 5 * 1024 * 1024,
          turnstileToken: "client-submitted",
        },
      }
    );
    expect(exactFiveMbRes.status()).toBe(200);
  });

  test("T2-TOKEN-02: /api/v1/public/applications/status and /withdraw token boundaries", async ({
    request,
  }) => {
    const missingTokenRes = await request.get(
      "/api/v1/public/applications/status"
    );
    expect(missingTokenRes.status()).toBe(400);

    const unknownTokenRes = await request.get(
      "/api/v1/public/applications/status?token=invalid-token-123"
    );
    expect(unknownTokenRes.status()).toBe(404);

    const shortWithdrawRes = await request.post(
      "/api/v1/public/applications/withdraw",
      {
        headers: {
          "Content-Type": "application/json",
          "x-real-ip": uniqueTestIp(2, 11),
        },
        data: { token: "short" },
      }
    );
    expect(shortWithdrawRes.status()).toBe(400);
  });

  test("T2-API-01: all unauthenticated portal GET endpoints return 401 (never 500 or 200)", async ({
    request,
  }) => {
    for (const endpoint of PROTECTED_PORTAL_GET_ENDPOINTS) {
      const res = await request.get(endpoint);
      expect(res.status(), `GET ${endpoint} expected 401`).toBe(401);
      const json = (await res.json()) as {
        ok?: boolean;
        error?: { code?: string };
      };
      expect(json.ok).toBe(false);
      expect(json.error?.code).toBe("UNAUTHORIZED");
    }
  });

  test("T2-API-02: all unauthenticated portal mutation endpoints return 401 (never 500)", async ({
    request,
  }) => {
    for (const endpoint of PROTECTED_PORTAL_MUTATION_ENDPOINTS) {
      const res = await request.fetch(endpoint.path, {
        method: endpoint.method,
        headers: { "Content-Type": "application/json" },
        data: {},
      });
      expect(
        res.status(),
        `${endpoint.method} ${endpoint.path} expected 401`
      ).toBe(401);
    }
  });

  test("T2-API-03 & T2-API-04: CSRF blocks cross-origin (403) and non-JSON Content-Type (415)", async ({
    request,
  }) => {
    const crossOriginRes = await request.post("/api/v1/public/contact", {
      headers: {
        Origin: "https://evil.example.com",
        "Content-Type": "application/json",
        "x-real-ip": uniqueTestIp(2, 12),
      },
      data: { fullName: "Attacker" },
    });
    expect(crossOriginRes.status()).toBe(403);

    const plainTextRes = await request.post("/api/v1/public/contact", {
      headers: {
        "Content-Type": "text/plain",
        "x-real-ip": uniqueTestIp(2, 13),
      },
      data: "raw-text-payload",
    });
    expect(plainTextRes.status()).toBe(415);
  });

  test("T2-API-05: cron endpoints enforce Bearer secret in production and never return 500", async ({
    request,
  }) => {
    const prodOrSecret =
      process.env.PLAYWRIGHT_USE_PROD === "1" || Boolean(process.env.CRON_SECRET);

    for (const endpoint of CRON_ENDPOINTS) {
      const res = await request.get(endpoint, {
        headers: { Authorization: "Bearer invalid-cron-secret" },
      });
      expect(res.status(), `GET ${endpoint} must not 500`).toBeLessThan(500);
      if (prodOrSecret) {
        expect([401, 403]).toContain(res.status());
      } else {
        expect([200, 401, 403]).toContain(res.status());
      }
    }
  });

  test("T2-API-06: newsletter confirm handles missing token (400) and invalid token redirect cleanly", async ({
    request,
  }) => {
    const missingRes = await request.get("/api/v1/public/newsletter/confirm", {
      maxRedirects: 0,
    });
    expect(missingRes.status()).toBe(400);

    const invalidRes = await request.get(
      "/api/v1/public/newsletter/confirm?token=nonexistent-token",
      { maxRedirects: 0 }
    );
    expect(invalidRes.status()).toBe(307);
    expect(invalidRes.headers()["location"] ?? "").toMatch(
      /\/insights\?(subscribed=1|sub_error=invalid_token)/
    );
  });
});
