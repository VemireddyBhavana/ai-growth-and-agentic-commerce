import type { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import type { ApiErrorResponse } from '@ai-sales-assistant/types';
import { AppError } from '../utils/app-error.js';
import { logger } from '../utils/logger.js';
import { env } from '../config/env.config.js';

export function errorHandler(
  err: Error | AppError | ZodError,
  req: Request,
  res: Response,
  _next: NextFunction
): void {
  const timestamp = new Date().toISOString();
  const requestId = (req.headers['x-request-id'] as string) || `req_${Date.now()}`;

  // Handle Zod Validation Errors
  if (err instanceof ZodError) {
    const errorResponse: ApiErrorResponse = {
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid request payload or query parameters',
        details: err.errors.map((e) => ({
          field: e.path.join('.'),
          issue: e.message,
          code: e.code,
        })),
        remediation: 'Verify payload against the endpoint specification.',
      },
      metadata: {
        timestamp,
        requestId,
      },
    };

    logger.warn({ err: err.errors, requestId, url: req.url }, 'Request validation failed');
    res.status(422).json(errorResponse);
    return;
  }

  // Handle Custom Operational AppError
  if (err instanceof AppError) {
    const errorResponse: ApiErrorResponse = {
      success: false,
      error: {
        code: err.code,
        message: err.message,
        details: err.details,
        remediation: err.remediation,
        stack: env.NODE_ENV === 'development' ? err.stack : undefined,
      },
      metadata: {
        timestamp,
        requestId,
      },
    };

    if (err.statusCode >= 500) {
      logger.error({ err, requestId, url: req.url }, `Operational 5xx Error: ${err.message}`);
    } else {
      logger.warn({ err, requestId, url: req.url }, `Client Error [${err.statusCode}]: ${err.message}`);
    }

    res.status(err.statusCode).json(errorResponse);
    return;
  }

  // Handle Unexpected Internal Errors
  logger.error({ err, requestId, url: req.url }, `Unhandled Exception: ${err.message}`);

  const errorResponse: ApiErrorResponse = {
    success: false,
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: env.NODE_ENV === 'production' ? 'An unexpected internal error occurred' : err.message,
      stack: env.NODE_ENV === 'development' ? err.stack : undefined,
      remediation: 'Please contact engineering support if this issue persists.',
    },
    metadata: {
      timestamp,
      requestId,
    },
  };

  res.status(500).json(errorResponse);
}
