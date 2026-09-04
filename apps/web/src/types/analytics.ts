// ───────────────────────────────────────────────────
// Analytics Module – Type Definitions
// ───────────────────────────────────────────────────

export type DateRange = '7d' | '30d' | '90d' | '1y';

export type RevenueDataPoint = {
  date: string;
  revenue: number;
  orders: number;
  profit: number;
};

export type FunnelStage = {
  label: string;
  count: number;
  pct: number; // conversion from previous step
};

export type PaymentMethodBreakdown = {
  method: 'UPI' | 'Cards' | 'Wallets' | 'Net Banking';
  count: number;
  amount: number;
  pct: number;
  color: string;
};

export type TopProduct = {
  rank: number;
  name: string;
  category: string;
  revenue: number;
  units: number;
  recommendations: number;
  conversionRate: number;
  trend: number;
  trendUp: boolean;
  aiBoosted: boolean;
  stock: 'in_stock' | 'low_stock' | 'out_of_stock';
};

export type CustomerSegment = {
  label: string;
  count: number;
  pct: number;
  avgOrderValue: number;
  color: string;
};

export type GeoDataPoint = {
  city: string;
  state: string;
  country: string;
  revenue: number;
  orders: number;
};

export type AIInsight = {
  id: string;
  icon: 'bundle' | 'time' | 'payment' | 'segment';
  title: string;
  detail: string;
  recommendation: string;
  impact: string;
  impactPositive: boolean;
};

export type AIPerformanceMetric = {
  label: string;
  value: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
  description: string;
  color: string;
};

export type AnalyticsSnapshot = {
  dateRange: DateRange;
  kpis: {
    totalRevenue: number;
    revenueChange: number;
    totalOrders: number;
    ordersChange: number;
    conversionRate: number;
    conversionChange: number;
    avgOrderValue: number;
    aovChange: number;
    paymentSuccessRate: number;
    paymentSuccessChange: number;
    aiAccuracy: number;
    aiAccuracyChange: number;
    cartAbandonmentRate: number;
    cartAbandonmentChange: number;
    csat: number;
    csatChange: number;
  };
  revenue: RevenueDataPoint[];
  funnel: FunnelStage[];
  paymentBreakdown: PaymentMethodBreakdown[];
  paymentStats: {
    successful: number;
    failed: number;
    retrySuccessRate: number;
    refundRate: number;
  };
  topProducts: TopProduct[];
  customerSegments: CustomerSegment[];
  geoData: GeoDataPoint[];
  aiInsights: AIInsight[];
  aiPerformance: AIPerformanceMetric[];
  returningCustomers: number;
  newCustomers: number;
};
