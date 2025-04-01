import { handlers } from '@/auth';
import { rateLimiter } from '@/lib/auth/rate-limit';
import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  const rateLimit = rateLimiter({ limit: 100, windowMs: 60000 });
  const rateLimitResponse = await rateLimit(req);

  if (rateLimitResponse) {
    return rateLimitResponse;
  }

  return handlers.GET(req);
}

export async function POST(req: NextRequest) {
  const rateLimit = rateLimiter({ limit: 100, windowMs: 60000 });
  const rateLimitResponse = await rateLimit(req);

  if (rateLimitResponse) {
    return rateLimitResponse;
  }

  return handlers.POST(req);
}

export const { HEAD, PUT, DELETE, PATCH } = handlers;
