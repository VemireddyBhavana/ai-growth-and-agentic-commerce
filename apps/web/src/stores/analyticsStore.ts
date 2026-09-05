import { create } from 'zustand';
import { toast } from 'sonner';
import type { AnalyticsSnapshot, DateRange } from '@/types/analytics';
import { apiClient } from '@/lib/api-client';

const STORE_ID =
  (typeof process !== 'undefined' ? (process.env as any)?.NEXT_PUBLIC_STORE_ID : undefined) ||
  'acme-retail';

const createEmptySnapshot = (): AnalyticsSnapshot => ({
  dateRange: '30d',
  kpis: {
    totalRevenue: 0,
    revenueChange: 0,
    totalOrders: 0,
    ordersChange: 0,
    conversionRate: 0,
    conversionChange: 0,
    avgOrderValue: 0,
    aovChange: 0,
    paymentSuccessRate: 0,
    paymentSuccessChange: 0,
    aiAccuracy: 0,
    aiAccuracyChange: 0,
    cartAbandonmentRate: 0,
    cartAbandonmentChange: 0,
    csat: 0,
    csatChange: 0,
  },
  revenue: [],
  funnel: [],
  paymentBreakdown: [],
  paymentStats: { successful: 0, failed: 0, retrySuccessRate: 0, refundRate: 0 },
  topProducts: [],
  customerSegments: [],
  geoData: [],
  aiInsights: [],
  aiPerformance: [],
  returningCustomers: 0,
  newCustomers: 0,
});

function normalizeOverview(raw: any, period: DateRange): AnalyticsSnapshot {
  const k = raw?.kpis || raw?.overview || {};
  return {
    dateRange: period,
    kpis: {
      totalRevenue: Number(k.totalRevenue ?? k.revenue ?? 0),
      revenueChange: Number(k.revenueChange ?? k.revenueDelta ?? 0),
      totalOrders: Number(k.totalOrders ?? k.orders ?? 0),
      ordersChange: Number(k.ordersChange ?? k.ordersDelta ?? 0),
      conversionRate: Number(k.conversionRate ?? k.conversion ?? 0),
      conversionChange: Number(k.conversionChange ?? 0),
      avgOrderValue: Number(k.avgOrderValue ?? k.aov ?? 0),
      aovChange: Number(k.aovChange ?? 0),
      paymentSuccessRate: Number(k.paymentSuccessRate ?? 0),
      paymentSuccessChange: Number(k.paymentSuccessChange ?? 0),
      aiAccuracy: Number(k.aiAccuracy ?? k.aiAccuracy ?? 0),
      aiAccuracyChange: Number(k.aiAccuracyChange ?? 0),
      cartAbandonmentRate: Number(k.cartAbandonmentRate ?? 0),
      cartAbandonmentChange: Number(k.cartAbandonmentChange ?? 0),
      csat: Number(k.csat ?? 0),
      csatChange: Number(k.csatChange ?? 0),
    },
    revenue: Array.isArray(raw?.revenue) ? raw.revenue : Array.isArray(k.revenue) ? k.revenue : [],
    funnel: Array.isArray(raw?.funnel) ? raw.funnel : Array.isArray(k.funnel) ? k.funnel : [],
    paymentBreakdown: Array.isArray(raw?.paymentBreakdown)
      ? raw.paymentBreakdown
      : Array.isArray(k.paymentBreakdown)
        ? k.paymentBreakdown
        : [],
    paymentStats: raw?.paymentStats ||
      k.paymentStats || { successful: 0, failed: 0, retrySuccessRate: 0, refundRate: 0 },
    topProducts: Array.isArray(raw?.topProducts) ? raw.topProducts : [],
    customerSegments: Array.isArray(raw?.customerSegments) ? raw.customerSegments : [],
    geoData: Array.isArray(raw?.geoData) ? raw.geoData : [],
    aiInsights: Array.isArray(raw?.aiInsights) ? raw.aiInsights : [],
    aiPerformance: Array.isArray(raw?.aiPerformance) ? raw.aiPerformance : [],
    returningCustomers: Number(raw?.returningCustomers ?? 0),
    newCustomers: Number(raw?.newCustomers ?? 0),
  };
}

interface AnalyticsState {
  snapshot: AnalyticsSnapshot;
  dateRange: DateRange;
  isLoading: boolean;
  error: string | null;
  fetchAnalytics: (period?: DateRange | string) => Promise<void>;
  setDateRange: (range: DateRange) => void;
  getRevenueForRange: () => AnalyticsSnapshot['revenue'];
}

export const useAnalyticsStore = create<AnalyticsState>((set, get) => ({
  snapshot: createEmptySnapshot(),
  dateRange: '30d',
  isLoading: false,
  error: null,

  fetchAnalytics: async (period) => {
    const resolvedPeriod: DateRange = (period as DateRange) || get().dateRange;
    set({ isLoading: true, error: null });
    try {
      const params: Record<string, string> = { period: resolvedPeriod };
      const response = await apiClient.get('/analytics/overview', {
        params,
        headers: { 'x-store-id': STORE_ID },
      });
      const payload = response?.data?.data ?? response?.data ?? null;
      if (!payload) throw new Error('Empty analytics response');
      set({ isLoading: false, snapshot: normalizeOverview(payload, resolvedPeriod), error: null });
    } catch (err: any) {
      const msg =
        err?.response?.data?.error?.message || err?.message || 'Could not load analytics data';
      set({ isLoading: false, error: msg });
      if (typeof window !== 'undefined') toast.warning(msg + ' — showing available data');
    }
  },

  setDateRange: (range) => {
    set({ dateRange: range });
    get().fetchAnalytics(range);
  },

  getRevenueForRange: () => get().snapshot.revenue,
}));
