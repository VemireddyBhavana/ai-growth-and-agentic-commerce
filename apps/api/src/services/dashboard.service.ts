import { dashboardRepository } from '../repositories/dashboard.repository.js';
import type { DashboardSnapshot } from '@ai-sales-assistant/types';
import { AppError } from '../utils/app-error.js';

const SNAPSHOT_CACHE_TTL_MS = 5000;

class SnapshotCacheEntry {
  public readonly fetchedAt: number;
  public readonly promise: Promise<DashboardSnapshot>;

  constructor(promise: Promise<DashboardSnapshot>) {
    this.fetchedAt = Date.now();
    this.promise = promise;
  }

  get isExpired(): boolean {
    return Date.now() - this.fetchedAt > SNAPSHOT_CACHE_TTL_MS;
  }
}

export class DashboardService {
  private readonly snapshotCache = new Map<string, SnapshotCacheEntry>();

  private async getOrCreateSnapshot(storeId: string): Promise<DashboardSnapshot> {
    const existing = this.snapshotCache.get(storeId);
    if (existing && !existing.isExpired) {
      return existing.promise;
    }

    const fresh = new SnapshotCacheEntry(
      (async () => {
        try {
          return await dashboardRepository.getDashboardSnapshot(storeId);
        } catch (error) {
          this.snapshotCache.delete(storeId);
          throw error;
        }
      })()
    );
    this.snapshotCache.set(storeId, fresh);
    return fresh.promise;
  }

  async getDashboardSnapshot(storeId: string): Promise<DashboardSnapshot> {
    try {
      return await this.getOrCreateSnapshot(storeId);
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError({
        message: 'Failed to fetch dashboard data',
        code: 'DASHBOARD_FETCH_ERROR',
        statusCode: 500,
      });
    }
  }

  async getKpiMetrics(storeId: string) {
    try {
      return (await this.getOrCreateSnapshot(storeId)).kpis;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError({
        message: 'Failed to fetch KPI metrics',
        code: 'KPI_FETCH_ERROR',
        statusCode: 500,
      });
    }
  }

  async getRevenueData(storeId: string) {
    try {
      return (await this.getOrCreateSnapshot(storeId)).revenue;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError({
        message: 'Failed to fetch revenue data',
        code: 'REVENUE_FETCH_ERROR',
        statusCode: 500,
      });
    }
  }

  async getRecentOrders(storeId: string) {
    try {
      return (await this.getOrCreateSnapshot(storeId)).recentOrders;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError({
        message: 'Failed to fetch recent orders',
        code: 'ORDERS_FETCH_ERROR',
        statusCode: 500,
      });
    }
  }

  async getAiMetrics(storeId: string) {
    try {
      return (await this.getOrCreateSnapshot(storeId)).aiMetrics;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError({
        message: 'Failed to fetch AI metrics',
        code: 'AI_METRICS_FETCH_ERROR',
        statusCode: 500,
      });
    }
  }
}

export const dashboardService = new DashboardService();
