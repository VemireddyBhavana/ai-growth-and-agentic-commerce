import rateLimit from 'express-rate-limit';
import { APP_CONFIG } from '@ai-sales-assistant/config';
import { AppError } from '../utils/app-error.js';

export const globalRateLimiter = rateLimit({
  windowMs: APP_CONFIG.RATE_LIMIT.WINDOW_MS,
  max: APP_CONFIG.RATE_LIMIT.MAX_REQUESTS,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req, _res, next) => {
    next(
      new AppError({
        message: 'Too many requests, please slow down.',
        statusCode: 429,
        code: 'RATE_LIMIT_EXCEEDED',
        remediation: 'Wait for the current rate limit window to reset before retrying.',
      })
    );
  },
});
