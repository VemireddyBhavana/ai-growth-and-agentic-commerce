'use client';

import { useQuery } from '@tanstack/react-query';
import { dashboardSnapshot } from './mock-data';
import type { DashboardSnapshot } from './types';
import { getDashboardConfig, shouldUseApiData, shouldUseMockFallback } from './config';

// Get current configuration
const config = getDashboardConfig();
const API_URL = config.apiUrl;
const STORE_ID = config.storeId;

export const dashboardQueryKeys = {
  all: ['dashboard'] as const,
  snapshot: () => [...dashboardQueryKeys.all, 'snapshot'] as const,
  kpi: () => [...dashboardQueryKeys.all, 'kpi'] as const,
  revenue: () => [...dashboardQueryKeys.all, 'revenue'] as const,
  orders: () => [...dashboardQueryKeys.all, 'orders'] as const,
  aiMetrics: () => [...dashboardQueryKeys.all, 'ai-metrics'] as const,
};

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Smart data fetching based on configuration mode
 *
 * Option A (api): Uses real API data only, throws errors on failure
 * Option B (hybrid): Uses API with mock data fallback (default)
 * Option C (mock): Uses mock data only, no API calls
 */
async function fetchWithFallback<T>(
  endpoint: string,
  mockData: T
): Promise<T> {
  const currentConfig = getDashboardConfig();

  // Option C: Use mock data only
  if (currentConfig.dataSourceMode === 'mock') {
    console.log(`🎭 Using mock data for ${endpoint} (Option C)`);
    await delay(100); // Simulate network delay for realistic UX
    return mockData;
  }

  // Option A & B: Try API first
  if (shouldUseApiData(currentConfig)) {
    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          'x-store-id': STORE_ID,
        },
        cache: 'no-store',
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const result = await response.json();

      if (result.success && result.data) {
        console.log(`✅ Successfully fetched real data from ${endpoint} (Option A/B)`);
        return result.data as T;
      }

      throw new Error('Invalid API response format');
    } catch (error) {
      // Option A: No fallback, throw error
      if (currentConfig.dataSourceMode === 'api') {
        console.error(`❌ API fetch failed for ${endpoint} (Option A - no fallback):`, error);
        throw error;
      }

      // Option B: Fallback to mock data
      if (shouldUseMockFallback(currentConfig)) {
        console.warn(`⚠️ API fetch failed for ${endpoint}, falling back to mock data (Option B):`, error);
        await delay(100);
        return mockData;
      }
    }
  }

  // Default fallback
  return mockData;
}

async function fetchDashboardSnapshot(): Promise<DashboardSnapshot> {
  return fetchWithFallback<DashboardSnapshot>('/dashboard', dashboardSnapshot);
}

async function fetchKpiMetrics() {
  return fetchWithFallback('/dashboard/kpi', dashboardSnapshot.kpis);
}

async function fetchRevenueData() {
  return fetchWithFallback('/dashboard/revenue', dashboardSnapshot.revenue);
}

async function fetchRecentOrders() {
  return fetchWithFallback('/dashboard/orders', dashboardSnapshot.recentOrders);
}

async function fetchAiMetrics() {
  return fetchWithFallback('/dashboard/ai-metrics', dashboardSnapshot.aiMetrics);
}

/**
 * Main dashboard snapshot hook
 * Behavior depends on configuration mode:
 * - Option A: Real API data with errors on failure
 * - Option B: API with automatic mock fallback
 * - Option C: Mock data only
 */
export function useDashboardSnapshot() {
  const currentConfig = getDashboardConfig();

  return useQuery({
    queryKey: dashboardQueryKeys.snapshot(),
    queryFn: fetchDashboardSnapshot,
    staleTime: currentConfig.cacheDuration.snapshot,
    retry: currentConfig.dataSourceMode === 'api' ? 3 : currentConfig.retryConfig.attempts,
    retryDelay: currentConfig.retryConfig.delay,
  });
}

/**
 * Individual slice hooks for optimized data fetching
 * Each respects the configuration mode independently
 */
export function useDashboardSlice<K extends keyof DashboardSnapshot>(key: K) {
  const query = useDashboardSnapshot();
  return {
    ...query,
    data: query.data?.[key],
  };
}

/**
 * Specific hooks for individual dashboard components
 * These allow more granular control and independent loading states
 */
export function useKpiMetrics() {
  const currentConfig = getDashboardConfig();

  return useQuery({
    queryKey: dashboardQueryKeys.kpi(),
    queryFn: fetchKpiMetrics,
    staleTime: currentConfig.cacheDuration.kpi,
    retry: currentConfig.dataSourceMode === 'api' ? 3 : currentConfig.retryConfig.attempts,
    retryDelay: currentConfig.retryConfig.delay,
  });
}

export function useRevenueData() {
  const currentConfig = getDashboardConfig();

  return useQuery({
    queryKey: dashboardQueryKeys.revenue(),
    queryFn: fetchRevenueData,
    staleTime: currentConfig.cacheDuration.revenue,
    retry: currentConfig.dataSourceMode === 'api' ? 3 : currentConfig.retryConfig.attempts,
    retryDelay: currentConfig.retryConfig.delay,
  });
}

export function useRecentOrders() {
  const currentConfig = getDashboardConfig();

  return useQuery({
    queryKey: dashboardQueryKeys.orders(),
    queryFn: fetchRecentOrders,
    staleTime: currentConfig.cacheDuration.orders,
    retry: currentConfig.dataSourceMode === 'api' ? 3 : currentConfig.retryConfig.attempts,
    retryDelay: currentConfig.retryConfig.delay,
  });
}

export function useAiMetrics() {
  const currentConfig = getDashboardConfig();

  return useQuery({
    queryKey: dashboardQueryKeys.aiMetrics(),
    queryFn: fetchAiMetrics,
    staleTime: currentConfig.cacheDuration.aiMetrics,
    retry: currentConfig.dataSourceMode === 'api' ? 3 : currentConfig.retryConfig.attempts,
    retryDelay: currentConfig.retryConfig.delay,
  });
}

/**
 * Data source indicator
 * Returns information about current data source and configuration
 */
export function useDataSource() {
  const { error, isLoading } = useDashboardSnapshot();
  const currentConfig = getDashboardConfig();

  // Determine actual data source based on config and API status
  let actualSource: 'api' | 'mock' | 'error' = 'mock';
  let usingRealData = false;

  if (currentConfig.dataSourceMode === 'mock') {
    actualSource = 'mock';
    usingRealData = false;
  } else if (currentConfig.dataSourceMode === 'api') {
    actualSource = error ? 'error' : 'api';
    usingRealData = !error && !isLoading;
  } else { // hybrid
    actualSource = error ? 'mock' : 'api';
    usingRealData = !error && !isLoading;
  }

  return {
    usingRealData,
    source: actualSource,
    configMode: currentConfig.dataSourceMode,
    apiUrl: currentConfig.apiUrl,
    storeId: currentConfig.storeId,
  };
}
