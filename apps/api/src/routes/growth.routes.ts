/**
 * Phase 7.9 & 7.10 — Growth Agent & Action Guardrails Routes
 *
 * POST /growth/analyze               — Trigger AI merchant growth analysis
 * GET  /growth/opportunities         — Get previously generated growth opportunities
 *
 * Phase 7.10 Guardrails Endpoints:
 * GET  /growth/actions               — List actions for merchant (filtered by status/risk)
 * GET  /growth/actions/:actionId     — Get action detail & deterministic preview
 * POST /growth/actions/propose       — Propose an action (evaluated against guardrails)
 * POST /growth/actions/:actionId/approve — Approve a pending action
 * POST /growth/actions/:actionId/reject  — Reject an action
 * POST /growth/actions/:actionId/execute — Execute an approved action
 * GET  /growth/policy                — Get merchant policy settings
 * PATCH /growth/policy               — Update merchant policy settings
 *
 * All endpoints require JWT authentication + Merchant/Admin role.
 * Merchant scope is strictly derived from JWT via req.merchantId.
 */

import { Router, Request } from 'express';
import { z } from 'zod';
import { authenticate, requireRoles } from '../middleware/auth.middleware.js';
import { resolveMerchant } from '../middleware/merchant.middleware.js';
import { validateRequest } from '../middleware/validate.middleware.js';
import { growthAgentService } from '../services/growth/growth-agent.service.js';
import { analyzeGrowthBodySchema } from '../services/growth/growth-agent.schemas.js';
import { BaseController } from '../controllers/base.controller.js';

// Guardrail domain services & schemas
import {
  approvalService,
  executionService,
  policyService,
  proposeActionSchema,
  approveActionSchema,
  rejectActionSchema,
  updateMerchantPolicySchema,
} from '../services/guardrails/index.js';

const router: Router = Router();
const ctrl = new (class extends BaseController {})();

const run =
  (fn: (req: Request & { merchantId: string; user?: any }) => Promise<unknown>) =>
  async (req: Request, res: any, next: any) => {
    try {
      ctrl['sendSuccess'](res, await fn(req as any));
    } catch (e) {
      next(e);
    }
  };

const authStack = [authenticate, requireRoles('MERCHANT', 'ADMIN'), resolveMerchant];

const getOpportunitiesQuery = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

const getActionsQuery = z.object({
  status: z.string().optional(),
  riskLevel: z.string().optional(),
  limit: z.coerce.number().int().min(1).max(100).default(50),
});

// ─── Phase 7.9 Endpoints ──────────────────────────────────────────────────────

/**
 * POST /growth/analyze
 * Trigger growth analysis for merchant business metrics & growth signals.
 */
router.post(
  '/analyze',
  ...authStack,
  validateRequest({ body: analyzeGrowthBodySchema }),
  run((req) =>
    growthAgentService.analyzeGrowth(req.merchantId, req.user?.id ?? null, req.body)
  )
);

/**
 * GET /growth/opportunities
 * Retrieve saved growth opportunities for merchant.
 */
router.get(
  '/opportunities',
  ...authStack,
  validateRequest({ query: getOpportunitiesQuery }),
  run((req) =>
    growthAgentService.getOpportunities(req.merchantId, (req.query as any).limit)
  )
);

// ─── Phase 7.10 Guardrails & Action Execution Endpoints ─────────────────────

/**
 * GET /growth/actions
 * List growth actions for merchant with status and risk filters.
 */
router.get(
  '/actions',
  ...authStack,
  validateRequest({ query: getActionsQuery }),
  run((req) =>
    approvalService.listActions(req.merchantId, req.query as any)
  )
);

/**
 * GET /growth/actions/:actionId
 * Get action detail and deterministic preview before approval/execution.
 */
router.get(
  '/actions/:actionId',
  ...authStack,
  run((req) =>
    approvalService.getActionPreview(req.params.actionId as string, req.merchantId)
  )
);

/**
 * POST /growth/actions/propose
 * Propose an action for merchant (evaluated against policy and risk rules).
 */
router.post(
  '/actions/propose',
  ...authStack,
  validateRequest({ body: proposeActionSchema }),
  run((req) =>
    approvalService.proposeAction({
      ...(req.body as any),
      merchantId: req.merchantId,
      proposedBy: req.user?.role === 'ADMIN' || req.user?.role === 'MERCHANT' ? 'MERCHANT' : 'AI_AGENT',
    })
  )
);

/**
 * POST /growth/actions/:actionId/approve
 * Approve a pending action proposal.
 */
router.post(
  '/actions/:actionId/approve',
  ...authStack,
  validateRequest({ body: approveActionSchema }),
  run((req) =>
    approvalService.approveAction(
      req.params.actionId as string,
      req.merchantId,
      req.user?.id ?? 'user_merchant',
      req.user?.role ?? 'MERCHANT'
    )
  )
);

/**
 * POST /growth/actions/:actionId/reject
 * Reject a proposed or pending action.
 */
router.post(
  '/actions/:actionId/reject',
  ...authStack,
  validateRequest({ body: rejectActionSchema }),
  run((req) =>
    approvalService.rejectAction(
      req.params.actionId as string,
      req.merchantId,
      req.user?.id ?? 'user_merchant',
      req.body.reason
    )
  )
);

/**
 * POST /growth/actions/:actionId/execute
 * Execute an approved action after policy re-validation & staleness check.
 */
router.post(
  '/actions/:actionId/execute',
  ...authStack,
  run((req) =>
    executionService.executeApprovedAction(
      req.params.actionId as string,
      req.merchantId,
      req.user?.id ?? 'user_merchant'
    )
  )
);

/**
 * GET /growth/policy
 * Retrieve merchant policy limits & guardrail configuration.
 */
router.get(
  '/policy',
  ...authStack,
  run((req) =>
    policyService.getMerchantPolicy(req.merchantId)
  )
);

/**
 * PATCH /growth/policy
 * Update merchant policy guardrail limits.
 */
router.patch(
  '/policy',
  ...authStack,
  validateRequest({ body: updateMerchantPolicySchema }),
  run((req) =>
    policyService.updateMerchantPolicy(req.merchantId, req.body)
  )
);

export const growthRoutes = router;
