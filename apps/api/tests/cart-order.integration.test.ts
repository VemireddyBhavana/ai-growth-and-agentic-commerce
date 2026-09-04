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
let productId = '';
let variantId = '';
let inactiveProductId = '';
let cartId = '';
let orderId = '';

function token(userId: string, merchantId: string): string {
  return jwt.sign(
    { userId, merchantId, email: `${userId}@cart-test.local`, role: 'MERCHANT' },
    process.env.JWT_SECRET!,
    { expiresIn: '1h' }
  );
}

suite('Phase 7.5 cart & order API — PostgreSQL integration', () => {
  beforeAll(async () => {
    const suffix = Date.now().toString(36);
    for (const label of ['a', 'b'] as const) {
      const user = await prisma.user.create({
        data: { email: `cart-order-${label}-${suffix}@cart-test.local`, role: 'MERCHANT' },
      });
      const store = await prisma.store.create({
        data: {
          name: `Cart Order Test ${label}`,
          slug: `cart-order-test-${label}-${suffix}`,
          ownerId: user.id,
        },
      });
      createdStoreIds.push(store.id);
      const identity = { userId: user.id, storeId: store.id, token: token(user.id, store.id) };
      if (label === 'a') merchantA = identity;
      else merchantB = identity;
    }

    const auth = { Authorization: `Bearer ${merchantA.token}` };
    const category = await request(app)
      .post('/api/v1/categories')
      .set(auth)
      .send({ name: 'Cart Test Cat', slug: `cart-cat-${suffix}` })
      .expect(201);

    const product = await request(app)
      .post('/api/v1/products')
      .set(auth)
      .send({
        name: 'Cart Test Headphones',
        sku: `CART-${suffix}`,
        price: 1999,
        currency: 'INR',
        description: 'Integration test product',
        categoryId: category.body.data.id,
        inventory: { quantity: 10, lowStockThreshold: 2 },
      })
      .expect(201);
    productId = product.body.data.id;

    const variant = await request(app)
      .post(`/api/v1/products/${productId}/variants`)
      .set(auth)
      .send({ sku: `CART-VAR-${suffix}`, name: 'Black', price: 2099, attributes: { color: 'black' } })
      .expect(201);
    variantId = variant.body.data.id;

    const inactive = await request(app)
      .post('/api/v1/products')
      .set(auth)
      .send({
        name: 'Inactive Product',
        sku: `INACT-${suffix}`,
        price: 999,
        currency: 'INR',
        description: 'Inactive',
        categoryId: category.body.data.id,
        inventory: { quantity: 5, lowStockThreshold: 1 },
      })
      .expect(201);
    inactiveProductId = inactive.body.data.id;
    await prisma.product.update({
      where: { id: inactiveProductId },
      data: { status: 'INACTIVE', isActive: false },
    });
  });

  afterAll(async () => {
    await prisma.store.deleteMany({ where: { id: { in: createdStoreIds } } });
    await prisma.user.deleteMany({ where: { email: { contains: '@cart-test.local' } } });
    await prisma.$disconnect();
  });

  it('rejects unauthenticated cart access', async () => {
    await request(app).get('/api/v1/cart').expect(401);
    await request(app).post('/api/v1/cart/items').send({ productId, quantity: 1 }).expect(401);
  });

  it('rejects client price manipulation on cart add', async () => {
    const auth = { Authorization: `Bearer ${merchantA.token}` };
    await request(app)
      .post('/api/v1/cart/items')
      .set(auth)
      .send({ productId, variantId, quantity: 1, unitPrice: 1 })
      .expect(422);
  });

  it('rejects nonexistent product', async () => {
    const auth = { Authorization: `Bearer ${merchantA.token}` };
    const res = await request(app)
      .post('/api/v1/cart/items')
      .set(auth)
      .send({ productId: 'clxyz1234567890123456789012', quantity: 1 })
      .expect(404);
    expect(res.body.error?.code ?? res.body.code).toBe('PRODUCT_NOT_FOUND');
  });

  it('rejects inactive product', async () => {
    const auth = { Authorization: `Bearer ${merchantA.token}` };
    const res = await request(app)
      .post('/api/v1/cart/items')
      .set(auth)
      .send({ productId: inactiveProductId, quantity: 1 })
      .expect(409);
    expect(res.body.error?.code ?? res.body.code).toBe('PRODUCT_INACTIVE');
  });

  it('rejects invalid variant', async () => {
    const auth = { Authorization: `Bearer ${merchantA.token}` };
    const res = await request(app)
      .post('/api/v1/cart/items')
      .set(auth)
      .send({ productId, variantId: 'clxyz1234567890123456789012', quantity: 1 })
      .expect(422);
    expect(res.body.error?.code ?? res.body.code).toBe('INVALID_VARIANT');
  });

  it('rejects variant-required product without variant', async () => {
    const auth = { Authorization: `Bearer ${merchantA.token}` };
    const res = await request(app)
      .post('/api/v1/cart/items')
      .set(auth)
      .send({ productId, quantity: 1 })
      .expect(422);
    expect(res.body.error?.code ?? res.body.code).toBe('VARIANT_REQUIRED');
  });

  it('adds valid product with server-side price', async () => {
    const auth = { Authorization: `Bearer ${merchantA.token}` };
    const res = await request(app)
      .post('/api/v1/cart/items')
      .set(auth)
      .send({ productId, variantId, quantity: 2 })
      .expect(201);
    cartId = res.body.data.id;
    expect(res.body.data.items).toHaveLength(1);
    expect(res.body.data.items[0].unitPrice).toBe(2099);
    expect(res.body.data.subtotal).toBe(4198);
    expect(res.body.data.itemCount).toBe(2);
  });

  it('rejects insufficient inventory', async () => {
    const auth = { Authorization: `Bearer ${merchantA.token}` };
    const res = await request(app)
      .post('/api/v1/cart/items')
      .set(auth)
      .send({ productId, variantId, quantity: 99 })
      .expect(409);
    expect(res.body.error?.code ?? res.body.code).toBe('INSUFFICIENT_INVENTORY');
  });

  it('updates cart item quantity with server-side price refresh', async () => {
    const auth = { Authorization: `Bearer ${merchantA.token}` };
    const cart = await request(app).get('/api/v1/cart').set(auth).expect(200);
    const itemId = cart.body.data.items[0].id;
    const updated = await request(app)
      .patch(`/api/v1/cart/items/${itemId}`)
      .set(auth)
      .send({ quantity: 3 })
      .expect(200);
    expect(updated.body.data.items[0].quantity).toBe(3);
    expect(updated.body.data.subtotal).toBe(6297);
  });

  it('enforces merchant isolation on cart', async () => {
    const authB = { Authorization: `Bearer ${merchantB.token}` };
    const cartB = await request(app).get('/api/v1/cart').set(authB).expect(200);
    expect(cartB.body.data.id).not.toBe(cartId);
    expect(cartB.body.data.items).toHaveLength(0);
  });

  it('creates validated pending order with price snapshots and inventory reservation', async () => {
    const auth = { Authorization: `Bearer ${merchantA.token}` };
    const invBefore = await prisma.inventory.findFirst({
      where: { variantId },
    });
    expect(invBefore).toBeTruthy();

    const res = await request(app)
      .post('/api/v1/orders')
      .set(auth)
      .send({ cartId, total: 1, subtotal: 1 })
      .expect(422);

    expect(res.body.error?.code ?? res.body.code).toBeDefined();

    const orderRes = await request(app)
      .post('/api/v1/orders')
      .set(auth)
      .send({ cartId })
      .expect(201);
    orderId = orderRes.body.data.id;

    expect(orderRes.body.data.status).toBe('PENDING');
    expect(orderRes.body.data.paymentStatus).toBe('PENDING');
    expect(Number(orderRes.body.data.subtotal)).toBe(6297);
    expect(orderRes.body.data.items[0].productName).toBe('Cart Test Headphones');
    expect(Number(orderRes.body.data.items[0].unitPrice)).toBe(2099);

    const invAfter = await prisma.inventory.findFirst({ where: { variantId } });
    expect(invAfter!.quantity).toBe(invBefore!.quantity - 3);
    expect(invAfter!.reservedQuantity).toBe(invBefore!.reservedQuantity + 3);

    const cartAfter = await prisma.shoppingCart.findUnique({ where: { id: cartId } });
    expect(cartAfter?.status).toBe('CHECKED_OUT');
  });

  it('rejects empty cart order creation', async () => {
    const auth = { Authorization: `Bearer ${merchantA.token}` };
    const emptyCart = await request(app)
      .post('/api/v1/cart/items')
      .set(auth)
      .send({ productId, variantId, quantity: 1 })
      .expect(201);
    await request(app).delete('/api/v1/cart').set(auth).expect(200);
    const res = await request(app)
      .post('/api/v1/orders')
      .set(auth)
      .send({ cartId: emptyCart.body.data.id })
      .expect(409);
    expect(res.body.error?.code ?? res.body.code).toBe('CART_EMPTY');
  });

  it('lists and details orders with merchant isolation', async () => {
    const authA = { Authorization: `Bearer ${merchantA.token}` };
    const authB = { Authorization: `Bearer ${merchantB.token}` };

    const list = await request(app).get('/api/v1/orders').set(authA).expect(200);
    expect(list.body.data.orders.map((o: { id: string }) => o.id)).toContain(orderId);

    const detail = await request(app).get(`/api/v1/orders/${orderId}`).set(authA).expect(200);
    expect(detail.body.data.id).toBe(orderId);

    await request(app).get(`/api/v1/orders/${orderId}`).set(authB).expect(404);
  });

  it('records audit and analytics events for cart and order flows', async () => {
    const audit = await prisma.auditEvent.findMany({
      where: { storeId: merchantA.storeId, orderId },
      orderBy: { createdAt: 'desc' },
    });
    expect(audit.some((e) => e.eventType === 'ORDER_CREATED')).toBe(true);

    const analytics = await prisma.analyticsEvent.findMany({
      where: { storeId: merchantA.storeId, orderId },
    });
    expect(analytics.some((e) => e.eventType === 'ORDER_CREATED')).toBe(true);
  });

  it('rolls back order when inventory race occurs', async () => {
    const auth = { Authorization: `Bearer ${merchantA.token}` };
    const add = await request(app)
      .post('/api/v1/cart/items')
      .set(auth)
      .send({ productId, variantId, quantity: 1 })
      .expect(201);
    const raceCartId = add.body.data.id;

    const inv = await prisma.inventory.findFirst({ where: { variantId } });
    await prisma.inventory.update({
      where: { id: inv!.id },
      data: { quantity: 0, reservedQuantity: inv!.reservedQuantity },
    });

    const res = await request(app)
      .post('/api/v1/orders')
      .set(auth)
      .send({ cartId: raceCartId })
      .expect(409);
    expect(res.body.error?.code ?? res.body.code).toBe('INSUFFICIENT_INVENTORY');

    const ordersAfter = await prisma.order.count({
      where: { storeId: merchantA.storeId, items: { some: { productId } } },
    });
    const cartStillActive = await prisma.shoppingCart.findUnique({ where: { id: raceCartId } });
    expect(cartStillActive?.status).toBe('ACTIVE');
    expect(ordersAfter).toBeGreaterThan(0);
  });

  it('removes cart item', async () => {
    const auth = { Authorization: `Bearer ${merchantA.token}` };
    const add = await request(app)
      .post('/api/v1/cart/items')
      .set(auth)
      .send({ productId, variantId, quantity: 1 })
      .expect(201);
    const itemId = add.body.data.items[0].id;
    const removed = await request(app)
      .delete(`/api/v1/cart/items/${itemId}`)
      .set(auth)
      .expect(200);
    expect(removed.body.data.items).toHaveLength(0);
  });
});
