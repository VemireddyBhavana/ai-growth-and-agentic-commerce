# Environment Matrix

This document outlines the expected configuration environment variables across different deployment stages for the AI Sales Assistant platform.

> [!WARNING]
> This matrix uses placeholders. Never store real secrets in documentation, source code, or unencrypted text.

## 1. Development Environment
Used by engineers on their local machines. Fakes most services unless explicitly needed.

| Variable | Purpose | Public/Server | Example Placeholder |
|----------|---------|---------------|---------------------|
| `NODE_ENV` | Mode of the application | Server | `development` |
| `DATABASE_URL` | Local Postgres DB connection | Server | `postgresql://postgres:pass@localhost:5432/ai_sales_assistant` |
| `REDIS_URL` | Local Redis connection | Server | `redis://localhost:6379` |
| `JWT_SECRET` | Auth signing secret | Server | `dev_jwt_secret_super_secure_key_min_32_chars` |
| `OPENAI_API_KEY` | OpenAI API key | Server | `sk-mock-development-key` |
| `OPENAI_MODEL` | AI Model to use | Server | `gpt-4o` |
| `RAZORPAY_MODE` | Payment processing mode | Server | `test` |
| `RAZORPAY_KEY_ID` | Razorpay Key ID | Server | `rzp_test_mock_key_id` |
| `RAZORPAY_KEY_SECRET`| Razorpay Key Secret | Server | `mock_key_secret_for_test_mode` |
| `NEXT_PUBLIC_APP_URL` | Frontend URL | Public | `http://localhost:3000` |
| `NEXT_PUBLIC_API_URL` | Backend API URL | Public | `http://localhost:5000/api/v1` |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | Public Razorpay key | Public | `rzp_test_mock_key_id` |

## 2. Test Environment
Used by automated testing pipelines (CI/CD). Completely isolated and mocked.

| Variable | Purpose | Public/Server | Example Placeholder |
|----------|---------|---------------|---------------------|
| `NODE_ENV` | Mode of the application | Server | `test` |
| `DATABASE_URL` | CI Postgres DB connection | Server | `postgresql://postgres:pass@localhost:5432/ai_sales_test` |
| `JWT_SECRET` | Auth signing secret | Server | `test_jwt_secret_super_secure_key_min_32_chars` |
| `OPENAI_API_KEY` | OpenAI API key | Server | `sk-mock-test-key` |
| `RAZORPAY_MODE` | Payment processing mode | Server | `test` |
| `RAZORPAY_KEY_ID` | Razorpay Key ID | Server | `rzp_test_mock_key_id` |

## 3. Staging Environment
Pre-production environment that mirrors production architecture but uses test accounts for third-party services.

| Variable | Purpose | Public/Server | Example Placeholder |
|----------|---------|---------------|---------------------|
| `NODE_ENV` | Mode of the application | Server | `production` (simulated) |
| `DATABASE_URL` | Staging Postgres DB connection| Server | `postgresql://user:pass@staging-db.internal:5432/db` |
| `JWT_SECRET` | Auth signing secret | Server | `staging_jwt_secret_super_secure_key_min_32_chars` |
| `OPENAI_API_KEY` | OpenAI API key | Server | `sk-real-staging-key` |
| `RAZORPAY_MODE` | Payment processing mode | Server | `test` |
| `RAZORPAY_KEY_ID` | Razorpay Key ID | Server | `rzp_test_real_staging_key` |
| `NEXT_PUBLIC_APP_URL` | Frontend URL | Public | `https://staging.app.com` |
| `NEXT_PUBLIC_API_URL` | Backend API URL | Public | `https://api.staging.app.com/api/v1` |

## 4. Production Environment
Live environment serving real users. Must "fail closed" if configuration is invalid or secrets are missing.

| Variable | Purpose | Public/Server | Example Placeholder |
|----------|---------|---------------|---------------------|
| `NODE_ENV` | Mode of the application | Server | `production` |
| `DATABASE_URL` | Prod Postgres DB connection | Server | `postgresql://user:pass@prod-db.internal:5432/db` |
| `JWT_SECRET` | Auth signing secret | Server | `[REDACTED]` |
| `OPENAI_API_KEY` | OpenAI API key | Server | `[REDACTED]` |
| `RAZORPAY_MODE` | Payment processing mode | Server | `live` |
| `RAZORPAY_KEY_ID` | Razorpay Key ID | Server | `rzp_live_real_prod_key` |
| `RAZORPAY_KEY_SECRET`| Razorpay Key Secret | Server | `[REDACTED]` |
| `RAZORPAY_WEBHOOK_SECRET` | Razorpay Webhook | Server | `[REDACTED]` |
| `NEXT_PUBLIC_APP_URL` | Frontend URL | Public | `https://app.com` |
| `NEXT_PUBLIC_API_URL` | Backend API URL | Public | `https://api.app.com/api/v1` |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | Public Razorpay key | Public | `rzp_live_real_prod_key` |

> [!CAUTION]
> In `production`, default fallbacks for secrets (e.g. `JWT_SECRET`, `OPENAI_API_KEY`) are removed. Missing these variables will cause the service to crash immediately at startup to prevent insecure execution.
