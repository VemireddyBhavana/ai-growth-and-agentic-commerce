# AI Sales Assistant — Enterprise Foundation

[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue.svg)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-15.1-black.svg)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0-61dafb.svg)](https://react.dev/)
[![Express](https://img.shields.io/badge/Express-4.21-green.svg)](https://expressjs.com/)
[![Prisma](https://img.shields.io/badge/Prisma-6.4-1b222d.svg)](https://www.prisma.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8.svg)](https://tailwindcss.com/)
[![Turborepo](https://img.shields.io/badge/Turborepo-2.4-ef4444.svg)](https://turbo.build/)
[![Vitest](https://img.shields.io/badge/Vitest-3.0-fcc72b.svg)](https://vitest.dev/)
[![Playwright](https://img.shields.io/badge/Playwright-1.50-45ba4b.svg)](https://playwright.dev/)

> **Autonomous Agentic Commerce Platform with Explainable AI & Razorpay Integration**  
> Enterprise-grade modular monorepo project foundation engineered for high-throughput AI commerce workflows, explainable multi-turn recommendation trees, and cryptographically verified payment reconciliation.

---

## 📑 Table of Contents
- [Architecture Overview](#-architecture-overview)
- [Monorepo Folder Hierarchy](#-monorepo-folder-hierarchy)
- [Folder Responsibilities & Rationale](#-folder-responsibilities--rationale)
- [Technology Stack Matrix](#-technology-stack-matrix)
- [Prerequisites](#-prerequisites)
- [Quick Start & Installation](#-quick-start--installation)
- [Environment Variables Specification](#-environment-variables-specification)
- [Running Applications](#-running-applications)
- [Database Setup & Management](#-database-setup--management)
- [Docker & Containerized Development](#-docker--containerized-development)
- [Testing Matrix & Quality Assurance](#-testing-matrix--quality-assurance)
- [Available Development Scripts](#-available-development-scripts)
- [Engineering Governance & Standards](#-engineering-governance--standards)

---

## 🏛 Architecture Overview

The repository is structured as an enterprise-grade Turborepo monorepo consisting of high-cohesion applications and shared domain packages:

```mermaid
graph TD
    subgraph Apps ["Applications (`apps/`)"]
        Web["@ai-sales-assistant/web<br/>(Next.js 15 App Router)"]
        Api["@ai-sales-assistant/api<br/>(Node.js Express API)"]
    end

    subgraph Packages ["Shared Packages (`packages/`)"]
        UI["@ai-sales-assistant/ui<br/>(shadcn/ui Design Tokens)"]
        Config["@ai-sales-assistant/config<br/>(Zod Schemas & Constants)"]
        Types["@ai-sales-assistant/types<br/>(DTOs & Contract Types)"]
        Utils["@ai-sales-assistant/utils<br/>(Crypto, Formats & Logger)"]
    end

    Web --> UI
    Web --> Config
    Web --> Types
    Web --> Utils

    Api --> Config
    Api --> Types
    Api --> Utils
```

---

## 📂 Monorepo Folder Hierarchy

```
ai-sales-assistant/
├── .github/                       # CI/CD pipelines & automated workflows
├── .husky/                        # Git hooks (pre-commit, commit-msg)
├── .vscode/                       # Workspace settings, launch configs, recommendations
├── apps/
│   ├── api/                       # Express.js backend API server
│   │   ├── prisma/                # Prisma schema, migrations, seed runners
│   │   │   ├── schema.prisma      # PostgreSQL & pgvector datasource configuration
│   │   │   └── seed.ts            # Baseline database seeder
│   │   ├── src/
│   │   │   ├── config/            # Strongly-typed environment & SDK singletons
│   │   │   ├── controllers/       # HTTP route handler controllers
│   │   │   ├── middleware/        # Error handling, auth, validation, rate limiting
│   │   │   ├── repositories/      # Prisma ORM data access abstraction layer
│   │   │   ├── routes/            # Express router aggregators
│   │   │   ├── services/          # Business logic domain services
│   │   │   ├── utils/             # AppError, Logger, and local helpers
│   │   │   ├── app.ts             # Express app setup and middleware chain
│   │   │   └── server.ts          # Server listener and graceful shutdown
│   │   ├── tests/                 # Vitest integration and health tests
│   │   ├── Dockerfile             # Multi-stage production container build
│   │   └── package.json           # API dependencies and lifecycle scripts
│   └── web/                       # Next.js 15 Web Application
│       ├── public/                # Static public assets (icons, favicons)
│       ├── src/
│       │   ├── app/               # Next.js 15 App Router (layout, globals.css, pages)
│       │   ├── lib/               # Utility functions, animation presets, API client
│       │   ├── providers/         # ThemeProvider, QueryProvider, ToastProvider
│       │   └── stores/            # Zustand reactive client state stores
│       ├── tests/                 # Playwright E2E and Vitest unit tests
│       ├── components.json        # shadcn/ui configuration
│       ├── next.config.ts         # Next.js bundler and monorepo transpiler config
│       ├── tailwind.config.ts     # Tailwind CSS theme tokens and dark mode config
│       ├── Dockerfile             # Multi-stage production container build
│       └── package.json           # Frontend dependencies and lifecycle scripts
├── packages/
│   ├── config/                    # Shared Zod environment schemas & system constants
│   ├── types/                     # Shared TypeScript interfaces, DTOs & API models
│   ├── ui/                        # Shared shadcn/ui components (Button, etc.)
│   └── utils/                     # Shared crypto (HMAC), formatting & logging utilities
├── docs/                          # Architecture blueprints & developer guidelines
│   ├── architecture/              # System architecture specifications
│   ├── setup/                     # Setup instructions & developer guides
│   └── api/                       # REST & WebSocket API standards
├── scripts/                       # Automation, setup, dev, and maintenance scripts
├── public/                        # Monorepo global static assets & robots.txt
├── .editorconfig                  # Uniform indentation and formatting rules across IDEs
├── .gitignore                     # Git exclusion patterns
├── .lintstagedrc.json             # Staged file linter configuration
├── .prettierrc                    # Code formatting configuration
├── .prettierignore                # Prettier exclusion list
├── commitlint.config.js           # Conventional commit message enforcement
├── docker-compose.yml             # Local PostgreSQL 16 (pgvector) & Redis 7.2 stack
├── package.json                   # Monorepo root workspaces and orchestration scripts
├── tsconfig.base.json             # Root TypeScript compiler base configuration
├── tsconfig.json                  # Root TypeScript workspace configuration
├── turbo.json                     # Turborepo task pipeline dependency graph
└── README.md                      # Comprehensive project documentation
```

---

## 🎯 Folder Responsibilities & Rationale

| Directory / Package | Responsibility & Rationale |
| :--- | :--- |
| **`apps/api/`** | The Express backend API server. Houses layered architecture (`config/`, `middleware/`, `controllers/`, `services/`, `repositories/`, `routes/`) to cleanly decouple HTTP routing from business domain logic and database operations. |
| **`apps/web/`** | The Next.js 15 App Router frontend. Configured with React 19, Tailwind CSS, dark mode support (`next-themes`), TanStack Query v5, Zustand client state, Sonner toast notifications, and Framer Motion spring animations. |
| **`packages/config/`** | Single source of truth for runtime environment validation using Zod. Eliminates unvalidated `process.env` access and provides system constants across apps. |
| **`packages/types/`** | Central repository for shared TypeScript interfaces, JWT auth payloads, API response envelopes, and pagination models. Guarantees 100% end-to-end type safety between frontend and backend. |
| **`packages/ui/`** | Shared design system components based on Radix UI primitives and Tailwind CSS. Enables reusable, accessible UI elements across multiple web portals. |
| **`packages/utils/`** | Shared pure utilities, including HMAC-SHA256 signature verification for Razorpay payments, integer subunit currency formatting, and structured logging. |
| **`docs/`** | Comprehensive architectural reference documents, API specifications, and onboarding manuals. |
| **`scripts/`** | Shell scripts for rapid workspace bootstrap (`setup.sh`), dev orchestration (`dev.sh`), and cache cleanup (`clean.sh`). |
| **`public/`** | Shared static assets including `robots.txt` and favicon files. |

---

## 🧰 Technology Stack Matrix

### Frontend Stack (`apps/web`)
- **Framework:** Next.js 15 (App Router)
- **UI Library:** React 19
- **Language:** TypeScript 5.7+
- **Styling:** Tailwind CSS 3.4 + CSS Custom Properties (Dark Mode)
- **Components:** shadcn/ui (Radix UI Primitives)
- **Animations:** Framer Motion 12+
- **Icons:** Lucide React
- **Server State:** TanStack React Query v5
- **Client State:** Zustand 5+ (with devtools & persist)
- **Forms & Validation:** React Hook Form + Zod
- **Toasts:** Sonner
- **Testing:** Vitest (Unit/Component) + Playwright (E2E)

### Backend Stack (`apps/api`)
- **Runtime:** Node.js v20+ (LTS)
- **Framework:** Express.js 4.21+
- **Language:** TypeScript 5.7+ (NodeNext resolution)
- **ORM:** Prisma ORM 6.4+
- **Database:** PostgreSQL 16 with `pgvector` extension
- **Caching & PubSub:** Redis 7.2
- **Authentication:** JWT (jsonwebtoken) + Role-Based Access Control (RBAC)
- **AI Gateway Configuration:** OpenAI SDK 4+ (GPT-4o)
- **Payment Gateway Configuration:** Razorpay SDK 2.9+ (Test Mode)
- **Validation:** Zod 3.24+
- **Security:** Helmet, CORS, Rate Limiter (express-rate-limit), Timing-Safe HMAC
- **Logging:** Pino (Structured NDJSON) + Pino-Pretty + Morgan

### Monorepo & Dev Tooling
- **Build Orchestration:** Turborepo 2.4+
- **Code Quality:** ESLint 9+ & Prettier 3.5+
- **Git Hooks:** Husky 9+ & Lint-Staged 15+ & Commitlint
- **Containers:** Docker Multi-Stage Builds & Docker Compose

---

## ⚡ Prerequisites

Ensure the following tools are installed on your machine:
- [Node.js (LTS v20+)](https://nodejs.org/)
- [npm (v10+)](https://www.npmjs.com/)
- [Docker & Docker Compose](https://www.docker.com/)

---

## 🚀 Quick Start & Installation

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/your-org/ai-sales-assistant.git
cd ai-sales-assistant
npm install
```

### 2. Configure Environment Variables
```bash
# Copy example configurations
cp .env.example .env
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env
```

### 3. Spin Up Development Containers (PostgreSQL + Redis)
```bash
docker compose up -d postgres redis
```

### 4. Initialize Database & Generate Prisma Client
```bash
npm run db:generate
npm run db:migrate
npm run db:seed
```

### 5. Start Development Servers
```bash
npm run dev
```

Your applications will be available at:
- **Next.js Web Frontend:** [http://localhost:3000](http://localhost:3000)
- **Express API Server:** [http://localhost:5000](http://localhost:5000)
- **API Health Check:** [http://localhost:5000/health](http://localhost:5000/health)
- **API v1 Health Endpoint:** [http://localhost:5000/api/v1/health](http://localhost:5000/api/v1/health)

---

## 🔐 Environment Variables Specification

### Backend Variables (`apps/api/.env`)
| Variable | Required | Default / Example | Purpose |
| :--- | :---: | :--- | :--- |
| `NODE_ENV` | No | `development` | Environment mode (`development`, `test`, `production`) |
| `PORT` | No | `5000` | HTTP port for the Express API server |
| `DATABASE_URL` | **Yes** | `postgresql://postgres:...@localhost:5432/ai_sales_assistant` | PostgreSQL connection string |
| `REDIS_URL` | No | `redis://localhost:6379` | Redis connection URL for caching & rate limiting |
| `JWT_SECRET` | **Yes** | `[32+ character random string]` | Secret key used to sign and verify access tokens |
| `JWT_EXPIRES_IN` | No | `7d` | Access token lifespan |
| `JWT_REFRESH_SECRET`| No | `[32+ character random string]` | Secret key for refresh tokens |
| `JWT_REFRESH_EXPIRES_IN`| No | `30d` | Refresh token lifespan |
| `OPENAI_API_KEY` | **Yes** | `sk-...` | OpenAI API key for autonomous agent & embeddings |
| `OPENAI_MODEL` | No | `gpt-4o` | Primary LLM model identifier |
| `RAZORPAY_KEY_ID` | **Yes** | `rzp_test_...` | Razorpay Test Mode Key ID |
| `RAZORPAY_KEY_SECRET`| **Yes** | `...` | Razorpay Test Mode Key Secret |
| `RAZORPAY_WEBHOOK_SECRET`| No | `...` | HMAC secret for verifying Razorpay webhooks |
| `LOG_LEVEL` | No | `debug` | Logging level (`debug`, `info`, `warn`, `error`) |
| `CORS_ORIGIN` | No | `http://localhost:3000` | Allowed client origin for CORS |

### Frontend Variables (`apps/web/.env`)
| Variable | Required | Default / Example | Purpose |
| :--- | :---: | :--- | :--- |
| `NEXT_PUBLIC_APP_URL` | No | `http://localhost:3000` | Public URL of the frontend application |
| `NEXT_PUBLIC_API_URL` | No | `http://localhost:5000/api/v1` | Base URL for API calls made from browser |
| `NODE_ENV` | No | `development` | Frontend runtime environment |

---

## 🏃 Running Applications

### Run All Applications Concurrently
```bash
npm run dev
```

### Run Frontend Only
```bash
npm run dev:web
```

### Run Backend Only
```bash
npm run dev:api
```

---

## 🗄 Database Setup & Management

All database operations are managed via Prisma ORM configured in `apps/api/prisma/schema.prisma`.

```bash
# Generate the Prisma client types
npm run db:generate

# Run migrations against the database
npm run db:migrate

# Seed baseline configuration data
npm run db:seed

# Launch Prisma Studio interactive database GUI
npm run db:studio
```

---

## 🐳 Docker & Containerized Development

### Start Core Infrastructure Services
```bash
docker compose up -d postgres redis
```

### Start Full Stack in Docker Containers
```bash
docker compose --profile full-stack up --build -d
```

### Stop Containers & Preserve Volumes
```bash
docker compose down
```

---

## 🧪 Testing Matrix & Quality Assurance

### Run Unit & Integration Tests (Vitest)
```bash
npm run test
```

### Run End-to-End Tests (Playwright)
```bash
npm run test:e2e
```

### Code Quality & Formatting Checks
```bash
# Run ESLint across all workspaces
npm run lint

# Auto-fix linting issues
npm run lint:fix

# Check formatting with Prettier
npm run format:check

# Auto-format all files with Prettier
npm run format
```

---

## 📜 Available Development Scripts

| Command | Action |
| :--- | :--- |
| `npm run dev` | Starts both frontend and backend development servers in watch mode |
| `npm run dev:web` | Starts only the Next.js 15 frontend server |
| `npm run dev:api` | Starts only the Express API server with `tsx` hot reload |
| `npm run build` | Builds all packages and applications for production |
| `npm run test` | Executes Vitest unit/integration test suites across all packages |
| `npm run test:e2e` | Executes Playwright end-to-end browser test suites |
| `npm run lint` | Runs ESLint across all packages and apps |
| `npm run format` | Formats all code files using Prettier |
| `npm run db:generate` | Generates Prisma client types |
| `npm run db:migrate` | Runs database migrations |
| `npm run db:seed` | Runs the database seed script |
| `npm run clean` | Cleans build caches, `.next`, `dist`, and `node_modules` |

---

## 🛡 Engineering Governance & Standards

- **Conventional Commits:** All git commits must adhere to the Conventional Commits format (enforced via Husky & Commitlint):
  - `feat(catalog): add semantic embedding search endpoint`
  - `fix(payment): resolve razorpay webhook hmac verification`
  - `chore(deps): update prisma to v6.4`
- **Zero Raw Environment Access:** All environment variables must be validated through `@ai-sales-assistant/config` schemas.
- **Layered Decoupling:** Controllers must never directly query the database; all database interactions must flow through the Repository layer and Service layer.
- **Financial Precision:** All monetary amounts are handled in integer subunits (Paise) to eliminate floating-point calculation errors.

---
*Autonomous Agentic Commerce Platform — Built for high performance, explainable AI, and frictionless payments.*
