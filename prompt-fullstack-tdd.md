note:   
doc pour agent : https://deepwiki.com
skills (https://github.com/anthropics/skills) à installer ici -> .claude/skills/mon-skill/SKILL.md
repo généré : https://github.com/manuelLandreau/modern-stack-2026

### Prompt de création de prompt:

Create a prompt to generate an client/api web application with a tdd method approch.             
the app has to be a react app with react-router-v7 (Remix mode), Better-auth, ChadCn/ui, Zod and 
has to be dockerised for production.                                                            
The api has to be an NestJS api with Better-auth, SQLite, Zod and TypeORM.                       
All of this will be an pnpm monorepo with workspace: the client and api can share common DTOs    
(types or Zod schemas)                                                                           
It will have a README.MD, and a github action config bootstrap for ci/cd.                        
the tdd aproche is very importante. A                                                            
Any question before righting the prompt ?                                                        

● Good idea to clarify before writing. Here are my questions:

  App Scope & Features
  1. What does the app actually do beyond auth? (e.g., CRUD on a specific resource like "tasks",
  "posts"? Or just an auth boilerplate scaffold?)
  2. Which auth methods? Email/password only, or also OAuth providers (Google, GitHub...)?

  TDD Details
  3. Testing frameworks preference? (e.g., Vitest for client + shared, Jest for NestJS — or Vitest
  everywhere?)
  4. Should the prompt include E2E tests (Playwright/Cypress) or only unit/integration tests?

  Infrastructure
  5. Docker setup: single docker-compose.yml orchestrating both client + API, or separate Dockerfiles
  only?
  6. SQLite in production too, or just for dev? (SQLite can be limiting in production — or is that
  intentional for simplicity?)
  7. GitHub Actions: just lint + test + build, or also a deployment step to a specific target (VPS,
  Fly.io, etc.)?

  Preferences
  8. Node version? (22 LTS?)
  9. React Router v7 "Remix mode" = framework/SSR mode with loaders/actions — confirmed?
  10. Any preference for the monorepo structure naming? (e.g., apps/client, apps/api, packages/shared —
   or something else?)

  Let me know and I'll craft a comprehensive, copy-pasteable prompt.

❯ App Scope & Features: juste a home page (layout/header/page content/footer) protected by auth        
  (Email/password). Vitest everywhere. docker-compose.yml for api in dev and separate dockerfiles   
  in production. E2E tests with cypress. actually no sqlite but postgres for dev and production     
  (for dev put it in the docker-compose). int + test + build -> no deploy for now. node lts 24.        
  framework/SSR mode with loaders/actions ok. monorepo structure ok. go
  
  
# Final Prompt

## Prompt: Full-Stack TDD Monorepo — React Router v7 + NestJS

Generate a **production-ready, test-driven** full-stack web application as a **pnpm monorepo**.

---

## 1. Monorepo Structure

```
project-root/
├── apps/
│   ├── client/          # React Router v7 (Remix/framework mode)
│   └── api/             # NestJS API
├── packages/
│   └── shared/          # Shared Zod schemas, DTOs, types
├── docker/
│   ├── client.Dockerfile   # Production Dockerfile for client
│   └── api.Dockerfile      # Production Dockerfile for API
├── docker-compose.yml      # Dev: API + PostgreSQL
├── .github/
│   └── workflows/
│       └── ci.yml          # GitHub Actions: lint + test + build
├── pnpm-workspace.yaml
├── package.json            # Root scripts (lint, test, build, dev)
├── tsconfig.base.json      # Shared TypeScript base config
├── .gitignore
├── .nvmrc                  # Node 24
└── README.md
```

**pnpm workspace config** (`pnpm-workspace.yaml`):
```yaml
packages:
  - "apps/*"
  - "packages/*"
```

All packages reference `@repo/shared` for shared code. Use `workspace:*` protocol.

---

## 2. TDD Methodology — CRITICAL

This project **must** follow strict Test-Driven Development:

1. **Red**: Write a failing test that defines the expected behavior.
2. **Green**: Write the minimal code to make the test pass.
3. **Refactor**: Clean up while keeping tests green.

### Testing stack (uniform across all packages):
- **Unit & Integration tests**: Vitest everywhere (client, API, shared)
- **E2E tests**: Cypress (in `apps/client/`)
- Every module, service, controller, route, component, and schema **must have corresponding tests**.
- Tests are colocated next to source files: `foo.ts` → `foo.spec.ts`
- Provide a `vitest.config.ts` per package.

### Test expectations:
| Layer | What to test |
|---|---|
| `packages/shared` | Zod schema validation (valid input, invalid input, edge cases) |
| `apps/api` — Services | Business logic, auth flows, DB interactions (use in-memory/test DB) |
| `apps/api` — Controllers | Request/response cycle, guards, validation pipes |
| `apps/api` — Integration | Full request through NestJS app (supertest) |
| `apps/client` — Components | Rendering, user interactions (Testing Library) |
| `apps/client` — Routes | Loaders/actions logic, redirects, auth guards |
| `apps/client` — E2E (Cypress) | Full login flow, protected route redirect, logout |

---

## 3. Shared Package — `packages/shared`

```
packages/shared/
├── src/
│   ├── schemas/
│   │   ├── auth.schema.ts       # loginSchema, registerSchema (Zod)
│   │   └── auth.schema.spec.ts
│   ├── types/
│   │   └── auth.types.ts        # Inferred types from Zod schemas (LoginDTO, RegisterDTO, UserDTO)
│   └── index.ts                 # Barrel export
├── tsconfig.json
├── vitest.config.ts
└── package.json                 # name: @repo/shared
```

- All DTOs are **Zod schemas first**, types are **inferred** with `z.infer<>`.
- Both client and API import from `@repo/shared`.

---

## 4. API — `apps/api` (NestJS)

```
apps/api/
├── src/
│   ├── app.module.ts
│   ├── app.module.spec.ts
│   ├── main.ts
│   ├── config/
│   │   ├── database.config.ts       # TypeORM PostgreSQL config
│   │   └── auth.config.ts           # Better-auth server config
│   ├── auth/
│   │   ├── auth.module.ts
│   │   ├── auth.controller.ts
│   │   ├── auth.controller.spec.ts
│   │   ├── auth.service.ts
│   │   ├── auth.service.spec.ts
│   │   ├── auth.guard.ts
│   │   └── auth.guard.spec.ts
│   ├── user/
│   │   ├── user.module.ts
│   │   ├── user.entity.ts
│   │   ├── user.service.ts
│   │   ├── user.service.spec.ts
│   │   └── user.repository.ts
│   └── health/
│       ├── health.controller.ts
│       └── health.controller.spec.ts
├── test/
│   ├── app.e2e-spec.ts             # Integration tests (supertest)
│   └── setup.ts                     # Test DB setup/teardown
├── tsconfig.json
├── vitest.config.ts
└── package.json
```

### API details:
- **NestJS** with Express adapter.
- **Better-auth** as the auth engine (server-side). Email/password strategy only.
- **TypeORM** with PostgreSQL. Entities: `User` (id, email, name, password hash, createdAt, updatedAt).
- **Zod validation pipe**: validate all incoming requests with shared Zod schemas.
- **Endpoints**:
  - `POST /api/auth/register` — register (validated by `registerSchema`)
  - `POST /api/auth/login` — login (validated by `loginSchema`)
  - `POST /api/auth/logout` — logout
  - `GET /api/auth/me` — get current user (protected)
  - `GET /api/health` — health check
- **Guards**: `AuthGuard` that verifies the Better-auth session.
- API listens on port `3001`.

---

## 5. Client — `apps/client` (React Router v7 — Remix Mode)

```
apps/client/
├── src/ <- appDirectory: "src" in apps/front/react-router.config.ts
│   ├── root.tsx
│   ├── root.spec.tsx
│   ├── routes/
│   │   ├── _layout.tsx              # Shared layout: Header + Footer + <Outlet/>
│   │   ├── _layout.spec.tsx
│   │   ├── _layout.home.tsx         # Home page (protected, loader checks auth)
│   │   ├── _layout.home.spec.tsx
│   │   ├── auth.login.tsx           # Login page (action handles form submit)
│   │   ├── auth.login.spec.tsx
│   │   ├── auth.register.tsx        # Register page (action handles form submit)
│   │   └── auth.register.spec.tsx
│   ├── components/
│   │   ├── ui/                      # ChadCN/UI components (button, input, card, form...)
│   │   ├── header.tsx
│   │   ├── header.spec.tsx
│   │   ├── footer.tsx
│   │   └── footer.spec.tsx
│   ├── lib/
│   │   ├── auth.client.ts           # Better-auth client config
│   │   ├── api.ts                   # Fetch wrapper to call the API
│   │   └── utils.ts                 # ChadCN cn() utility
│   └── styles/
│       └── tailwind.css
├── cypress/
│   ├── e2e/
│   │   ├── auth.cy.ts              # Login, register, logout flows
│   │   └── home.cy.ts              # Protected home page access
│   ├── support/
│   │   └── commands.ts
│   └── cypress.config.ts
├── public/
├── react-router.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── vitest.config.ts
└── package.json
```

### Client details:
- **React Router v7 in framework mode** (SSR, loaders, actions).
- **Better-auth client** for session management.
- **ChadCN/UI** + Tailwind CSS for all UI components.
- **Loaders**: `_layout.home.tsx` loader checks auth → redirects to `/auth/login` if unauthenticated.
- **Actions**: `auth.login.tsx` and `auth.register.tsx` actions validate form with shared Zod schemas, call the API, handle errors.
- **Forms**: Use ChadCN/UI `<Form>`, `<Input>`, `<Button>`, `<Card>` components. Display Zod validation errors inline.
- **Layout**: Header shows app name + user email + logout button (when authenticated). Footer shows a simple copyright.
- Client runs on port `3000`, proxies `/api` to `http://localhost:3001`.

---

## 6. Docker

### `docker-compose.yml` (Development)
```yaml
services:
  postgres:
    image: postgres:17-alpine
    environment:
      POSTGRES_USER: dev
      POSTGRES_PASSWORD: dev
      POSTGRES_DB: app_dev
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data

  api:
    build:
      context: .
      dockerfile: docker/api.Dockerfile
      target: development
    volumes:
      - ./apps/api:/app/apps/api
      - ./packages/shared:/app/packages/shared
    ports:
      - "3001:3001"
    depends_on:
      - postgres
    environment:
      DATABASE_URL: postgres://dev:dev@postgres:5432/app_dev
      NODE_ENV: development

volumes:
  pgdata:
```

### Production Dockerfiles (`docker/api.Dockerfile`, `docker/client.Dockerfile`)
- Multi-stage builds: `deps` → `build` → `production`.
- Base image: `node:24-alpine`.
- Install pnpm globally, copy workspace config, install deps, build, then create lean production image.
- Production stage copies only built artifacts + `node_modules` (pruned).

---

## 7. GitHub Actions — `.github/workflows/ci.yml`

Triggered on: `push` to `main`, all `pull_request`.

```yaml
jobs:
  ci:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:17-alpine
        env:
          POSTGRES_USER: test
          POSTGRES_PASSWORD: test
          POSTGRES_DB: app_test
        ports:
          - 5432:5432
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 24
          cache: pnpm
      - run: pnpm install --frozen-lockfile
      - run: pnpm lint
      - run: pnpm test          # Vitest (all packages)
      - run: pnpm build         # Build all packages
      - run: pnpm test:e2e      # Cypress (headless)
```

---

## 8. Root `package.json` Scripts

```json
{
  "scripts": {
    "dev": "pnpm --filter @repo/api dev & pnpm --filter @repo/client dev",
    "build": "pnpm -r build",
    "test": "pnpm -r test",
    "test:e2e": "pnpm --filter @repo/client test:e2e",
    "lint": "pnpm -r lint",
    "db:migrate": "pnpm --filter @repo/api db:migrate",
    "docker:dev": "docker compose up -d"
  }
}
```

---

## 9. Environment & Config

- `.env.example` at root and in each app with all required variables.
- Variables: `DATABASE_URL`, `AUTH_SECRET`, `API_URL`, `NODE_ENV`.
- Zod-validated env config in the API (`config/env.config.ts`).

---

## 10. README.md

Include:
- Project description and tech stack summary.
- Prerequisites (Node 24, pnpm, Docker).
- Quick start: `pnpm install` → `docker compose up -d` → `pnpm dev`.
- Available scripts table.
- Project structure overview.
- Testing section: how to run unit, integration, and E2E tests.
- Docker production build instructions.
- Contributing guidelines (TDD workflow).
