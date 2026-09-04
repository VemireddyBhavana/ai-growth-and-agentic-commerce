import type { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger.js';

export function requestLogger(req: Request, res: Response, next: NextFunction): void {
  const startTime = Date.now();
  const requestId = (req.headers['x-request-id'] as string) || `req_${Date.now()}`;
  res.setHeader('x-request-id', requestId);

  res.on('finish', () => {
    const executionMs = Date.now() - startTime;
    const { method, originalUrl } = req;
    const { statusCode } = res;

    logger.info(
      {
        requestId,
        method,
        url: originalUrl,
        statusCode,
        executionMs,
      },
      `HTTP ${method} ${originalUrl} ${statusCode} - ${executionMs}ms`
    );
  });

  next();
}
