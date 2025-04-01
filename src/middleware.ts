import { NextResponse } from 'next/server';

export function middleware() {
  const response = NextResponse.next();

  const securityHeaders = {
    // Prevent MIME type sniffing
    'X-Content-Type-Options': 'nosniff',
    // Prevent clickjacking
    'X-Frame-Options': 'DENY',
    // XSS protection
    'X-XSS-Protection': '1; mode=block',
    // Strict Transport Security
    'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
    // Referrer Policy
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    // Content Security Policy
    'Content-Security-Policy':
      "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https:; frame-src 'self' https://accounts.google.com https://github.com;",
    // Permissions Policy
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  };

  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  return response;
}

// Apply middleware to all routes
export const config = {
  matcher: ['/((?!api/auth|_next/static|_next/image|favicon.ico).*)'],
};
