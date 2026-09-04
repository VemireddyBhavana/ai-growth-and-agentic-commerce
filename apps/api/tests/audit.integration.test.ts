/**
 * Phase 7.7 — Audit Integration Tests (PostgreSQL opt-in)
 *
 * Run with:
 *   RUN_DB_INTEGRATION_TESTS=true npx vitest run
 *
 * Tests cover:
 * 1. Merchant A cannot read Merchant B audit events
 * 2. Unauthenticated audit requests are rejected
 * 3. Client cannot override merchant scope
 * 4. Audit events cannot be modified (PUT/PATCH/DELETE → 404)
 * 5. Secrets are redacted in responses
 * 6. Event query with filters
 * 7. Timeline ordering
 * 8. Event detail retrieval
 * 9. Arbitrary query/sort fields rejected
 * 10. Event taxonomy endpoint
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
let auditEventIdA = '';
let auditEventIdB = '';

function token(userId: string, merchantId: string): string {
  return jwt.sign(
    { userId, merchantId, email: `${userId}@audit-test.local`, role: 'MERCHANT' },
    process.env.JWT_SECRET!,
    { expiresIn: '1h' }
  );
}

suite('Phase 7.7 audit API — PostgreSQL integration', () => {
  beforeAll(async () => {
    const suffix = Date.now().toString(36);

    // Create two merchants with separate stores
    for (const label of ['a', 'b'] as const) {
      const user = await prisma.user.create({
        data: { email: `audit-${label}-${suffix}@audit-test.local`, role: 'MERCHANT' },
      });
      const store = await prisma.store.create({
        data: {
          name: `Audit Test ${label}`,
          slug: `audit-test-${label}-${suffix}`,
          ownerId: user.id,
        },
      });
      createdStoreIds.push(store.id);
      const identity = { userId: user.id, storeId: store.id, token: token(user.id, store.id) };
      if (label === 'a') merchantA = identity;
      else merchantB = identity;
    }

    // Create audit events for each merchant
    const eventA = await prisma.auditEvent.create({
      data: {
        storeId: merchantA.storeId,
        eventType: 'ORDER_CREATED',
        actorType: 'USER',
        actorId: merchantA.userId,
        metadata: {
          orderNumber: 'ORD-A-001',
          total: '4999.00',
          cartId: 'cart_test_a',
          explanation: 'Order created for testing merchant A.',
        },
      },
    });
    auditEventIdA = eventA.id;

    const eventB = await prisma.auditEvent.create({
      data: {
        storeId: merchantB.storeId,
        eventType: 'PAYMENT_VERIFIED',
        actorType: 'SYSTEM',
        metadata: {
          amount: '2999.00',
          razorpayOrderId: 'order_b_test',
          explanation: 'Payment verified for merchant B testing.',
          key_secret: 'SHOULD_NEVER_APPEAR',
        },
      },
    });
    auditEventIdB = eventB.id;

    // Create additional events for merchant A for timeline testing
    await prisma.auditEvent.create({
      data: {
        storeId: merchantA.storeId,
        eventType: 'PAYMENT_ORDER_CREATED',
        actorType: 'USER',
        actorId: merchantA.userId,
        orderId: 'clxyz0000000000000000000001',
        metadata: { explanation: 'Payment order created.' },
      },
    });

    await prisma.auditEvent.create({
      data: {
        storeId: merchantA.storeId,
        eventType: 'PAYMENT_VERIFIED',
        actorType: 'SYSTEM',
        orderId: 'clxyz0000000000000000000001',
        metadata: { explanation: 'Payment verified.' },
      },
    });
  });

  afterAll(async () => {
    // Clean up
    await prisma.auditEvent.deleteMany({ where: { storeId: { in: createdStoreIds } } });
    await prisma.store.deleteMany({ where: { id: { in: createdStoreIds } } });
    await prisma.user.deleteMany({ where: { email: { contains: '@audit-test.local' } } });
    await prisma.$disconnect();
  });

  // ── 1. Merchant Isolation ───────────────────────────────────────────────

  it('merchant A cannot read merchant B audit events', async () => {
    const authA = { Authorization: `Bearer ${merchantA.token}` };
    const res = await request(app)
      .get(`/api/v1/audit/events/${auditEventIdB}`)
      .set(authA);
    expect(res.status).toBe(404);
  });

  it('merchant B cannot read merchant A audit events', async () => {
    const authB = { Authorization: `Bearer ${merchantB.token}` };
    const res = await request(app)
      .get(`/api/v1/audit/events/${auditEventIdA}`)
      .set(authB);
    expect(res.status).toBe(404);
  });

  it('merchant A list only shows own events', async () => {
    const authA = { Authorization: `Bearer ${merchantA.token}` };
    const res = await request(app)
      .get('/api/v1/audit/events')
      .set(authA)
      .expect(200);

    for (const item of res.body.data.items) {
      // All returned events belong to merchant A's store
      // The response doesn't include storeId in list view, but should never show B's events
      expect(item.id).not.toBe(auditEventIdB);
    }
  });

  // ── 2. Authentication ───────────────────────────────────────────────────

  it('rejects unauthenticated list request', async () => {
    await request(app)
      .get('/api/v1/audit/events')
      .expect(401);
  });

  it('rejects unauthenticated detail request', async () => {
    await request(app)
      .get(`/api/v1/audit/events/${auditEventIdA}`)
      .expect(401);
  });

  it('rejects unauthenticated timeline request', async () => {
    await request(app)
      .get('/api/v1/audit/timeline/order/clxyz0000000000000000000001')
      .expect(401);
  });

  // ── 3. Client Cannot Override Scope ─────────────────────────────────────

  it('cannot override storeId via query parameter', async () => {
    const authA = { Authorization: `Bearer ${merchantA.token}` };
    const res = await request(app)
      .get('/api/v1/audit/events')
      .query({ storeId: merchantB.storeId })
      .set(authA)
      .expect(200);

    // Should still only return merchant A's events
    for (const item of res.body.data.items) {
      expect(item.id).not.toBe(auditEventIdB);
    }
  });

  // ── 4. Audit Immutability ───────────────────────────────────────────────

  it('PUT on audit event returns 404', async () => {
    const authA = { Authorization: `Bearer ${merchantA.token}` };
    await request(app)
      .put(`/api/v1/audit/events/${auditEventIdA}`)
      .set(authA)
      .send({ eventType: 'HACKED' })
      .expect(404);
  });

  it('PATCH on audit event returns 404', async () => {
    const authA = { Authorization: `Bearer ${merchantA.token}` };
    await request(app)
      .patch(`/api/v1/audit/events/${auditEventIdA}`)
      .set(authA)
      .send({ eventType: 'HACKED' })
      .expect(404);
  });

  it('DELETE on audit event returns 404', async () => {
    const authA = { Authorization: `Bearer ${merchantA.token}` };
    await request(app)
      .delete(`/api/v1/audit/events/${auditEventIdA}`)
      .set(authA)
      .expect(404);
  });

  // ── 5. Secrets Redacted in Responses ────────────────────────────────────

  it('redacts sensitive fields in event detail', async () => {
    const authB = { Authorization: `Bearer ${merchantB.token}` };
    const res = await request(app)
      .get(`/api/v1/audit/events/${auditEventIdB}`)
      .set(authB)
      .expect(200);

    const meta = res.body.data.metadata;
    if (meta && meta.key_secret) {
      expect(meta.key_secret).toBe('[REDACTED]');
    }
    // Verify the safe fields are still present
    expect(res.body.data.explanation).toBeTruthy();
  });

  // ── 6. Event Query with Filters ─────────────────────────────────────────

  it('filters by eventType', async () => {
    const authA = { Authorization: `Bearer ${merchantA.token}` };
    const res = await request(app)
      .get('/api/v1/audit/events')
      .query({ eventType: 'ORDER_CREATED' })
      .set(authA)
      .expect(200);

    for (const item of res.body.data.items) {
      expect(item.eventType).toBe('ORDER_CREATED');
    }
  });

  it('paginates correctly', async () => {
    const authA = { Authorization: `Bearer ${merchantA.token}` };
    const res = await request(app)
      .get('/api/v1/audit/events')
      .query({ page: 1, limit: 1 })
      .set(authA)
      .expect(200);

    expect(res.body.data.items.length).toBeLessThanOrEqual(1);
    expect(res.body.data.pagination.page).toBe(1);
    expect(res.body.data.pagination.limit).toBe(1);
  });

  // ── 7. Timeline Ordering ───────────────────────────────────────────────

  it('returns order timeline in chronological order', async () => {
    const authA = { Authorization: `Bearer ${merchantA.token}` };
    const res = await request(app)
      .get('/api/v1/audit/timeline/order/clxyz0000000000000000000001')
      .set(authA)
      .expect(200);

    const timeline = res.body.data.timeline;
    for (let i = 1; i < timeline.length; i++) {
      expect(new Date(timeline[i].createdAt).getTime())
        .toBeGreaterThanOrEqual(new Date(timeline[i - 1].createdAt).getTime());
    }
  });

  // ── 8. Event Detail ─────────────────────────────────────────────────────

  it('returns event detail with explanation', async () => {
    const authA = { Authorization: `Bearer ${merchantA.token}` };
    const res = await request(app)
      .get(`/api/v1/audit/events/${auditEventIdA}`)
      .set(authA)
      .expect(200);

    expect(res.body.data.id).toBe(auditEventIdA);
    expect(res.body.data.eventType).toBe('ORDER_CREATED');
    expect(res.body.data.explanation).toBeTruthy();
    expect(res.body.data.entityType).toBe('ORDER');
    expect(res.body.data.metadata).toBeDefined();
  });

  // ── 9. Invalid Query Rejection ──────────────────────────────────────────

  it('rejects invalid sort field', async () => {
    const authA = { Authorization: `Bearer ${merchantA.token}` };
    await request(app)
      .get('/api/v1/audit/events')
      .query({ sort: 'id; DROP TABLE' })
      .set(authA)
      .expect(422);
  });

  it('rejects invalid actorType', async () => {
    const authA = { Authorization: `Bearer ${merchantA.token}` };
    await request(app)
      .get('/api/v1/audit/events')
      .query({ actorType: 'HACKER' })
      .set(authA)
      .expect(422);
  });

  // ── 10. Event Taxonomy Endpoint ─────────────────────────────────────────

  it('returns event type taxonomy without auth', async () => {
    const res = await request(app)
      .get('/api/v1/audit/event-types')
      .expect(200);

    expect(res.body.data.eventTypes).toBeInstanceOf(Array);
    expect(res.body.data.actorTypes).toBeInstanceOf(Array);
    expect(res.body.data.riskLevels).toBeInstanceOf(Array);
    expect(res.body.data.statuses).toBeInstanceOf(Array);
  });

  // ── Secret Non-Exposure ─────────────────────────────────────────────────

  it('never exposes secrets in any audit API response', async () => {
    const authA = { Authorization: `Bearer ${merchantA.token}` };

    const endpoints = [
      request(app).get('/api/v1/audit/events').set(authA),
      request(app).get(`/api/v1/audit/events/${auditEventIdA}`).set(authA),
      request(app).get('/api/v1/audit/timeline/order/clxyz0000000000000000000001').set(authA),
    ];

    for (const req$ of endpoints) {
      const res = await req$;
      const body = JSON.stringify(res.body);
      expect(body).not.toContain('key_secret');
      expect(body).not.toContain('RAZORPAY_KEY_SECRET');
      expect(body).not.toContain('webhook_secret');
      expect(body).not.toContain('JWT_SECRET');
      expect(body).not.toContain('OPENAI_API_KEY');
      // Authorization header value should not appear
      expect(body).not.toContain('Bearer ');
    }
  });
});
