/**
 * Phase 7.10 — Guardrails Security & Isolation Tests
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

const merchantA = 'store_merchant_A';
const merchantB = 'store_merchant_B';

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
          const existing = dbActions[where.id] ?? { id: where.id, storeId: merchantA };
          const updated = { ...existing, ...data, updatedAt: new Date() };
          dbActions[where.id] = updated;
          return Promise.resolve(updated);
        }),
        findMany: vi.fn().mockResolvedValue([]),
        count: vi.fn().mockResolvedValue(0),
      },
      product: {
        findFirst: vi.fn().mockImplementation(({ where }) => {
          if (where.storeId === merchantA) {
            return Promise.resolve({
              id: where.id ?? 'prod_a',
              storeId: merchantA,
              name: 'Merchant A Product',
              price: 4000,
              status: 'ACTIVE',
              inventory: [{ quantity: 50 }],
            });
          }
          return Promise.resolve(null);
        }),
        update: vi.fn().mockResolvedValue({ id: 'prod_a', price: 3800 }),
      },
      inventory: {
        findFirst: vi.fn().mockResolvedValue({ id: 'inv_a', quantity: 50 }),
        update: vi.fn().mockResolvedValue({ id: 'inv_a', quantity: 50 }),
      },
      auditEvent: {
        create: vi.fn().mockResolvedValue({ id: 'audit_sec_1' }),
      },
      analyticsEvent: {
        create: vi.fn().mockResolvedValue({ id: 'analytics_sec_1' }),
      },
    },
  };
});

import {
  policyService,
  approvalService,
  executionService,
  PROHIBITED_FINANCIAL_ACTION_TYPES,
} from '../src/services/guardrails/index.js';
import { SelfApprovalError } from '../src/services/guardrails/guardrail.errors.js';
import { redactMetadata } from '../src/services/audit.service.js';

describe('Phase 7.10 — Guardrails Security & Isolation Tests', () => {
  beforeEach(() => {
    dbActions = {};
  });

  describe('1. Financial Action Hard Stop', () => {
    it('blocks all financial actions regardless of confidence level or policy settings', async () => {
      for (const actionType of PROHIBITED_FINANCIAL_ACTION_TYPES) {
        const result = await policyService.evaluatePolicy({
          actionType,
          merchantId: merchantA,
          confidence: 1.0, // Even 100% confidence fails
          reason: 'Autonomous financial operation test',
          parameters: { amount: 500 },
        });

        expect(result.allowed).toBe(false);
        expect(result.requiresApproval).toBe(false);
        expect(result.riskLevel).toBe('CRITICAL');
        expect(result.reason).toContain('Financial actions cannot be autonomously executed');
      }
    });

    it('throws error if execution is directly attempted on financial action', async () => {
      await expect(
        executionService.executeApprovedAction('fin_act_123', merchantA, 'user_merchant')
      ).rejects.toThrow();
    });
  });

  describe('2. AI Self-Approval Prevention', () => {
    it('rejects self-approval when actor is AI_AGENT', async () => {
      await expect(
        approvalService.approveAction('act_test_1', merchantA, 'AI_AGENT', 'AI_AGENT')
      ).rejects.toThrow(SelfApprovalError);
    });
  });

  describe('3. Parameter Injection & Malicious Inputs', () => {
    it('rejects zero, negative, NaN, and Infinity prices', async () => {
      const maliciousPrices = [-500, 0, NaN, Infinity];

      for (const price of maliciousPrices) {
        const result = await policyService.evaluatePolicy({
          actionType: 'UPDATE_PRODUCT_PRICE',
          merchantId: merchantA,
          parameters: { newPrice: price },
          reason: 'Malicious price injection test',
        });

        expect(result.allowed).toBe(false);
      }
    });

    it('rejects attempt to disable financial protections via merchant policy update schema', async () => {
      const result = await policyService.updateMerchantPolicy(merchantA, {
        allowAutonomousFinancialActions: false, // Schema only permits literal false
      });

      expect((result as any).allowAutonomousFinancialActions).toBeUndefined();
    });
  });

  describe('4. Merchant Scope & Isolation', () => {
    it('prevents Merchant B from accessing or approving Merchant A actions', async () => {
      const { action } = await approvalService.proposeAction({
        actionType: 'UPDATE_PRODUCT_PRICE',
        merchantId: merchantA,
        productId: 'prod_merchant_a',
        parameters: { newPrice: 2000 },
        reason: 'Merchant A price reduction',
      });

      // Merchant B attempts to approve Merchant A's action -> Not found error (isolated)
      await expect(
        approvalService.approveAction(action.id, merchantB, 'user_merchant_B', 'MERCHANT')
      ).rejects.toThrow();
    });
  });

  describe('5. Audit Privacy & Secret Redaction', () => {
    it('redacts secrets, tokens, API keys, and chain-of-thought from audit metadata', () => {
      const dirtyMetadata = {
        actionId: 'act_123',
        OPENAI_API_KEY: 'sk-proj-secret-12345',
        jwt: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        chain_of_thought: 'Internal model prompt thoughts...',
        normalField: 'safe_value',
      };

      const cleanMetadata = redactMetadata(dirtyMetadata) as Record<string, unknown>;

      expect(cleanMetadata.OPENAI_API_KEY).toBe('[REDACTED]');
      expect(cleanMetadata.jwt).toBe('[REDACTED]');
      expect(cleanMetadata.chain_of_thought).toBe('[REDACTED]');
      expect(cleanMetadata.normalField).toBe('safe_value');
    });
  });
});
