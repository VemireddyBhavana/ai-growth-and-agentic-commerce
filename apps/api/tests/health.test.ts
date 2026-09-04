import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app.js';

describe('Health Check API Endpoints', () => {
  const app = createApp();

  it('GET /health/ping returns pong message', async () => {
    const response = await request(app).get('/health/ping');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('success', true);
    expect(response.body.data).toEqual({ ping: 'pong' });
  });

  it('GET /api/v1/health returns health status structure', async () => {
    const response = await request(app).get('/api/v1/health');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('success', true);
    expect(response.body.data).toHaveProperty('status');
    expect(response.body.data).toHaveProperty('version');
    expect(response.body.data).toHaveProperty('services');
  });

  it('GET /non-existent-route returns structured 404', async () => {
    const response = await request(app).get('/non-existent-route');

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('success', false);
    expect(response.body.error).toHaveProperty('code', 'NOT_FOUND');
  });
});
