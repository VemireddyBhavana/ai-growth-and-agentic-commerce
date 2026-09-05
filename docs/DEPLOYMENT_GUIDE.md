# Deployment Guide — AI Growth & Agentic Commerce

This document covers the complete deployment procedure for the AI Sales Assistant platform.

## Architecture Overview

```
┌─────────────────────┐     ┌─────────────────────┐     ┌─────────────────┐
│   Next.js Frontend  │────▶│   Express API       │────▶│  PostgreSQL 16  │
│   (Vercel / Docker) │     │   (Render / Docker)  │     │  (Supabase /    │
│                     │     │                     │     │   Neon / RDS)   │
│   Port 3000         │     │   Port 5000         │     │   Port 5432     │
└─────────────────────┘     └─────────────────────┘     └─────────────────┘
                                      │
                                      ├──▶ OpenAI API (GPT-4o)
                                      ├──▶ Razorpay (TEST MODE)
                                      └──▶ Supabase Auth
```

## Required Services

| Service         | Purpose                        | Provider Options                     |
|-----------------|--------------------------------|--------------------------------------|
| PostgreSQL 16   | Primary database               | Supabase, Neon, Render, RDS          |
| OpenAI          | AI Shopping Engine & Growth    | OpenAI Platform                      |
| Razorpay        | Payment processing             | Razorpay Dashboard (TEST mode)       |
| Supabase Auth   | User authentication            | Supabase                             |
| Web Hosting     | Next.js frontend               | Vercel, Render, Docker               |
| API Hosting     | Express backend                | Render, Railway, Docker              |

## Environment Variables

### API Server (Server-Only — NEVER expose to browser)

| Variable                   | Required | Description                              |
|----------------------------|----------|------------------------------------------|
| `NODE_ENV`                 | Yes      | `development`, `test`, or `production`   |
| `PORT`                     | No       | Default: `5000`                          |
| `DATABASE_URL`             | Yes      | PostgreSQL connection string             |
| `JWT_SECRET`               | Yes      | Min 32 chars, unique per environment     |
| `JWT_EXPIRES_IN`           | No       | Default: `7d`                            |
| `JWT_REFRESH_SECRET`       | No       | Min 32 chars                             |
| `OPENAI_API_KEY`           | Yes      | OpenAI API key                           |
| `OPENAI_MODEL`             | No       | Default: `gpt-4o`                        |
| `RAZORPAY_MODE`            | Yes      | `test` or `live`                         |
| `RAZORPAY_KEY_ID`          | Yes      | Razorpay Key ID                          |
| `RAZORPAY_KEY_SECRET`      | Yes      | Razorpay Key Secret                      |
| `RAZORPAY_WEBHOOK_SECRET`  | No       | For webhook signature verification       |
| `CORS_ORIGIN`              | Yes      | Deployed frontend URL                    |
| `LOG_LEVEL`                | No       | Default: `info`                          |

### Web Frontend (NEXT_PUBLIC_ — safe for browser)

| Variable                        | Required | Description                        |
|---------------------------------|----------|------------------------------------|
| `NEXT_PUBLIC_APP_URL`           | No       | Frontend URL                       |
| `NEXT_PUBLIC_API_URL`           | Yes      | Deployed API URL                   |
| `NEXT_PUBLIC_SUPABASE_URL`      | Yes      | Supabase project URL               |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes      | Supabase anonymous key             |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID`   | Yes      | Razorpay **public** key ID only    |
| `NEXT_PUBLIC_STORE_ID`          | No       | Store identifier                   |

## Deployment Steps

### 1. Database Setup

```bash
# Deploy migrations to the staging/production database
npx prisma migrate deploy --schema apps/api/prisma/schema.prisma

# Verify migration status
npx prisma migrate status --schema apps/api/prisma/schema.prisma
```

> **WARNING**: Never run `prisma migrate reset` or `prisma db push --force-reset` against staging/production.

### 2. API Deployment (Render / Railway)

1. Connect your GitHub repository.
2. Set **Root Directory** to `apps/api`.
3. Set **Build Command** to `npm ci && npx prisma generate && npm run build`.
4. Set **Start Command** to `node dist/server.js`.
5. Add all server-only environment variables in the platform's secret manager.
6. Set `CORS_ORIGIN` to your deployed frontend URL.

### 3. Web Deployment (Vercel)

1. Connect your GitHub repository.
2. Set **Root Directory** to `apps/web`.
3. Set **Framework** to `Next.js`.
4. Add all `NEXT_PUBLIC_*` environment variables.
5. Set `NEXT_PUBLIC_API_URL` to the deployed API URL (e.g., `https://api.example.com/api/v1`).

### 4. Razorpay Webhook Configuration

1. Go to Razorpay Dashboard → Webhooks.
2. Add webhook URL: `https://<your-api-domain>/api/v1/payments/webhook`.
3. Select events: `payment.captured`, `payment.failed`.
4. Copy the webhook secret.
5. Set `RAZORPAY_WEBHOOK_SECRET` in your API deployment secrets.

> **IMPORTANT**: Keep `RAZORPAY_MODE=test` until explicitly ready for live payments.

### 5. Health Verification

```bash
# After deployment, verify the API is healthy
curl https://<your-api-domain>/health

# Expected response:
# { "status": "healthy", "services": { "database": "connected", ... } }

# Quick ping
curl https://<your-api-domain>/health/ping
```

## Smoke Test Procedure

### Customer Flow
1. Open the deployed web application.
2. Register/Login via Supabase Auth.
3. Navigate to AI Assistant → Ask for product recommendations.
4. Add a product to cart.
5. Proceed to checkout.
6. Complete a Razorpay test payment.
7. Verify order status updates.
8. Check audit trail in `/audit`.

### Merchant Flow
1. Login as merchant.
2. View Dashboard → verify analytics load.
3. Check Growth Agent → verify opportunity analysis.
4. Review action proposals → verify guardrail policies.
5. Approve a safe action → verify execution.
6. Check audit trail for the full decision chain.

### Failure Flow
1. Attempt an invalid payment signature → verify rejection.
2. Attempt cross-merchant data access → verify 403/404.
3. Submit a stale growth action → verify rejection.

## Rollback Procedure

### Application Rollback
- **Vercel/Render**: Redeploy the previous successful deployment from the platform dashboard.
- **Docker**: Roll back to the previous image tag.

### Database Rollback
- Use **corrective forward migrations** (create a new migration that undoes the change).
- For catastrophic failures, use the database provider's point-in-time recovery.
- **Prisma does NOT support automatic migration rollback in production**.

## CI/CD Pipeline

The repository includes a GitHub Actions workflow at `.github/workflows/ci.yml` that runs:
1. Prisma schema validation
2. Prisma client generation
3. Migration deployment against an ephemeral PostgreSQL service
4. TypeScript compilation (API + Web)
5. Linting
6. Integration tests with a real PostgreSQL database
7. Production build
8. Secret scanning
