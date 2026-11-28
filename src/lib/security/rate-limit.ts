import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { NextRequest } from "next/server";

type RateBucket = "public_contact" | "public_apply" | "auth_login" | "portal_api";

interface RateLimitDecision {
  allowed: boolean;
  limit: number;
  remaining: number;
  resetSeconds: number;
}

const RATE_RULES: Record<RateBucket, { max: number; windowMs: number; windowStr: `${number} s` | `${number} m` }> = {
  public_contact: { max: 5, windowMs: 10 * 60_000, windowStr: "10 m" },
  public_apply: { max: 15, windowMs: 10 * 60_000, windowStr: "10 m" },
  auth_login: { max: 10, windowMs: 15 * 60_000, windowStr: "15 m" },
  portal_api: { max: 120, windowMs: 60_000, windowStr: "60 s" },
};

// Local development / CI in-memory sliding window fallback when Upstash env is unconfigured
const memoryStore = new Map<string, { count: number; resetAt: number }>();

let cachedRedis: Redis | null | undefined;
const limiters = new Map<RateBucket, Ratelimit>();

function getRedisClient(): Redis | null {
  if (cachedRedis !== undefined) return cachedRedis;
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) {
    cachedRedis = null;
    return null;
  }
  cachedRedis = new Redis({ url, token });
  return cachedRedis;
}

/**
 * Strictly reads Vercel's verified forwarding header (never spoofable X-Forwarded-For).
 */
export function getTrustedClientIp(req: NextRequest): string {
  const vercelIp = req.headers.get("x-vercel-forwarded-for");
  if (vercelIp) {
    const first = vercelIp.split(",")[0]?.trim();
    if (first) return first;
  }
  const realIp = req.headers.get("x-real-ip")?.trim();
  return realIp || "127.0.0.1";
}

export async function checkRateLimit(
  bucket: RateBucket,
  identifier: string
): Promise<RateLimitDecision> {
  const rule = RATE_RULES[bucket];
  const key = `${bucket}:${identifier}`;
  const redis = getRedisClient();

  if (redis) {
    let limiter = limiters.get(bucket);
    if (!limiter) {
      limiter = new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(rule.max, rule.windowStr),
        prefix: "tg_rl",
      });
      limiters.set(bucket, limiter);
    }
    const result = await limiter.limit(key);
    return {
      allowed: result.success,
      limit: result.limit,
      remaining: result.remaining,
      resetSeconds: Math.max(1, Math.ceil((result.reset - Date.now()) / 1000)),
    };
  }

  // Fallback local/test limiter
  const now = Date.now();
  const current = memoryStore.get(key);
  if (!current || current.resetAt <= now) {
    memoryStore.set(key, { count: 1, resetAt: now + rule.windowMs });
    return {
      allowed: true,
      limit: rule.max,
      remaining: rule.max - 1,
      resetSeconds: Math.ceil(rule.windowMs / 1000),
    };
  }

  current.count += 1;
  memoryStore.set(key, current);
  const allowed = current.count <= rule.max;
  return {
    allowed,
    limit: rule.max,
    remaining: Math.max(0, rule.max - current.count),
    resetSeconds: Math.max(1, Math.ceil((current.resetAt - now) / 1000)),
  };
}
