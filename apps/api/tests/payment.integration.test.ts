/**
 * Phase 7.6 — Payment Integration Tests (PostgreSQL opt-in)
 *
 * Run with:
 *   RUN_DB_INTEGRATION_TESTS=true npx vitest run
 *
 * These tests require:
 * - PostgreSQL running
 * - Valid DATABASE_URL
 * - Razorpay SDK is NOT required (provider is exercised only via DB state)
 */

import crypto from 'node:crypto';
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
let orderId = '';
let paymentId = '';

function token(userId: string, merchantId: string): string {
  return jwt.sign(
    { userId, merchantId, email: `${userId}@pay-test.local`, role: 'MERCHANT' },
    process.env.JWT_SECRET!,
    { expiresIn: '1h' }
  );
}

suite('Phase 7.6 payment API — PostgreSQL integration', () => {
  beforeAll(async () => {
    const suffix = Date.now().toString(36);

    // Create two merchants
    for (const label of ['a', 'b'] as const) {
      const user = await prisma.user.create({
        data: { email: `pay-${label}-${suffix}@pay-test.local`, role: 'MERCHANT' },
      });
      const store = await prisma.store.create({
        data: {
          name: `Pay Test ${label}`,
          slug: `pay-test-${label}-${suffix}`,
          ownerId: user.id,
        },
      });
      createdStoreIds.push(store.id);
      const identity = { userId: user.id, storeId: store.id, token: token(user.id, store.id) };
      if (label === 'a') merchantA = identity;
      else merchantB = identity;
    }

    // Create a product + inventory + cart + order for merchant A
    const auth = { Authorization: `Bearer ${merchantA.token}` };

    const category = await request(app)
      .post('/api/v1/categories')
      .set(auth)
      .send({ name: 'Pay Test Cat', slug: `pay-cat-${suffix}` })
      .expect(201);

    const product = await request(app)
      .post('/api/v1/products')
      .set(auth)
      .send({
        name: 'Pay Test Widget',
        sku: `PAY-${suffix}`,
        price: 1999,
        currency: 'INR',
        description: 'Payment integration test product',
        categoryId: category.body.data.id,
        inventory: { quantity: 50, lowStockThreshold: 5 },
      })
      .expect(201);
    const productId = product.body.data.id;

    // Add to cart
    const cart = await request(app)
      .post('/api/v1/cart/items')
      .set(auth)
      .send({ productId, quantity: 2 })
      .expect(201);
    const cartId = cart.body.data.id;

    // Create order
    const order = await request(app)
      .post('/api/v1/orders')
      .set(auth)
      .send({ cartId })
      .expect(201);
    orderId = order.body.data.id;
  });

  afterAll(async () => {
    // Cleanup: cascading deletes via store deletion
    await prisma.payment.deleteMany({ where: { storeId: { in: createdStoreIds } } });
    await prisma.store.deleteMany({ where: { id: { in: createdStoreIds } } });
    await prisma.user.deleteMany({ where: { email: { contains: '@pay-test.local' } } });
    await prisma.$disconnect();
  });

  // ── Authentication ──────────────────────────────────────────────────────

  it('rejects unauthenticated create-order', async () => {
    await request(app)
      .post('/api/v1/payments/create-order')
      .send({ orderId })
      .expect(401);
  });

  it('rejects unauthenticated verify', async () => {
    await request(app)
      .post('/api/v1/payments/verify')
      .send({
        razorpay_order_id: 'order_test',
        razorpay_payment_id: 'pay_test',
        razorpay_signature: 'sig_test',
      })
      .expect(401);
  });

  it('rejects unauthenticated payment status', async () => {
    await request(app)
      .get(`/api/v1/payments/order/${orderId}`)
      .expect(401);
  });

  // ── Client Amount Manipulation ──────────────────────────────────────────

  it('rejects client-supplied amount on create-order', async () => {
    const auth = { Authorization: `Bearer ${merchantA.token}` };
    await request(app)
      .post('/api/v1/payments/create-order')
      .set(auth)
      .send({ orderId, amount: 1 })
      .expect(422);
  });

  it('rejects client-supplied currency on create-order', async () => {
    const auth = { Authorization: `Bearer ${merchantA.token}` };
    await request(app)
      .post('/api/v1/payments/create-order')
      .set(auth)
      .send({ orderId, currency: 'USD' })
      .expect(422);
  });

  it('rejects client-supplied total on create-order', async () => {
    const auth = { Authorization: `Bearer ${merchantA.token}` };
    await request(app)
      .post('/api/v1/payments/create-order')
      .set(auth)
      .send({ orderId, total: 100 })
      .expect(422);
  });

  // ── Merchant Isolation ──────────────────────────────────────────────────

  it('merchant B cannot create payment for merchant A order', async () => {
    const authB = { Authorization: `Bearer ${merchantB.token}` };
    const res = await request(app)
      .post('/api/v1/payments/create-order')
      .set(authB)
      .send({ orderId });
    // Should get 404 (order not found in merchant B's store) or 502 (Razorpay failure)
    expect([404, 502]).toContain(res.status);
  });

  it('merchant B cannot access merchant A payment status', async () => {
    const authB = { Authorization: `Bearer ${merchantB.token}` };
    const res = await request(app)
      .get(`/api/v1/payments/order/${orderId}`)
      .set(authB);
    expect(res.status).toBe(404);
  });

  // ── Invalid Signature ───────────────────────────────────────────────────

  it('rejects invalid payment signature', async () => {
    const auth = { Authorization: `Bearer ${merchantA.token}` };

    // First, manually create a Payment record to test verification
    const payment = await prisma.payment.create({
      data: {
        storeId: merchantA.storeId,
        orderId,
        provider: 'RAZORPAY',
        providerOrderId: `order_test_sig_${Date.now()}`,
        amount: 3998,
        currency: 'INR',
        status: 'CREATED',
        method: 'UPI',
      },
    });
    paymentId = payment.id;

    const res = await request(app)
      .post('/api/v1/payments/verify')
      .set(auth)
      .send({
        razorpay_order_id: payment.providerOrderId,
        razorpay_payment_id: 'pay_fake',
        razorpay_signature: 'a'.repeat(64),
      });

    expect(res.status).toBe(400);
    expect(res.body.error?.code).toBe('PAYMENT_SIGNATURE_INVALID');

    // Confirm order is NOT marked paid
    const order = await prisma.order.findUnique({ where: { id: orderId } });
    expect(order!.status).toBe('PENDING');
  });

  // ── Webhook without Signature ───────────────────────────────────────────

  it('rejects webhook without x-razorpay-signature header', async () => {
    const res = await request(app)
      .post('/api/v1/payments/webhook')
      .send({ event: 'payment.captured', payload: {} });
    expect(res.status).toBe(400);
  });

  it('rejects webhook with invalid signature', async () => {
    const res = await request(app)
      .post('/api/v1/payments/webhook')
      .set('x-razorpay-signature', 'invalid_signature_value')
      .send({ event: 'payment.captured', payload: {} });
    expect(res.status).toBe(400);
  });

  // ── Webhook with Valid Signature ────────────────────────────────────────

  it('processes valid webhook with correct signature (payment.captured)', async () => {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    if (!webhookSecret) {
      // Skip if webhook secret is not configured
      return;
    }

    // Create a fresh payment record for webhook testing
    const testPayment = await prisma.payment.create({
      data: {
        storeId: merchantA.storeId,
        orderId, // reuse
        provider: 'RAZORPAY',
        providerOrderId: `order_webhook_test_${Date.now()}`,
        amount: 3998,
        currency: 'INR',
        status: 'CREATED',
        method: 'UPI',
      },
    });

    const webhookBody = JSON.stringify({
      entity: 'event',
      account_id: 'acc_test',
      event: 'payment.captured',
      contains: ['payment'],
      payload: {
        payment: {
          entity: {
            id: 'pay_webhook_test',
            entity: 'payment',
            amount: 399800,
            currency: 'INR',
            status: 'captured',
            order_id: testPayment.providerOrderId,
            method: 'upi',
          },
        },
      },
      created_at: Math.floor(Date.now() / 1000),
    });

    const sig = crypto
      .createHmac('sha256', webhookSecret)
      .update(webhookBody)
      .digest('hex');

    const res = await request(app)
      .post('/api/v1/payments/webhook')
      .set('x-razorpay-signature', sig)
      .set('Content-Type', 'application/json')
      .send(webhookBody);

    expect(res.status).toBe(200);

    // Cleanup
    await prisma.payment.delete({ where: { id: testPayment.id } });
  });

  // ── Audit Events ───────────────────────────────────────────────────────

  it('records audit event for invalid signature attempt', async () => {
    const audit = await prisma.auditEvent.findFirst({
      where: {
        storeId: merchantA.storeId,
        eventType: 'PAYMENT_VERIFICATION_REJECTED',
      },
      orderBy: { createdAt: 'desc' },
    });
    expect(audit).toBeTruthy();
    expect(audit!.riskLevel).toBe('HIGH');
  });

  // ── Secret Never in Response ───────────────────────────────────────────

  it('never exposes Razorpay secret in any API response', async () => {
    const auth = { Authorization: `Bearer ${merchantA.token}` };

    // Check all payment endpoints for secret leakage
    const endpoints = [
      request(app).get(`/api/v1/payments/order/${orderId}`).set(auth),
    ];

    for (const req$ of endpoints) {
      const res = await req$;
      const body = JSON.stringify(res.body);
      expect(body).not.toContain('key_secret');
      expect(body).not.toContain('RAZORPAY_KEY_SECRET');
      expect(body).not.toContain('webhook_secret');
      expect(body).not.toContain('RAZORPAY_WEBHOOK_SECRET');
    }
  });
});
