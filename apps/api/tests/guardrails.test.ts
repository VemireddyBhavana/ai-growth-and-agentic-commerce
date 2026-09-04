/**
 * Phase 7.10 — Agent Guardrails & Bounded Action Execution Unit Tests
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

// ─── Mock Prisma Client ──────────────────────────────────────────────────────

const mockStoreId = 'store_test_guardrails_1';

const mockProductData = {
  id: 'prod_test',
  storeId: mockStoreId,
  name: 'Test Product',
  price: 4000,
  stock: 50,
  status: 'ACTIVE',
  inventory: [{ quantity: 50 }],
};

let currentDbProduct = { ...mockProductData };
let dbActions: Record<string, any> = {};

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
          if (where.storeId === mockStoreId) {
            return Promise.resolve({
              id: where.id ?? 'act_default',
              storeId: mockStoreId,
              actionType: 'UPDATE_PRODUCT_PRICE',
              targetProductId: 'prod_test',
              status: 'APPROVED',
              riskLevel: 'HIGH',
              requiresApproval: true,
              reason: 'Optimize pricing',
              parameters: { newPrice: 3800 },
              confidence: 0.85,
              expiresAt: new Date(Date.now() + 86400000),
              expectedState: { price: 4000 },
            });
          }
          return Promise.resolve(null);
        }),
        create: vi.fn().mockImplementation(({ data }) => {
          const action = {
            id: `act_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
            ...data,
            createdAt: new Date(),
            updatedAt: new Date(),
          };
          dbActions[action.id] = action;
          return Promise.resolve(action);
        }),
        update: vi.fn().mockImplementation(({ where, data }) => {
          const existing = dbActions[where.id] ?? { id: where.id, storeId: mockStoreId };
          const updated = { ...existing, ...data, updatedAt: new Date() };
          dbActions[where.id] = updated;
          return Promise.resolve(updated);
        }),
        findMany: vi.fn().mockResolvedValue([]),
        count: vi.fn().mockResolvedValue(0),
      },
      product: {
        findFirst: vi.fn().mockImplementation(({ where }) => {
          if (where.storeId && where.storeId !== currentDbProduct.storeId) return Promise.resolve(null);
          return Promise.resolve(currentDbProduct);
        }),
        update: vi.fn().mockImplementation(({ data }) => {
          if (data.price !== undefined) currentDbProduct.price = data.price;
          if (data.status !== undefined) currentDbProduct.status = data.status;
          return Promise.resolve(currentDbProduct);
        }),
      },
      inventory: {
        findFirst: vi.fn().mockResolvedValue({ id: 'inv_1', quantity: 50, reservedQuantity: 0 }),
        create: vi.fn().mockResolvedValue({ id: 'inv_1', quantity: 50 }),
        update: vi.fn().mockImplementation(({ data }) => {
          if (data.quantity !== undefined) currentDbProduct.inventory[0].quantity = data.quantity;
          return Promise.resolve(currentDbProduct.inventory[0]);
        }),
      },
      auditEvent: {
        create: vi.fn().mockResolvedValue({ id: 'audit_123' }),
      },
      analyticsEvent: {
        create: vi.fn().mockResolvedValue({ id: 'analytics_123' }),
      },
    },
  };
});

import {
  riskService,
  policyService,
  approvalService,
  executionService,
  validateActionParameters,
  DEFAULT_POLICY_LIMITS,
  PROHIBITED_FINANCIAL_ACTION_TYPES,
  RECOMMENDATION_ONLY_ACTION_TYPES,
} from '../src/services/guardrails/index.js';
import {
  ActionExpiredError,
  FinancialActionProhibitedError,
  PolicyViolationError,
  SelfApprovalError,
} from '../src/services/guardrails/guardrail.errors.js';

describe('Phase 7.10 — Agent Guardrails & Bounded Action Execution Unit Tests', () => {
  beforeEach(() => {
    dbActions = {};
    currentDbProduct = { ...mockProductData };
  });

  // ─── 1. Action Taxonomy & Financial Action Boundaries ────────────────────

  describe('Taxonomy & Boundary Rules', () => {
    it('classifies financial actions as strictly PROHIBITED', () => {
      PROHIBITED_FINANCIAL_ACTION_TYPES.forEach((actionType) => {
        expect(riskService.classifyRisk(actionType)).toBe('CRITICAL');
      });
    });

    it('rejects autonomous financial actions during policy evaluation', async () => {
      for (const actionType of PROHIBITED_FINANCIAL_ACTION_TYPES) {
        const result = await policyService.evaluatePolicy({
          actionType,
          merchantId: mockStoreId,
          reason: 'Test autonomous financial attempt',
        });

        expect(result.allowed).toBe(false);
        expect(result.requiresApproval).toBe(false);
        expect(result.riskLevel).toBe('CRITICAL');
        expect(result.reason).toContain('Financial actions cannot be autonomously executed');
      }
    });

    it('identifies recommendation-only actions correctly', async () => {
      for (const actionType of RECOMMENDATION_ONLY_ACTION_TYPES) {
        const result = await policyService.evaluatePolicy({
          actionType,
          merchantId: mockStoreId,
          reason: 'Test recommendation action',
        });

        expect(result.allowed).toBe(true);
        expect(result.requiresApproval).toBe(false);
        expect(result.riskLevel).toBe('LOW');
      }
    });
  });

  // ─── 2. Parameter Schema & Range Validation ──────────────────────────────

  describe('Parameter Validation & Manipulation Protection', () => {
    it('validates UPDATE_PRODUCT_PRICE parameters correctly', () => {
      expect(validateActionParameters('UPDATE_PRODUCT_PRICE', { newPrice: 3800 })).toEqual({
        newPrice: 3800,
        currency: 'INR',
      });
    });

    it('throws error for negative, zero, NaN, or Infinity prices', () => {
      expect(() => validateActionParameters('UPDATE_PRODUCT_PRICE', { newPrice: -100 })).toThrow();
      expect(() => validateActionParameters('UPDATE_PRODUCT_PRICE', { newPrice: 0 })).toThrow();
      expect(() => validateActionParameters('UPDATE_PRODUCT_PRICE', { newPrice: NaN })).toThrow();
      expect(() => validateActionParameters('UPDATE_PRODUCT_PRICE', { newPrice: Infinity })).toThrow();
    });

    it('throws error for prices with > 2 decimal places', () => {
      expect(() => validateActionParameters('UPDATE_PRODUCT_PRICE', { newPrice: 3800.123 })).toThrow();
    });

    it('validates UPDATE_INVENTORY parameters correctly', () => {
      expect(validateActionParameters('UPDATE_INVENTORY', { quantity: 150 })).toEqual({
        quantity: 150,
      });

      expect(() => validateActionParameters('UPDATE_INVENTORY', { quantity: -5 })).toThrow();
    });
  });

  // ─── 3. Deterministic Risk Classification ──────────────────────────────────

  describe('Deterministic Risk Classification', () => {
    it('classifies price changes correctly', () => {
      expect(
        riskService.classifyRisk('UPDATE_PRODUCT_PRICE', { newPrice: 3800 }, { price: 4000 })
      ).toBe('HIGH');

      // Price change > 30% -> CRITICAL
      expect(
        riskService.classifyRisk('UPDATE_PRODUCT_PRICE', { newPrice: 1000 }, { price: 4000 })
      ).toBe('CRITICAL');
    });

    it('classifies metadata and inventory changes correctly', () => {
      expect(riskService.classifyRisk('UPDATE_PRODUCT_METADATA')).toBe('MEDIUM');
      expect(riskService.classifyRisk('UPDATE_PRODUCT_STATUS')).toBe('MEDIUM');
      expect(
        riskService.classifyRisk('UPDATE_INVENTORY', { quantity: 50 }, { inventory: 40 })
      ).toBe('MEDIUM');
      expect(
        riskService.classifyRisk('UPDATE_INVENTORY', { quantity: 200 }, { inventory: 40 })
      ).toBe('HIGH');
    });
  });

  // ─── 4. Merchant Policy & Price/Inventory Guardrails ──────────────────────

  describe('Policy Evaluation & Safe Defaults', () => {
    it('fails closed with DEFAULT_POLICY_LIMITS when policy is missing', async () => {
      const policy = await policyService.getMerchantPolicy('non_existent_store');
      expect(policy).toEqual(DEFAULT_POLICY_LIMITS);
      expect(policy.autonomousActionsEnabled).toBe(false);
    });

    it('rejects price changes exceeding maxPriceChangePercent limit', async () => {
      // 4000 -> 3000 = 25% drop (exceeds default 10% limit)
      const result = await policyService.evaluatePolicy({
        actionType: 'UPDATE_PRODUCT_PRICE',
        merchantId: mockStoreId,
        productId: 'prod_test',
        parameters: { newPrice: 3000 },
        reason: 'Large price drop proposal',
      });

      expect(result.requiresApproval).toBe(true);
      expect(result.violations?.some(v => v.includes('exceeds policy limit'))).toBe(true);
    });
  });

  // ─── 5. Non-Self-Approval & Expiration Rules ─────────────────────────────

  describe('Approval Lifecycle & Non-Self-Approval', () => {
    it('prevents AI Agent from approving its own action proposal', async () => {
      await expect(
        approvalService.approveAction('act_123', mockStoreId, 'AI_AGENT', 'AI_AGENT')
      ).rejects.toThrow(SelfApprovalError);
    });

    it('allows human merchant to approve action proposal', async () => {
      const { action } = await approvalService.proposeAction({
        actionType: 'UPDATE_PRODUCT_PRICE',
        merchantId: mockStoreId,
        productId: 'prod_test',
        parameters: { newPrice: 3800 },
        reason: 'Optimize price for conversion',
      });

      const approved = await approvalService.approveAction(
        action.id,
        mockStoreId,
        'user_merchant_1',
        'MERCHANT'
      );

      expect(approved.status).toBe('APPROVED');
      expect(approved.approvedBy).toBe('user_merchant_1');
    });
  });

  // ─── 6. Action Execution, Staleness & Post-Verification ──────────────────

  describe('Execution & Safety Re-Validation', () => {
    it('prevents execution of non-approved actions', async () => {
      const { action } = await approvalService.proposeAction({
        actionType: 'UPDATE_PRODUCT_PRICE',
        merchantId: mockStoreId,
        productId: 'prod_test',
        parameters: { newPrice: 3800 },
        reason: 'Optimize price',
      });

      // Action created with PENDING_APPROVAL status
      await expect(
        executionService.executeApprovedAction(action.id, mockStoreId, 'user_merchant_1')
      ).rejects.toThrow();
    });

    it('executes approved action and performs post-execution verification', async () => {
      const { action } = await approvalService.proposeAction({
        actionType: 'UPDATE_PRODUCT_PRICE',
        merchantId: mockStoreId,
        productId: 'prod_test',
        parameters: { newPrice: 3800 },
        reason: 'Optimize price',
      });

      const approved = await approvalService.approveAction(
        action.id,
        mockStoreId,
        'user_merchant_1',
        'MERCHANT'
      );

      const result = await executionService.executeApprovedAction(
        approved.id,
        mockStoreId,
        'user_merchant_1'
      );

      expect(result.status).toBe('EXECUTED');
      expect(result.actionId).toBe(approved.id);
      expect(result.actionType).toBe('UPDATE_PRODUCT_PRICE');
      expect(result.explanation).toContain('price');
    });
  });
});
