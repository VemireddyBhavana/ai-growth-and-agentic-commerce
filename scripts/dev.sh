#!/usr/bin/env bash
set -e

echo "🚀 Starting AI Sales Assistant local development environment..."

# Start Postgres & Redis containers
docker compose up -d postgres redis

# Run Turborepo Dev
npm run dev
