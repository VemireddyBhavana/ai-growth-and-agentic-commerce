/**
 * Phase 7.8 — Analytics Integration Tests (PostgreSQL opt-in)
 *
 * Run with:
 *   RUN_DB_INTEGRATION_TESTS=true npx vitest run
 *
 * Tests cover:
 * - Merchant isolation (Merchant A cannot see Merchant B metrics)
 * - Executive Overview endpoint (`/api/v1/analytics/overview`)
 * - Revenue metrics endpoint (`/api/v1/analytics/revenue`)
 * - Order metrics endpoint (`/api/v1/analytics/orders`)
 * - Product metrics endpoint (`/api/v1/analytics/products`)
 * - AI metrics endpoint (`/api/v1/analytics/ai`)
 * - Conversion funnel endpoint (`/api/v1/analytics/funnel`)
 * - Payment metrics endpoint (`/api/v1/analytics/payments`)
 * - Growth signals endpoint (`/api/v1/analytics/signals`)
 * - Unauthenticated request rejection (401)
 * - Non-merchant role rejection (403)
 */

import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import { prisma } from '../src/config/prisma.config.js';
import { createApp } from '../src/app.js';

const runDb = process.env.RUN_DB_INTEGRATION_TESTS === 'true';
const suite = runDb ? describe : describe.skip;
const app = createApp();

const createdStoreIds: string[] = [];
let merchantA: { userId: string; storeId: string; token: string };
let merchantB: { userId: string; storeId: string; token: string };
let customerToken: string;

function makeToken(userId: string, merchantId: string, role = 'MERCHANT'): string {
  return jwt.sign(
    { userId, merchantId, email: `${userId}@analytics-test.local`, role },
    process.env.JWT_SECRET || 'super-secret-key-for-jwt-verification-at-least-32-chars',
    { expiresIn: '1h' }
  );
}

suite('Phase 7.8 Analytics API — PostgreSQL integration', () => {
  beforeAll(async () => {
    const suffix = Date.now().toString(36);

    for (const label of ['a', 'b'] as const) {
      const user = await prisma.user.create({
        data: { email: `analytics-${label}-${suffix}@test.local`, role: 'MERCHANT' },
      });
      const store = await prisma.store.create({
        data: {
          name: `Analytics Test ${label}`,
          slug: `analytics-test-${label}-${suffix}`,
          ownerId: user.id,
        },
      });
      createdStoreIds.push(store.id);
      const identity = { userId: user.id, storeId: store.id, token: makeToken(user.id, store.id) };
      if (label === 'a') merchantA = identity;
      else merchantB = identity;
    }

    const customerUser = await prisma.user.create({
      data: { email: `analytics-cust-${suffix}@test.local`, role: 'CUSTOMER' },
    });
    customerToken = makeToken(customerUser.id, merchantA.storeId, 'CUSTOMER');

    // Create seed product for Merchant A
    const product = await prisma.product.create({
      data: {
        storeId: merchantA.storeId,
        name: 'Analytics Test Product',
        slug: `analytics-prod-${suffix}`,
        price: 500,
        currency: 'INR',
        sku: `SKU-${suffix}`,
      },
    });

    // Create seed analytics events for Merchant A
    await prisma.analyticsEvent.createMany({
      data: [
        { storeId: merchantA.storeId, eventType: 'PRODUCT_VIEWED', productId: product.id },
        { storeId: merchantA.storeId, eventType: 'CART_VIEWED' },
        { storeId: merchantA.storeId, eventType: 'AI_SEARCH_STARTED' },
        { storeId: merchantA.storeId, eventType: 'AI_RECOMMENDATION_GENERATED', productId: product.id },
        { storeId: merchantA.storeId, eventType: 'RAZORPAY_ORDER_CREATED' },
        { storeId: merchantA.storeId, eventType: 'PAYMENT_VERIFICATION_SUCCESS' },
      ],
    });

    // Create a confirmed order for Merchant A
    await prisma.order.create({
      data: {
        storeId: merchantA.storeId,
        orderNumber: `ORD-ANALYTICS-${suffix}`,
        status: 'CONFIRMED',
        paymentStatus: 'CAPTURED',
        paymentMethod: 'CARD',
        total: 1000,
        subtotal: 1000,
        currency: 'INR',
        aiAssisted: true,
        items: {
          create: [
            {
              productId: product.id,
              productName: product.name,
              sku: product.sku,
              quantity: 2,
              unitPrice: 500,
              totalPrice: 1000,
            },
          ],
        },
      },
    });
  });

  afterAll(async () => {
    for (const storeId of createdStoreIds) {
      await prisma.analyticsEvent.deleteMany({ where: { storeId } });
      await prisma.orderItem.deleteMany({ where: { order: { storeId } } });
      await prisma.order.deleteMany({ where: { storeId } });
      await prisma.product.deleteMany({ where: { storeId } });
      await prisma.store.deleteMany({ where: { id: storeId } });
    }
  });

  describe('Authentication & Authorization', () => {
    it('rejects unauthenticated GET /analytics/overview with 401', async () => {
      const res = await request(app).get('/api/v1/analytics/overview');
      expect(res.status).toBe(401);
    });

    it('rejects non-merchant role with 403', async () => {
      const res = await request(app)
        .get('/api/v1/analytics/overview')
        .set('Authorization', `Bearer ${customerToken}`);
      expect(res.status).toBe(403);
    });
  });

  describe('GET /api/v1/analytics/overview', () => {
    it('returns executive overview for merchant A', async () => {
      const res = await request(app)
        .get('/api/v1/analytics/overview')
        .set('Authorization', `Bearer ${merchantA.token}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.revenue.current).toBe(1000);
      expect(res.body.data.orders.current).toBe(1);
      expect(res.body.data.ai.aiAssistedOrders).toBe(1);
    });

    it('isolates merchant B (returns zero metrics for B)', async () => {
      const res = await request(app)
        .get('/api/v1/analytics/overview')
        .set('Authorization', `Bearer ${merchantB.token}`);

      expect(res.status).toBe(200);
      expect(res.body.data.revenue.current).toBe(0);
      expect(res.body.data.orders.current).toBe(0);
    });
  });

  describe('GET /api/v1/analytics/revenue', () => {
    it('returns revenue breakdown & daily metrics', async () => {
      const res = await request(app)
        .get('/api/v1/analytics/revenue?period=30d')
        .set('Authorization', `Bearer ${merchantA.token}`);

      expect(res.status).toBe(200);
      expect(res.body.data.total.current).toBe(1000);
      expect(res.body.data.daily.length).toBeGreaterThan(0);
    });
  });

  describe('GET /api/v1/analytics/orders', () => {
    it('returns order status breakdown', async () => {
      const res = await request(app)
        .get('/api/v1/analytics/orders')
        .set('Authorization', `Bearer ${merchantA.token}`);

      expect(res.status).toBe(200);
      expect(res.body.data.paid).toBe(1);
      expect(res.body.data.byStatus.CONFIRMED).toBe(1);
    });
  });

  describe('GET /api/v1/analytics/products', () => {
    it('returns top products with views, recs, units sold & revenue', async () => {
      const res = await request(app)
        .get('/api/v1/analytics/products?limit=5')
        .set('Authorization', `Bearer ${merchantA.token}`);

      expect(res.status).toBe(200);
      expect(res.body.data.length).toBeGreaterThan(0);
      const top = res.body.data[0];
      expect(top.name).toBe('Analytics Test Product');
      expect(top.unitsSold).toBe(2);
      expect(top.revenue).toBe(1000);
    });
  });

  describe('GET /api/v1/analytics/ai', () => {
    it('returns AI engine metrics & top recommended products', async () => {
      const res = await request(app)
        .get('/api/v1/analytics/ai')
        .set('Authorization', `Bearer ${merchantA.token}`);

      expect(res.status).toBe(200);
      expect(res.body.data.aiAssistedOrders).toBe(1);
      expect(res.body.data.aiAssistedRevenue).toBe(1000);
      expect(res.body.data.attribution.method).toBeDefined();
    });
  });

  describe('GET /api/v1/analytics/funnel', () => {
    it('returns conversion funnel stages', async () => {
      const res = await request(app)
        .get('/api/v1/analytics/funnel')
        .set('Authorization', `Bearer ${merchantA.token}`);

      expect(res.status).toBe(200);
      expect(res.body.data.stages.length).toBe(4);
      expect(res.body.data.stages[0].stage).toBe('PRODUCT_VIEW');
    });
  });

  describe('GET /api/v1/analytics/payments', () => {
    it('returns Razorpay payment metrics', async () => {
      const res = await request(app)
        .get('/api/v1/analytics/payments')
        .set('Authorization', `Bearer ${merchantA.token}`);

      expect(res.status).toBe(200);
      expect(res.body.data.razorpayOrdersCreated).toBe(1);
      expect(res.body.data.successfulPayments).toBe(1);
      expect(res.body.data.totalCapturedAmount).toBe(1000);
    });
  });

  describe('GET /api/v1/analytics/signals', () => {
    it('returns deterministic growth signals', async () => {
      const res = await request(app)
        .get('/api/v1/analytics/signals')
        .set('Authorization', `Bearer ${merchantA.token}`);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.data)).toBe(true);
    });
  });
});
