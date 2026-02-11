import { betterAuth } from 'better-auth';
import type { BetterAuthOptions } from 'better-auth';
import Database from 'better-sqlite3';

const options = {
  database: new Database('./sqlite.db'),
  emailAndPassword: { enabled: true },
  secret:
    process.env.BETTER_AUTH_SECRET || 'dev-secret-at-least-32-chars-long!!!',
  basePath: '/api/auth',
  baseURL: process.env.BETTER_AUTH_URL || 'http://localhost:3000',
  trustedOrigins: [process.env.FRONTEND_URL || 'http://localhost:5173'],
} satisfies BetterAuthOptions;

export const auth: ReturnType<typeof betterAuth> = betterAuth(options);
