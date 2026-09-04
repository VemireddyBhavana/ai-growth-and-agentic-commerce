import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import { prisma } from '../src/config/prisma.config.js';
import { createApp } from '../src/app.js';

// Opt-in: runs only against an explicitly provisioned disposable PostgreSQL database.
const runDb = process.env.RUN_DB_INTEGRATION_TESTS === 'true';
const suite = runDb ? describe : describe.skip;
const app = createApp();
const createdStoreIds: string[] = [];
let merchantA: { userId: string; storeId: string; token: string };
let merchantB: { userId: string; storeId: string; token: string };
let productId = '';
let customerId = '';

function token(userId: string, merchantId: string): string {
  return jwt.sign({ userId, merchantId, email: `${userId}@test.local`, role: 'MERCHANT' }, process.env.JWT_SECRET!, { expiresIn: '1h' });
}

suite('Phase 7.3 catalog API — PostgreSQL integration', () => {
  beforeAll(async () => {
    const suffix = Date.now().toString(36);
    for (const label of ['a', 'b']) {
      const user = await prisma.user.create({ data: { email: `catalog-${label}-${suffix}@test.local`, role: 'MERCHANT' } });
      const store = await prisma.store.create({ data: { name: `Catalog Test ${label}`, slug: `catalog-test-${label}-${suffix}`, ownerId: user.id } });
      createdStoreIds.push(store.id);
      const identity = { userId: user.id, storeId: store.id, token: token(user.id, store.id) };
      if (label === 'a') merchantA = identity; else merchantB = identity;
    }
    const customer = await prisma.customer.create({ data: { storeId: merchantA.storeId, name: 'Test Customer', email: `customer-${suffix}@test.local`, tags: [] } });
    customerId = customer.id;
  });

  afterAll(async () => {
    await prisma.store.deleteMany({ where: { id: { in: createdStoreIds } } });
    await prisma.user.deleteMany({ where: { email: { contains: '@test.local' } } });
    await prisma.$disconnect();
  });

  it('creates, lists, filters, details, variants, and inventory through PostgreSQL', async () => {
    const auth = { Authorization: `Bearer ${merchantA.token}` };
    const category = await request(app).post('/api/v1/categories').set(auth).send({ name: 'Test Audio', slug: `test-audio-${Date.now()}` }).expect(201);
    const created = await request(app).post('/api/v1/products').set(auth).send({ name: 'Integration Headphones', sku: `INT-${Date.now()}`, price: 1999, currency: 'INR', description: 'Database-backed integration test product', brand: 'Test Brand', categoryId: category.body.data.id, inventory: { quantity: 7, lowStockThreshold: 2 } }).expect(201);
    productId = created.body.data.id;
    expect(created.body.data.inventory[0].quantity).toBe(7);
    await request(app).post(`/api/v1/products/${productId}/variants`).set(auth).send({ sku: `VAR-${Date.now()}`, name: 'Black', price: 2099, attributes: { color: 'black' } }).expect(201);
    const list = await request(app).get('/api/v1/products').set(auth).query({ search: 'headphones', brand: 'Test Brand', page: 1, limit: 20 }).expect(200);
    expect(list.body.data.products.map((p: { id: string }) => p.id)).toContain(productId);
    const detail = await request(app).get(`/api/v1/products/${productId}`).set(auth).expect(200);
    expect(detail.body.data.variants).toHaveLength(1);
    await request(app).patch(`/api/v1/products/${productId}/inventory`).set(auth).send({ quantity: 3 }).expect(200);
    const inventory = await request(app).get(`/api/v1/products/${productId}/inventory`).set(auth).expect(200);
    expect(inventory.body.data[0].quantity).toBe(3);
  });

  it('enforces merchant isolation for products and customers', async () => {
    const authB = { Authorization: `Bearer ${merchantB.token}` };
    await request(app).get(`/api/v1/products/${productId}`).set(authB).expect(404);
    await request(app).patch(`/api/v1/products/${productId}`).set(authB).send({ name: 'Unauthorized update' }).expect(404);
    await request(app).get(`/api/v1/customers/${customerId}`).set(authB).expect(404);
    await request(app).get('/api/v1/products').expect(401);
  });
});
