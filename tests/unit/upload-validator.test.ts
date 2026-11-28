import { describe, expect, it } from "vitest";
import {
  validateUploadMetadata,
  verifyFileMagicAndStructure,
} from "@/lib/security/upload-validator";

describe("Upload Validator & Magic Byte Scanner", () => {
  it("strictly prohibits SVG uploads", () => {
    const res1 = validateUploadMetadata("cms", "image.svg", "image/svg+xml", 1000);
    expect(res1.ok).toBe(false);
    expect(res1.status).toBe(415);

    const res2 = validateUploadMetadata("resume", "resume.svg", "image/svg+xml", 1000);
    expect(res2.ok).toBe(false);
  });

  it("accepts valid PDF metadata within domain limits", () => {
    const res = validateUploadMetadata("resume", "resume.pdf", "application/pdf", 1024 * 1024);
    expect(res.ok).toBe(true);
  });

  it("rejects files exceeding size limits", () => {
    const res = validateUploadMetadata("resume", "resume.pdf", "application/pdf", 10 * 1024 * 1024);
    expect(res.ok).toBe(false);
    expect(res.status).toBe(413);
  });

  it("verifies PDF magic bytes %PDF-", () => {
    const validPdfBytes = new Uint8Array([0x25, 0x50, 0x44, 0x46, 0x2d, 0x31, 0x2e, 0x37]);
    const res = verifyFileMagicAndStructure(validPdfBytes, "application/pdf");
    expect(res.ok).toBe(true);

    const invalidBytes = new Uint8Array([0x48, 0x65, 0x6c, 0x6c, 0x6f]);
    const badRes = verifyFileMagicAndStructure(invalidBytes, "application/pdf");
    expect(badRes.ok).toBe(false);
  });

  it("verifies PNG magic bytes 0x89 0x50 0x4E 0x47", () => {
    const validPngBytes = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
    const res = verifyFileMagicAndStructure(validPngBytes, "image/png");
    expect(res.ok).toBe(true);
  });
});
