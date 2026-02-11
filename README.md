# CTest — Full-Stack Web Starter Kit

A production-ready monorepo starter kit for building modern web applications.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Monorepo** | pnpm workspaces |
| **API** | NestJS 11, TypeORM, SQLite |
| **Auth** | better-auth (email + password) |
| **Frontend** | React 19, React Router v7 (Remix/SSR mode) |
| **UI** | Tailwind CSS 4, shadcn/ui (New York style), Radix UI |
| **Validation** | Zod (shared schemas between API & frontend) |
| **Testing** | Vitest, Testing Library, Supertest |
| **Production** | Docker (multi-stage builds), Docker Compose |
| **CI/CD** | GitHub Actions |

## Project Structure

```
ctest/
├── apps/
│   ├── api/                 # NestJS REST API
│   │   ├── src/
│   │   │   ├── auth/        # better-auth configuration & routes
│   │   │   └── user/        # User module (controller, service)
│   │   ├── test/            # E2E tests
│   │   ├── Dockerfile
│   │   └── vitest.config.ts
│   └── front/               # React Router v7 frontend (SSR)
│       ├── src/
│       │   ├── components/  # Login/Register forms + shadcn/ui
│       │   ├── lib/         # Auth client, utilities
│       │   └── routes/      # Home, Login, Register
│       ├── Dockerfile
│       └── vite.config.ts
├── packages/
│   └── shared/              # Shared Zod schemas & TypeScript types
│       └── src/
│           ├── auth.ts      # LoginSchema, RegisterSchema
│           └── auth-response.ts  # SessionSchema, AuthUserSchema
├── docker-compose.yml
├── .github/workflows/ci.yml
└── pnpm-workspace.yaml
```

## Prerequisites

- **Node.js** >= 20
- **pnpm** >= 9

## Getting Started

```bash
# Install dependencies
pnpm install

# Start all apps in development mode (API + Frontend)
pnpm dev
```

The API runs on `http://localhost:3000` and the frontend on `http://localhost:5173`.

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start API and frontend in watch mode |
| `pnpm build` | Build all packages and apps |
| `pnpm test` | Run all tests across the monorepo |
| `pnpm test:api` | Run API tests only |
| `pnpm test:front` | Run frontend tests only |
| `pnpm test:shared` | Run shared package tests only |

## Environment Variables

### API (`apps/api`)

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `3000` | API server port |
| `FRONTEND_URL` | `http://localhost:5173` | Allowed CORS origin |
| `BETTER_AUTH_SECRET` | — | Auth secret (min 32 chars, required in production) |
| `BETTER_AUTH_URL` | `http://localhost:3000` | Auth base URL |

### Frontend (`apps/front`)

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_API_URL` | `http://localhost:3000` | API URL for the auth client |

## Authentication

Authentication is handled by [better-auth](https://www.better-auth.com/) with email/password strategy:

- **API** — better-auth server mounted at `/api/auth/*` via `@thallesp/nestjs-better-auth`
- **Frontend** — better-auth client (`createAuthClient`) calling the API
- **Database** — SQLite (auto-migrated by better-auth: `users` and `sessions` tables)

### Auth Routes

| Endpoint | Description |
|----------|-------------|
| `POST /api/auth/sign-up/email` | Register a new user |
| `POST /api/auth/sign-in/email` | Sign in with email/password |
| `GET /api/auth/get-session` | Get current session |
| `POST /api/auth/sign-out` | Sign out |

## Testing

All packages use **Vitest** as the test runner.

```bash
# Run all tests
pnpm test

# Watch mode (per app)
cd apps/api && pnpm test:watch
cd apps/front && pnpm test:watch

# API E2E tests
cd apps/api && pnpm test:e2e

# Coverage
cd apps/api && pnpm test:cov
```

- **API** — Unit tests (`*.spec.ts`) and E2E tests (`test/*.e2e-spec.ts`) with Supertest
- **Frontend** — Component tests with Testing Library (`*.test.tsx`) in jsdom
- **Shared** — Schema validation tests with Vitest

## Docker (Production)

Both apps have multi-stage Dockerfiles optimized for production.

```bash
# Build and run with Docker Compose
docker compose up --build

# Or build individually
docker build -t ctest-api ./apps/api
docker build -t ctest-front ./apps/front
```

The `docker-compose.yml` exposes:
- API on port `3000`
- Frontend on port `3001`

## CI/CD

GitHub Actions workflow at `.github/workflows/ci.yml` runs on every push and PR to `main`:

1. **Test** — Installs dependencies, runs all tests across the monorepo
2. **Build** — Builds all packages and apps
3. **Docker** — Builds Docker images for both API and frontend

Deployment is commented out (no production server configured yet).

## License

UNLICENSED — Private project.
