import type { HealthCheckResponse } from '@ai-sales-assistant/types';
import { APP_CONFIG } from '@ai-sales-assistant/config';
import { BaseService } from './base.service.js';
import { checkDatabaseHealth } from '../config/prisma.config.js';
import { openaiConfig } from '../config/openai.config.js';
import { razorpayConfig } from '../config/razorpay.config.js';
import { env } from '../config/env.config.js';

export class HealthService extends BaseService {
  public async getHealthStatus(): Promise<HealthCheckResponse> {
    const dbStatus = await checkDatabaseHealth();

    const isHealthy = dbStatus === 'connected';

    return {
      status: isHealthy ? 'healthy' : 'degraded',
      uptimeSeconds: Math.floor(process.uptime()),
      timestamp: new Date().toISOString(),
      version: APP_CONFIG.VERSION,
      environment: env.NODE_ENV,
      services: {
        database: dbStatus,
        redis: 'unknown',
        openai: openaiConfig.isConfigured ? 'configured' : 'unconfigured',
        razorpay: razorpayConfig.isConfigured ? 'configured' : 'unconfigured',
      },
    };
  }
}

export const healthService = new HealthService();
