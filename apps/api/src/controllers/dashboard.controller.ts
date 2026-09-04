import type { Request, Response, NextFunction } from 'express';
import { dashboardService } from '../services/dashboard.service.js';
import { BaseController } from './base.controller.js';
import { AppError } from '../utils/app-error.js';

/**
 * Dashboard Controller
 * Handles HTTP requests for dashboard data
 */
export class DashboardController extends BaseController {
  /**
   * Get complete dashboard snapshot
   * GET /api/v1/dashboard
   */
  async getDashboardSnapshot(req: Request, res: Response, next: NextFunction) {
    try {
      const storeId = req.headers['x-store-id'] as string | undefined;

      if (!storeId) {
        throw AppError.badRequest('Store ID is required');
      }

      const data = await dashboardService.getDashboardSnapshot(storeId);

      this.sendSuccess(res, data, 'Dashboard snapshot retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get KPI metrics
   * GET /api/v1/dashboard/kpi
   */
  async getKpiMetrics(req: Request, res: Response, next: NextFunction) {
    try {
      const storeId = req.headers['x-store-id'] as string | undefined;

      if (!storeId) {
        throw AppError.badRequest('Store ID is required');
      }

      const data = await dashboardService.getKpiMetrics(storeId);

      this.sendSuccess(res, data, 'KPI metrics retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get revenue data
   * GET /api/v1/dashboard/revenue
   */
  async getRevenueData(req: Request, res: Response, next: NextFunction) {
    try {
      const storeId = req.headers['x-store-id'] as string | undefined;

      if (!storeId) {
        throw AppError.badRequest('Store ID is required');
      }

      const data = await dashboardService.getRevenueData(storeId);

      this.sendSuccess(res, data, 'Revenue data retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get recent orders
   * GET /api/v1/dashboard/orders
   */
  async getRecentOrders(req: Request, res: Response, next: NextFunction) {
    try {
      const storeId = req.headers['x-store-id'] as string | undefined;

      if (!storeId) {
        throw AppError.badRequest('Store ID is required');
      }

      const data = await dashboardService.getRecentOrders(storeId);

      this.sendSuccess(res, data, 'Recent orders retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get AI performance metrics
   * GET /api/v1/dashboard/ai-metrics
   */
  async getAiMetrics(req: Request, res: Response, next: NextFunction) {
    try {
      const storeId = req.headers['x-store-id'] as string | undefined;

      if (!storeId) {
        throw AppError.badRequest('Store ID is required');
      }

      const data = await dashboardService.getAiMetrics(storeId);

      this.sendSuccess(res, data, 'AI metrics retrieved successfully');
    } catch (error) {
      next(error);
    }
  }
}

export const dashboardController = new DashboardController();
