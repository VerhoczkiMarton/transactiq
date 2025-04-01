// src/lib/auth/rate-limit.ts
import { NextRequest, NextResponse } from 'next/server';

interface RateLimitConfig {
  limit: number;
  windowMs: number;
}

// Store IP addresses and their request timestamps
const ipRequests = new Map<string, number[]>();

/**
 * Rate limiting middleware for authentication endpoints
 * @param config Rate limiting configuration
 */
export function rateLimiter(config: RateLimitConfig = { limit: 5, windowMs: 60000 }) {
  return async function (req: NextRequest): Promise<NextResponse | null> {
    // Get client IP
    const ip = req.ip || 'unknown';
    const now = Date.now();

    // Get existing requests for this IP
    const requests = ipRequests.get(ip) || [];

    // Filter out requests outside the current window
    const windowStart = now - config.windowMs;
    const recentRequests = requests.filter(timestamp => timestamp > windowStart);

    // Check if rate limit is exceeded
    if (recentRequests.length >= config.limit) {
      // Return 429 Too Many Requests
      return new NextResponse(
        JSON.stringify({
          error: 'Too many requests',
          message: 'Please try again later',
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': Math.ceil(config.windowMs / 1000).toString(),
          },
        }
      );
    }

    // Add current request timestamp
    recentRequests.push(now);
    ipRequests.set(ip, recentRequests);

    // Clean up old entries periodically
    if (Math.random() < 0.01) {
      cleanupOldEntries(windowStart);
    }

    // Continue to the next middleware/handler
    return null;
  };
}

/**
 * Clean up old entries from the IP requests map
 */
function cleanupOldEntries(windowStart: number) {
  for (const [ip, requests] of ipRequests.entries()) {
    const recentRequests = requests.filter(timestamp => timestamp > windowStart);

    if (recentRequests.length === 0) {
      ipRequests.delete(ip);
    } else {
      ipRequests.set(ip, recentRequests);
    }
  }
}
