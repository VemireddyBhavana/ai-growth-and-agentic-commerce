import { describe, expect, it } from 'vitest';
import { Prisma } from '@prisma/client';
import { z } from 'zod';
import { cartSubtotal, MAX_CART_QUANTITY } from '../src/services/cart.service.js';

const cartItemBody = z
  .object({
    productId: z.string().cuid(),
    variantId: z.string().cuid().optional(),
    quantity: z.coerce.number().int().min(1).max(99),
  })
  .strict();

const orderCreateBody = z.object({ cartId: z.string().cuid() }).strict();

describe('Phase 7.5 Cart & Order — unit tests (no DB)', () => {
  it('cartSubtotal sums unitPrice × quantity with Prisma Decimal precision', () => {
    const lines = [
      { unitPrice: new Prisma.Decimal('1299.99'), quantity: 2 },
      { unitPrice: new Prisma.Decimal('500.00'), quantity: 1 },
    ];
    expect(cartSubtotal(lines).toString()).toBe('3099.98');
  });

  it('cartSubtotal returns zero for empty cart', () => {
    expect(cartSubtotal([]).toString()).toBe('0');
  });

  it('MAX_CART_QUANTITY is 99', () => {
    expect(MAX_CART_QUANTITY).toBe(99);
  });

  it('rejects client-supplied unitPrice on cart add (strict schema)', () => {
    const result = cartItemBody.safeParse({
      productId: 'clxyz1234567890123456789012',
      quantity: 1,
      unitPrice: 1,
    });
    expect(result.success).toBe(false);
  });

  it('rejects client-supplied subtotal/total on cart add (strict schema)', () => {
    for (const extra of [{ subtotal: 100 }, { total: 100 }, { discount: 50 }]) {
      const result = cartItemBody.safeParse({
        productId: 'clxyz1234567890123456789012',
        quantity: 1,
        ...extra,
      });
      expect(result.success).toBe(false);
    }
  });

  it('rejects client-supplied totals on order create (strict schema)', () => {
    for (const extra of [
      { total: 1 },
      { subtotal: 1 },
      { discount: 1 },
      { paymentMethod: 'UPI' },
    ]) {
      const result = orderCreateBody.safeParse({
        cartId: 'clxyz1234567890123456789012',
        ...extra,
      });
      expect(result.success).toBe(false);
    }
  });

  it('accepts valid cart add payload without price fields', () => {
    const result = cartItemBody.safeParse({
      productId: 'clxyz1234567890123456789012',
      quantity: 3,
    });
    expect(result.success).toBe(true);
  });

  it('rejects quantity below 1 and above MAX_CART_QUANTITY', () => {
    expect(cartItemBody.safeParse({ productId: 'clxyz1234567890123456789012', quantity: 0 }).success).toBe(false);
    expect(cartItemBody.safeParse({ productId: 'clxyz1234567890123456789012', quantity: 100 }).success).toBe(false);
  });
});
