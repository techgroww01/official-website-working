import { describe, expect, it } from "vitest";
import {
  hashClientIp,
  sha256Hex,
  signHmacPayload,
  verifyHmacPayload,
} from "@/lib/security/crypto";

describe("Crypto & Security Token Utilities", () => {
  it("computes deterministic sha256Hex", () => {
    const h1 = sha256Hex("techgroww");
    const h2 = sha256Hex("techgroww");
    expect(h1).toBe(h2);
    expect(h1.length).toBe(64);
  });

  it("hashes client IPs deterministically with salt", () => {
    const ip1 = hashClientIp("192.168.1.1");
    const ip2 = hashClientIp("192.168.1.1");
    expect(ip1).toBe(ip2);
    expect(ip1).not.toBe("192.168.1.1");
  });

  it("signs and verifies HMAC payloads within TTL", () => {
    const token = signHmacPayload({ postingId: "post-123", role: "lead" }, 60);
    const verified = verifyHmacPayload<{ postingId: string; role: string }>(token);
    expect(verified).not.toBeNull();
    expect(verified?.postingId).toBe("post-123");
    expect(verified?.role).toBe("lead");
  });

  it("rejects tampered HMAC tokens", () => {
    const token = signHmacPayload({ postingId: "post-123" }, 60);
    const tampered = token.slice(0, -4) + "XXXX";
    const verified = verifyHmacPayload(tampered);
    expect(verified).toBeNull();
  });
});
