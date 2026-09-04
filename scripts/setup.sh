#!/usr/bin/env bash
set -e

echo "🚀 Setting up AI Sales Assistant Development Workspace..."

# 1. Check Node version
node -v
npm -v

# 2. Copy environment files if not already present
if [ ! -f .env ]; then
  cp .env.example .env
  echo "📄 Created .env from .env.example"
fi

if [ ! -f apps/api/.env ]; then
  cp apps/api/.env.example apps/api/.env
  echo "📄 Created apps/api/.env from .env.example"
fi

if [ ! -f apps/web/.env ]; then
  cp apps/web/.env.example apps/web/.env
  echo "📄 Created apps/web/.env from .env.example"
fi

# 3. Install Monorepo Dependencies
echo "📦 Installing npm dependencies across monorepo..."
npm install

# 4. Generate Prisma Client
echo "🔧 Generating Prisma Client..."
npm run db:generate

echo "✅ Setup complete! Run 'npm run dev' to start development."
