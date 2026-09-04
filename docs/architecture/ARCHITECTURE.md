# System Architecture Reference — AI Sales Assistant

## Overview
The AI Sales Assistant is an enterprise-grade autonomous agentic commerce platform built with a high-performance modular monorepo architecture.

## Monorepo Layout
```
ai-sales-assistant/
├── apps/
│   ├── web/        # Next.js 15 App Router Frontend (React 19, Tailwind, shadcn/ui)
│   └── api/        # Express.js API Server (TypeScript, Prisma, pgvector)
├── packages/
│   ├── ui/         # Shared shadcn/ui React Component Library
│   ├── config/     # Centralized Zod Environment & Constant Definitions
│   ├── types/      # Shared TypeScript DTOs and Interfaces
│   └── utils/      # Shared Cryptographic, Formatting, and Logging Utilities
├── docs/           # System Documentation & Standards
├── scripts/        # Operational Dev and Automation Scripts
└── public/         # Global Static Assets
```

## Technology Stack Summary
- **Frontend:** Next.js 15, React 19, TypeScript, Tailwind CSS, shadcn/ui, Framer Motion, TanStack Query v5, Zustand, React Hook Form, Zod.
- **Backend:** Node.js v20+, Express.js, TypeScript, Prisma ORM, PostgreSQL 16 (pgvector), JWT Auth, OpenAI SDK, Razorpay SDK.
- **DevOps & QA:** Turborepo, Docker Compose, Vitest, Playwright, ESLint, Prettier, Husky.
