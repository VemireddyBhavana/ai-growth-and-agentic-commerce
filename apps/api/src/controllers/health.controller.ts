import type { Request, Response, NextFunction } from 'express';
import { BaseController } from './base.controller.js';
import { healthService } from '../services/health.service.js';

export class HealthController extends BaseController {
  public getHealth = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const healthData = await healthService.getHealthStatus();
      this.sendSuccess(res, healthData, 'AI Sales Assistant API is operational');
    } catch (error) {
      next(error);
    }
  };

  public getPing = async (_req: Request, res: Response): Promise<void> => {
    this.sendSuccess(res, { ping: 'pong' }, 'Pong');
  };
}

export const healthController = new HealthController();
