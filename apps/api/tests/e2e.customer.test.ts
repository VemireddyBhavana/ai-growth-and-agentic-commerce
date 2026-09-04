/**
 * Phase 7.11 — End-to-End Customer AI Commerce Integration Test
 *
 * Journey:
 * Customer AI Shopping Request → Real Product Recommendation →
 * Add to Cart → Server Cart Validation → Order Creation →
 * Razorpay Payment Order → Payment Signature Verification →
 * Confirmed/Paid Order State → Append-Only Audit Trail
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

const { mockStoreId, mockCustomerId, PrismaDecimal, ordersDb, paymentsDb, cartItems } = await vi.hoisted(async () => {
  const { Prisma } = await import('@prisma/client');
  return {
    mockStoreId: 'store_e2e_customer_1',
    mockCustomerId: 'cust_e2e_1',
    PrismaDecimal: Prisma.Decimal,
    ordersDb: {} as Record<string, any>,
    paymentsDb: {} as Record<string, any>,
    cartItems: [] as any[],
  };
});

vi.mock('../src/services/payment/razorpay.provider.js', () => ({
  razorpayProvider: {
    createOrder: vi.fn().mockResolvedValue({
      razorpayOrderId: 'order_rzp_mock_123',
      amount: 349900,
      currency: 'INR',
      status: 'created',
    }),
    verifyPaymentSignature: vi.fn().mockReturnValue(true),
    getPublicKeyId: vi.fn().mockReturnValue('rzp_test_mock_key'),
  },
  RazorpayProvider: vi.fn(),
}));

vi.mock('../src/config/prisma.config.js', () => {
  const mockProduct = {
    id: 'prod_headset_1',
    storeId: mockStoreId,
    name: 'Wireless Pro Headset',
    sku: 'HEADSET-01',
    price: new PrismaDecimal(3499),
    currency: 'INR',
    status: 'ACTIVE',
    isActive: true,
    variants: [],
    inventory: [{ id: 'inv_1', quantity: 25, reservedQuantity: 0 }],
  };

  const mockPrismaObj: any = {
    product: {
      findMany: vi.fn().mockResolvedValue([mockProduct]),
      findFirst: vi.fn().mockResolvedValue(mockProduct),
    },
    shoppingCart: {
      findFirst: vi.fn().mockImplementation(() =>
        Promise.resolve({
          id: 'cart_cust_1',
          storeId: mockStoreId,
          customerId: mockCustomerId,
          currency: 'INR',
          status: 'ACTIVE',
          items: [
            {
              id: 'ci_1',
              productId: 'prod_headset_1',
              variantId: null,
              quantity: 1,
              unitPrice: new PrismaDecimal(3499),
              product: mockProduct,
            },
          ],
        })
      ),
      create: vi.fn().mockImplementation(() =>
        Promise.resolve({
          id: 'cart_cust_1',
          storeId: mockStoreId,
          customerId: mockCustomerId,
          currency: 'INR',
          status: 'ACTIVE',
          items: [],
        })
      ),
      update: vi.fn().mockResolvedValue({ id: 'cart_cust_1', status: 'CHECKED_OUT' }),
    },
    cartItem: {
      create: vi.fn().mockImplementation(({ data }) => {
        const item = {
          id: `ci_${Date.now()}`,
          ...data,
          product: mockProduct,
        };
        cartItems.push(item);
        return Promise.resolve(item);
      }),
      update: vi.fn().mockResolvedValue({ id: 'ci_1' }),
    },
    order: {
      create: vi.fn().mockImplementation(({ data }) => {
        const order = {
          id: `ord_${Date.now()}`,
          orderNumber: `ORD-2026-${Math.floor(Math.random() * 10000)}`,
          status: 'PENDING',
          paymentStatus: 'PENDING',
          subtotal: new PrismaDecimal(3499),
          total: new PrismaDecimal(3499),
          currency: 'INR',
          ...data,
        };
        ordersDb[order.id] = order;
        return Promise.resolve(order);
      }),
      findFirst: vi.fn().mockImplementation(({ where }) => {
        if (where.id && ordersDb[where.id]) return Promise.resolve(ordersDb[where.id]);
        return Promise.resolve(Object.values(ordersDb)[0] ?? null);
      }),
      update: vi.fn().mockImplementation(({ where, data }) => {
        const existing = ordersDb[where.id] ?? {};
        const updated = { ...existing, ...data };
        ordersDb[where.id] = updated;
        return Promise.resolve(updated);
      }),
    },
    inventory: {
      updateMany: vi.fn().mockResolvedValue({ count: 1 }),
    },
    payment: {
      findUnique: vi.fn().mockImplementation(({ where }) => {
        if (where.orderId) {
          const match = Object.values(paymentsDb).find((p: any) => p.orderId === where.orderId);
          return Promise.resolve(match ?? null);
        }
        if (where.id && paymentsDb[where.id]) return Promise.resolve(paymentsDb[where.id]);
        return Promise.resolve(null);
      }),
      findFirst: vi.fn().mockImplementation(({ where }) => {
        if (where.orderId) {
          const match = Object.values(paymentsDb).find((p: any) => p.orderId === where.orderId);
          return Promise.resolve(match ?? null);
        }
        return Promise.resolve(Object.values(paymentsDb)[0] ?? null);
      }),
      create: vi.fn().mockImplementation(({ data }) => {
        const payment = {
          id: `pay_${Date.now()}`,
          status: 'PENDING',
          ...data,
        };
        paymentsDb[payment.id] = payment;
        return Promise.resolve(payment);
      }),
      update: vi.fn().mockImplementation(({ where, data }) => {
        const existing = Object.values(paymentsDb)[0] ?? {};
        const updated = { ...existing, ...data };
        if (existing.id) paymentsDb[existing.id] = updated;
        return Promise.resolve(updated);
      }),
    },
    auditEvent: {
      create: vi.fn().mockResolvedValue({ id: 'audit_e2e_cust_1' }),
    },
    analyticsEvent: {
      create: vi.fn().mockResolvedValue({ id: 'analytics_e2e_cust_1' }),
    },
  };

  mockPrismaObj.$transaction = vi.fn().mockImplementation((arg) => {
    if (typeof arg === 'function') {
      return arg(mockPrismaObj);
    }
    return Promise.all(arg);
  });

  return {
    prisma: mockPrismaObj,
  };
});

import { catalogService } from '../src/services/catalog.service.js';
import { cartService } from '../src/services/cart.service.js';
import { orderService } from '../src/services/order.service.js';
import { paymentService } from '../src/services/payment/payment.service.js';

describe('Phase 7.11 — End-to-End Customer AI Commerce Journey', () => {
  beforeEach(() => {
    cartItems.length = 0;
    for (const k of Object.keys(ordersDb)) delete ordersDb[k];
    for (const k of Object.keys(paymentsDb)) delete paymentsDb[k];
  });

  it('completes the entire customer AI shopping, cart, order creation, and payment verification journey', async () => {
    // 1. AI Recommendation & Catalog Search
    const product = await catalogService.getProduct(mockStoreId, 'prod_headset_1');
    expect(product).toBeDefined();
    expect(product.name).toBe('Wireless Pro Headset');
    expect(Number(product.price)).toBe(3499);

    // 2. Add Recommended Product to Cart (Server Authoritative)
    const cart = await cartService.add(mockStoreId, mockCustomerId, {
      productId: product.id,
      quantity: 1,
    });
    expect(cart).toBeDefined();
    expect(cart.id).toBeDefined();

    // 3. Create Order from Cart (Server-Calculated Totals)
    const order = await orderService.create(mockStoreId, mockCustomerId, cart.id);

    expect(order).toBeDefined();
    expect(order.status).toBe('PENDING');
    expect(order.paymentStatus).toBe('PENDING');
    expect(Number(order.total)).toBeGreaterThan(0);

    // 4. Create Razorpay Payment Order
    const paymentOrder = await paymentService.createPaymentOrder(mockStoreId, {
      orderId: order.id,
      paymentMethod: 'UPI',
    });

    expect(paymentOrder).toBeDefined();
    expect(paymentOrder.razorpayOrderId).toBeDefined();
    expect(paymentOrder.currency).toBe('INR');

    // 5. Server Payment Verification (Mocked Razorpay Signature Verification)
    const verificationResult = await paymentService.verifyPayment(
      mockStoreId,
      mockCustomerId,
      paymentOrder.razorpayOrderId!,
      'pay_test_verified_123',
      'valid_test_signature_999'
    );

    expect(verificationResult.status).toBe('CAPTURED');
    expect(verificationResult.verified).toBe(true);

    // 6. Refresh Order and Confirm Paid State
    const finalOrder = await orderService.get(mockStoreId, order.id);
    expect(finalOrder.paymentStatus).toBe('CAPTURED');
    expect(finalOrder.status).toBe('CONFIRMED');
  });
});
