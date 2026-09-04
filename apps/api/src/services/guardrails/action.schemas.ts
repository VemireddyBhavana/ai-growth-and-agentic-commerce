/**
 * Phase 7.10 — Action Parameter & Policy Zod Schemas
 *
 * Strict validation preventing parameter injection, invalid prices (NaN, negative, zero, Infinity),
 * missing fields, or unauthorized policy mutations.
 */

import { z } from 'zod';
import { ACTION_TYPES } from './action.types.js';

// ─── Individual Parameter Schemas ────────────────────────────────────────────

export const updateProductPriceParamSchema = z
  .object({
    newPrice: z
      .number({ required_error: 'newPrice must be a number' })
      .positive('newPrice must be greater than zero')
      .finite('newPrice must be a finite number')
      .refine((val) => !isNaN(val), 'newPrice cannot be NaN')
      .refine((val) => Number.isFinite(val), 'newPrice cannot be Infinity')
      .refine(
        (val) => Number(val.toFixed(2)) === val,
        'newPrice cannot have more than 2 decimal places'
      ),
    currency: z.string().default('INR'),
  })
  .strict();

export const updateProductStatusParamSchema = z
  .object({
    status: z.enum(['ACTIVE', 'INACTIVE', 'DRAFT', 'ARCHIVED']),
  })
  .strict();

export const updateProductMetadataParamSchema = z
  .object({
    name: z.string().min(1).max(255).optional(),
    description: z.string().max(2000).optional(),
    category: z.string().max(100).optional(),
    brand: z.string().max(100).optional(),
  })
  .strict()
  .refine(
    (data) => Object.keys(data).length > 0,
    'At least one metadata field must be provided for update'
  );

export const updateInventoryParamSchema = z
  .object({
    quantity: z
      .number()
      .int('quantity must be an integer')
      .min(0, 'quantity cannot be negative')
      .max(1000000, 'quantity exceeds maximum allowed limit'),
    lowStockThreshold: z.number().int().min(0).optional(),
  })
  .strict();

export const evidenceItemSchema = z.object({
  signal: z.string().min(1),
  value: z.union([z.number(), z.string()]),
  unit: z.string().optional(),
  description: z.string().optional(),
});

// ─── Action Proposal Schema ──────────────────────────────────────────────────

export const proposeActionSchema = z
  .object({
    actionType: z.enum(ACTION_TYPES),
    productId: z.string().cuid().or(z.string().min(1)).optional().nullable(),
    entityId: z.string().cuid().or(z.string().min(1)).optional().nullable(),
    reason: z.string().min(5, 'Reason must be at least 5 characters long'),
    evidence: z.array(evidenceItemSchema).optional().default([]),
    parameters: z.record(z.unknown()).optional().default({}),
    confidence: z.number().min(0).max(1.0).optional().default(0.8),
  })
  .strict();

// ─── Action Approval & Rejection Schemas ──────────────────────────────────────

export const approveActionSchema = z
  .object({
    reason: z.string().optional(),
  })
  .strict();

export const rejectActionSchema = z
  .object({
    reason: z.string().min(3, 'Rejection reason must be provided'),
  })
  .strict();

// ─── Merchant Policy Configuration Schema ────────────────────────────────────

export const updateMerchantPolicySchema = z
  .object({
    maxPriceChangePercent: z.number().min(1).max(50).optional(),
    maxInventoryAdjustment: z.number().int().min(1).max(500).optional(),
    maxDailyActions: z.number().int().min(1).max(100).optional(),
    maxHourlyActions: z.number().int().min(1).max(50).optional(),
    approvalRequiredForPrice: z.boolean().optional(),
    approvalRequiredForInventory: z.boolean().optional(),
    autonomousActionsEnabled: z.boolean().optional(),

    // Strictly disallow setting financial autonomous actions to true
    allowAutonomousFinancialActions: z
      .literal(false, {
        errorMap: () => ({
          message: 'Autonomous financial actions are strictly disabled and cannot be enabled.',
        }),
      })
      .optional(),
  })
  .strict();

/** Validate specific parameters based on action type */
export function validateActionParameters(actionType: string, params: unknown): Record<string, unknown> {
  if (actionType === 'UPDATE_PRODUCT_PRICE') {
    return updateProductPriceParamSchema.parse(params);
  }
  if (actionType === 'UPDATE_PRODUCT_STATUS') {
    return updateProductStatusParamSchema.parse(params);
  }
  if (actionType === 'UPDATE_PRODUCT_METADATA') {
    return updateProductMetadataParamSchema.parse(params);
  }
  if (actionType === 'UPDATE_INVENTORY') {
    return updateInventoryParamSchema.parse(params);
  }
  return (params as Record<string, unknown>) ?? {};
}
