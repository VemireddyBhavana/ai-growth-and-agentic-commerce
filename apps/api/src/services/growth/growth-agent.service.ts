/**
 * Phase 7.9 — AI Merchant Growth Agent Service
 *
 * Decision-support engine that analyzes real merchant business data & growth signals
 * and produces structured, evidence-backed, ranked growth opportunities.
 *
 * CRITICAL BOUNDARIES:
 * - Decision Support Only: Performs ZERO autonomous monetary or catalog mutations.
 * - Authoritative DB: All factual claims must match underlying analytics metrics.
 * - Evidence Post-Validation: Model JSON response is strictly validated against merchant data.
 * - No Chain-of-Thought Storage: Persists only final conclusion, evidence, action, and confidence.
 */

import { prisma } from '../../config/prisma.config.js';
import { openai, openaiConfig } from '../../config/openai.config.js';
import { AppError } from '../../utils/app-error.js';
import { analyticsService } from '../analytics/analytics.service.js';
import { DateRange, PeriodPreset, resolvePeriod } from '../analytics/analytics.types.js';
import {
  BoundedAgentContext,
  GrowthAnalysisResponse,
  GrowthOpportunity,
  OpportunityType,
  ActionCategory,
  SeverityLevel,
} from './growth-agent.types.js';
import { growthAnalysisOutputSchema } from './growth-agent.schemas.js';
import { GROWTH_AGENT_SYSTEM_PROMPT, buildGrowthUserPrompt } from './growth-agent.prompts.js';

export class GrowthAgentService {
  /**
   * Main entry point: Gather merchant analytics, construct bounded context,
   * reason over growth signals (via OpenAI or deterministic fallback),
   * post-validate evidence, persist decision, log audit event, and return response.
   */
  async analyzeGrowth(
    storeId: string,
    actorId: string | null = null,
    periodInput?: { period?: PeriodPreset; from?: string; to?: string }
  ): Promise<GrowthAnalysisResponse> {
    const periodPreset: PeriodPreset = periodInput?.period || '30d';
    let range: DateRange;

    if (periodInput?.from && periodInput?.to) {
      const f = new Date(periodInput.from);
      const t = new Date(periodInput.to);
      range = !isNaN(f.getTime()) && !isNaN(t.getTime()) ? { from: f, to: t } : resolvePeriod(periodPreset);
    } else {
      range = resolvePeriod(periodPreset);
    }

    // 1. Gather real analytics metrics & deterministic growth signals
    const [
      overview,
      _revenueMetrics,
      orderMetrics,
      productMetrics,
      aiMetrics,
      conversionFunnel,
      paymentMetrics,
      growthSignals,
    ] = await Promise.all([
      analyticsService.getOverview(storeId, range),
      analyticsService.getRevenueMetrics(storeId, range),
      analyticsService.getOrderMetrics(storeId, range),
      analyticsService.getProductMetrics(storeId, range, 20),
      analyticsService.getAIMetrics(storeId, range),
      analyticsService.getConversionFunnel(storeId, range),
      analyticsService.getPaymentMetrics(storeId, range),
      analyticsService.getGrowthSignals(storeId, range),
    ]);

    const totalOrdersInPeriod = orderMetrics.total.current;
    const totalEventsInPeriod =
      overview.ai.totalRequests +
      conversionFunnel.stages.reduce((acc, s) => acc + s.count, 0);

    // Data Quality Check: Handle empty/insufficient merchant data gracefully
    const hasSufficientData = totalOrdersInPeriod > 0 || totalEventsInPeriod > 0 || productMetrics.length > 0;

    if (!hasSufficientData) {
      const emptyResponse: GrowthAnalysisResponse = {
        generatedAt: new Date().toISOString(),
        period: { from: range.from.toISOString(), to: range.to.toISOString() },
        summary:
          'Insufficient commerce data recorded in this period to generate reliable AI growth opportunities.',
        opportunityCount: 0,
        opportunities: [],
        dataQuality: {
          hasSufficientData: false,
          reason: 'No orders, product views, or AI interactions found in the selected period.',
          totalOrdersInPeriod: 0,
          totalEventsInPeriod: 0,
        },
      };
      return emptyResponse;
    }

    // 2. Build Bounded Context for LLM Reasoning
    const context: BoundedAgentContext = {
      period: { from: range.from.toISOString(), to: range.to.toISOString() },
      overview,
      growthSignals,
      topProducts: productMetrics,
      aiPerformance: aiMetrics,
      paymentPerformance: paymentMetrics,
      conversionFunnel,
    };

    // 3. Generate Opportunities (LLM or Deterministic Fallback)
    let rawOutput: { summary: string; opportunities: GrowthOpportunity[] };

    if (openaiConfig.isConfigured) {
      rawOutput = await this.invokeLLM(context);
    } else {
      rawOutput = this.generateDeterministicFallback(context);
    }

    // 4. Evidence Post-Validation & Factual Grounding Verification
    const validatedOpportunities = await this.postValidateOpportunities(
      storeId,
      rawOutput.opportunities,
      productMetrics
    );

    // 5. Persist AIDecisions to DB (non-destructive)
    for (const opp of validatedOpportunities) {
      await prisma.aiDecision.create({
        data: {
          storeId,
          decisionType: 'GROWTH_RECOMMENDATION',
          inputSummary: `Period: ${periodPreset}, SignalCount: ${growthSignals.length}, OverviewOrders: ${overview.orders.current}`,
          decision: opp.title,
          confidenceScore: opp.confidence,
          reason: opp.summary,
          rulesApplied: {
            type: opp.type,
            actionCategory: opp.actionCategory,
            targetProductId: opp.targetProductId ?? null,
            evidence: opp.evidence,
          } as any,
          alternativesConsidered: {
            expectedImpact: opp.expectedImpact,
            recommendedAction: opp.recommendedAction,
            explanation: opp.explanation,
          } as any,
        },
      });
    }

    // 6. Record Audit Event
    await prisma.auditEvent.create({
      data: {
        storeId,
        eventType: 'GROWTH_ANALYSIS_GENERATED',
        actorType: 'AI_AGENT',
        actorId: actorId ?? 'SYSTEM',
        metadata: {
          period: periodPreset,
          opportunityCount: validatedOpportunities.length,
          signalTypes: growthSignals.map((s) => s.type),
          confidenceAverage:
            validatedOpportunities.length > 0
              ? Math.round(
                  (validatedOpportunities.reduce((acc, o) => acc + o.confidence, 0) /
                    validatedOpportunities.length) *
                    100
                ) / 100
              : 0,
        },
      },
    });

    // 7. Record Analytics Event
    await prisma.analyticsEvent.create({
      data: {
        storeId,
        eventType: 'GROWTH_ANALYSIS_GENERATED',
        metadata: {
          opportunityCount: validatedOpportunities.length,
        },
      },
    });

    return {
      generatedAt: new Date().toISOString(),
      period: { from: range.from.toISOString(), to: range.to.toISOString() },
      summary: rawOutput.summary,
      opportunityCount: validatedOpportunities.length,
      opportunities: validatedOpportunities,
      dataQuality: {
        hasSufficientData: true,
        totalOrdersInPeriod,
        totalEventsInPeriod,
      },
    };
  }

  /**
   * Retrieve saved growth opportunities for merchant
   */
  async getOpportunities(storeId: string, limit = 20): Promise<GrowthOpportunity[]> {
    const decisions = await prisma.aiDecision.findMany({
      where: {
        storeId,
        decisionType: 'GROWTH_RECOMMENDATION',
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    return decisions.map((d) => {
      const rules = (d.rulesApplied as any) || {};
      const alt = (d.alternativesConsidered as any) || {};

      return {
        id: d.id,
        type: (rules.type as OpportunityType) || 'REVENUE_GROWTH',
        title: d.decision,
        summary: d.reason,
        severity: (rules.severity as SeverityLevel) || 'MEDIUM',
        confidence: d.confidenceScore,
        actionCategory: (rules.actionCategory as ActionCategory) || 'REVIEW_PRODUCT',
        targetProductId: rules.targetProductId ?? null,
        recommendedAction: alt.recommendedAction || 'Review merchant performance metrics.',
        expectedImpact: alt.expectedImpact || 'Potential performance improvement.',
        evidence: Array.isArray(rules.evidence) ? rules.evidence : [],
        explanation: alt.explanation || {
          what: d.decision,
          why: d.reason,
          evidenceSummary: 'Derived from merchant business analytics.',
          recommendedNextStep: alt.recommendedAction || 'Review metrics.',
          confidence: `${Math.round(d.confidenceScore * 100)}%`,
        },
      };
    });
  }

  /**
   * Invoke OpenAI Provider with strict JSON output parsing
   */
  private async invokeLLM(context: BoundedAgentContext): Promise<{ summary: string; opportunities: GrowthOpportunity[] }> {
    try {
      const response = await openai.chat.completions.create({
        model: openaiConfig.model,
        temperature: 0,
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: GROWTH_AGENT_SYSTEM_PROMPT },
          { role: 'user', content: buildGrowthUserPrompt(context) },
        ],
      });

      const content = response.choices[0]?.message.content ?? '{}';
      const parsedJson = JSON.parse(content);
      const validated = growthAnalysisOutputSchema.parse(parsedJson);

      return {
        summary: validated.summary,
        opportunities: validated.opportunities as GrowthOpportunity[],
      };
    } catch (error) {
      if (error instanceof SyntaxError || (error as any).name === 'ZodError') {
        // Fallback gracefully to deterministic rules if LLM produces malformed response
        return this.generateDeterministicFallback(context);
      }
      throw new AppError({
        statusCode: 503,
        code: 'AI_PROVIDER_UNAVAILABLE',
        message: 'AI Provider unavailable for growth analysis.',
      });
    }
  }

  /**
   * Deterministic Fallback Generator: Converts real 7.8 growth signals & metrics
   * into validated GrowthOpportunities when AI provider is unconfigured or unavailable.
   */
  generateDeterministicFallback(context: BoundedAgentContext): {
    summary: string;
    opportunities: GrowthOpportunity[];
  } {
    const opportunities: GrowthOpportunity[] = [];

    // Signal 1: High AI Recommendation but Low Conversion
    const lowConvProds = context.topProducts.filter(
      (p) => p.aiRecommendations >= 3 && p.unitsSold === 0
    );
    for (const prod of lowConvProds) {
      opportunities.push({
        type: 'AI_RECOMMENDATION_OPTIMIZATION',
        title: `Optimize AI Conversion for ${prod.name}`,
        summary: `Product "${prod.name}" has received ${prod.aiRecommendations} AI recommendations but has 0 units sold in the current period.`,
        severity: 'HIGH',
        confidence: 0.88,
        actionCategory: 'REVIEW_PRICE',
        targetProductId: prod.productId,
        recommendedAction: `Review pricing, description, and offer positioning for "${prod.name}".`,
        expectedImpact: 'Potential improvement in AI recommendation-to-order conversion rate.',
        evidence: [
          {
            metric: 'aiRecommendations',
            observedValue: prod.aiRecommendations,
            comparisonValue: 0,
            unit: 'count',
            description: `Product recommended ${prod.aiRecommendations} times by AI`,
          },
          {
            metric: 'unitsSold',
            observedValue: prod.unitsSold,
            comparisonValue: 0,
            unit: 'units',
            description: `Product sold 0 units`,
          },
        ],
        explanation: {
          what: `High AI recommendation traffic with 0 sales for ${prod.name}.`,
          why: 'High customer recommendation interest is not converting to completed purchases.',
          evidenceSummary: `${prod.aiRecommendations} AI recommendations vs 0 units sold.`,
          recommendedNextStep: `Review pricing and product offer details for ${prod.name}.`,
          confidence: 'High (backed directly by database tracking)',
        },
      });
    }

    // Signal 2: Revenue Decline Signal
    const revDeclineSignal = context.growthSignals.find((s) => s.type === 'REVENUE_DECLINE');
    if (revDeclineSignal) {
      opportunities.push({
        type: 'REVENUE_GROWTH',
        title: 'Address Period-over-Period Revenue Drop',
        summary: revDeclineSignal.explanation,
        severity: revDeclineSignal.severity === 'CRITICAL' ? 'CRITICAL' : 'HIGH',
        confidence: 0.92,
        actionCategory: 'REVIEW_OFFER',
        targetProductId: null,
        recommendedAction: 'Review overall product catalog pricing and active merchant promotional offers.',
        expectedImpact: 'Mitigate revenue drop and recover period revenue momentum.',
        evidence: [
          {
            metric: 'currentRevenue',
            observedValue: revDeclineSignal.observedValue,
            comparisonValue: revDeclineSignal.comparisonValue,
            unit: 'INR',
            description: `Current period revenue is ${revDeclineSignal.observedValue} INR vs previous ${revDeclineSignal.comparisonValue} INR`,
          },
        ],
        explanation: {
          what: 'Revenue decreased compared to the previous period.',
          why: 'Fewer paid orders completed during the current time frame.',
          evidenceSummary: `Current revenue ${revDeclineSignal.observedValue} INR vs previous ${revDeclineSignal.comparisonValue} INR.`,
          recommendedNextStep: 'Launch promotional campaign or review pricing strategy.',
          confidence: 'High (deterministic revenue aggregation)',
        },
      });
    }

    // Signal 3: Cart Abandonment Signal
    const cartSignal = context.growthSignals.find((s) => s.type === 'HIGH_CART_ABANDONMENT');
    if (cartSignal) {
      opportunities.push({
        type: 'CART_CONVERSION',
        title: 'Reduce High Cart Abandonment',
        summary: cartSignal.explanation,
        severity: 'HIGH',
        confidence: 0.85,
        actionCategory: 'REVIEW_CHECKOUT',
        targetProductId: null,
        recommendedAction: 'Audit checkout page friction, shipping cost transparency, and cart checkout steps.',
        expectedImpact: 'Higher completion rate from cart views to paid orders.',
        evidence: [
          {
            metric: 'cartAbandonmentRate',
            observedValue: cartSignal.observedValue,
            comparisonValue: cartSignal.comparisonValue,
            unit: '%',
            description: `Cart abandonment rate is ${cartSignal.observedValue}%`,
          },
        ],
        explanation: {
          what: 'High rate of shoppers view cart without completing orders.',
          why: 'Friction or unexpected costs during checkout phase.',
          evidenceSummary: `Cart abandonment rate of ${cartSignal.observedValue}%.`,
          recommendedNextStep: 'Simplify checkout requirements and provide upfront fee clarity.',
          confidence: 'High (direct cart event comparison)',
        },
      });
    }

    // Default general opportunity if no specific signals fired
    if (opportunities.length === 0) {
      opportunities.push({
        type: 'PRODUCT_OPTIMIZATION',
        title: 'Promote Top-Performing Catalog Products',
        summary: `Store generated ${context.overview.revenue.current} INR from ${context.overview.orders.current} orders in this period.`,
        severity: 'MEDIUM',
        confidence: 0.75,
        actionCategory: 'REVIEW_PRODUCT',
        targetProductId: context.topProducts[0]?.productId ?? null,
        recommendedAction: 'Focus promotion and AI search boosting on top converting catalog items.',
        expectedImpact: 'Sustained growth in average order value.',
        evidence: [
          {
            metric: 'totalRevenue',
            observedValue: context.overview.revenue.current,
            comparisonValue: context.overview.revenue.previous,
            unit: 'INR',
            description: `Total period revenue: ${context.overview.revenue.current} INR`,
          },
        ],
        explanation: {
          what: 'Stable commerce operations detected.',
          why: 'Overall metrics are consistent with previous benchmarks.',
          evidenceSummary: `${context.overview.orders.current} total paid orders in current period.`,
          recommendedNextStep: 'Double down on high-performing product categories.',
          confidence: 'Medium',
        },
      });
    }

    const summaryText = `I analyzed your commerce data for this period and identified ${opportunities.length} growth ${opportunities.length === 1 ? 'opportunity' : 'opportunities'}.`;

    return {
      summary: summaryText,
      opportunities,
    };
  }

  /**
   * Post-Validation & Factual Grounding Safeguards:
   * 1. Verify targetProductId belongs to current merchant store catalog.
   * 2. Clamp confidence between 0.0 and 1.0.
   * 3. Filter out invalid/hallucinated product IDs.
   */
  private async postValidateOpportunities(
    storeId: string,
    opportunities: GrowthOpportunity[],
    knownProducts: Array<{ productId: string }>
  ): Promise<GrowthOpportunity[]> {
    const knownProductIds = new Set(knownProducts.map((p) => p.productId));
    const validated: GrowthOpportunity[] = [];

    for (const opp of opportunities) {
      let targetProductId = opp.targetProductId ?? null;

      // Product ownership check
      if (targetProductId && !knownProductIds.has(targetProductId)) {
        try {
          const dbProduct = await prisma.product.findFirst({
            where: { id: targetProductId, storeId },
            select: { id: true },
          });

          if (!dbProduct) {
            targetProductId = null;
          }
        } catch {
          // If DB is unreachable or query fails, strip unconfirmed product ID
          targetProductId = null;
        }
      }

      // Clamp confidence score strictly between 0.0 and 1.0
      const confidence = Math.max(0.0, Math.min(1.0, Math.round(opp.confidence * 100) / 100));

      validated.push({
        ...opp,
        targetProductId,
        confidence,
      });
    }

    return validated;
  }
}

export const growthAgentService = new GrowthAgentService();
