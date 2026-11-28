import { describe, expect, it } from "vitest";
import { generateCertificatePdfBytes } from "@/lib/certificates/pdf";

describe("Pure-JS PDF Certificate Generator", () => {
  it("generates valid PDF binary with %PDF- header", async () => {
    const pdfBytes = await generateCertificatePdfBytes({
      certificateCode: "TG-CERT-2026-TEST",
      recipientName: "Test Candidate",
      programTitle: "Cloud Architecture & Full-Stack Systems",
      issuedAtIso: "2026-03-01T00:00:00Z",
    });

    expect(pdfBytes).toBeInstanceOf(Uint8Array);
    expect(pdfBytes.byteLength).toBeGreaterThan(1000);

    const header = String.fromCharCode(...pdfBytes.slice(0, 5));
    expect(header).toBe("%PDF-");
  });
});
