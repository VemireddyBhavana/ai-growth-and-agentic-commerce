/**
 * Phase 7.9 — Growth Agent Integration Tests (PostgreSQL opt-in)
 *
 * Run with:
 *   RUN_DB_INTEGRATION_TESTS=true npx vitest run
 *
 * Tests cover:
 * - Merchant isolation (Merchant A cannot analyze or view Merchant B data)
 * - Growth analysis execution (`POST /api/v1/growth/analyze`)
 * - Decision persistence (`AiDecision` records with decisionType = GROWTH_RECOMMENDATION)
 * - Audit event generation (`AuditEvent` with eventType = GROWTH_ANALYSIS_GENERATED)
 * - Saved opportunities retrieval (`GET /api/v1/growth/opportunities`)
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
    { userId, merchantId, email: `${userId}@growth-test.local`, role },
    process.env.JWT_SECRET || 'super-secret-key-for-jwt-verification-at-least-32-chars',
    { expiresIn: '1h' }
  );
}

suite('Phase 7.9 Growth Agent API — PostgreSQL integration', () => {
  beforeAll(async () => {
    const suffix = Date.now().toString(36);

    for (const label of ['a', 'b'] as const) {
      const user = await prisma.user.create({
        data: { email: `growth-${label}-${suffix}@test.local`, role: 'MERCHANT' },
      });
      const store = await prisma.store.create({
        data: {
          name: `Growth Test ${label}`,
          slug: `growth-test-${label}-${suffix}`,
          ownerId: user.id,
        },
      });
      createdStoreIds.push(store.id);
      const identity = { userId: user.id, storeId: store.id, token: makeToken(user.id, store.id) };
      if (label === 'a') merchantA = identity;
      else merchantB = identity;
    }

    const customerUser = await prisma.user.create({
      data: { email: `growth-cust-${suffix}@test.local`, role: 'CUSTOMER' },
    });
    customerToken = makeToken(customerUser.id, merchantA.storeId, 'CUSTOMER');

    // Create seed product for Merchant A
    const product = await prisma.product.create({
      data: {
        storeId: merchantA.storeId,
        name: 'Growth Test Product A',
        slug: `growth-prod-${suffix}`,
        price: 1500,
        currency: 'INR',
        sku: `SKU-G-${suffix}`,
      },
    });

    // Create seed analytics & order events for Merchant A
    await prisma.analyticsEvent.createMany({
      data: [
        { storeId: merchantA.storeId, eventType: 'PRODUCT_VIEWED', productId: product.id },
        { storeId: merchantA.storeId, eventType: 'CART_VIEWED' },
        { storeId: merchantA.storeId, eventType: 'AI_SEARCH_STARTED' },
        { storeId: merchantA.storeId, eventType: 'AI_RECOMMENDATION_GENERATED', productId: product.id },
        { storeId: merchantA.storeId, eventType: 'AI_RECOMMENDATION_GENERATED', productId: product.id },
        { storeId: merchantA.storeId, eventType: 'AI_RECOMMENDATION_GENERATED', productId: product.id },
      ],
    });

    // Create a confirmed order for Merchant A
    await prisma.order.create({
      data: {
        storeId: merchantA.storeId,
        orderNumber: `ORD-GROWTH-${suffix}`,
        status: 'CONFIRMED',
        paymentStatus: 'CAPTURED',
        paymentMethod: 'CARD',
        total: 1500,
        subtotal: 1500,
        currency: 'INR',
        aiAssisted: true,
        items: {
          create: [
            {
              productId: product.id,
              productName: product.name,
              sku: product.sku,
              quantity: 1,
              unitPrice: 1500,
              totalPrice: 1500,
            },
          ],
        },
      },
    });
  });

  afterAll(async () => {
    for (const storeId of createdStoreIds) {
      await prisma.aiDecision.deleteMany({ where: { storeId } });
      await prisma.auditEvent.deleteMany({ where: { storeId } });
      await prisma.analyticsEvent.deleteMany({ where: { storeId } });
      await prisma.orderItem.deleteMany({ where: { order: { storeId } } });
      await prisma.order.deleteMany({ where: { storeId } });
      await prisma.product.deleteMany({ where: { storeId } });
      await prisma.store.deleteMany({ where: { id: storeId } });
    }
  });

  describe('Authentication & Authorization', () => {
    it('rejects unauthenticated POST /growth/analyze with 401', async () => {
      const res = await request(app).post('/api/v1/growth/analyze').send({ period: '30d' });
      expect(res.status).toBe(401);
    });

    it('rejects non-merchant role with 403', async () => {
      const res = await request(app)
        .post('/api/v1/growth/analyze')
        .set('Authorization', `Bearer ${customerToken}`)
        .send({ period: '30d' });
      expect(res.status).toBe(403);
    });
  });

  describe('POST /api/v1/growth/analyze', () => {
    it('runs growth analysis and returns structured opportunities for Merchant A', async () => {
      const res = await request(app)
        .post('/api/v1/growth/analyze')
        .set('Authorization', `Bearer ${merchantA.token}`)
        .send({ period: '30d' });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.summary).toBeDefined();
      expect(res.body.data.opportunityCount).toBeGreaterThan(0);
      expect(res.body.data.opportunities.length).toBeGreaterThan(0);
      expect(res.body.data.dataQuality.hasSufficientData).toBe(true);

      const topOpp = res.body.data.opportunities[0];
      expect(topOpp.title).toBeDefined();
      expect(topOpp.actionCategory).toBeDefined();
      expect(topOpp.confidence).toBeGreaterThanOrEqual(0);
      expect(topOpp.confidence).toBeLessThanOrEqual(1);

      // Verify Audit Event created
      const audit = await prisma.auditEvent.findFirst({
        where: { storeId: merchantA.storeId, eventType: 'GROWTH_ANALYSIS_GENERATED' },
      });
      expect(audit).toBeDefined();

      // Verify AiDecision created
      const decision = await prisma.aiDecision.findFirst({
        where: { storeId: merchantA.storeId, decisionType: 'GROWTH_RECOMMENDATION' },
      });
      expect(decision).toBeDefined();
    });

    it('handles empty merchant data cleanly for Merchant B', async () => {
      const res = await request(app)
        .post('/api/v1/growth/analyze')
        .set('Authorization', `Bearer ${merchantB.token}`)
        .send({ period: '30d' });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.dataQuality.hasSufficientData).toBe(false);
      expect(res.body.data.opportunityCount).toBe(0);
    });
  });

  describe('GET /api/v1/growth/opportunities', () => {
    it('retrieves previously saved growth opportunities for Merchant A', async () => {
      const res = await request(app)
        .get('/api/v1/growth/opportunities')
        .set('Authorization', `Bearer ${merchantA.token}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.length).toBeGreaterThan(0);
    });

    it('isolates Merchant B (returns 0 saved opportunities for B)', async () => {
      const res = await request(app)
        .get('/api/v1/growth/opportunities')
        .set('Authorization', `Bearer ${merchantB.token}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.length).toBe(0);
    });
  });
});
