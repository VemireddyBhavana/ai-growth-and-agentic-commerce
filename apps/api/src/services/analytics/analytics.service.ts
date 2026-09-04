/**
 * Phase 7.8 — Analytics Service
 *
 * Provides aggregated analytics metrics for merchant dashboards and Phase 7.9 AI insights.
 * All calculations are deterministic — backed strictly by Prisma database aggregations.
 * Monetary values are derived from authoritative Order/Payment records, NOT client payloads.
 */

import { OrderStatus } from '@prisma/client';
import { prisma } from '../../config/prisma.config.js';
import {
  AnalyticsOverview,
  RevenueMetrics,
  OrderMetrics,
  ProductMetric,
  AIMetrics,
  ConversionFunnel,
  PaymentMetrics,
  GrowthSignal,
  DateRange,
  comparisonPeriod,
  percentChange,
  safeRate,
  PAID_ORDER_STATUSES,
} from './analytics.types.js';

export class AnalyticsService {
  /**
   * Helper to format DateRange into ISO string period
   */
  private formatPeriod(range: DateRange): { from: string; to: string } {
    return {
      from: range.from.toISOString(),
      to: range.to.toISOString(),
    };
  }

  /**
   * 1. Executive Analytics Overview
   */
  async getOverview(storeId: string, currentRange: DateRange): Promise<AnalyticsOverview> {
    const { current, previous } = comparisonPeriod(currentRange);

    // Current period revenue & order count
    const currentAgg = await prisma.order.aggregate({
      where: {
        storeId,
        createdAt: { gte: current.from, lte: current.to },
        status: { in: [...PAID_ORDER_STATUSES] as OrderStatus[] },
      },
      _sum: { total: true },
      _count: { id: true },
    });

    // Previous period revenue & order count
    const previousAgg = await prisma.order.aggregate({
      where: {
        storeId,
        createdAt: { gte: previous.from, lte: previous.to },
        status: { in: [...PAID_ORDER_STATUSES] as OrderStatus[] },
      },
      _sum: { total: true },
      _count: { id: true },
    });

    const currentRevenue = Number(currentAgg._sum.total || 0);
    const previousRevenue = Number(previousAgg._sum.total || 0);
    const currentOrders = currentAgg._count.id;
    const previousOrders = previousAgg._count.id;

    const currentAOV = currentOrders > 0 ? Math.round((currentRevenue / currentOrders) * 100) / 100 : 0;
    const previousAOV = previousOrders > 0 ? Math.round((previousRevenue / previousOrders) * 100) / 100 : 0;

    // Conversion rates
    const cartViews = await prisma.analyticsEvent.count({
      where: { storeId, eventType: 'CART_VIEWED', createdAt: { gte: current.from, lte: current.to } },
    });

    const aiRequestsCount = await prisma.analyticsEvent.count({
      where: {
        storeId,
        eventType: { in: ['AI_SEARCH_STARTED', 'AI_RECOMMENDATION_GENERATED'] },
        createdAt: { gte: current.from, lte: current.to },
      },
    });

    const aiAssistedOrdersAgg = await prisma.order.aggregate({
      where: {
        storeId,
        aiAssisted: true,
        createdAt: { gte: current.from, lte: current.to },
        status: { in: [...PAID_ORDER_STATUSES] as OrderStatus[] },
      },
      _sum: { total: true },
      _count: { id: true },
    });

    const aiRecsCount = await prisma.aiRecommendation.count({
      where: { conversation: { storeId }, createdAt: { gte: current.from, lte: current.to } },
    });

    return {
      period: this.formatPeriod(currentRange),
      revenue: {
        current: currentRevenue,
        previous: previousRevenue,
        changePercent: percentChange(currentRevenue, previousRevenue),
        currency: 'INR',
      },
      orders: {
        current: currentOrders,
        previous: previousOrders,
        changePercent: percentChange(currentOrders, previousOrders),
      },
      averageOrderValue: {
        current: currentAOV,
        previous: previousAOV,
        changePercent: percentChange(currentAOV, previousAOV),
        currency: 'INR',
      },
      conversion: {
        cartToOrder: safeRate(currentOrders, cartViews),
        aiAssisted: safeRate(aiAssistedOrdersAgg._count.id, currentOrders),
      },
      ai: {
        totalRequests: aiRequestsCount,
        totalRecommendations: aiRecsCount,
        aiAssistedOrders: aiAssistedOrdersAgg._count.id,
        aiAssistedRevenue: Number(aiAssistedOrdersAgg._sum.total || 0),
      },
    };
  }

  /**
   * 2. Revenue Breakdown & Daily Trend
   */
  async getRevenueMetrics(storeId: string, currentRange: DateRange): Promise<RevenueMetrics> {
    const { current, previous } = comparisonPeriod(currentRange);

    const currentAgg = await prisma.order.aggregate({
      where: {
        storeId,
        createdAt: { gte: current.from, lte: current.to },
        status: { in: [...PAID_ORDER_STATUSES] as OrderStatus[] },
      },
      _sum: { total: true },
      _count: { id: true },
    });

    const previousAgg = await prisma.order.aggregate({
      where: {
        storeId,
        createdAt: { gte: previous.from, lte: previous.to },
        status: { in: [...PAID_ORDER_STATUSES] as OrderStatus[] },
      },
      _sum: { total: true },
      _count: { id: true },
    });

    const currentRev = Number(currentAgg._sum.total || 0);
    const previousRev = Number(previousAgg._sum.total || 0);
    const currentOrders = currentAgg._count.id;
    const previousOrders = previousAgg._count.id;

    const currentAOV = currentOrders > 0 ? Math.round((currentRev / currentOrders) * 100) / 100 : 0;
    const previousAOV = previousOrders > 0 ? Math.round((previousRev / previousOrders) * 100) / 100 : 0;

    // Daily breakdown for current range
    const orders = await prisma.order.findMany({
      where: {
        storeId,
        createdAt: { gte: current.from, lte: current.to },
        status: { in: [...PAID_ORDER_STATUSES] as OrderStatus[] },
      },
      select: { createdAt: true, total: true },
    });

    const dailyMap = new Map<string, { revenue: number; orders: number }>();

    for (const o of orders) {
      const dayKey = o.createdAt.toISOString().substring(0, 10);
      const existing = dailyMap.get(dayKey) || { revenue: 0, orders: 0 };
      existing.revenue += Number(o.total);
      existing.orders += 1;
      dailyMap.set(dayKey, existing);
    }

    const daily = Array.from(dailyMap.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([date, val]) => ({
        date,
        revenue: Math.round(val.revenue * 100) / 100,
        orders: val.orders,
      }));

    return {
      period: this.formatPeriod(currentRange),
      total: {
        current: currentRev,
        previous: previousRev,
        changePercent: percentChange(currentRev, previousRev),
        currency: 'INR',
      },
      orderCount: {
        current: currentOrders,
        previous: previousOrders,
        changePercent: percentChange(currentOrders, previousOrders),
      },
      averageOrderValue: {
        current: currentAOV,
        previous: previousAOV,
        changePercent: percentChange(currentAOV, previousAOV),
        currency: 'INR',
      },
      daily,
    };
  }

  /**
   * 3. Order Breakdown & Status Metrics
   */
  async getOrderMetrics(storeId: string, currentRange: DateRange): Promise<OrderMetrics> {
    const { current, previous } = comparisonPeriod(currentRange);

    const currentTotal = await prisma.order.count({
      where: { storeId, createdAt: { gte: current.from, lte: current.to } },
    });

    const previousTotal = await prisma.order.count({
      where: { storeId, createdAt: { gte: previous.from, lte: previous.to } },
    });

    const grouped = await prisma.order.groupBy({
      by: ['status'],
      where: { storeId, createdAt: { gte: current.from, lte: current.to } },
      _count: { id: true },
    });

    const byStatus: Record<string, number> = {};
    let paidCount = 0;
    let pendingCount = 0;
    let cancelledCount = 0;

    for (const item of grouped) {
      byStatus[item.status] = item._count.id;
      if ((PAID_ORDER_STATUSES as readonly string[]).includes(item.status)) {
        paidCount += item._count.id;
      } else if (item.status === 'PENDING') {
        pendingCount += item._count.id;
      } else if (item.status === 'CANCELLED') {
        cancelledCount += item._count.id;
      }
    }

    const paidAgg = await prisma.order.aggregate({
      where: {
        storeId,
        createdAt: { gte: current.from, lte: current.to },
        status: { in: [...PAID_ORDER_STATUSES] as OrderStatus[] },
      },
      _sum: { total: true },
    });

    const paidRev = Number(paidAgg._sum.total || 0);
    const aov = paidCount > 0 ? Math.round((paidRev / paidCount) * 100) / 100 : 0;

    // Daily order volume
    const dailyOrders = await prisma.order.findMany({
      where: { storeId, createdAt: { gte: current.from, lte: current.to } },
      select: { createdAt: true },
    });

    const dailyMap = new Map<string, number>();
    for (const o of dailyOrders) {
      const dayKey = o.createdAt.toISOString().substring(0, 10);
      dailyMap.set(dayKey, (dailyMap.get(dayKey) || 0) + 1);
    }

    const daily = Array.from(dailyMap.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([date, orders]) => ({ date, orders }));

    return {
      period: this.formatPeriod(currentRange),
      total: {
        current: currentTotal,
        previous: previousTotal,
        changePercent: percentChange(currentTotal, previousTotal),
      },
      byStatus,
      paid: paidCount,
      pending: pendingCount,
      cancelled: cancelledCount,
      averageOrderValue: aov,
      currency: 'INR',
      daily,
    };
  }

  /**
   * 4. Product Analytics (Views, Recs, Cart Adds, Units Sold, Revenue)
   */
  async getProductMetrics(storeId: string, currentRange: DateRange, limit = 10): Promise<ProductMetric[]> {
    const products = await prisma.product.findMany({
      where: { storeId },
      select: { id: true, name: true, sku: true },
    });

    if (products.length === 0) return [];

    const productMap = new Map<string, ProductMetric>();
    for (const p of products) {
      productMap.set(p.id, {
        productId: p.id,
        name: p.name,
        sku: p.sku,
        views: 0,
        aiRecommendations: 0,
        addedToCart: 0,
        unitsSold: 0,
        revenue: 0,
        currency: 'INR',
      });
    }

    // Views
    const views = await prisma.analyticsEvent.groupBy({
      by: ['productId'],
      where: {
        storeId,
        eventType: 'PRODUCT_VIEWED',
        createdAt: { gte: currentRange.from, lte: currentRange.to },
        productId: { not: null },
      },
      _count: { id: true },
    });
    for (const v of views) {
      if (v.productId && productMap.has(v.productId)) {
        productMap.get(v.productId)!.views = v._count.id;
      }
    }

    // AI Recommendations
    const aiRecs = await prisma.analyticsEvent.groupBy({
      by: ['productId'],
      where: {
        storeId,
        eventType: 'AI_RECOMMENDATION_GENERATED',
        createdAt: { gte: currentRange.from, lte: currentRange.to },
        productId: { not: null },
      },
      _count: { id: true },
    });
    for (const r of aiRecs) {
      if (r.productId && productMap.has(r.productId)) {
        productMap.get(r.productId)!.aiRecommendations = r._count.id;
      }
    }

    // Cart Adds
    const cartAdds = await prisma.analyticsEvent.groupBy({
      by: ['productId'],
      where: {
        storeId,
        eventType: 'PRODUCT_ADDED_TO_CART',
        createdAt: { gte: currentRange.from, lte: currentRange.to },
        productId: { not: null },
      },
      _count: { id: true },
    });
    for (const c of cartAdds) {
      if (c.productId && productMap.has(c.productId)) {
        productMap.get(c.productId)!.addedToCart = c._count.id;
      }
    }

    // Units Sold & Revenue from paid OrderItems
    const orderItems = await prisma.orderItem.findMany({
      where: {
        order: {
          storeId,
          createdAt: { gte: currentRange.from, lte: currentRange.to },
          status: { in: [...PAID_ORDER_STATUSES] as OrderStatus[] },
        },
      },
      select: { productId: true, quantity: true, unitPrice: true },
    });

    for (const item of orderItems) {
      if (productMap.has(item.productId)) {
        const pm = productMap.get(item.productId)!;
        pm.unitsSold += item.quantity;
        pm.revenue += item.quantity * Number(item.unitPrice);
      }
    }

    return Array.from(productMap.values())
      .map(p => ({ ...p, revenue: Math.round(p.revenue * 100) / 100 }))
      .sort((a, b) => b.revenue - a.revenue || b.unitsSold - a.unitsSold)
      .slice(0, limit);
  }

  /**
   * 5. AI Search & Recommendation Performance
   */
  async getAIMetrics(storeId: string, currentRange: DateRange): Promise<AIMetrics> {
    const events = await prisma.analyticsEvent.findMany({
      where: {
        storeId,
        eventType: {
          in: [
            'AI_SEARCH_STARTED',
            'AI_RECOMMENDATION_GENERATED',
            'AI_CLARIFICATION_REQUESTED',
            'AI_NO_MATCH',
          ],
        },
        createdAt: { gte: currentRange.from, lte: currentRange.to },
      },
      select: { eventType: true, productId: true },
    });

    let totalRequests = 0;
    let totalRecommendations = 0;
    let clarificationRequests = 0;
    let noMatchCount = 0;
    const recProductCounts = new Map<string, number>();

    for (const e of events) {
      if (e.eventType === 'AI_SEARCH_STARTED') totalRequests++;
      if (e.eventType === 'AI_RECOMMENDATION_GENERATED') {
        totalRecommendations++;
        if (e.productId) {
          recProductCounts.set(e.productId, (recProductCounts.get(e.productId) || 0) + 1);
        }
      }
      if (e.eventType === 'AI_CLARIFICATION_REQUESTED') clarificationRequests++;
      if (e.eventType === 'AI_NO_MATCH') noMatchCount++;
    }

    if (totalRequests === 0 && totalRecommendations > 0) {
      totalRequests = totalRecommendations + clarificationRequests + noMatchCount;
    }

    // AI Assisted Orders & Revenue
    const aiOrdersAgg = await prisma.order.aggregate({
      where: {
        storeId,
        aiAssisted: true,
        createdAt: { gte: currentRange.from, lte: currentRange.to },
        status: { in: [...PAID_ORDER_STATUSES] as OrderStatus[] },
      },
      _sum: { total: true },
      _count: { id: true },
    });

    const aiOrders = aiOrdersAgg._count.id;
    const aiRevenue = Number(aiOrdersAgg._sum.total || 0);

    // Top recommended products names
    const topRecIds = Array.from(recProductCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    let topRecommendedProducts: AIMetrics['topRecommendedProducts'] = [];
    if (topRecIds.length > 0) {
      const prods = await prisma.product.findMany({
        where: { id: { in: topRecIds.map(t => t[0]) } },
        select: { id: true, name: true },
      });
      const prodNameMap = new Map(prods.map(p => [p.id, p.name]));
      topRecommendedProducts = topRecIds.map(([id, count]) => ({
        productId: id,
        name: prodNameMap.get(id) || 'Unknown Product',
        recommendationCount: count,
      }));
    }

    return {
      period: this.formatPeriod(currentRange),
      totalRequests,
      totalRecommendations,
      clarificationRequests,
      noMatchCount,
      recommendationRate: safeRate(totalRecommendations, totalRequests),
      clarificationRate: safeRate(clarificationRequests, totalRequests),
      noMatchRate: safeRate(noMatchCount, totalRequests),
      aiAssistedOrders: aiOrders,
      aiAssistedRevenue: Math.round(aiRevenue * 100) / 100,
      aiConversionRate: safeRate(aiOrders, totalRecommendations),
      topRecommendedProducts,
      attribution: {
        method: 'Direct AI Session Trace & Order.aiAssisted Flag',
        explanation: 'Orders marked aiAssisted=true were created by buyers who engaged with AI recommendations during their session.',
      },
    };
  }

  /**
   * 6. Conversion Funnel (Search -> Cart -> Order -> Payment)
   */
  async getConversionFunnel(storeId: string, currentRange: DateRange): Promise<ConversionFunnel> {
    const productViews = await prisma.analyticsEvent.count({
      where: { storeId, eventType: 'PRODUCT_VIEWED', createdAt: { gte: currentRange.from, lte: currentRange.to } },
    });

    const cartViews = await prisma.analyticsEvent.count({
      where: { storeId, eventType: 'CART_VIEWED', createdAt: { gte: currentRange.from, lte: currentRange.to } },
    });

    const ordersCreated = await prisma.order.count({
      where: { storeId, createdAt: { gte: currentRange.from, lte: currentRange.to } },
    });

    const ordersPaid = await prisma.order.count({
      where: {
        storeId,
        createdAt: { gte: currentRange.from, lte: currentRange.to },
        status: { in: [...PAID_ORDER_STATUSES] as OrderStatus[] },
      },
    });

    const baseCount = Math.max(productViews, cartViews, ordersCreated, 1);

    return {
      period: this.formatPeriod(currentRange),
      basis: 'Unique Analytics Events and Order Lifecycle',
      stages: [
        { stage: 'PRODUCT_VIEW', count: productViews, rate: 100 },
        { stage: 'CART_VIEW', count: cartViews, rate: safeRate(cartViews, baseCount) },
        { stage: 'ORDER_CREATED', count: ordersCreated, rate: safeRate(ordersCreated, baseCount) },
        { stage: 'ORDER_PAID', count: ordersPaid, rate: safeRate(ordersPaid, baseCount) },
      ],
    };
  }

  /**
   * 7. Payment Analytics (Razorpay orders, payment successes, failures, conversion)
   */
  async getPaymentMetrics(storeId: string, currentRange: DateRange): Promise<PaymentMetrics> {
    const razorpayCreated = await prisma.analyticsEvent.count({
      where: { storeId, eventType: 'RAZORPAY_ORDER_CREATED', createdAt: { gte: currentRange.from, lte: currentRange.to } },
    });

    const paymentSuccesses = await prisma.analyticsEvent.count({
      where: {
        storeId,
        eventType: { in: ['PAYMENT_VERIFICATION_SUCCESS', 'PAYMENT_WEBHOOK_PROCESSED'] },
        createdAt: { gte: currentRange.from, lte: currentRange.to },
      },
    });

    const paymentFailures = await prisma.analyticsEvent.count({
      where: {
        storeId,
        eventType: { in: ['PAYMENT_VERIFICATION_FAILED', 'PAYMENT_FAILED'] },
        createdAt: { gte: currentRange.from, lte: currentRange.to },
      },
    });

    const totalAttempts = paymentSuccesses + paymentFailures;

    const paidAgg = await prisma.order.aggregate({
      where: {
        storeId,
        createdAt: { gte: currentRange.from, lte: currentRange.to },
        status: { in: [...PAID_ORDER_STATUSES] as OrderStatus[] },
      },
      _sum: { total: true },
      _count: { id: true },
    });

    const totalCaptured = Number(paidAgg._sum.total || 0);
    const paidCount = paidAgg._count.id;
    const avgTxn = paidCount > 0 ? Math.round((totalCaptured / paidCount) * 100) / 100 : null;

    return {
      period: this.formatPeriod(currentRange),
      razorpayOrdersCreated: razorpayCreated,
      successfulPayments: paymentSuccesses,
      failedPayments: paymentFailures,
      successRate: safeRate(paymentSuccesses, totalAttempts > 0 ? totalAttempts : razorpayCreated),
      failureRate: safeRate(paymentFailures, totalAttempts > 0 ? totalAttempts : razorpayCreated),
      totalCapturedAmount: Math.round(totalCaptured * 100) / 100,
      averageTransactionValue: avgTxn,
      currency: 'INR',
    };
  }

  /**
   * 8. Deterministic Growth Signals (consumed by Phase 7.9 AI Engine)
   */
  async getGrowthSignals(storeId: string, currentRange: DateRange): Promise<GrowthSignal[]> {
    const signals: GrowthSignal[] = [];
    const { current, previous } = comparisonPeriod(currentRange);

    // Revenue drop check
    const currentRevAgg = await prisma.order.aggregate({
      where: { storeId, createdAt: { gte: current.from, lte: current.to }, status: { in: [...PAID_ORDER_STATUSES] as OrderStatus[] } },
      _sum: { total: true },
    });
    const prevRevAgg = await prisma.order.aggregate({
      where: { storeId, createdAt: { gte: previous.from, lte: previous.to }, status: { in: [...PAID_ORDER_STATUSES] as OrderStatus[] } },
      _sum: { total: true },
    });

    const curRev = Number(currentRevAgg._sum.total || 0);
    const prevRev = Number(prevRevAgg._sum.total || 0);

    if (prevRev > 0 && curRev < prevRev * 0.85) {
      const dropPct = Math.round(((prevRev - curRev) / prevRev) * 100);
      signals.push({
        type: 'REVENUE_DECLINE',
        severity: dropPct > 30 ? 'CRITICAL' : 'WARNING',
        metric: 'revenue',
        observedValue: curRev,
        comparisonValue: prevRev,
        explanation: `Revenue dropped by ${dropPct}% compared to the previous period (${prevRev} INR -> ${curRev} INR).`,
      });
    }

    // High recommendation, low conversion check
    const productMetrics = await this.getProductMetrics(storeId, currentRange, 20);
    for (const p of productMetrics) {
      if (p.aiRecommendations >= 5 && p.unitsSold === 0) {
        signals.push({
          type: 'HIGH_RECOMMENDATION_LOW_CONVERSION',
          severity: 'WARNING',
          metric: 'product_conversion',
          observedValue: p.aiRecommendations,
          comparisonValue: 0,
          explanation: `Product "${p.name}" (${p.productId}) was recommended by AI ${p.aiRecommendations} times but generated 0 sales.`,
        });
      }
    }

    // High cart abandonment
    const cartViews = await prisma.analyticsEvent.count({
      where: { storeId, eventType: 'CART_VIEWED', createdAt: { gte: currentRange.from, lte: currentRange.to } },
    });
    const ordersPaid = await prisma.order.count({
      where: { storeId, createdAt: { gte: currentRange.from, lte: currentRange.to }, status: { in: [...PAID_ORDER_STATUSES] as OrderStatus[] } },
    });

    if (cartViews >= 10 && ordersPaid / cartViews < 0.2) {
      const abandonRate = Math.round((1 - ordersPaid / cartViews) * 100);
      signals.push({
        type: 'HIGH_CART_ABANDONMENT',
        severity: 'WARNING',
        metric: 'cart_abandonment_rate',
        observedValue: abandonRate,
        comparisonValue: 80,
        explanation: `Cart abandonment rate is ${abandonRate}%. ${cartViews} cart views produced only ${ordersPaid} paid orders.`,
      });
    }

    // Payment failure anomaly
    const failures = await prisma.analyticsEvent.count({
      where: { storeId, eventType: { in: ['PAYMENT_VERIFICATION_FAILED', 'PAYMENT_FAILED'] }, createdAt: { gte: currentRange.from, lte: currentRange.to } },
    });
    if (failures > 3) {
      signals.push({
        type: 'PAYMENT_FAILURE_SPIKE',
        severity: 'CRITICAL',
        metric: 'payment_failures',
        observedValue: failures,
        comparisonValue: 0,
        explanation: `Detected ${failures} failed payment attempts in the current period. Verify Razorpay credentials & customer experience.`,
      });
    }

    return signals;
  }
}

export const analyticsService = new AnalyticsService();
