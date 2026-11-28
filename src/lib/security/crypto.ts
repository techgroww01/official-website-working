import { createHash, createHmac, randomBytes, timingSafeEqual } from "node:crypto";

function getAuthSecret(): string {
  return process.env.AUTH_SECRET || "dev-only-auth-secret-replace-in-production";
}

function getIpSalt(): string {
  return process.env.IP_HASH_SALT || getAuthSecret();
}

export function sha256Hex(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

export function hashClientIp(ip: string): string {
  return createHash("sha256").update(`${ip}:${getIpSalt()}`).digest("hex");
}

export function generateOpaqueToken(bytes = 32): string {
  return randomBytes(bytes).toString("base64url");
}

export function signHmacPayload(payload: Record<string, unknown>, ttlSeconds = 3600): string {
  const exp = Math.floor(Date.now() / 1000) + ttlSeconds;
  const body = Buffer.from(JSON.stringify({ ...payload, exp })).toString("base64url");
  const sig = createHmac("sha256", getAuthSecret()).update(body).digest("base64url");
  return `${body}.${sig}`;
}

export function verifyHmacPayload<T extends Record<string, unknown>>(
  token: string
): (T & { exp: number }) | null {
  const parts = token.split(".");
  if (parts.length !== 2) return null;
  const [body, sig] = parts;
  if (!body || !sig) return null;

  const expectedSig = createHmac("sha256", getAuthSecret()).update(body).digest();
  const actualSig = Buffer.from(sig, "base64url");
  if (expectedSig.length !== actualSig.length) return null;
  if (!timingSafeEqual(expectedSig, actualSig)) return null;

  try {
    const parsed = JSON.parse(Buffer.from(body, "base64url").toString("utf8")) as T & { exp?: number };
    if (typeof parsed.exp !== "number" || parsed.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }
    return parsed as T & { exp: number };
  } catch {
    return null;
  }
}
