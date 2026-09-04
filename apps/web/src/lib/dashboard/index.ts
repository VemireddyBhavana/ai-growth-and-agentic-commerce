export { dashboardSnapshot } from './mock-data';
export {
  dashboardQueryKeys,
  useDashboardSnapshot,
  useDashboardSlice,
  useKpiMetrics,
  useRevenueData,
  useRecentOrders,
  useAiMetrics,
  useDataSource
} from './hooks';
export {
  getDashboardConfig,
  shouldUseApiData,
  shouldUseMockFallback,
  type DashboardConfig,
  type DataSourceMode
} from './config';
export * from './types';
