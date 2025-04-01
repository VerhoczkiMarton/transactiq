// src/lib/auth/csrf.ts
import { randomBytes } from 'crypto';

/**
 * Generate a CSRF token
 * @returns {string} A random CSRF token
 */
export function generateCsrfToken(): string {
  return randomBytes(32).toString('hex');
}

/**
 * Validate a CSRF token
 * @param {string} token - The token to validate
 * @param {string} storedToken - The stored token to compare against
 * @returns {boolean} Whether the token is valid
 */
export function validateCsrfToken(token: string, storedToken: string): boolean {
  if (!token || !storedToken) {
    return false;
  }

  // Use constant-time comparison to prevent timing attacks
  return timingSafeEqual(token, storedToken);
}

/**
 * Constant-time comparison of two strings
 * This prevents timing attacks by taking the same amount of time
 * regardless of how many characters match
 */
function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) {
    return false;
  }

  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }

  return result === 0;
}
