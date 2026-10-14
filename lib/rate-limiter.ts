import { NextRequest } from "next/server";

interface RateLimitRecord {
  timestamps: number[];
}

// In-memory cache for tracking client request timestamps
const rateLimitMap = new Map<string, RateLimitRecord>();

// Cleanup interval to remove stale records and prevent memory leaks
const CLEANUP_INTERVAL_MS = 5 * 60 * 1000; // 5 minutes
let lastCleanup = Date.now();

function cleanupStaleRecords(windowMs: number) {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL_MS) return;

  lastCleanup = now;
  const cutoff = now - windowMs;

  for (const [ip, record] of rateLimitMap.entries()) {
    record.timestamps = record.timestamps.filter((t) => t > cutoff);
    if (record.timestamps.length === 0) {
      rateLimitMap.delete(ip);
    }
  }
}

/**
 * Extracts client IP address accurately from various proxy headers
 */
export function getClientIp(req: NextRequest): string {
  // Check standard reverse proxy headers
  const cfConnectingIp = req.headers.get("cf-connecting-ip");
  if (cfConnectingIp) return cfConnectingIp.trim();

  const xForwardedFor = req.headers.get("x-forwarded-for");
  if (xForwardedFor) {
    // x-forwarded-for can be a comma-separated list of IPs. First one is the real client.
    const firstIp = xForwardedFor.split(",")[0].trim();
    if (firstIp) return firstIp;
  }

  const xRealIp = req.headers.get("x-real-ip");
  if (xRealIp) return xRealIp.trim();

  // Fallback to local or default
  return "127.0.0.1";
}

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number; // Seconds until window reset
}

/**
 * Checks and updates rate limit for a client IP using sliding-window counter
 * @param ip Client IP address
 * @param limit Maximum allowed requests within the window
 * @param windowMs Window duration in milliseconds (default: 60,000ms / 1 minute)
 */
export function checkRateLimit(
  ip: string,
  limit: number = 20,
  windowMs: number = 60000
): RateLimitResult {
  cleanupStaleRecords(windowMs);

  const now = Date.now();
  const windowStart = now - windowMs;

  let record = rateLimitMap.get(ip);
  if (!record) {
    record = { timestamps: [] };
    rateLimitMap.set(ip, record);
  }

  // Filter timestamps within current window
  record.timestamps = record.timestamps.filter((t) => t > windowStart);

  const currentRequests = record.timestamps.length;
  const resetSeconds = Math.ceil(
    (record.timestamps.length > 0
      ? record.timestamps[0] + windowMs - now
      : windowMs) / 1000
  );

  if (currentRequests >= limit) {
    return {
      success: false,
      limit,
      remaining: 0,
      reset: Math.max(1, resetSeconds),
    };
  }

  // Record this request
  record.timestamps.push(now);

  return {
    success: true,
    limit,
    remaining: limit - (currentRequests + 1),
    reset: Math.max(1, resetSeconds),
  };
}
