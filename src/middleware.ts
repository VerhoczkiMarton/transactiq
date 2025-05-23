import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

const protectedRoutes = ['/dashboard', '/transactions', '/wallets', '/analytics'];
const publicRoutes = ['/welcome', '/auth', '/unauthorized'];

export async function middleware(request: NextRequest) {
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

  const path = request.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.some(
    route => path === route || path.startsWith(`${route}/`)
  );
  const isPublicRoute = publicRoutes.some(route => path === route || path.startsWith(`${route}/`));

  const isProduction = process.env.NODE_ENV === 'production';

  const token = await getToken({
    req: request,
    secret: process.env.AUTH_SECRET,
    cookieName: isProduction ? '__Secure-authjs.session-token' : 'authjs.session-token',
    secureCookie: isProduction,
  });

  console.log('Token:', JSON.stringify(token));
  console.log('Requested Path:', path);

  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL('/unauthorized', request.url));
  }

  if (path === '/' && !token && !isPublicRoute) {
    return NextResponse.redirect(new URL('/welcome', request.url));
  }

  return response;
}

export const config = {
  matcher: ['/((?!api/auth|_next/static|_next/image|favicon.ico).*)'],
};
