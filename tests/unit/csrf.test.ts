import { describe, expect, it } from "vitest";
import { NextRequest } from "next/server";
import { validateMutationCsrf } from "@/lib/security/csrf";

describe("CSRF Origin Validation & RFC 8058 Exemption", () => {
  it("allows requests from allowed origins with valid JSON content-type", () => {
    const req = new NextRequest("https://techgroww.co.in/api/v1/public/contact", {
      method: "POST",
      headers: {
        host: "techgroww.co.in",
        origin: "https://techgroww.co.in",
        "content-type": "application/json",
      },
    });
    const res = validateMutationCsrf(req);
    expect(res.ok).toBe(true);
  });

  it("allows localhost during local development", () => {
    const req = new NextRequest("http://localhost:3000/api/v1/public/contact", {
      method: "POST",
      headers: {
        host: "localhost:3000",
        origin: "http://localhost:3000",
        "content-type": "application/json",
      },
    });
    const res = validateMutationCsrf(req);
    expect(res.ok).toBe(true);
  });

  it("rejects untrusted external origins with 403", () => {
    const req = new NextRequest("https://techgroww.co.in/api/v1/public/contact", {
      method: "POST",
      headers: {
        host: "techgroww.co.in",
        origin: "https://malicious-site.com",
        "content-type": "application/json",
      },
    });
    const res = validateMutationCsrf(req);
    expect(res.ok).toBe(false);
    expect(res.status).toBe(403);
  });

  it("rejects simple HTML form submissions missing application/json with 415", () => {
    const req = new NextRequest("https://techgroww.co.in/api/v1/public/contact", {
      method: "POST",
      headers: {
        host: "techgroww.co.in",
        origin: "https://techgroww.co.in",
        "content-type": "application/x-www-form-urlencoded",
      },
    });
    const res = validateMutationCsrf(req);
    expect(res.ok).toBe(false);
    expect(res.status).toBe(415);
  });

  it("exempts RFC 8058 One-Click unsubscribe POST from Origin check", () => {
    const req = new NextRequest("https://techgroww.co.in/api/v1/public/newsletter/unsubscribe?token=abc", {
      method: "POST",
      headers: {
        "content-type": "application/x-www-form-urlencoded",
      },
    });
    const res = validateMutationCsrf(req);
    expect(res.ok).toBe(true);
  });
});
