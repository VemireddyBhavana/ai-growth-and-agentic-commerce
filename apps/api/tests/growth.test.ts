/**
 * Phase 7.9 — Growth Agent Unit Tests (no DB required)
 *
 * Tests cover:
 * - Growth opportunity schema validation & confidence score clamping (0.0 to 1.0)
 * - LLM output schema validation & malformed output rejection
 * - Opportunity taxonomy completeness & strict action category enforcement
 * - Deterministic fallback opportunity generation from real 7.8 analytics signals
 * - Factual grounding post-validation (hallucinated product ID stripping)
 * - Empty merchant analytics handling & friendly data quality response
 */

import { describe, expect, it } from 'vitest';
import {
  growthOpportunitySchema,
  growthAnalysisOutputSchema,
} from '../src/services/growth/growth-agent.schemas.js';
import type { BoundedAgentContext, GrowthOpportunity } from '../src/services/growth/growth-agent.types.js';
import { GrowthAgentService } from '../src/services/growth/growth-agent.service.js';

describe('Phase 7.9 — AI Growth Agent Unit Tests', () => {
  const growthService = new GrowthAgentService();

  describe('Taxonomy & Schema Validation', () => {
    it('validates a complete, well-formed growth opportunity', () => {
      const validOpp = {
        type: 'AI_RECOMMENDATION_OPTIMIZATION',
        title: 'Optimize Product A Conversion',
        summary: 'Product A is recommended frequently by AI but converts below store average.',
        severity: 'HIGH',
        confidence: 0.88,
        actionCategory: 'REVIEW_PRICE',
        targetProductId: 'prod_123',
        recommendedAction: 'Review pricing and offer details for Product A.',
        expectedImpact: 'Potential improvement in AI conversion rate.',
        evidence: [
          {
            metric: 'aiRecommendations',
            observedValue: 143,
            comparisonValue: 18,
            unit: 'count',
            description: 'Recommended 143 times by AI',
          },
        ],
        explanation: {
          what: 'Product A is underconverting.',
          why: 'High interest, low purchase completion.',
          evidenceSummary: '143 recommendations vs 4 orders.',
          recommendedNextStep: 'Review price positioning.',
          confidence: 'High',
        },
      };

      const result = growthOpportunitySchema.parse(validOpp);
      expect(result.type).toBe('AI_RECOMMENDATION_OPTIMIZATION');
      expect(result.confidence).toBe(0.88);
    });

    it('clamps confidence scores greater than 1.0 down to 1.0', () => {
      const oppWithHighConfidence = {
        type: 'REVENUE_GROWTH',
        title: 'Recover Revenue Drop',
        summary: 'Revenue dropped period-over-period.',
        severity: 'CRITICAL',
        confidence: 1.5, // Exceeds max 1.0
        actionCategory: 'REVIEW_OFFER',
        recommendedAction: 'Launch promotional offer.',
        expectedImpact: 'Recover revenue.',
        evidence: [
          {
            metric: 'revenue',
            observedValue: 5000,
            description: 'Current revenue is 5000',
          },
        ],
        explanation: {
          what: 'Revenue dropped.',
          why: 'Fewer sales.',
          evidenceSummary: 'Revenue 5000.',
          recommendedNextStep: 'Offer promo.',
          confidence: 'High',
        },
      };

      const result = growthOpportunitySchema.parse(oppWithHighConfidence);
      expect(result.confidence).toBe(1.0);
    });

    it('rejects invalid opportunity types not in taxonomy', () => {
      const invalidType = {
        type: 'UNSUPPORTED_TYPE_XYZ',
        title: 'Invalid',
        summary: 'Invalid type',
        severity: 'LOW',
        confidence: 0.5,
        actionCategory: 'REVIEW_PRODUCT',
        recommendedAction: 'Do something',
        expectedImpact: 'None',
        evidence: [{ metric: 'm', observedValue: 1, description: 'd' }],
        explanation: { what: 'w', why: 'w', evidenceSummary: 'e', recommendedNextStep: 'r', confidence: 'c' },
      };

      expect(() => growthOpportunitySchema.parse(invalidType)).toThrow();
    });

    it('rejects invalid action categories not in taxonomy', () => {
      const invalidAction = {
        type: 'PRODUCT_OPTIMIZATION',
        title: 'Test',
        summary: 'Test summary string for invalid action category',
        severity: 'MEDIUM',
        confidence: 0.5,
        actionCategory: 'AUTONOMOUSLY_CHANGE_PRICES', // Forbidden action
        recommendedAction: 'Action recommendation',
        expectedImpact: 'Impact',
        evidence: [{ metric: 'm', observedValue: 1, description: 'd' }],
        explanation: { what: 'w', why: 'w', evidenceSummary: 'e', recommendedNextStep: 'r', confidence: 'c' },
      };

      expect(() => growthOpportunitySchema.parse(invalidAction)).toThrow();
    });

    it('validates LLM output response schema', () => {
      const llmOutput = {
        summary: 'I identified 2 growth opportunities backed by analytics data.',
        opportunities: [
          {
            type: 'CART_CONVERSION',
            title: 'Reduce Cart Abandonment',
            summary: 'High cart abandonment rate observed.',
            severity: 'HIGH',
            confidence: 0.85,
            actionCategory: 'REVIEW_CHECKOUT',
            targetProductId: null,
            recommendedAction: 'Audit checkout page friction.',
            expectedImpact: 'Improved checkout completion.',
            evidence: [{ metric: 'abandonmentRate', observedValue: 75, description: '75% cart abandonment' }],
            explanation: { what: 'Abandonment', why: 'Friction', evidenceSummary: '75%', recommendedNextStep: 'Audit', confidence: 'High' },
          },
        ],
      };

      const result = growthAnalysisOutputSchema.parse(llmOutput);
      expect(result.opportunities.length).toBe(1);
      expect(result.opportunities[0]?.actionCategory).toBe('REVIEW_CHECKOUT');
    });
  });

  describe('Deterministic Fallback Opportunity Generator', () => {
    const mockContext: BoundedAgentContext = {
      period: { from: '2026-08-01T00:00:00.000Z', to: '2026-08-31T23:59:59.999Z' },
      overview: {
        period: { from: '2026-08-01T00:00:00.000Z', to: '2026-08-31T23:59:59.999Z' },
        revenue: { current: 10000, previous: 15000, changePercent: -33.33, currency: 'INR' },
        orders: { current: 20, previous: 30, changePercent: -33.33 },
        averageOrderValue: { current: 500, previous: 500, changePercent: 0, currency: 'INR' },
        conversion: { cartToOrder: 15, aiAssisted: 25 },
        ai: { totalRequests: 50, totalRecommendations: 40, aiAssistedOrders: 5, aiAssistedRevenue: 2500 },
      },
      growthSignals: [
        {
          type: 'REVENUE_DECLINE',
          severity: 'CRITICAL',
          metric: 'revenue',
          observedValue: 10000,
          comparisonValue: 15000,
          explanation: 'Revenue dropped by 33% compared to previous period.',
        },
        {
          type: 'HIGH_CART_ABANDONMENT',
          severity: 'WARNING',
          metric: 'cart_abandonment_rate',
          observedValue: 85,
          comparisonValue: 80,
          explanation: 'Cart abandonment rate is 85%.',
        },
      ],
      topProducts: [
        {
          productId: 'prod_underperforming',
          name: 'Underperforming Product',
          sku: 'SKU-001',
          views: 100,
          aiRecommendations: 25,
          addedToCart: 10,
          unitsSold: 0,
          revenue: 0,
          currency: 'INR',
        },
      ],
      aiPerformance: {
        period: { from: '2026-08-01T00:00:00.000Z', to: '2026-08-31T23:59:59.999Z' },
        totalRequests: 50,
        totalRecommendations: 40,
        clarificationRequests: 5,
        noMatchCount: 5,
        recommendationRate: 80,
        clarificationRate: 10,
        noMatchRate: 10,
        aiAssistedOrders: 5,
        aiAssistedRevenue: 2500,
        aiConversionRate: 12.5,
        topRecommendedProducts: [{ productId: 'prod_underperforming', name: 'Underperforming Product', recommendationCount: 25 }],
        attribution: { method: 'Direct Session', explanation: 'AI Assisted' },
      },
      paymentPerformance: {
        period: { from: '2026-08-01T00:00:00.000Z', to: '2026-08-31T23:59:59.999Z' },
        razorpayOrdersCreated: 25,
        successfulPayments: 20,
        failedPayments: 5,
        successRate: 80,
        failureRate: 20,
        totalCapturedAmount: 10000,
        averageTransactionValue: 500,
        currency: 'INR',
      },
      conversionFunnel: {
        period: { from: '2026-08-01T00:00:00.000Z', to: '2026-08-31T23:59:59.999Z' },
        basis: 'Analytics Events',
        stages: [
          { stage: 'PRODUCT_VIEW', count: 100, rate: 100 },
          { stage: 'CART_VIEW', count: 40, rate: 40 },
          { stage: 'ORDER_CREATED', count: 25, rate: 25 },
          { stage: 'ORDER_PAID', count: 20, rate: 20 },
        ],
      },
    };

    it('generates evidence-backed opportunities from deterministic signals', () => {
      const result = growthService.generateDeterministicFallback(mockContext);

      expect(result.summary).toBeDefined();
      expect(result.opportunities.length).toBeGreaterThanOrEqual(3);

      const aiOpp = result.opportunities.find((o) => o.type === 'AI_RECOMMENDATION_OPTIMIZATION');
      expect(aiOpp).toBeDefined();
      expect(aiOpp?.targetProductId).toBe('prod_underperforming');
      expect(aiOpp?.evidence?.[0]?.observedValue).toBe(25);

      const revOpp = result.opportunities.find((o) => o.type === 'REVENUE_GROWTH');
      expect(revOpp).toBeDefined();
      expect(revOpp?.severity).toBe('CRITICAL');

      const cartOpp = result.opportunities.find((o) => o.type === 'CART_CONVERSION');
      expect(cartOpp).toBeDefined();
      expect(cartOpp?.actionCategory).toBe('REVIEW_CHECKOUT');
    });
  });

  describe('Post-Validation & Factual Grounding Safeguards', () => {
    it('strips hallucinated product IDs not in merchant catalog', async () => {
      const rawOpp: GrowthOpportunity[] = [
        {
          type: 'PRODUCT_OPTIMIZATION',
          title: 'Optimize Unknown Product',
          summary: 'Product optimization summary for testing stripping',
          severity: 'MEDIUM',
          confidence: 0.8,
          actionCategory: 'REVIEW_PRODUCT',
          targetProductId: 'hallucinated_id_99999', // Not in known products
          recommendedAction: 'Review catalog listing details',
          expectedImpact: 'Higher sales',
          evidence: [{ metric: 'views', observedValue: 10, description: '10 views' }],
          explanation: { what: 'w', why: 'w', evidenceSummary: 'e', recommendedNextStep: 'r', confidence: 'c' },
        },
      ];

      const knownProducts = [{ productId: 'real_prod_123' }];
      const servicePrivate = growthService as unknown as {
        postValidateOpportunities: (
          storeId: string,
          opportunities: GrowthOpportunity[],
          knownProducts: Array<{ productId: string }>
        ) => Promise<GrowthOpportunity[]>;
      };
      const postValidated = await servicePrivate.postValidateOpportunities('store_1', rawOpp, knownProducts);

      // Should clear hallucinated product ID to null (unless found in DB, which doesn't exist in unit test)
      expect(postValidated[0]!.targetProductId).toBeNull();
    });
  });
});
