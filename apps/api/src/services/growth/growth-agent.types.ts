/**
 * Phase 7.9 — AI Merchant Growth Agent Types
 *
 * TypeScript type definitions and constants for growth opportunity taxonomy,
 * evidence validation, bounded agent context, and response structures.
 */

import {
  AnalyticsOverview,
  ProductMetric,
  AIMetrics,
  ConversionFunnel,
  PaymentMetrics,
  GrowthSignal,
} from '../analytics/analytics.types.js';

// ─── Taxonomy Constants ──────────────────────────────────────────────────────

export const OPPORTUNITY_TYPES = [
  'REVENUE_GROWTH',
  'CONVERSION_IMPROVEMENT',
  'AI_RECOMMENDATION_OPTIMIZATION',
  'PRODUCT_OPTIMIZATION',
  'INVENTORY_OPPORTUNITY',
  'PAYMENT_CONVERSION',
  'CART_CONVERSION',
  'CATALOG_QUALITY',
  'CUSTOMER_DEMAND',
  'PRICING_OPPORTUNITY',
] as const;

export type OpportunityType = typeof OPPORTUNITY_TYPES[number];

export const ACTION_CATEGORIES = [
  'REVIEW_PRODUCT',
  'REVIEW_PRICE',
  'REVIEW_INVENTORY',
  'REVIEW_DESCRIPTION',
  'REVIEW_CATEGORY',
  'REVIEW_OFFER',
  'REVIEW_AI_RECOMMENDATION',
  'REVIEW_CHECKOUT',
  'REVIEW_PAYMENT_FUNNEL',
] as const;

export type ActionCategory = typeof ACTION_CATEGORIES[number];

export const SEVERITY_LEVELS = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'] as const;
export type SeverityLevel = typeof SEVERITY_LEVELS[number];

// ─── Interfaces ──────────────────────────────────────────────────────────────

export interface EvidenceItem {
  metric: string;
  observedValue: number;
  comparisonValue?: number | null;
  unit?: string;
  description: string;
}

export interface OpportunityExplanation {
  what: string;
  why: string;
  evidenceSummary: string;
  recommendedNextStep: string;
  confidence: string;
}

export interface GrowthOpportunity {
  id?: string;
  type: OpportunityType;
  title: string;
  summary: string;
  severity: SeverityLevel;
  confidence: number; // 0.0 - 1.0
  actionCategory: ActionCategory;
  targetProductId?: string | null;
  recommendedAction: string;
  expectedImpact: string;
  evidence: EvidenceItem[];
  explanation: OpportunityExplanation;
}

export interface BoundedAgentContext {
  period: { from: string; to: string };
  overview: AnalyticsOverview;
  growthSignals: GrowthSignal[];
  topProducts: ProductMetric[];
  aiPerformance: AIMetrics;
  paymentPerformance: PaymentMetrics;
  conversionFunnel: ConversionFunnel;
}

export interface GrowthAnalysisResponse {
  generatedAt: string;
  period: { from: string; to: string };
  summary: string;
  opportunityCount: number;
  opportunities: GrowthOpportunity[];
  dataQuality: {
    hasSufficientData: boolean;
    reason?: string;
    totalOrdersInPeriod: number;
    totalEventsInPeriod: number;
  };
}
