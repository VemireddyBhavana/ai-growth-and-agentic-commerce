/**
 * Dashboard Data Configuration
 * Controls data fetching strategy for the dashboard
 * 
 * Options:
 * - 'api': Use real API data only (Option A)
 * - 'hybrid': Use API with mock fallback (Option B) 
 * - 'mock': Use mock data only (Option C)
 */

export type DataSourceMode = 'api' | 'hybrid' | 'mock';

export interface DashboardConfig {
  /**
   * Data source mode
   * - 'api': Full real data from API
   * - 'hybrid': API with mock fallback (recommended for development)
   * - 'mock': Mock data only (for UI/UX demonstration)
   */
  dataSourceMode: DataSourceMode;
  
  /**
   * API base URL
   */
  apiUrl: string;
  
  /**
   * Store ID for multi-tenant support
   */
  storeId: string;
  
  /**
   * Enable real-time updates via WebSocket
   */
  enableRealtime: boolean;
  
  /**
   * Cache duration in milliseconds
   */
  cacheDuration: {
    snapshot: number;
    kpi: number;
    revenue: number;
    orders: number;
    aiMetrics: number;
  };
  
  /**
   * Retry configuration for API calls
   */
  retryConfig: {
    attempts: number;
    delay: number;
  };
}

/**
 * Default configuration
 * Change dataSourceMode to switch between options A, B, C
 */
export const defaultDashboardConfig: DashboardConfig = {
  // ⚙️ CHANGE THIS VALUE TO SWITCH BETWEEN OPTIONS:
  // 'api' = Option A (Full real data)
  // 'hybrid' = Option B (API with mock fallback) 
  // 'mock' = Option C (Mock data only)
  dataSourceMode: 'hybrid',
  
  apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1',
  storeId: process.env.NEXT_PUBLIC_STORE_ID || 'acme-retail',
  
  enableRealtime: false, // Set to true when WebSocket is implemented
  
  cacheDuration: {
    snapshot: 30_000,    // 30 seconds
    kpi: 30_000,         // 30 seconds
    revenue: 60_000,     // 1 minute
    orders: 15_000,      // 15 seconds
    aiMetrics: 45_000,   // 45 seconds
  },
  
  retryConfig: {
    attempts: 1,
    delay: 500,
  },
};

/**
 * Get current configuration
 * Can be overridden by environment variables
 */
export function getDashboardConfig(): DashboardConfig {
  const mode = (process.env.NEXT_PUBLIC_DATA_SOURCE_MODE as DataSourceMode) || 
               defaultDashboardConfig.dataSourceMode;
  
  return {
    ...defaultDashboardConfig,
    dataSourceMode: mode,
    apiUrl: process.env.NEXT_PUBLIC_API_URL || defaultDashboardConfig.apiUrl,
    storeId: process.env.NEXT_PUBLIC_STORE_ID || defaultDashboardConfig.storeId,
  };
}

/**
 * Validate if API should be used based on configuration
 */
export function shouldUseApiData(config: DashboardConfig): boolean {
  return config.dataSourceMode === 'api' || config.dataSourceMode === 'hybrid';
}

/**
 * Validate if mock fallback should be used
 */
export function shouldUseMockFallback(config: DashboardConfig): boolean {
  return config.dataSourceMode === 'hybrid' || config.dataSourceMode === 'mock';
}