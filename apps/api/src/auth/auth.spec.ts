import { describe, it, expect, beforeAll } from 'vitest';
import { betterAuth } from 'better-auth';
import { getMigrations } from 'better-auth/db';
import Database from 'better-sqlite3';

describe('better-auth', () => {
  let auth: ReturnType<typeof betterAuth>;

  beforeAll(async () => {
    const db = new Database(':memory:');
    auth = betterAuth({
      database: db,
      emailAndPassword: { enabled: true },
      secret: 'test-secret-at-least-32-chars-long!!!',
      basePath: '/api/auth',
      baseURL: 'http://localhost:3000',
      trustedOrigins: ['http://localhost:5173'],
    });

    const { runMigrations } = await getMigrations(auth.options);
    await runMigrations();
  });

  it('should sign up a new user', async () => {
    const result = await auth.api.signUpEmail({
      body: {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      },
    });

    expect(result.user).toBeDefined();
    expect(result.user.email).toBe('test@example.com');
    expect(result.user.name).toBe('Test User');
  });

  it('should sign in with correct credentials', async () => {
    const result = await auth.api.signInEmail({
      body: {
        email: 'test@example.com',
        password: 'password123',
      },
    });

    // signInEmail returns { token, user } when called via API directly
    expect(result).toBeDefined();
    expect(result.user).toBeDefined();
    expect(result.user.email).toBe('test@example.com');
    expect(result.token).toBeDefined();
  });

  it('should reject wrong password', async () => {
    await expect(
      auth.api.signInEmail({
        body: {
          email: 'test@example.com',
          password: 'wrongpassword',
        },
      }),
    ).rejects.toThrow();
  });
});
