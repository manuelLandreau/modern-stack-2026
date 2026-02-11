import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { betterAuth } from 'better-auth';
import { getMigrations } from 'better-auth/db';
import Database from 'better-sqlite3';
import { AuthModule } from '@thallesp/nestjs-better-auth';
import { AppController } from '../src/app.controller';
import { UserModule } from '../src/user/user.module';

describe('Auth E2E', () => {
  let app: INestApplication;
  let auth: ReturnType<typeof betterAuth>;
  let sessionCookie: string;

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

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AuthModule.forRoot({ auth }), UserModule],
      controllers: [AppController],
    }).compile();

    app = moduleFixture.createNestApplication({ bodyParser: false });
    await app.init();
  });

  afterAll(async () => {
    await app?.close();
  });

  it('POST /api/auth/sign-up/email → creates user (200)', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/auth/sign-up/email')
      .send({
        name: 'E2E User',
        email: 'e2e@example.com',
        password: 'password123',
      })
      .expect(200);

    expect(res.body.user).toBeDefined();
    expect(res.body.user.email).toBe('e2e@example.com');
    expect(res.body.user.name).toBe('E2E User');
  });

  it('POST /api/auth/sign-in/email → returns session cookie (200)', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/auth/sign-in/email')
      .send({
        email: 'e2e@example.com',
        password: 'password123',
      })
      .expect(200);

    expect(res.body.user).toBeDefined();
    // Extract session cookie
    const cookies = res.headers['set-cookie'];
    expect(cookies).toBeDefined();
    sessionCookie = Array.isArray(cookies) ? cookies.join('; ') : cookies;
  });

  it('GET /user/me without cookie → 401', async () => {
    await request(app.getHttpServer()).get('/user/me').expect(401);
  });

  it('GET /user/me with session cookie → returns user data (200)', async () => {
    const res = await request(app.getHttpServer())
      .get('/user/me')
      .set('Cookie', sessionCookie)
      .expect(200);

    expect(res.body.user).toBeDefined();
    expect(res.body.user.email).toBe('e2e@example.com');
    expect(res.body.user.name).toBe('E2E User');
  });
});
