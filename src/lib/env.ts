import { z } from 'zod';

const envSchema = z.object({
  // Database
  DATABASE_URL: z.string().url(),
  POSTGRES_PASSWORD: z.string().min(8),

  // Authentication
  AUTH_SECRET: z.string().min(32),
  AUTH_GITHUB_ID: z.string(),
  AUTH_GITHUB_SECRET: z.string(),
  AUTH_GOOGLE_ID: z.string(),
  AUTH_GOOGLE_SECRET: z.string(),
  AUTH_TRUST_HOST: z
    .union([z.literal('true'), z.literal('false')])
    .optional()
    .default('true'),

  // API
  NEXT_PUBLIC_API_URL: z.string().url(),

  // Node environment
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
});

export function validateEnv() {
  try {
    const parsed = envSchema.safeParse(process.env);

    if (!parsed.success) {
      console.error(
        '❌ Invalid environment variables:',
        parsed.error.errors.map(err => `${err.path}: ${err.message}`).join('\n')
      );
      throw new Error('Invalid environment variables');
    }

    return parsed.data;
  } catch (error) {
    console.error('❌ Error validating environment variables:', error);
    throw new Error('Failed to validate environment variables');
  }
}

export const env = validateEnv();
