/**
 * Phase 7.11 — End-to-End Merchant AI Growth & Bounded Guardrails Integration Test
 *
 * Journey:
 * Merchant Dashboard Analytics → Growth Signals → Growth Agent Analysis →
 * Action Proposal → Guardrail Policy Evaluation → Human Merchant Approval →
 * Bounded Execution → Post-Execution Verification → Append-Only Audit Timeline
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

const merchantId = 'store_e2e_merchant_1';
const userId = 'usr_merchant_owner';

let dbActions: Record<string, any> = {};
let productDb = {
  id: 'prod_merchant_headset',
  storeId: merchantId,
  name: 'Wireless Pro Headset',
  price: 4000,
  stock: 30,
  status: 'ACTIVE',
  inventory: [{ quantity: 30 }],
};

vi.mock('../src/config/prisma.config.js', () => {
  return {
    prisma: {
      merchantPolicy: {
        findUnique: vi.fn().mockResolvedValue(null),
        upsert: vi.fn().mockImplementation(({ create, update }) => Promise.resolve(create ?? update)),
      },
      agentAction: {
        findFirst: vi.fn().mockImplementation(({ where }) => {
          if (where.id && dbActions[where.id]) {
            const act = dbActions[where.id];
            if (where.storeId && act.storeId !== where.storeId) return Promise.resolve(null);
            return Promise.resolve(act);
          }
          return Promise.resolve(null);
        }),
        create: vi.fn().mockImplementation(({ data }) => {
          const action = {
            id: `act_e2e_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
            ...data,
            createdAt: new Date(),
            updatedAt: new Date(),
          };
          dbActions[action.id] = action;
          return Promise.resolve(action);
        }),
        update: vi.fn().mockImplementation(({ where, data }) => {
          const existing = dbActions[where.id] ?? { id: where.id, storeId: merchantId };
          const updated = { ...existing, ...data, updatedAt: new Date() };
          dbActions[where.id] = updated;
          return Promise.resolve(updated);
        }),
        findMany: vi.fn().mockResolvedValue([]),
        count: vi.fn().mockResolvedValue(0),
      },
      product: {
        findFirst: vi.fn().mockImplementation(({ where }) => {
          if (where.storeId && where.storeId !== productDb.storeId) return Promise.resolve(null);
          return Promise.resolve(productDb);
        }),
        update: vi.fn().mockImplementation(({ data }) => {
          if (data.price !== undefined) productDb.price = data.price;
          if (data.status !== undefined) productDb.status = data.status;
          return Promise.resolve(productDb);
        }),
      },
      inventory: {
        findFirst: vi.fn().mockResolvedValue({ id: 'inv_m_1', quantity: 30 }),
        update: vi.fn().mockResolvedValue({ id: 'inv_m_1', quantity: 30 }),
      },
      auditEvent: {
        create: vi.fn().mockResolvedValue({ id: 'audit_e2e_m_1' }),
      },
      analyticsEvent: {
        create: vi.fn().mockResolvedValue({ id: 'analytics_e2e_m_1' }),
      },
    },
  };
});

import {
  policyService,
  approvalService,
  executionService,
  riskService,
} from '../src/services/guardrails/index.js';
import { catalogService } from '../src/services/catalog.service.js';

describe('Phase 7.11 — End-to-End Merchant AI Growth & Guardrails Journey', () => {
  beforeEach(() => {
    dbActions = {};
    productDb = {
      id: 'prod_merchant_headset',
      storeId: merchantId,
      name: 'Wireless Pro Headset',
      price: 4000,
      stock: 30,
      status: 'ACTIVE',
      inventory: [{ quantity: 30 }],
    };
  });

  it('completes full merchant growth analysis, action proposal, policy evaluation, merchant approval, and bounded execution', async () => {
    // 1. Merchant catalog product setup
    const product = await catalogService.getProduct(merchantId, 'prod_merchant_headset');
    expect(product.price).toBe(4000);

    // 2. Growth Agent proposes action based on analytics signals
    const proposalInput = {
      actionType: 'UPDATE_PRODUCT_PRICE' as const,
      merchantId,
      productId: product.id,
      reason: 'Product receives high AI recommendations but underconverts; 5% price drop proposed.',
      evidence: [
        { signal: 'HIGH_AI_RECOMMENDATION_LOW_CONVERSION', value: 143, description: '143 AI recommendations' },
      ],
      parameters: { newPrice: 3800 },
      confidence: 0.91,
      proposedBy: 'AI_AGENT' as const,
    };

    // 3. Action Proposal & Policy Evaluation
    const { action, policyResult } = await approvalService.proposeAction(proposalInput);

    expect(policyResult.allowed).toBe(true);
    expect(policyResult.requiresApproval).toBe(true);
    expect(policyResult.riskLevel).toBe('HIGH');
    expect(action.status).toBe('PENDING_APPROVAL');

    // 4. Deterministic Preview for Merchant UI
    const preview = await approvalService.getActionPreview(action.id, merchantId);
    expect(preview.actionType).toBe('UPDATE_PRODUCT_PRICE');
    expect(preview.currentValue).toBe(4000);
    expect(preview.proposedValue).toBe(3800);
    expect(preview.requiresApproval).toBe(true);
    expect(preview.executionSupported).toBe(true);

    // 5. Merchant Authorization (Human Approval)
    const approvedAction = await approvalService.approveAction(
      action.id,
      merchantId,
      userId,
      'MERCHANT'
    );
    expect(approvedAction.status).toBe('APPROVED');
    expect(approvedAction.approvedBy).toBe(userId);

    // 6. Bounded Execution Service
    const executionResult = await executionService.executeApprovedAction(
      approvedAction.id,
      merchantId,
      userId
    );

    expect(executionResult.status).toBe('EXECUTED');
    expect(executionResult.before.price).toBe(4000);
    expect(executionResult.after.price).toBe(3800);

    // 7. Post-Execution Database State Verification
    const updatedProduct = await catalogService.getProduct(merchantId, 'prod_merchant_headset');
    expect(updatedProduct.price).toBe(3800);
  });
});
