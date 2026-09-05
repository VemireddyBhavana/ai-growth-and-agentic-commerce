import express, { type Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import { APP_CONFIG } from '@ai-sales-assistant/config';
import { env } from './config/env.config.js';
import { requestLogger } from './middleware/logging.middleware.js';
import { globalRateLimiter } from './middleware/rate-limiter.middleware.js';
import { errorHandler } from './middleware/error.middleware.js';
import { notFoundHandler } from './middleware/not-found.middleware.js';
import { apiRouter } from './routes/index.js';
import { healthRoutes } from './routes/health.routes.js';

export function createApp(): Express {
  const app: Express = express();

  // Security Headers
  app.use(helmet());

  // Cross-Origin Resource Sharing
  app.use(
    cors({
      origin: env.CORS_ORIGIN,
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: [
        'Content-Type',
        'Authorization',
        'x-request-id',
        'x-store-id',
        'x-client-version',
        'x-requested-with',
        'x-api-key',
        'x-currency',
        'Accept',
        'Origin',
      ],
    })
  );

  // Response Compression
  app.use(compression());

  // Razorpay Webhook Raw Body — must come BEFORE express.json()
  // Captures the exact raw bytes for HMAC-SHA256 signature verification.
  // Applied ONLY to the webhook path; all other routes use normal JSON parsing.
  app.use(
    `${APP_CONFIG.API_PREFIX}/payments/webhook`,
    express.raw({ type: 'application/json' }),
    (req: any, _res, next) => {
      // Store raw body for signature verification, then parse as JSON for handlers
      if (Buffer.isBuffer(req.body)) {
        req.rawBody = req.body;
        req.body = JSON.parse(req.body.toString('utf-8'));
      }
      next();
    }
  );

  // Body Parsers
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Telemetry & Logging Middleware
  app.use(requestLogger);

  // Global Rate Limiting
  app.use(globalRateLimiter);

  // Root Healthcheck (useful for cloud ALB/K8s liveness probes)
  app.use('/health', healthRoutes);

  // Versioned API Routes (/api/v1)
  app.use(APP_CONFIG.API_PREFIX, apiRouter);

  // 404 Catch-All Handler
  app.use(notFoundHandler);

  // Centralized Error Handling Middleware
  app.use(errorHandler);

  return app;
}
