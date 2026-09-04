import { create } from 'zustand';
import type {
  AnalyticsSnapshot,
  DateRange,
  RevenueDataPoint,
} from '@/types/analytics';

// ── helpers ────────────────────────────────────────
const rnd = (min: number, max: number) =>
  Math.round(Math.random() * (max - min) + min);

const generateRevenue = (days: number): RevenueDataPoint[] =>
  Array.from({ length: days }, (_, i) => {
    const date = new Date(Date.now() - (days - 1 - i) * 86400000);
    const base = 18000 + Math.sin(i / 3) * 5000 + i * 120;
    const revenue = Math.round(base + rnd(-2000, 3000));
    return {
      date: date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
      revenue,
      orders: rnd(80, 180),
      profit: Math.round(revenue * (0.18 + Math.random() * 0.08)),
    };
  });

const snapshot: AnalyticsSnapshot = {
  dateRange: '30d',
  kpis: {
    totalRevenue: 7284560,
    revenueChange: 18.2,
    totalOrders: 4218,
    ordersChange: 24.6,
    conversionRate: 4.82,
    conversionChange: 5.4,
    avgOrderValue: 8934,
    aovChange: 3.1,
    paymentSuccessRate: 97.3,
    paymentSuccessChange: 1.2,
    aiAccuracy: 82.5,
    aiAccuracyChange: 4.8,
    cartAbandonmentRate: 34.2,
    cartAbandonmentChange: -6.1,
    csat: 4.6,
    csatChange: 0.2,
  },
  revenue: generateRevenue(30),
  funnel: [
    { label: 'Visitors',           count: 98450, pct: 100 },
    { label: 'AI Conversations',   count: 73837, pct: 75.0 },
    { label: 'Product Views',      count: 61040, pct: 82.7 },
    { label: 'Add to Cart',        count: 33620, pct: 55.1 },
    { label: 'Checkout Started',   count: 24560, pct: 73.1 },
    { label: 'Payment Completed',  count: 21710, pct: 88.4 },
  ],
  paymentBreakdown: [
    { method: 'UPI',         count: 12220, amount: 3854200, pct: 58, color: '#6366F1' },
    { method: 'Cards',       count: 6100,  amount: 2062380, pct: 29, color: '#8B5CF6' },
    { method: 'Wallets',     count: 2150,  amount: 832640,  pct: 10, color: '#06B6D4' },
    { method: 'Net Banking', count: 630,   amount: 535340,  pct: 3,  color: '#10B981' },
  ],
  paymentStats: {
    successful: 21110,
    failed: 590,
    retrySuccessRate: 74.2,
    refundRate: 2.1,
  },
  topProducts: [
    { rank: 1, name: 'Sony WH-1000XM5 Headphones', category: 'Electronics', revenue: 4200000, units: 1400, recommendations: 8920, conversionRate: 82, trend: 22, trendUp: true,  aiBoosted: true,  stock: 'in_stock'  },
    { rank: 2, name: 'Boat Airdopes 141',           category: 'Electronics', revenue: 1860000, units: 6200, recommendations: 11200, conversionRate: 78, trend: 15, trendUp: true,  aiBoosted: true,  stock: 'low_stock' },
    { rank: 3, name: 'JBL Flip 6 Speaker',          category: 'Electronics', revenue: 1540000, units: 1100, recommendations: 4400, conversionRate: 65, trend: 8,  trendUp: true,  aiBoosted: false, stock: 'in_stock'  },
    { rank: 4, name: 'Ergonomic Desk Chair',        category: 'Furniture',   revenue: 1190000, units: 595,  recommendations: 2100, conversionRate: 58, trend: -4, trendUp: false, aiBoosted: false, stock: 'in_stock'  },
    { rank: 5, name: 'Apple MagSafe Charger',       category: 'Accessories', revenue: 980000,  units: 3267, recommendations: 6700, conversionRate: 71, trend: 12, trendUp: true,  aiBoosted: true,  stock: 'out_of_stock' },
  ],
  customerSegments: [
    { label: 'Power Buyers',     count: 842,  pct: 20, avgOrderValue: 14820, color: '#6366F1' },
    { label: 'Regular Shoppers', count: 2110, pct: 50, avgOrderValue: 7340,  color: '#8B5CF6' },
    { label: 'Occasional',       count: 1054, pct: 25, avgOrderValue: 4120,  color: '#06B6D4' },
    { label: 'First-time',       count: 212,  pct: 5,  avgOrderValue: 2880,  color: '#10B981' },
  ],
  geoData: [
    { city: 'Mumbai',    state: 'Maharashtra', country: 'India', revenue: 2184168, orders: 1265 },
    { city: 'Bengaluru', state: 'Karnataka',   country: 'India', revenue: 1821140, orders: 1053 },
    { city: 'Delhi',     state: 'Delhi',       country: 'India', revenue: 1456912, orders: 843  },
    { city: 'Hyderabad', state: 'Telangana',   country: 'India', revenue: 874147,  orders: 506  },
    { city: 'Chennai',   state: 'Tamil Nadu',  country: 'India', revenue: 656610,  orders: 380  },
    { city: 'Pune',      state: 'Maharashtra', country: 'India', revenue: 582765,  orders: 337  },
    { city: 'Kolkata',   state: 'West Bengal', country: 'India', revenue: 437073,  orders: 253  },
    { city: 'Ahmedabad', state: 'Gujarat',     country: 'India', revenue: 291746,  orders: 169  },
  ],
  aiInsights: [
    {
      id: 'i1',
      icon: 'bundle',
      title: 'Bundle Opportunity Detected',
      detail: 'Customers who buy Boat Earbuds convert 24% better when offered a Charging Case bundle.',
      recommendation: 'Enable automatic bundle upsell for Boat Earbuds.',
      impact: '+₹1.8L / month',
      impactPositive: true,
    },
    {
      id: 'i2',
      icon: 'time',
      title: 'Peak Conversion Window',
      detail: 'Customers searching between 7 PM–10 PM convert 32% better than other times.',
      recommendation: 'Increase AI campaign budget during 7 PM–10 PM slots.',
      impact: '+19% ROAS',
      impactPositive: true,
    },
    {
      id: 'i3',
      icon: 'payment',
      title: 'UPI Dominates Checkout',
      detail: 'UPI has a 97.8% payment success rate — highest of all methods by 4.2%.',
      recommendation: 'Surface UPI as default payment option in checkout.',
      impact: '+2.1% Conversion',
      impactPositive: true,
    },
    {
      id: 'i4',
      icon: 'segment',
      title: 'High-Value Segment Insight',
      detail: 'Customers spending over ₹5,000 have a 32% higher checkout completion rate.',
      recommendation: 'Prioritize AI recommendations for cart values > ₹5,000.',
      impact: '₹4.2L potential / month',
      impactPositive: true,
    },
  ],
  aiPerformance: [
    { label: 'Recommendations Generated', value: 24520, description: 'Total product recommendations served by AI',  color: '#6366F1' },
    { label: 'Accepted Recommendations',  value: 19550, description: 'Customers who clicked or purchased',          color: '#10B981' },
    { label: 'Rejected Recommendations',  value: 4970,  description: 'Recommendations ignored or dismissed',       color: '#EF4444' },
    { label: 'Avg. Confidence Score',     value: 87.4,  suffix: '%', decimals: 1, description: 'Mean confidence across all recommendations', color: '#8B5CF6' },
    { label: 'Avg. Response Time',        value: 1.24,  suffix: 's', decimals: 2, description: 'Time for AI to generate recommendation',     color: '#06B6D4' },
    { label: 'AI Conversion Lift',        value: 34.8,  suffix: '%', decimals: 1, description: 'Revenue lift attributed to AI recommendations', color: '#F59E0B' },
    { label: 'Recommendation Accuracy',   value: 82.5,  suffix: '%', decimals: 1, description: 'Accepted vs total (acceptance rate)',          color: '#EC4899' },
  ],
  returningCustomers: 3204,
  newCustomers: 1014,
};

import { apiClient } from '@/lib/api-client';

// ── Store ─────────────────────────────────────────
interface AnalyticsState {
  snapshot: AnalyticsSnapshot;
  dateRange: DateRange;
  isLoading: boolean;
  fetchAnalytics: (period?: string) => Promise<void>;
  setDateRange: (range: DateRange) => void;
  getRevenueForRange: () => AnalyticsSnapshot['revenue'];
}

export const useAnalyticsStore = create<AnalyticsState>((set, get) => ({
  snapshot,
  dateRange: '30d',
  isLoading: false,

  fetchAnalytics: async (period = '30d') => {
    set({ isLoading: true });
    try {
      const response = await apiClient.get('/analytics/overview', { params: { period } });
      const data = response.data?.data || response.data;
      if (data && data.kpis) {
        set((state) => ({
          isLoading: false,
          snapshot: {
            ...state.snapshot,
            kpis: {
              ...state.snapshot.kpis,
              totalRevenue: data.kpis.totalRevenue ?? state.snapshot.kpis.totalRevenue,
              totalOrders: data.kpis.totalOrders ?? state.snapshot.kpis.totalOrders,
              avgOrderValue: data.kpis.avgOrderValue ?? state.snapshot.kpis.avgOrderValue,
              conversionRate: data.kpis.conversionRate ?? state.snapshot.kpis.conversionRate,
            },
            revenue: Array.isArray(data.revenue) && data.revenue.length > 0 ? data.revenue : state.snapshot.revenue,
          },
        }));
      } else {
        set({ isLoading: false });
      }
    } catch {
      set({ isLoading: false });
    }
  },

  setDateRange: (range) => {
    const days = range === '7d' ? 7 : range === '30d' ? 30 : range === '90d' ? 90 : 365;
    set({
      dateRange: range,
      snapshot: { ...get().snapshot, revenue: generateRevenue(days), dateRange: range },
    });
    get().fetchAnalytics(range);
  },

  getRevenueForRange: () => get().snapshot.revenue,
}));
