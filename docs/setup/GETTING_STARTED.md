# Getting Started with Development

## Prerequisites
- **Node.js**: `v20.0.0` or higher
- **npm**: `v10.0.0` or higher
- **Docker & Docker Compose**: For local PostgreSQL 16 (pgvector) and Redis instances.

## Quick Start Steps

1. **Install All Monorepo Dependencies:**
   ```bash
   npm install
   ```

2. **Setup Local Environment Variables:**
   ```bash
   cp .env.example .env
   cp apps/api/.env.example apps/api/.env
   cp apps/web/.env.example apps/web/.env
   ```

3. **Start Local Infrastructure (Postgres + Redis):**
   ```bash
   docker compose up -d postgres redis
   ```

4. **Initialize Database Client & Seed Foundation:**
   ```bash
   npm run db:generate
   npm run db:migrate
   npm run db:seed
   ```

5. **Start Full Development Environment:**
   ```bash
   npm run dev
   ```
   - Web App: `http://localhost:3000`
   - Express API: `http://localhost:5000`
   - Healthcheck: `http://localhost:5000/health`
