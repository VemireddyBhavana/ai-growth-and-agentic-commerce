/**
 * Phase 7.8 — Analytics Types
 *
 * TypeScript interfaces for merchant analytics metrics.
 * All monetary values use number (converted from Decimal for API responses).
 * All calculations are deterministic — no LLM.
 */

// ─── Date Range ──────────────────────────────────────────────────────────────

export type PeriodPreset = 'today' | '7d' | '30d' | '90d';

export interface DateRange {
  from: Date;
  to: Date;
}

export interface ComparisonPeriod {
  current: DateRange;
  previous: DateRange;
}

// ─── Comparison Metric ───────────────────────────────────────────────────────

export interface ComparisonMetric {
  current: number;
  previous: number;
  /** null when previous = 0 (avoids Infinity/NaN) */
  changePercent: number | null;
}

// ─── Overview ────────────────────────────────────────────────────────────────

export interface AnalyticsOverview {
  period: { from: string; to: string };
  revenue: ComparisonMetric & { currency: string };
  orders: ComparisonMetric;
  averageOrderValue: ComparisonMetric & { currency: string };
  conversion: {
    cartToOrder: number | null;
    aiAssisted: number | null;
  };
  ai: {
    totalRequests: number;
    totalRecommendations: number;
    aiAssistedOrders: number;
    aiAssistedRevenue: number;
  };
}

// ─── Revenue ─────────────────────────────────────────────────────────────────

export interface RevenueMetrics {
  period: { from: string; to: string };
  total: ComparisonMetric & { currency: string };
  orderCount: ComparisonMetric;
  averageOrderValue: ComparisonMetric & { currency: string };
  daily: Array<{ date: string; revenue: number; orders: number }>;
}

// ─── Orders ──────────────────────────────────────────────────────────────────

export interface OrderMetrics {
  period: { from: string; to: string };
  total: ComparisonMetric;
  byStatus: Record<string, number>;
  paid: number;
  pending: number;
  cancelled: number;
  averageOrderValue: number;
  currency: string;
  daily: Array<{ date: string; orders: number }>;
}

// ─── Products ────────────────────────────────────────────────────────────────

export interface ProductMetric {
  productId: string;
  name: string;
  sku: string | null;
  views: number;
  aiRecommendations: number;
  addedToCart: number;
  unitsSold: number;
  revenue: number;
  currency: string;
}

// ─── AI ──────────────────────────────────────────────────────────────────────

export interface AIMetrics {
  period: { from: string; to: string };
  totalRequests: number;
  totalRecommendations: number;
  clarificationRequests: number;
  noMatchCount: number;
  recommendationRate: number | null;
  clarificationRate: number | null;
  noMatchRate: number | null;
  aiAssistedOrders: number;
  aiAssistedRevenue: number;
  aiConversionRate: number | null;
  topRecommendedProducts: Array<{
    productId: string;
    name: string;
    recommendationCount: number;
  }>;
  attribution: {
    method: string;
    explanation: string;
  };
}

// ─── Conversion Funnel ───────────────────────────────────────────────────────

export interface ConversionFunnel {
  period: { from: string; to: string };
  basis: string;
  stages: Array<{
    stage: string;
    count: number;
    rate: number | null;
  }>;
}

// ─── Payment ─────────────────────────────────────────────────────────────────

export interface PaymentMetrics {
  period: { from: string; to: string };
  razorpayOrdersCreated: number;
  successfulPayments: number;
  failedPayments: number;
  successRate: number | null;
  failureRate: number | null;
  totalCapturedAmount: number;
  averageTransactionValue: number | null;
  currency: string;
}

// ─── Growth Signals ──────────────────────────────────────────────────────────

export type SignalSeverity = 'INFO' | 'WARNING' | 'CRITICAL';

export interface GrowthSignal {
  type: string;
  severity: SignalSeverity;
  metric: string;
  observedValue: number;
  comparisonValue: number | null;
  explanation: string;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Calculate percentage change safely. Returns null when previous = 0.
 */
export function percentChange(current: number, previous: number): number | null {
  if (previous === 0) return current > 0 ? null : null;
  return Math.round(((current - previous) / previous) * 10000) / 100;
}

/**
 * Safe division. Returns null when denominator = 0.
 */
export function safeRate(numerator: number, denominator: number): number | null {
  if (denominator === 0) return null;
  return Math.round((numerator / denominator) * 10000) / 100;
}

/**
 * Resolve a period preset to a concrete DateRange.
 */
export function resolvePeriod(preset: PeriodPreset): DateRange {
  const to = new Date();
  to.setHours(23, 59, 59, 999);
  const from = new Date(to);

  switch (preset) {
    case 'today':
      from.setHours(0, 0, 0, 0);
      break;
    case '7d':
      from.setDate(from.getDate() - 6);
      from.setHours(0, 0, 0, 0);
      break;
    case '30d':
      from.setDate(from.getDate() - 29);
      from.setHours(0, 0, 0, 0);
      break;
    case '90d':
      from.setDate(from.getDate() - 89);
      from.setHours(0, 0, 0, 0);
      break;
  }
  return { from, to };
}

/**
 * Calculate a comparison period of equal length immediately before the current period.
 */
export function comparisonPeriod(current: DateRange): ComparisonPeriod {
  const durationMs = current.to.getTime() - current.from.getTime();
  const previousTo = new Date(current.from.getTime() - 1);
  previousTo.setHours(23, 59, 59, 999);
  const previousFrom = new Date(previousTo.getTime() - durationMs);
  previousFrom.setHours(0, 0, 0, 0);
  return { current, previous: { from: previousFrom, to: previousTo } };
}

/** Order statuses that count as "paid" / revenue-generating. */
export const PAID_ORDER_STATUSES = ['CONFIRMED', 'PROCESSING', 'PACKED', 'SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED'] as const;

/** Analytics event types from Phases 7.3–7.6. */
export const ANALYTICS_EVENT_TYPES = [
  'PRODUCT_VIEWED', 'PRODUCT_SEARCHED',
  'AI_SEARCH_STARTED', 'AI_RECOMMENDATION_GENERATED', 'AI_CLARIFICATION_REQUESTED', 'AI_NO_MATCH',
  'CART_VIEWED', 'PRODUCT_ADDED_TO_CART', 'CART_ITEM_UPDATED', 'CART_ITEM_REMOVED',
  'ORDER_CREATED',
  'RAZORPAY_ORDER_CREATED', 'PAYMENT_VERIFICATION_SUCCESS', 'PAYMENT_VERIFICATION_FAILED',
  'PAYMENT_WEBHOOK_PROCESSED', 'PAYMENT_FAILED',
] as const;
