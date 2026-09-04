import { dashboardRepository } from '../repositories/dashboard.repository.js';
import type { DashboardSnapshot } from '@ai-sales-assistant/types';
import { AppError } from '../utils/app-error.js';

/**
 * Dashboard Service
 * Business logic for dashboard operations
 */
export class DashboardService {
  /**
   * Get complete dashboard snapshot for a store
   */
  async getDashboardSnapshot(storeId: string): Promise<DashboardSnapshot> {
    try {
      return await dashboardRepository.getDashboardSnapshot(storeId);
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError({ message: 'Failed to fetch dashboard data', code: 'DASHBOARD_FETCH_ERROR', statusCode: 500 });
    }
  }

  /**
   * Get KPI metrics for a store
   */
  async getKpiMetrics(storeId: string) {
    try {
      const snapshot = await dashboardRepository.getDashboardSnapshot(storeId);
      return snapshot.kpis;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError({ message: 'Failed to fetch KPI metrics', code: 'KPI_FETCH_ERROR', statusCode: 500 });
    }
  }

  /**
   * Get revenue data for a store
   */
  async getRevenueData(storeId: string) {
    try {
      const snapshot = await dashboardRepository.getDashboardSnapshot(storeId);
      return snapshot.revenue;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError({ message: 'Failed to fetch revenue data', code: 'REVENUE_FETCH_ERROR', statusCode: 500 });
    }
  }

  /**
   * Get recent orders for a store
   */
  async getRecentOrders(storeId: string) {
    try {
      const snapshot = await dashboardRepository.getDashboardSnapshot(storeId);
      return snapshot.recentOrders;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError({ message: 'Failed to fetch recent orders', code: 'ORDERS_FETCH_ERROR', statusCode: 500 });
    }
  }

  /**
   * Get AI performance metrics for a store
   */
  async getAiMetrics(storeId: string) {
    try {
      const snapshot = await dashboardRepository.getDashboardSnapshot(storeId);
      return snapshot.aiMetrics;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError({ message: 'Failed to fetch AI metrics', code: 'AI_METRICS_FETCH_ERROR', statusCode: 500 });
    }
  }
}

export const dashboardService = new DashboardService();