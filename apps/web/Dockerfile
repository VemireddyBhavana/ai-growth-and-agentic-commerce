# Production Multi-Stage Dockerfile for Next.js 15 Web Application
FROM node:20-alpine AS base
WORKDIR /app
RUN apk add --no-cache libc6-compat

# Stage 1: Install dependencies and build
FROM base AS builder
WORKDIR /app
COPY package*.json turbo.json ./
COPY packages ./packages
COPY apps/web ./apps/web
RUN npm ci
RUN npx turbo run build --filter=@ai-sales-assistant/web

# Stage 2: Production runner
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder --chown=nextjs:nodejs /app/apps/web/public ./apps/web/public
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next ./apps/web/.next
COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nextjs:nodejs /app/packages ./packages
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/package.json ./apps/web/package.json

USER nextjs

EXPOSE 3000

WORKDIR /app/apps/web
ENV NEXT_TELEMETRY_DISABLED=1
CMD ["node_modules/.bin/next", "start", "--port", "3000"]
