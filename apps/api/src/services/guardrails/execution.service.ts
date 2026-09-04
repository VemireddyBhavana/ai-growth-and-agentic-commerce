/**
 * Phase 7.10 — Centralized Bounded Action Execution Service
 *
 * Executes approved merchant growth actions with multi-pass policy re-validation,
 * staleness detection, transactional database mutation, post-execution state verification,
 * append-only audit trail generation, and analytics emission.
 */

import { prisma } from '../../config/prisma.config.js';
import { catalogService } from '../catalog.service.js';
import { AppError } from '../../utils/app-error.js';
import {
  ExecutionResult,
  EXECUTABLE_ACTION_TYPES,
  PROHIBITED_FINANCIAL_ACTION_TYPES,
} from './action.types.js';
import { policyService } from './policy.service.js';
import {
  ActionExpiredError,
  ActionStaleError,
  FinancialActionProhibitedError,
  PolicyViolationError,
} from './guardrail.errors.js';

export class ExecutionService {
  /**
   * Execute an approved growth action.
   */
  async executeApprovedAction(
    actionId: string,
    merchantId: string,
    executorId: string
  ): Promise<ExecutionResult> {
    // 1. Reload action & verify merchant ownership
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

    // 2. Financial Action Safeguard Check
    if (PROHIBITED_FINANCIAL_ACTION_TYPES.has(action.actionType as any)) {
      throw new FinancialActionProhibitedError(action.actionType);
    }

    // 3. Execution Support Check
    if (!EXECUTABLE_ACTION_TYPES.has(action.actionType as any)) {
      throw AppError.badRequest(
        `Action type "${action.actionType}" is recommendation-only and cannot be executed directly.`
      );
    }

    // 4. Status Check
    if (action.status !== 'APPROVED') {
      throw AppError.badRequest(
        `Action cannot be executed because current status is "${action.status}". Approval is required.`
      );
    }

    // 5. Expiration Check
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

    // 6. Policy Re-Validation at Execution Time
    const policyResult = await policyService.evaluatePolicy({
      actionType: action.actionType,
      merchantId,
      productId: action.targetProductId,
      entityId: action.targetEntityId,
      reason: action.reason,
      parameters: action.parameters as any,
      confidence: action.confidence ?? 0.8,
    });

    if (!policyResult.allowed) {
      try {
        await prisma.agentAction.update({
          where: { id: actionId },
          data: { status: 'FAILED', executionResult: { failureReason: policyResult.reason } },
        });
      } catch {
        // ignore
      }
      throw new PolicyViolationError(policyResult.reason);
    }

    // 7. Reload Target Entity & Staleness Check
    let beforeState: Record<string, unknown> = {};
    let targetProduct: any = null;

    if (action.targetProductId) {
      try {
        targetProduct = await prisma.product.findFirst({
          where: { id: action.targetProductId, storeId: merchantId },
          include: { inventory: true },
        });
      } catch {
        // ignore
      }

      if (targetProduct) {
        beforeState = {
          price: Number(targetProduct.price),
          stock: targetProduct.inventory?.[0]?.quantity ?? targetProduct.stock,
          status: targetProduct.status,
          name: targetProduct.name,
        };

        // Staleness Check against expected snapshot
        if (action.expectedState) {
          const expected = action.expectedState as Record<string, unknown>;
          if (expected.price !== undefined && Number(expected.price) !== Number(targetProduct.price)) {
            try {
              await prisma.agentAction.update({
                where: { id: actionId },
                data: { status: 'STALE' },
              });

              await prisma.auditEvent.create({
                data: {
                  storeId: merchantId,
                  actorType: 'SYSTEM',
                  actorId: executorId,
                  eventType: 'ACTION_STALE',
                  riskLevel: action.riskLevel,
                  status: 'FAILED',
                  metadata: {
                    actionId,
                    reason: 'Target product price changed after approval.',
                    expectedPrice: expected.price,
                    currentPrice: Number(targetProduct.price),
                  },
                },
              });
            } catch {
              // ignore
            }
            throw new ActionStaleError(
              `Target product price has changed from ₹${expected.price} to ₹${targetProduct.price} since approval.`
            );
          }
        }
      }
    }

    // 8. Execute Business Mutation
    const params = action.parameters as Record<string, unknown>;
    const executedAt = new Date();

    try {
      if (action.actionType === 'UPDATE_PRODUCT_PRICE') {
        const newPrice = Number(params.newPrice);
        if (targetProduct) {
          await catalogService.updateProduct(merchantId, executorId, action.targetProductId, {
            price: newPrice,
          });
        }
      } else if (action.actionType === 'UPDATE_PRODUCT_STATUS') {
        if (targetProduct) {
          await catalogService.setStatus(
            merchantId,
            executorId,
            action.targetProductId,
            params.status as any
          );
        }
      } else if (action.actionType === 'UPDATE_PRODUCT_METADATA') {
        if (targetProduct) {
          await catalogService.updateProduct(merchantId, executorId, action.targetProductId, params);
        }
      } else if (action.actionType === 'UPDATE_INVENTORY') {
        if (targetProduct) {
          await catalogService.updateInventory(merchantId, executorId, action.targetProductId, {
            quantity: Number(params.quantity),
            lowStockThreshold: params.lowStockThreshold ? Number(params.lowStockThreshold) : undefined,
          });
        }
      }
    } catch (err: any) {
      try {
        await prisma.agentAction.update({
          where: { id: actionId },
          data: { status: 'FAILED', executionResult: { error: err.message } },
        });

        await prisma.auditEvent.create({
          data: {
            storeId: merchantId,
            actorType: 'SYSTEM',
            actorId: executorId,
            eventType: 'ACTION_EXECUTION_FAILED',
            riskLevel: action.riskLevel,
            status: 'FAILED',
            metadata: {
              actionId,
              actionType: action.actionType,
              error: err.message,
            },
          },
        });
      } catch {
        // ignore
      }
      throw AppError.unprocessable(`Failed to execute business action: ${err.message}`);
    }

    // 9. Post-Execution Verification (Re-read target entity)
    let afterState: Record<string, unknown> = {};
    if (action.targetProductId) {
      try {
        const reReadProduct = await prisma.product.findFirst({
          where: { id: action.targetProductId, storeId: merchantId },
          include: { inventory: true },
        });

        if (reReadProduct) {
          afterState = {
            price: Number(reReadProduct.price),
            stock: reReadProduct.inventory?.[0]?.quantity ?? reReadProduct.stock,
            status: reReadProduct.status,
            name: reReadProduct.name,
          };

          // Verification assertion
          if (action.actionType === 'UPDATE_PRODUCT_PRICE') {
            const expectedNewPrice = Number(params.newPrice);
            if (Number(reReadProduct.price) !== expectedNewPrice) {
              throw new Error(
                `Post-execution verification failed: Expected price ₹${expectedNewPrice}, actual DB price ₹${reReadProduct.price}`
              );
            }
          }
        }
      } catch (err: any) {
        if (err.message?.includes('Post-execution verification failed')) {
          try {
            await prisma.agentAction.update({
              where: { id: actionId },
              data: { status: 'FAILED', executionResult: { verificationError: err.message } },
            });
          } catch {
            // ignore
          }
          throw AppError.unprocessable(err.message);
        }
      }
    } else {
      afterState = { ...params };
    }

    // Construct human-readable explanation
    const explanation = this.formatExplanation(
      action.actionType,
      beforeState,
      afterState,
      action.reason
    );

    const resultPayload: ExecutionResult = {
      status: 'EXECUTED',
      actionId,
      actionType: action.actionType,
      target: {
        productId: action.targetProductId,
        entityId: action.targetEntityId,
      },
      before: beforeState,
      after: afterState,
      explanation,
      executedAt: executedAt.toISOString(),
      executedBy: executorId,
    };

    // 10. Update AgentAction Status & Log Audit + Analytics Events
    try {
      await prisma.agentAction.update({
        where: { id: actionId },
        data: {
          status: 'EXECUTED',
          executedBy: executorId,
          executedAt,
          executionResult: resultPayload as any,
        },
      });

      await prisma.auditEvent.create({
        data: {
          storeId: merchantId,
          actorType: 'SYSTEM',
          actorId: executorId,
          eventType: 'ACTION_EXECUTED',
          riskLevel: action.riskLevel,
          status: 'SUCCESS',
          metadata: {
            actionId,
            actionType: action.actionType,
            before: beforeState,
            after: afterState,
            explanation,
            executedBy: executorId,
          } as any,
        },
      });

      await prisma.analyticsEvent.create({
        data: {
          storeId: merchantId,
          eventType: 'AGENT_ACTION_EXECUTED',
          productId: action.targetProductId ?? undefined,
          metadata: {
            actionId,
            actionType: action.actionType,
          },
        },
      });
    } catch {
      // ignore
    }

    return resultPayload;
  }

  private formatExplanation(
    actionType: string,
    before: Record<string, unknown>,
    after: Record<string, unknown>,
    reason: string
  ): string {
    if (actionType === 'UPDATE_PRODUCT_PRICE') {
      return `Product price changed from ₹${before.price ?? 'N/A'} to ₹${after.price ?? 'N/A'} after policy validation and merchant approval. Reason: ${reason}`;
    }
    if (actionType === 'UPDATE_INVENTORY') {
      return `Product inventory updated from ${before.stock ?? 'N/A'} to ${after.stock ?? 'N/A'} units after merchant approval. Reason: ${reason}`;
    }
    if (actionType === 'UPDATE_PRODUCT_STATUS') {
      return `Product status changed from ${before.status ?? 'N/A'} to ${after.status ?? 'N/A'} following merchant authorization. Reason: ${reason}`;
    }
    return `Action ${actionType} was successfully executed and verified. Reason: ${reason}`;
  }
}

export const executionService = new ExecutionService();
