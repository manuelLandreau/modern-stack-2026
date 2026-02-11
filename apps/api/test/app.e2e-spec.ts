import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { betterAuth } from 'better-auth';
import { getMigrations } from 'better-auth/db';
import Database from 'better-sqlite3';
import { AuthModule } from '@thallesp/nestjs-better-auth';
import { AppController } from '../src/app.controller';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const db = new Database(':memory:');
    const auth = betterAuth({
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
      imports: [AuthModule.forRoot({ auth })],
      controllers: [AppController],
    }).compile();

    app = moduleFixture.createNestApplication({ bodyParser: false });
    await app.init();
  });

  afterAll(async () => {
    await app?.close();
  });

  it('/ (GET)', async () => {
    const res = await request(app.getHttpServer()).get('/').expect(200);

    expect(res.body).toEqual({ message: 'Welcome to CTest API' });
  });
});
