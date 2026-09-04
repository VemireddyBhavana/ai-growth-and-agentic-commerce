/**
 * Phase 7.10 — Agent Guardrails & Bounded Action Execution Types
 */

import { RiskLevel } from '@prisma/client';

// ─── Taxonomy Constants ──────────────────────────────────────────────────────

export const ACTION_TYPES = [
  // Recommendation-Only / Review Actions
  'REVIEW_PRODUCT',
  'REVIEW_PRICE',
  'REVIEW_INVENTORY',
  'REVIEW_DESCRIPTION',
  'REVIEW_CATEGORY',
  'REVIEW_OFFER',
  'REVIEW_AI_RECOMMENDATION',

  // Executable Actions (Supported safely by business APIs)
  'UPDATE_PRODUCT_PRICE',
  'UPDATE_PRODUCT_STATUS',
  'UPDATE_PRODUCT_METADATA',
  'UPDATE_INVENTORY',

  // Recommendation-Only (Schema / Domain safe boundary until dedicated model exists)
  'CREATE_PROMOTION',

  // Prohibited Financial Actions (Strictly blocked from autonomous execution)
  'CREATE_PAYMENT',
  'CAPTURE_PAYMENT',
  'REFUND_PAYMENT',
  'MODIFY_PAYMENT_CONFIG',
  'MOVE_MONEY',
] as const;

export type ActionType = (typeof ACTION_TYPES)[number];

export const EXECUTABLE_ACTION_TYPES = new Set<ActionType>([
  'UPDATE_PRODUCT_PRICE',
  'UPDATE_PRODUCT_STATUS',
  'UPDATE_PRODUCT_METADATA',
  'UPDATE_INVENTORY',
]);

export const RECOMMENDATION_ONLY_ACTION_TYPES = new Set<ActionType>([
  'REVIEW_PRODUCT',
  'REVIEW_PRICE',
  'REVIEW_INVENTORY',
  'REVIEW_DESCRIPTION',
  'REVIEW_CATEGORY',
  'REVIEW_OFFER',
  'REVIEW_AI_RECOMMENDATION',
  'CREATE_PROMOTION',
]);

export const PROHIBITED_FINANCIAL_ACTION_TYPES = new Set<ActionType>([
  'CREATE_PAYMENT',
  'CAPTURE_PAYMENT',
  'REFUND_PAYMENT',
  'MODIFY_PAYMENT_CONFIG',
  'MOVE_MONEY',
]);

export const ACTION_STATUSES = [
  'PROPOSED',
  'PENDING_APPROVAL',
  'APPROVED',
  'EXECUTING',
  'EXECUTED',
  'FAILED',
  'REJECTED',
  'EXPIRED',
  'STALE',
] as const;

export type ActionStatus = (typeof ACTION_STATUSES)[number];

// ─── Interfaces & Schemas ───────────────────────────────────────────────────

export interface ActionEvidenceItem {
  signal: string;
  value: number | string;
  unit?: string;
  description?: string;
}

export interface UpdateProductPriceParams {
  newPrice: number;
  currency?: string;
}

export interface UpdateProductStatusParams {
  status: 'ACTIVE' | 'INACTIVE' | 'DRAFT' | 'ARCHIVED';
}

export interface UpdateProductMetadataParams {
  name?: string;
  description?: string;
  category?: string;
  brand?: string;
}

export interface UpdateInventoryParams {
  quantity: number;
  lowStockThreshold?: number;
}

export type ActionParameters =
  | UpdateProductPriceParams
  | UpdateProductStatusParams
  | UpdateProductMetadataParams
  | UpdateInventoryParams
  | Record<string, unknown>;

export interface ActionProposalInput {
  actionType: ActionType;
  merchantId: string;
  productId?: string | null;
  entityId?: string | null;
  reason: string;
  evidence?: ActionEvidenceItem[];
  parameters?: ActionParameters;
  confidence?: number;
  proposedBy?: 'AI_AGENT' | 'MERCHANT' | 'SYSTEM';
}

export interface PolicyLimits {
  maxPriceChangePercent: number;
  maxInventoryAdjustment: number;
  maxDailyActions: number;
  maxHourlyActions: number;
  approvalRequiredForPrice: boolean;
  approvalRequiredForInventory: boolean;
  autonomousActionsEnabled: boolean;
}

export interface PolicyResult {
  allowed: boolean;
  requiresApproval: boolean;
  riskLevel: RiskLevel;
  reason: string;
  limits?: Partial<PolicyLimits>;
  violations?: string[];
}

export interface ActionPreview {
  actionType: ActionType;
  entity: {
    id: string;
    name?: string;
    type: string;
  };
  currentValue: unknown;
  proposedValue: unknown;
  changeDescription: string;
  riskLevel: RiskLevel;
  requiresApproval: boolean;
  reason: string;
  evidence: ActionEvidenceItem[];
  confidence: number;
  executionSupported: boolean;
}

export interface ExecutionResult {
  status: ActionStatus;
  actionId: string;
  actionType: ActionType;
  target: {
    productId?: string | null;
    entityId?: string | null;
  };
  before: Record<string, unknown>;
  after: Record<string, unknown>;
  explanation: string;
  executedAt: string;
  executedBy: string;
}

export interface MerchantPolicyConfig {
  maxPriceChangePercent?: number;
  maxInventoryAdjustment?: number;
  maxDailyActions?: number;
  maxHourlyActions?: number;
  approvalRequiredForPrice?: boolean;
  approvalRequiredForInventory?: boolean;
  autonomousActionsEnabled?: boolean;
}
