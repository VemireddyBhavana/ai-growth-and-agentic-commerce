/**
 * Phase 7.7 — Audit & Explainability Unit Tests (no DB)
 *
 * Tests cover:
 * - Metadata redaction (secrets, JWT, authorization, API keys)
 * - Nested metadata redaction
 * - Explanation generation for every event type category
 * - Explanation reuse of metadata.explanation
 * - Entity type inference
 * - Event taxonomy completeness
 * - Filter validation (Zod schemas)
 * - Pagination validation
 * - Invalid sort field rejection
 * - Actor type handling
 * - AI explanation safety (no chain-of-thought)
 * - Payment explanation correctness
 * - Order explanation correctness
 * - Audit immutability (no mutation endpoints)
 */

import { describe, expect, it } from 'vitest';
import { z } from 'zod';
import { redactMetadata } from '../src/services/audit.service.js';
import {
  explain,
  inferEntityType,
  KNOWN_EVENT_TYPES,
} from '../src/services/explainability.service.js';

// ─── Metadata Redaction ─────────────────────────────────────────────────────

describe('Phase 7.7 — Metadata redaction', () => {
  it('redacts authorization field', () => {
    const result = redactMetadata({ authorization: 'Bearer xxx', safe: 'yes' }) as any;
    expect(result.authorization).toBe('[REDACTED]');
    expect(result.safe).toBe('yes');
  });

  it('redacts JWT token', () => {
    const result = redactMetadata({ token: 'eyJ...', jwt: 'eyJ...' }) as any;
    expect(result.token).toBe('[REDACTED]');
    expect(result.jwt).toBe('[REDACTED]');
  });

  it('redacts accessToken and refreshToken', () => {
    const result = redactMetadata({ accessToken: 'abc', refreshToken: 'xyz' }) as any;
    expect(result.accessToken).toBe('[REDACTED]');
    expect(result.refreshToken).toBe('[REDACTED]');
  });

  it('redacts API keys', () => {
    const result = redactMetadata({ apiKey: 'sk-xxx', api_key: 'sk-yyy' }) as any;
    expect(result.apiKey).toBe('[REDACTED]');
    expect(result.api_key).toBe('[REDACTED]');
  });

  it('redacts password and passwordHash', () => {
    const result = redactMetadata({ password: 'pass123', passwordHash: '$2b...' }) as any;
    expect(result.password).toBe('[REDACTED]');
    expect(result.passwordHash).toBe('[REDACTED]');
  });

  it('redacts Razorpay secrets', () => {
    const result = redactMetadata({
      razorpay_signature: 'sig',
      razorpaySignature: 'sig2',
      key_secret: 'ks',
      keySecret: 'ks2',
      webhook_secret: 'ws',
      webhookSecret: 'ws2',
    }) as any;
    expect(result.razorpay_signature).toBe('[REDACTED]');
    expect(result.razorpaySignature).toBe('[REDACTED]');
    expect(result.key_secret).toBe('[REDACTED]');
    expect(result.keySecret).toBe('[REDACTED]');
    expect(result.webhook_secret).toBe('[REDACTED]');
    expect(result.webhookSecret).toBe('[REDACTED]');
  });

  it('redacts OpenAI API key', () => {
    const result = redactMetadata({ openai_api_key: 'sk-xxx', OPENAI_API_KEY: 'sk-yyy' }) as any;
    expect(result.openai_api_key).toBe('[REDACTED]');
    expect(result.OPENAI_API_KEY).toBe('[REDACTED]');
  });

  it('redacts chain-of-thought and hidden prompts', () => {
    const result = redactMetadata({
      chain_of_thought: 'internal reasoning...',
      chainOfThought: 'more reasoning...',
      hidden_prompt: 'secret prompt',
      system_prompt: 'system instructions',
    }) as any;
    expect(result.chain_of_thought).toBe('[REDACTED]');
    expect(result.chainOfThought).toBe('[REDACTED]');
    expect(result.hidden_prompt).toBe('[REDACTED]');
    expect(result.system_prompt).toBe('[REDACTED]');
  });

  it('redacts environment variable names', () => {
    const result = redactMetadata({
      RAZORPAY_KEY_SECRET: 'xxx',
      RAZORPAY_WEBHOOK_SECRET: 'yyy',
      JWT_SECRET: 'zzz',
    }) as any;
    expect(result.RAZORPAY_KEY_SECRET).toBe('[REDACTED]');
    expect(result.RAZORPAY_WEBHOOK_SECRET).toBe('[REDACTED]');
    expect(result.JWT_SECRET).toBe('[REDACTED]');
  });

  it('deep-redacts nested objects', () => {
    const result = redactMetadata({
      level1: {
        safe: 'value',
        level2: {
          password: 'hidden',
          apiKey: 'also-hidden',
          normal: 'visible',
        },
      },
    }) as any;
    expect(result.level1.safe).toBe('value');
    expect(result.level1.level2.password).toBe('[REDACTED]');
    expect(result.level1.level2.apiKey).toBe('[REDACTED]');
    expect(result.level1.level2.normal).toBe('visible');
  });

  it('redacts within arrays', () => {
    const result = redactMetadata([
      { safe: 'yes', secret: 'no' },
      { safe: 'also-yes', token: 'no' },
    ]) as any;
    expect(result[0].safe).toBe('yes');
    expect(result[0].secret).toBe('[REDACTED]');
    expect(result[1].safe).toBe('also-yes');
    expect(result[1].token).toBe('[REDACTED]');
  });

  it('handles null and undefined metadata', () => {
    expect(redactMetadata(null)).toBeNull();
    expect(redactMetadata(undefined)).toBeUndefined();
  });

  it('handles primitive values', () => {
    expect(redactMetadata('string')).toBe('string');
    expect(redactMetadata(42)).toBe(42);
    expect(redactMetadata(true)).toBe(true);
  });

  it('preserves safe fields', () => {
    const result = redactMetadata({
      orderId: 'order_123',
      amount: '4999.00',
      currency: 'INR',
      productId: 'prod_456',
      quantity: 3,
      explanation: 'This is safe',
    }) as any;
    expect(result.orderId).toBe('order_123');
    expect(result.amount).toBe('4999.00');
    expect(result.currency).toBe('INR');
    expect(result.productId).toBe('prod_456');
    expect(result.quantity).toBe(3);
    expect(result.explanation).toBe('This is safe');
  });
});

// ─── Explanation Generation ─────────────────────────────────────────────────

describe('Phase 7.7 — Explanation generation', () => {
  // Metadata.explanation reuse
  it('uses pre-existing metadata.explanation when present', () => {
    const result = explain({
      eventType: 'PAYMENT_VERIFIED',
      metadata: { explanation: 'Custom explanation from Phase 7.6' },
    });
    expect(result).toBe('Custom explanation from Phase 7.6');
  });

  it('ignores empty explanation string', () => {
    const result = explain({
      eventType: 'AUTH_LOGIN',
      metadata: { explanation: '' },
    });
    expect(result).toBe('User authenticated successfully.');
  });

  // Auth events
  it('explains AUTH_LOGIN', () => {
    expect(explain({ eventType: 'AUTH_LOGIN' })).toBe('User authenticated successfully.');
  });

  it('explains AUTH_FAILURE with reason', () => {
    expect(explain({ eventType: 'AUTH_FAILURE', metadata: { reason: 'Invalid password' } }))
      .toBe('Authentication failed: Invalid password');
  });

  it('explains ACCESS_DENIED', () => {
    expect(explain({ eventType: 'ACCESS_DENIED' })).toContain('Access was denied');
  });

  it('explains CROSS_MERCHANT_ACCESS_ATTEMPT', () => {
    expect(explain({ eventType: 'CROSS_MERCHANT_ACCESS_ATTEMPT' }))
      .toContain('cross-merchant');
  });

  // Product events
  it('explains PRODUCT_CREATED', () => {
    expect(explain({ eventType: 'PRODUCT_CREATED', metadata: { name: 'Widget Pro' } }))
      .toBe('Product "Widget Pro" was created.');
  });

  it('explains PRODUCT_UPDATED', () => {
    expect(explain({ eventType: 'PRODUCT_UPDATED', metadata: { name: 'Widget Pro' } }))
      .toBe('Product "Widget Pro" was updated.');
  });

  it('explains PRODUCT_ARCHIVED', () => {
    expect(explain({ eventType: 'PRODUCT_ARCHIVED', metadata: { name: 'Old Widget' } }))
      .toContain('archived');
  });

  // Cart events
  it('explains CART_CREATED', () => {
    expect(explain({ eventType: 'CART_CREATED' })).toContain('cart was created');
  });

  it('explains CART_ITEM_ADDED with quantity', () => {
    expect(explain({
      eventType: 'CART_ITEM_ADDED',
      metadata: { productId: 'prod_123', quantity: 2 },
    })).toContain('qty: 2');
  });

  it('explains CART_ITEM_UPDATED', () => {
    expect(explain({
      eventType: 'CART_ITEM_UPDATED',
      metadata: { quantity: 5 },
    })).toContain('5');
  });

  it('explains CART_ITEM_REMOVED', () => {
    expect(explain({ eventType: 'CART_ITEM_REMOVED' })).toContain('removed');
  });

  it('explains CART_CLEARED', () => {
    expect(explain({ eventType: 'CART_CLEARED' })).toContain('removed from the cart');
  });

  // Order events
  it('explains ORDER_CREATED with amount', () => {
    const result = explain({
      eventType: 'ORDER_CREATED',
      metadata: { orderNumber: 'ORD-001', total: '4999' },
    });
    expect(result).toContain('ORD-001');
    expect(result).toContain('₹4999');
    expect(result).toContain('server-side');
  });

  it('explains ORDER_VALIDATION_FAILED', () => {
    expect(explain({
      eventType: 'ORDER_VALIDATION_FAILED',
      metadata: { reason: 'Insufficient inventory' },
    })).toContain('Insufficient inventory');
  });

  // AI events
  it('explains AI_RECOMMENDATION_GENERATED', () => {
    const result = explain({
      eventType: 'AI_RECOMMENDATION_GENERATED',
      metadata: { recommendedProductIds: ['p1', 'p2', 'p3'] },
    });
    expect(result).toContain('3');
    expect(result).toContain('recommendation');
  });

  it('explains AI_CLARIFICATION_REQUESTED', () => {
    const result = explain({
      eventType: 'AI_CLARIFICATION_REQUESTED',
      metadata: { reason: 'Missing budget range' },
    });
    expect(result).toContain('Missing budget range');
  });

  it('explains AI_DECISION_CREATED with confidence', () => {
    const result = explain({
      eventType: 'AI_DECISION_CREATED',
      metadata: { decisionType: 'PRODUCT_RECOMMENDATION', confidence: 0.91 },
    });
    expect(result).toContain('91%');
  });

  // Payment events
  it('explains PAYMENT_ORDER_CREATED', () => {
    const result = explain({
      eventType: 'PAYMENT_ORDER_CREATED',
      metadata: { orderNumber: 'ORD-456', amount: '4999' },
    });
    expect(result).toContain('ORD-456');
    expect(result).toContain('server-verified');
  });

  it('explains PAYMENT_VERIFIED', () => {
    const result = explain({
      eventType: 'PAYMENT_VERIFIED',
      metadata: { amount: '4999', razorpayOrderId: 'order_abc' },
    });
    expect(result).toContain('₹4999');
    expect(result).toContain('order_abc');
  });

  it('explains PAYMENT_VERIFICATION_REJECTED', () => {
    expect(explain({ eventType: 'PAYMENT_VERIFICATION_REJECTED' }))
      .toContain('signature was invalid');
  });

  it('explains PAYMENT_FAILED', () => {
    const result = explain({
      eventType: 'PAYMENT_FAILED',
      metadata: { errorDescription: 'Card declined' },
    });
    expect(result).toContain('Card declined');
  });

  it('explains PAYMENT_WEBHOOK_PROCESSED', () => {
    const result = explain({
      eventType: 'PAYMENT_WEBHOOK_PROCESSED',
      metadata: { event: 'payment.captured' },
    });
    expect(result).toContain('payment.captured');
  });

  it('explains PAYMENT_WEBHOOK_DUPLICATE', () => {
    expect(explain({ eventType: 'PAYMENT_WEBHOOK_DUPLICATE' }))
      .toContain('duplicate');
  });

  // Fallback
  it('provides fallback for unknown event types', () => {
    const result = explain({ eventType: 'UNKNOWN_CUSTOM_EVENT', status: 'SUCCESS' });
    expect(result).toContain('UNKNOWN_CUSTOM_EVENT');
    expect(result).toContain('SUCCESS');
  });
});

// ─── AI Explanation Safety ──────────────────────────────────────────────────

describe('Phase 7.7 — AI explanation safety', () => {
  it('never exposes chain-of-thought in explanations', () => {
    const events = [
      { eventType: 'AI_RECOMMENDATION_GENERATED', metadata: { recommendedProductIds: ['p1'] } },
      { eventType: 'AI_DECISION_CREATED', metadata: { decisionType: 'PRODUCT_RECOMMENDATION', confidence: 0.9 } },
      { eventType: 'AI_CLARIFICATION_REQUESTED', metadata: { reason: 'Need budget' } },
    ];

    for (const event of events) {
      const explanation = explain(event);
      expect(explanation).not.toContain('chain');
      expect(explanation).not.toContain('thought');
      expect(explanation).not.toContain('internal');
      expect(explanation).not.toContain('hidden');
      expect(explanation).not.toContain('prompt');
    }
  });

  it('AI explanation is deterministic', () => {
    const event = {
      eventType: 'AI_RECOMMENDATION_GENERATED',
      metadata: { recommendedProductIds: ['p1', 'p2'] },
    };
    const first = explain(event);
    const second = explain(event);
    expect(first).toBe(second);
  });
});

// ─── Entity Type Inference ──────────────────────────────────────────────────

describe('Phase 7.7 — Entity type inference', () => {
  it('infers PRODUCT for product/variant/category events', () => {
    expect(inferEntityType('PRODUCT_CREATED')).toBe('PRODUCT');
    expect(inferEntityType('VARIANT_UPDATED')).toBe('PRODUCT');
    expect(inferEntityType('CATEGORY_DELETED')).toBe('PRODUCT');
    expect(inferEntityType('INVENTORY_UPDATED')).toBe('PRODUCT');
  });

  it('infers CART for cart events', () => {
    expect(inferEntityType('CART_CREATED')).toBe('CART');
    expect(inferEntityType('CART_ITEM_ADDED')).toBe('CART');
  });

  it('infers ORDER for order events', () => {
    expect(inferEntityType('ORDER_CREATED')).toBe('ORDER');
    expect(inferEntityType('ORDER_VALIDATION_FAILED')).toBe('ORDER');
  });

  it('infers PAYMENT for payment events', () => {
    expect(inferEntityType('PAYMENT_ORDER_CREATED')).toBe('PAYMENT');
    expect(inferEntityType('PAYMENT_VERIFIED')).toBe('PAYMENT');
    expect(inferEntityType('PAYMENT_WEBHOOK_PROCESSED')).toBe('PAYMENT');
  });

  it('infers AI for AI events', () => {
    expect(inferEntityType('AI_REQUEST')).toBe('AI');
    expect(inferEntityType('AI_RECOMMENDATION_GENERATED')).toBe('AI');
  });

  it('infers AUTH for auth/security events', () => {
    expect(inferEntityType('AUTH_LOGIN')).toBe('AUTH');
    expect(inferEntityType('ACCESS_DENIED')).toBe('AUTH');
    expect(inferEntityType('CROSS_MERCHANT_ACCESS_ATTEMPT')).toBe('AUTH');
    expect(inferEntityType('RATE_LIMIT_EXCEEDED')).toBe('AUTH');
  });

  it('defaults to SYSTEM for unknown event types', () => {
    expect(inferEntityType('SOMETHING_UNKNOWN')).toBe('SYSTEM');
  });
});

// ─── Event Taxonomy ─────────────────────────────────────────────────────────

describe('Phase 7.7 — Event taxonomy', () => {
  it('contains all auth event types', () => {
    expect(KNOWN_EVENT_TYPES).toContain('AUTH_LOGIN');
    expect(KNOWN_EVENT_TYPES).toContain('AUTH_FAILURE');
  });

  it('contains all product event types', () => {
    expect(KNOWN_EVENT_TYPES).toContain('PRODUCT_CREATED');
    expect(KNOWN_EVENT_TYPES).toContain('PRODUCT_UPDATED');
    expect(KNOWN_EVENT_TYPES).toContain('PRODUCT_ARCHIVED');
  });

  it('contains all cart event types', () => {
    expect(KNOWN_EVENT_TYPES).toContain('CART_CREATED');
    expect(KNOWN_EVENT_TYPES).toContain('CART_ITEM_ADDED');
    expect(KNOWN_EVENT_TYPES).toContain('CART_ITEM_UPDATED');
    expect(KNOWN_EVENT_TYPES).toContain('CART_ITEM_REMOVED');
  });

  it('contains all order event types', () => {
    expect(KNOWN_EVENT_TYPES).toContain('ORDER_CREATED');
    expect(KNOWN_EVENT_TYPES).toContain('ORDER_VALIDATION_FAILED');
  });

  it('contains all AI event types', () => {
    expect(KNOWN_EVENT_TYPES).toContain('AI_REQUEST');
    expect(KNOWN_EVENT_TYPES).toContain('AI_RECOMMENDATION_GENERATED');
    expect(KNOWN_EVENT_TYPES).toContain('AI_RECOMMENDATION_CREATED');
    expect(KNOWN_EVENT_TYPES).toContain('AI_DECISION_CREATED');
    expect(KNOWN_EVENT_TYPES).toContain('AI_CLARIFICATION_REQUESTED');
  });

  it('contains all payment event types', () => {
    expect(KNOWN_EVENT_TYPES).toContain('PAYMENT_ORDER_CREATED');
    expect(KNOWN_EVENT_TYPES).toContain('PAYMENT_VERIFIED');
    expect(KNOWN_EVENT_TYPES).toContain('PAYMENT_FAILED');
    expect(KNOWN_EVENT_TYPES).toContain('PAYMENT_VERIFICATION_REJECTED');
    expect(KNOWN_EVENT_TYPES).toContain('PAYMENT_WEBHOOK_RECEIVED');
    expect(KNOWN_EVENT_TYPES).toContain('PAYMENT_WEBHOOK_PROCESSED');
    expect(KNOWN_EVENT_TYPES).toContain('PAYMENT_WEBHOOK_DUPLICATE');
  });

  it('has no duplicate event types', () => {
    const set = new Set(KNOWN_EVENT_TYPES);
    expect(set.size).toBe(KNOWN_EVENT_TYPES.length);
  });
});

// ─── Filter / Query Validation ──────────────────────────────────────────────

describe('Phase 7.7 — Filter validation', () => {
  const listEventsQuery = z.object({
    eventType: z.string().optional(),
    actorType: z.enum(['CUSTOMER', 'MERCHANT', 'ADMIN', 'SYSTEM', 'AI_AGENT', 'WEBHOOK', 'ANONYMOUS']).optional(),
    actorId: z.string().optional(),
    orderId: z.string().optional(),
    paymentId: z.string().optional(),
    customerId: z.string().optional(),
    riskLevel: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).optional(),
    status: z.enum(['SUCCESS', 'FAILED', 'PENDING', 'DENIED']).optional(),
    startDate: z.string().datetime({ offset: true }).optional(),
    endDate: z.string().datetime({ offset: true }).optional(),
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(25),
    sort: z.enum(['createdAt']).default('createdAt'),
    order: z.enum(['asc', 'desc']).default('desc'),
  });

  it('accepts valid filter query', () => {
    const result = listEventsQuery.safeParse({
      eventType: 'ORDER_CREATED',
      actorType: 'SYSTEM',
      page: '1',
      limit: '10',
    });
    expect(result.success).toBe(true);
  });

  it('applies defaults for page and limit', () => {
    const result = listEventsQuery.safeParse({});
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.page).toBe(1);
      expect(result.data.limit).toBe(25);
      expect(result.data.order).toBe('desc');
    }
  });

  it('rejects invalid actorType', () => {
    const result = listEventsQuery.safeParse({ actorType: 'HACKER' });
    expect(result.success).toBe(false);
  });

  it('rejects invalid riskLevel', () => {
    const result = listEventsQuery.safeParse({ riskLevel: 'EXTREME' });
    expect(result.success).toBe(false);
  });

  it('rejects invalid status', () => {
    const result = listEventsQuery.safeParse({ status: 'UNKNOWN' });
    expect(result.success).toBe(false);
  });

  it('rejects page < 1', () => {
    const result = listEventsQuery.safeParse({ page: '0' });
    expect(result.success).toBe(false);
  });

  it('rejects limit > 100', () => {
    const result = listEventsQuery.safeParse({ limit: '101' });
    expect(result.success).toBe(false);
  });

  it('rejects invalid sort field', () => {
    const result = listEventsQuery.safeParse({ sort: 'password' });
    expect(result.success).toBe(false);
  });

  it('rejects arbitrary sort expression', () => {
    const result = listEventsQuery.safeParse({ sort: 'id; DROP TABLE' });
    expect(result.success).toBe(false);
  });

  it('rejects invalid date format', () => {
    const result = listEventsQuery.safeParse({ startDate: 'not-a-date' });
    expect(result.success).toBe(false);
  });

  it('accepts valid ISO datetime', () => {
    const result = listEventsQuery.safeParse({ startDate: '2026-01-01T00:00:00+05:30' });
    expect(result.success).toBe(true);
  });
});

// ─── Pagination ─────────────────────────────────────────────────────────────

describe('Phase 7.7 — Pagination validation', () => {
  const paginationSchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(25),
  });

  it('applies defaults', () => {
    const result = paginationSchema.parse({});
    expect(result.page).toBe(1);
    expect(result.limit).toBe(25);
  });

  it('accepts valid values', () => {
    const result = paginationSchema.parse({ page: '5', limit: '50' });
    expect(result.page).toBe(5);
    expect(result.limit).toBe(50);
  });

  it('rejects negative page', () => {
    expect(() => paginationSchema.parse({ page: '-1' })).toThrow();
  });

  it('rejects zero page', () => {
    expect(() => paginationSchema.parse({ page: '0' })).toThrow();
  });

  it('rejects limit exceeding maximum', () => {
    expect(() => paginationSchema.parse({ limit: '101' })).toThrow();
  });
});

// ─── Audit Immutability ─────────────────────────────────────────────────────

describe('Phase 7.7 — Audit immutability', () => {
  it('audit routes file exports only GET endpoints (no PUT/PATCH/DELETE)', async () => {
    // Read the routes module source to verify no mutation routes exist
    // We test the constraint by checking that the route module only defines GET
    const routes = await import('../src/routes/audit.routes.js');
    const router = routes.auditRoutes;
    const stack = (router as any).stack as Array<{ route?: { methods: Record<string, boolean> } }>;

    for (const layer of stack) {
      if (layer.route) {
        expect(layer.route.methods.put).toBeFalsy();
        expect(layer.route.methods.patch).toBeFalsy();
        expect(layer.route.methods.delete).toBeFalsy();
      }
    }
  });
});

// ─── Secret Safety in Explanations ──────────────────────────────────────────

describe('Phase 7.7 — Secret safety in explanations', () => {
  it('explanation never contains secret even if metadata has it', () => {
    // The redactMetadata function handles storage safety.
    // The explain function only reads metadata.explanation and known safe fields.
    const event = {
      eventType: 'PAYMENT_VERIFIED',
      metadata: {
        amount: '4999',
        razorpayOrderId: 'order_abc',
        key_secret: 'SHOULD_NOT_APPEAR', // This would be redacted before storage
      },
    };
    const result = explain(event);
    expect(result).not.toContain('SHOULD_NOT_APPEAR');
    expect(result).not.toContain('key_secret');
  });
});
