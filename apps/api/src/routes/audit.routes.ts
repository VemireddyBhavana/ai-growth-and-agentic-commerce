/**
 * Phase 7.7 — Audit & Explainability Routes
 *
 * GET  /audit/events                        — List events (filtered, paginated)
 * GET  /audit/events/:eventId               — Single event detail
 * GET  /audit/timeline/order/:orderId       — Order lifecycle timeline
 * GET  /audit/timeline/payment/:paymentId   — Payment lifecycle timeline
 *
 * Append-only: No PUT, PATCH, DELETE endpoints.
 * All endpoints require JWT + Merchant role.
 * All queries are merchant-isolated by storeId from JWT.
 */

import { Router } from 'express';
import { z } from 'zod';
import { authenticate, requireRoles } from '../middleware/auth.middleware.js';
import { resolveMerchant } from '../middleware/merchant.middleware.js';
import { validateRequest } from '../middleware/validate.middleware.js';
import { auditService } from '../services/audit.service.js';
import { KNOWN_EVENT_TYPES } from '../services/explainability.service.js';
import { BaseController } from '../controllers/base.controller.js';

const router: Router = Router();
const ctrl = new (class extends BaseController {})();

// ─── Schemas ─────────────────────────────────────────────────────────────────

const MAX_PAGE_SIZE = 100;

/** Valid actor types (from Prisma ActorType enum) */
const ACTOR_TYPES = ['CUSTOMER', 'MERCHANT', 'ADMIN', 'SYSTEM', 'AI_AGENT', 'WEBHOOK', 'ANONYMOUS'] as const;

/** Valid risk levels (from Prisma RiskLevel enum) */
const RISK_LEVELS = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'] as const;

/** Valid statuses (from Prisma AuditEventStatus enum) */
const STATUSES = ['SUCCESS', 'FAILED', 'PENDING', 'DENIED'] as const;

const listEventsQuery = z.object({
  eventType: z.string().optional(),
  actorType: z.enum(ACTOR_TYPES).optional(),
  actorId: z.string().optional(),
  orderId: z.string().optional(),
  paymentId: z.string().optional(),
  customerId: z.string().optional(),
  riskLevel: z.enum(RISK_LEVELS).optional(),
  status: z.enum(STATUSES).optional(),
  startDate: z.string().datetime({ offset: true }).optional(),
  endDate: z.string().datetime({ offset: true }).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(MAX_PAGE_SIZE).default(25),
  sort: z.enum(['createdAt']).default('createdAt'),
  order: z.enum(['asc', 'desc']).default('desc'),
});

const eventIdParam = z.object({
  eventId: z.string().cuid(),
});

const orderIdParam = z.object({
  orderId: z.string().cuid(),
});

const paymentIdParam = z.object({
  paymentId: z.string().cuid(),
});

// ─── Helpers ─────────────────────────────────────────────────────────────────

const run =
  (fn: (req: any) => Promise<unknown>) =>
  async (req: any, res: any, next: any) => {
    try {
      ctrl['sendSuccess'](res, await fn(req));
    } catch (e) {
      next(e);
    }
  };

// ─── Middleware Stack (all endpoints require auth + merchant) ─────────────────

const authStack = [authenticate, requireRoles('MERCHANT', 'ADMIN'), resolveMerchant];

// ─── Endpoints ───────────────────────────────────────────────────────────────

// List audit events (filtered, paginated)
router.get(
  '/events',
  ...authStack,
  validateRequest({ query: listEventsQuery }),
  run((req) => auditService.listEvents(req.merchantId, req.query as any))
);

// Get single audit event detail
router.get(
  '/events/:eventId',
  ...authStack,
  validateRequest({ params: eventIdParam }),
  run((req) => auditService.getEvent(req.merchantId, req.params.eventId))
);

// Order lifecycle timeline
router.get(
  '/timeline/order/:orderId',
  ...authStack,
  validateRequest({ params: orderIdParam }),
  run((req) => auditService.getOrderTimeline(req.merchantId, req.params.orderId))
);

// Payment lifecycle timeline
router.get(
  '/timeline/payment/:paymentId',
  ...authStack,
  validateRequest({ params: paymentIdParam }),
  run((req) => auditService.getPaymentTimeline(req.merchantId, req.params.paymentId))
);

// ─── Event Taxonomy (public metadata, no auth required) ──────────────────────

router.get('/event-types', (_req, res) => {
  res.json({
    success: true,
    data: {
      eventTypes: KNOWN_EVENT_TYPES,
      actorTypes: ACTOR_TYPES,
      riskLevels: RISK_LEVELS,
      statuses: STATUSES,
    },
  });
});

export const auditRoutes = router;
