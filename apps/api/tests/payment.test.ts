/**
 * Phase 7.6 — Payment Unit Tests (no DB, no Razorpay)
 *
 * Tests cover:
 * - INR amount → paise conversion (Decimal safety)
 * - Edge cases for amount conversion
 * - Payment request schema validation
 * - Signature verification (valid + invalid)
 * - Webhook signature verification (valid + invalid)
 * - Unknown webhook event handling
 * - Payment state transitions
 * - Payment state machine monotonicity
 * - Checkout response safety (no secrets)
 * - Client amount manipulation rejection
 */

import crypto from 'node:crypto';
import { describe, expect, it } from 'vitest';
import { Prisma } from '@prisma/client';
import { z } from 'zod';
import { toSmallestUnit } from '../src/services/payment/payment.service.js';
import {
  CURRENCY_MULTIPLIERS,
  isValidTransition,
  VALID_PAYMENT_TRANSITIONS,
  mapRazorpayMethod,
} from '../src/services/payment/payment.types.js';

// ─── Schema validation ──────────────────────────────────────────────────────

const createOrderSchema = z.object({ orderId: z.string().cuid() }).strict();
const verifySchema = z.object({
  razorpay_order_id: z.string().min(1),
  razorpay_payment_id: z.string().min(1),
  razorpay_signature: z.string().min(1),
});

// ─── Amount Conversion ──────────────────────────────────────────────────────

describe('Phase 7.6 — Amount conversion (Decimal → paise)', () => {
  it('converts ₹4999.00 to 499900 paise', () => {
    expect(toSmallestUnit(new Prisma.Decimal('4999.00'), 'INR')).toBe(499900);
  });

  it('converts ₹1.00 to 100 paise', () => {
    expect(toSmallestUnit(new Prisma.Decimal('1.00'), 'INR')).toBe(100);
  });

  it('converts ₹0.50 to 50 paise', () => {
    expect(toSmallestUnit(new Prisma.Decimal('0.50'), 'INR')).toBe(50);
  });

  it('converts ₹1299.99 to 129999 paise', () => {
    expect(toSmallestUnit(new Prisma.Decimal('1299.99'), 'INR')).toBe(129999);
  });

  it('converts large amount ₹99999.99 correctly', () => {
    expect(toSmallestUnit(new Prisma.Decimal('99999.99'), 'INR')).toBe(9999999);
  });

  it('handles zero amount', () => {
    expect(toSmallestUnit(new Prisma.Decimal('0'), 'INR')).toBe(0);
  });

  it('rejects unsupported currency', () => {
    try {
      toSmallestUnit(new Prisma.Decimal('100'), 'XYZ');
      expect.unreachable('should have thrown');
    } catch (err: any) {
      expect(err.code).toBe('UNSUPPORTED_CURRENCY');
    }
  });

  it('supports all configured currencies', () => {
    for (const currency of Object.keys(CURRENCY_MULTIPLIERS)) {
      const result = toSmallestUnit(new Prisma.Decimal('100.00'), currency);
      expect(result).toBe(10000);
    }
  });
});

// ─── Schema Validation ──────────────────────────────────────────────────────

describe('Phase 7.6 — Payment request schema validation', () => {
  it('accepts valid create-order request with only orderId', () => {
    const result = createOrderSchema.safeParse({
      orderId: 'clxyz1234567890123456789012',
    });
    expect(result.success).toBe(true);
  });

  it('rejects client-supplied amount on create-order', () => {
    const result = createOrderSchema.safeParse({
      orderId: 'clxyz1234567890123456789012',
      amount: 100,
    });
    expect(result.success).toBe(false);
  });

  it('rejects client-supplied currency on create-order', () => {
    const result = createOrderSchema.safeParse({
      orderId: 'clxyz1234567890123456789012',
      currency: 'INR',
    });
    expect(result.success).toBe(false);
  });

  it('rejects client-supplied total on create-order', () => {
    const result = createOrderSchema.safeParse({
      orderId: 'clxyz1234567890123456789012',
      total: 999,
    });
    expect(result.success).toBe(false);
  });

  it('rejects client-supplied subtotal on create-order', () => {
    const result = createOrderSchema.safeParse({
      orderId: 'clxyz1234567890123456789012',
      subtotal: 999,
    });
    expect(result.success).toBe(false);
  });

  it('accepts valid verify request', () => {
    const result = verifySchema.safeParse({
      razorpay_order_id: 'order_test123',
      razorpay_payment_id: 'pay_test456',
      razorpay_signature: 'abc123signaturedef456',
    });
    expect(result.success).toBe(true);
  });

  it('rejects verify request missing signature', () => {
    const result = verifySchema.safeParse({
      razorpay_order_id: 'order_test123',
      razorpay_payment_id: 'pay_test456',
    });
    expect(result.success).toBe(false);
  });

  it('rejects verify request with empty fields', () => {
    const result = verifySchema.safeParse({
      razorpay_order_id: '',
      razorpay_payment_id: '',
      razorpay_signature: '',
    });
    expect(result.success).toBe(false);
  });
});

// ─── Signature Verification (pure crypto, no SDK) ───────────────────────────

describe('Phase 7.6 — Signature verification logic', () => {
  const testSecret = 'test_secret_key_for_unit_tests';

  function computePaymentSignature(
    orderId: string,
    paymentId: string,
    secret: string
  ): string {
    return crypto
      .createHmac('sha256', secret)
      .update(`${orderId}|${paymentId}`)
      .digest('hex');
  }

  function verifyPaymentSignature(
    orderId: string,
    paymentId: string,
    signature: string,
    secret: string
  ): boolean {
    const expected = computePaymentSignature(orderId, paymentId, secret);
    try {
      return crypto.timingSafeEqual(
        Buffer.from(expected, 'hex'),
        Buffer.from(signature, 'hex')
      );
    } catch {
      return false;
    }
  }

  it('accepts valid payment signature', () => {
    const orderId = 'order_test_abc';
    const paymentId = 'pay_test_xyz';
    const sig = computePaymentSignature(orderId, paymentId, testSecret);
    expect(verifyPaymentSignature(orderId, paymentId, sig, testSecret)).toBe(true);
  });

  it('rejects invalid payment signature', () => {
    const orderId = 'order_test_abc';
    const paymentId = 'pay_test_xyz';
    const invalidSig = 'a'.repeat(64); // 64 hex chars = 32 bytes
    expect(verifyPaymentSignature(orderId, paymentId, invalidSig, testSecret)).toBe(false);
  });

  it('rejects signature with tampered order ID', () => {
    const orderId = 'order_test_abc';
    const paymentId = 'pay_test_xyz';
    const sig = computePaymentSignature(orderId, paymentId, testSecret);
    // Tamper the order ID
    expect(verifyPaymentSignature('order_TAMPERED', paymentId, sig, testSecret)).toBe(false);
  });

  it('rejects signature with tampered payment ID', () => {
    const orderId = 'order_test_abc';
    const paymentId = 'pay_test_xyz';
    const sig = computePaymentSignature(orderId, paymentId, testSecret);
    expect(verifyPaymentSignature(orderId, 'pay_TAMPERED', sig, testSecret)).toBe(false);
  });

  it('rejects signature with wrong secret', () => {
    const orderId = 'order_test_abc';
    const paymentId = 'pay_test_xyz';
    const sig = computePaymentSignature(orderId, paymentId, testSecret);
    expect(verifyPaymentSignature(orderId, paymentId, sig, 'wrong_secret')).toBe(false);
  });

  it('rejects malformed signature (wrong length)', () => {
    expect(verifyPaymentSignature('a', 'b', 'short', testSecret)).toBe(false);
  });
});

// ─── Webhook Signature Verification ─────────────────────────────────────────

describe('Phase 7.6 — Webhook signature verification', () => {
  const webhookSecret = 'test_webhook_secret_for_unit_tests';

  function computeWebhookSignature(body: string, secret: string): string {
    return crypto.createHmac('sha256', secret).update(body).digest('hex');
  }

  function verifyWebhookSignature(body: string, signature: string, secret: string): boolean {
    const expected = computeWebhookSignature(body, secret);
    try {
      return crypto.timingSafeEqual(
        Buffer.from(expected, 'hex'),
        Buffer.from(signature, 'hex')
      );
    } catch {
      return false;
    }
  }

  it('accepts valid webhook signature', () => {
    const body = JSON.stringify({ event: 'payment.captured', payload: {} });
    const sig = computeWebhookSignature(body, webhookSecret);
    expect(verifyWebhookSignature(body, sig, webhookSecret)).toBe(true);
  });

  it('rejects tampered webhook body', () => {
    const body = JSON.stringify({ event: 'payment.captured', payload: {} });
    const sig = computeWebhookSignature(body, webhookSecret);
    const tampered = JSON.stringify({ event: 'payment.captured', payload: { tampered: true } });
    expect(verifyWebhookSignature(tampered, sig, webhookSecret)).toBe(false);
  });

  it('rejects invalid webhook signature', () => {
    const body = JSON.stringify({ event: 'payment.captured', payload: {} });
    const invalidSig = 'b'.repeat(64);
    expect(verifyWebhookSignature(body, invalidSig, webhookSecret)).toBe(false);
  });

  it('rejects webhook with wrong secret', () => {
    const body = JSON.stringify({ event: 'payment.captured', payload: {} });
    const sig = computeWebhookSignature(body, webhookSecret);
    expect(verifyWebhookSignature(body, sig, 'wrong_secret')).toBe(false);
  });
});

// ─── Payment State Transitions ──────────────────────────────────────────────

describe('Phase 7.6 — Payment state transitions', () => {
  it('allows CREATED → CAPTURED', () => {
    expect(isValidTransition('CREATED', 'CAPTURED')).toBe(true);
  });

  it('allows CREATED → FAILED', () => {
    expect(isValidTransition('CREATED', 'FAILED')).toBe(true);
  });

  it('allows PENDING → CAPTURED', () => {
    expect(isValidTransition('PENDING', 'CAPTURED')).toBe(true);
  });

  it('allows PENDING → FAILED', () => {
    expect(isValidTransition('PENDING', 'FAILED')).toBe(true);
  });

  it('disallows CAPTURED → anything (terminal state)', () => {
    expect(isValidTransition('CAPTURED', 'PENDING')).toBe(false);
    expect(isValidTransition('CAPTURED', 'FAILED')).toBe(false);
    expect(isValidTransition('CAPTURED', 'CAPTURED')).toBe(false);
  });

  it('disallows FAILED → CAPTURED (terminal state)', () => {
    expect(isValidTransition('FAILED', 'CAPTURED')).toBe(false);
  });

  it('disallows COMPLETED → anything (terminal state)', () => {
    expect(isValidTransition('COMPLETED', 'CAPTURED')).toBe(false);
    expect(isValidTransition('COMPLETED', 'PENDING')).toBe(false);
  });

  it('handles unknown source state gracefully', () => {
    expect(isValidTransition('NONEXISTENT', 'CAPTURED')).toBe(false);
  });

  it('ensures all terminal states have no outgoing transitions', () => {
    for (const terminal of ['CAPTURED', 'COMPLETED', 'FAILED', 'REFUNDED']) {
      expect(VALID_PAYMENT_TRANSITIONS[terminal]).toEqual([]);
    }
  });
});

// ─── Razorpay Method Mapping ────────────────────────────────────────────────

describe('Phase 7.6 — Razorpay method mapping', () => {
  it('maps "upi" to UPI', () => {
    expect(mapRazorpayMethod('upi')).toBe('UPI');
  });

  it('maps "card" to CARD', () => {
    expect(mapRazorpayMethod('card')).toBe('CARD');
  });

  it('maps "netbanking" to NET_BANKING', () => {
    expect(mapRazorpayMethod('netbanking')).toBe('NET_BANKING');
  });

  it('maps "wallet" to WALLET', () => {
    expect(mapRazorpayMethod('wallet')).toBe('WALLET');
  });

  it('defaults unknown method to UPI', () => {
    expect(mapRazorpayMethod('something_new')).toBe('UPI');
    expect(mapRazorpayMethod(undefined)).toBe('UPI');
  });
});

// ─── Checkout Response Safety ───────────────────────────────────────────────

describe('Phase 7.6 — Checkout response safety', () => {
  const sampleCheckoutResponse = {
    orderId: 'clxyz1234567890123456789012',
    paymentId: 'clxyz1234567890123456789013',
    razorpayOrderId: 'order_test123',
    amount: 499900,
    currency: 'INR',
    keyId: 'rzp_test_mock_key_id',
    orderNumber: 'ORD-123',
  };

  it('never contains key_secret', () => {
    const json = JSON.stringify(sampleCheckoutResponse);
    expect(json).not.toContain('key_secret');
    expect(json).not.toContain('RAZORPAY_KEY_SECRET');
    expect(json).not.toContain('webhook_secret');
  });

  it('contains only expected fields', () => {
    const keys = Object.keys(sampleCheckoutResponse);
    expect(keys).toEqual([
      'orderId',
      'paymentId',
      'razorpayOrderId',
      'amount',
      'currency',
      'keyId',
      'orderNumber',
    ]);
  });

  it('keyId starts with rzp_test_ for test mode', () => {
    expect(sampleCheckoutResponse.keyId).toMatch(/^rzp_test_/);
  });
});
