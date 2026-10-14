import type { Context } from "hono";
import { createMiddleware } from "hono/factory";

export interface RateLimitResult {
  limited: boolean;
  retryAfterSeconds?: number;
}

export interface RateLimiter {
  check(ip: string): Promise<RateLimitResult>;
  reset?(): void;
}

/**
 * In-memory sliding window rate limiter.
 * Can be swapped with an Upstash Redis-backed implementation when needed.
 */
export class MemoryRateLimiter implements RateLimiter {
  private ipRecords = new Map<string, { count: number; resetTime: number }>();
  private readonly maxRequests: number;
  private readonly windowMs: number;

  constructor(maxRequests = 3, windowMinutes = 15) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMinutes * 60 * 1000;
  }

  reset(): void {
    this.ipRecords.clear();
  }

  async check(ip: string): Promise<RateLimitResult> {
    const now = Date.now();
    const record = this.ipRecords.get(ip);

    // Evict expired record or create new one
    if (!record || now > record.resetTime) {
      this.ipRecords.set(ip, { count: 1, resetTime: now + this.windowMs });
      return { limited: false };
    }

    if (record.count >= this.maxRequests) {
      const retryAfterSeconds = Math.ceil((record.resetTime - now) / 1000);
      return { limited: true, retryAfterSeconds };
    }

    record.count++;
    return { limited: false };
  }
}

/**
 * Extracts client IP from Vercel/Cloudflare headers or remote address.
 */
export function getClientIp(c: Context): string {
  const forwarded = c.req.header("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0]?.trim() || "unknown";
  }
  return (
    c.req.header("cf-connecting-ip") ||
    c.req.header("x-real-ip") ||
    "127.0.0.1"
  );
}

const defaultLimiter = new MemoryRateLimiter(3, 15);

/**
 * Hono middleware creating the rate limit barrier.
 * Automatically bypassed in development / testing so you won't be locked out.
 */
export function createRateLimitMiddleware(limiter: RateLimiter = defaultLimiter) {
  return createMiddleware(async (c, next) => {
    // Only bypass if explicitly disabled via environment variable
    if (process.env.DISABLE_RATE_LIMIT === "true") {
      await next();
      return;
    }

    const ip = getClientIp(c);
    const result = await limiter.check(ip);

    if (result.limited) {
      c.header("Retry-After", String(result.retryAfterSeconds ?? 60));
      return c.json(
        {
          success: false,
          code: "RATE_LIMITED",
          message: `You've sent a few messages recently. Please wait a couple of minutes before sending another, or reach out to me directly by email.`,
          showDirectEmailFallback: true,
        },
        429
      );
    }

    await next();
  });
}
