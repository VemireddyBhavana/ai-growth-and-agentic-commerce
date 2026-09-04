import pino from 'pino';
import { env } from '../config/env.config.js';

export const logger = pino({
  level: env.LOG_LEVEL,
  transport:
    env.NODE_ENV === 'development'
      ? {
          target: 'pino-pretty',
          options: {
            colorize: true,
            translateTime: 'SYS:standard',
            ignore: 'pid,hostname',
          },
        }
      : undefined,
  redact: {
    paths: [
      'req.headers.authorization',
      'password',
      'creditCard',
      'razorpay_signature',
      'apiKey',
      'secret',
    ],
    censor: '[REDACTED]',
  },
});
