# Production Multi-Stage Dockerfile for Express API Server
FROM node:20-alpine AS base
WORKDIR /app
RUN apk add --no-cache libc6-compat

# Stage 1: Install dependencies and build
FROM base AS builder
WORKDIR /app
COPY package*.json turbo.json ./
COPY packages ./packages
COPY apps/api ./apps/api
RUN npm ci
RUN npx turbo run build --filter=@ai-sales-assistant/api

# Stage 2: Production runner
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=5000

# Create non-root user for security
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 expressjs

COPY --from=builder --chown=expressjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=expressjs:nodejs /app/packages ./packages
COPY --from=builder --chown=expressjs:nodejs /app/apps/api ./apps/api

USER expressjs

EXPOSE 5000

WORKDIR /app/apps/api
CMD ["node", "dist/server.js"]
