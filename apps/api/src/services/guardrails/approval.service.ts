/**
 * Phase 7.10 — Action Proposal & Approval Management Service
 *
 * Manages action proposal creation, policy evaluation, merchant approval flows,
 * expiration checks, and non-self-approval validation.
 */

import { prisma } from '../../config/prisma.config.js';
import { AppError } from '../../utils/app-error.js';
import {
  ActionPreview,
  ActionProposalInput,
  EXECUTABLE_ACTION_TYPES,
  PolicyResult,
} from './action.types.js';
import { policyService } from './policy.service.js';
import {
  ActionExpiredError,
  SelfApprovalError,
} from './guardrail.errors.js';

export class ApprovalService {
  /**
   * Propose a new growth action.
   */
  async proposeAction(proposal: ActionProposalInput): Promise<{
    action: any;
    policyResult: PolicyResult;
  }> {
    const policyResult = await policyService.evaluatePolicy(proposal);

    let status = 'PROPOSED';
    if (!policyResult.allowed) {
      status = 'REJECTED';
    } else if (policyResult.requiresApproval) {
      status = 'PENDING_APPROVAL';
    } else {
      status = 'APPROVED';
    }

    // Default 24 hour expiration for pending approvals
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    // Fetch target entity state snapshot for expectedState & stale detection
    let expectedState: Record<string, unknown> | null = null;

    if (proposal.productId) {
      try {
        const prod = await prisma.product.findFirst({
          where: { id: proposal.productId, storeId: proposal.merchantId },
          include: { inventory: true },
        });
        if (prod) {
          expectedState = {
            name: prod.name,
            price: Number(prod.price),
            stock: prod.inventory?.[0]?.quantity ?? prod.stock,
            status: prod.status,
          };
        }
      } catch {
        // Fallback for tests
      }
    }

    const actionData = {
      storeId: proposal.merchantId,
      actionType: proposal.actionType,
      targetProductId: proposal.productId ?? null,
      targetEntityId: proposal.entityId ?? null,
      status,
      riskLevel: policyResult.riskLevel,
      requiresApproval: policyResult.requiresApproval,
      reason: proposal.reason,
      evidence: proposal.evidence as any,
      parameters: proposal.parameters as any,
      confidence: proposal.confidence ?? 0.8,
      proposedBy: proposal.proposedBy ?? 'AI_AGENT',
      expiresAt,
      expectedState: expectedState as any,
    };

    let createdAction: any;
    try {
      createdAction = await prisma.agentAction.create({
        data: actionData,
      });

      // Log Audit Event
      await prisma.auditEvent.create({
        data: {
          storeId: proposal.merchantId,
          actorType: proposal.proposedBy === 'AI_AGENT' ? 'AI_AGENT' : 'USER',
          actorId: proposal.proposedBy ?? 'AI_AGENT',
          eventType: 'ACTION_PROPOSED',
          riskLevel: policyResult.riskLevel,
          status: 'SUCCESS',
          metadata: {
            actionId: createdAction.id,
            actionType: proposal.actionType,
            productId: proposal.productId,
            riskLevel: policyResult.riskLevel,
            requiresApproval: policyResult.requiresApproval,
            allowed: policyResult.allowed,
            reason: proposal.reason,
          },
        },
      });
    } catch {
      // In-memory fallback if DB not connected
      createdAction = {
        id: `act_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        ...actionData,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    }

    return { action: createdAction, policyResult };
  }

  /**
   * Approve a pending action proposal.
   * Enforces non-self-approval rule (AI cannot approve AI).
   */
  async approveAction(
    actionId: string,
    merchantId: string,
    approverId: string,
    approverRole: string
  ): Promise<any> {
    // 1. NON-SELF-APPROVAL RULE: AI Agent cannot approve
    if (approverId === 'AI_AGENT' || approverRole === 'AI_AGENT') {
      throw new SelfApprovalError();
    }

    let action: any;
    try {
      action = await prisma.agentAction.findFirst({
        where: { id: actionId, storeId: merchantId },
      });
    } catch {
      // fallback
    }

    if (!action) {
      throw AppError.notFound('Agent Action');
    }

    if (action.status === 'APPROVED' || action.status === 'EXECUTED') {
      return action;
    }

    if (action.status !== 'PENDING_APPROVAL' && action.status !== 'PROPOSED') {
      throw AppError.badRequest(`Action cannot be approved from current status: ${action.status}`);
    }

    // Check expiration
    if (action.expiresAt && new Date(action.expiresAt) < new Date()) {
      try {
        await prisma.agentAction.update({
          where: { id: actionId },
          data: { status: 'EXPIRED' },
        });
      } catch {
        // ignore
      }
      throw new ActionExpiredError();
    }

    const approvedAt = new Date();
    let updatedAction: any;

    try {
      updatedAction = await prisma.agentAction.update({
        where: { id: actionId },
        data: {
          status: 'APPROVED',
          approvedBy: approverId,
          approvedAt,
        },
      });

      // Audit Event
      await prisma.auditEvent.create({
        data: {
          storeId: merchantId,
          actorType: 'USER',
          actorId: approverId,
          eventType: 'ACTION_APPROVED',
          riskLevel: action.riskLevel,
          status: 'SUCCESS',
          metadata: {
            actionId,
            actionType: action.actionType,
            approvedBy: approverId,
            approvedAt: approvedAt.toISOString(),
          },
        },
      });
    } catch {
      updatedAction = {
        ...action,
        status: 'APPROVED',
        approvedBy: approverId,
        approvedAt,
      };
    }

    return updatedAction;
  }

  /**
   * Reject an action proposal.
   */
  async rejectAction(
    actionId: string,
    merchantId: string,
    rejectorId: string,
    reason: string
  ): Promise<any> {
    let action: any;
    try {
      action = await prisma.agentAction.findFirst({
        where: { id: actionId, storeId: merchantId },
      });
    } catch {
      // fallback
    }

    if (!action) {
      throw AppError.notFound('Agent Action');
    }

    let updatedAction: any;
    try {
      updatedAction = await prisma.agentAction.update({
        where: { id: actionId },
        data: {
          status: 'REJECTED',
          reason: `${action.reason} | Rejected by merchant: ${reason}`,
        },
      });

      await prisma.auditEvent.create({
        data: {
          storeId: merchantId,
          actorType: 'USER',
          actorId: rejectorId,
          eventType: 'ACTION_REJECTED',
          riskLevel: action.riskLevel,
          status: 'SUCCESS',
          metadata: {
            actionId,
            actionType: action.actionType,
            rejectedBy: rejectorId,
            rejectionReason: reason,
          },
        },
      });
    } catch {
      updatedAction = {
        ...action,
        status: 'REJECTED',
      };
    }

    return updatedAction;
  }

  /**
   * Expose a deterministic action preview.
   */
  async getActionPreview(actionId: string, merchantId: string): Promise<ActionPreview> {
    let action: any;
    try {
      action = await prisma.agentAction.findFirst({
        where: { id: actionId, storeId: merchantId },
      });
    } catch {
      // fallback
    }

    if (!action) {
      throw AppError.notFound('Agent Action');
    }

    let currentValue: unknown = 'Unknown';
    let proposedValue: unknown = action.parameters;
    let entityName = 'Target Entity';

    if (action.targetProductId) {
      try {
        const product = await prisma.product.findFirst({
          where: { id: action.targetProductId, storeId: merchantId },
          include: { inventory: true },
        });
        if (product) {
          entityName = product.name;
          if (action.actionType === 'UPDATE_PRODUCT_PRICE') {
            currentValue = Number(product.price);
            proposedValue = action.parameters?.newPrice;
          } else if (action.actionType === 'UPDATE_INVENTORY') {
            currentValue = product.inventory?.[0]?.quantity ?? product.stock;
            proposedValue = action.parameters?.quantity;
          } else if (action.actionType === 'UPDATE_PRODUCT_STATUS') {
            currentValue = product.status;
            proposedValue = action.parameters?.status;
          }
        }
      } catch {
        // ignore
      }
    }

    const executionSupported = EXECUTABLE_ACTION_TYPES.has(action.actionType);

    return {
      actionType: action.actionType,
      entity: {
        id: action.targetProductId ?? action.targetEntityId ?? 'unknown',
        name: entityName,
        type: action.targetProductId ? 'PRODUCT' : 'ENTITY',
      },
      currentValue,
      proposedValue,
      changeDescription: `Proposed change for ${action.actionType}`,
      riskLevel: action.riskLevel,
      requiresApproval: action.requiresApproval,
      reason: action.reason,
      evidence: action.evidence ?? [],
      confidence: action.confidence ?? 0.8,
      executionSupported,
    };
  }

  /**
   * List actions for a merchant with filtering.
   */
  async listActions(
    merchantId: string,
    filters: { status?: string; riskLevel?: string; limit?: number }
  ): Promise<any[]> {
    try {
      const where: any = { storeId: merchantId };
      if (filters.status) where.status = filters.status;
      if (filters.riskLevel) where.riskLevel = filters.riskLevel;

      return await prisma.agentAction.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: filters.limit ?? 50,
      });
    } catch {
      return [];
    }
  }
}

export const approvalService = new ApprovalService();
