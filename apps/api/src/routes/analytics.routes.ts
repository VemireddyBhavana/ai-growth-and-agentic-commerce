/**
 * Phase 7.8 — Analytics Routes
 *
 * GET /analytics           — Executive overview
 * GET /analytics/overview  — Executive overview (alias)
 * GET /analytics/revenue   — Revenue metrics & daily breakdown
 * GET /analytics/orders    — Order breakdown & status metrics
 * GET /analytics/products  — Product performance metrics
 * GET /analytics/ai        — AI search & recommendation metrics
 * GET /analytics/funnel    — Conversion funnel
 * GET /analytics/payments  — Payment performance & success/failure rates
 * GET /analytics/signals   — Growth & diagnostic signals
 *
 * All endpoints require JWT + Merchant role.
 * All metrics are merchant-isolated by storeId from req.merchantId.
 */

import { Router, Request } from 'express';
import { z } from 'zod';
import { authenticate, requireRoles } from '../middleware/auth.middleware.js';
import { resolveMerchant } from '../middleware/merchant.middleware.js';
import { validateRequest } from '../middleware/validate.middleware.js';
import { analyticsService } from '../services/analytics/analytics.service.js';
import { resolvePeriod, PeriodPreset, DateRange } from '../services/analytics/analytics.types.js';
import { BaseController } from '../controllers/base.controller.js';

const router: Router = Router();
const ctrl = new (class extends BaseController {})();

// ─── Query Schema ─────────────────────────────────────────────────────────────

const periodQuery = z.object({
  period: z.enum(['today', '7d', '30d', '90d']).default('30d'),
  from: z.string().optional(),
  to: z.string().optional(),
  limit: z.coerce.number().int().min(1).max(100).default(10),
});

type PeriodQueryType = z.infer<typeof periodQuery>;

function parseDateRange(query: PeriodQueryType): DateRange {
  if (query.from && query.to) {
    const from = new Date(query.from);
    const to = new Date(query.to);
    if (!isNaN(from.getTime()) && !isNaN(to.getTime())) {
      return { from, to };
    }
  }
  return resolvePeriod(query.period as PeriodPreset);
}

// ─── Controller Wrapper ───────────────────────────────────────────────────────

const run =
  (fn: (req: Request & { merchantId: string }) => Promise<unknown>) =>
  async (req: Request, res: any, next: any) => {
    try {
      ctrl['sendSuccess'](res, await fn(req as any));
    } catch (e) {
      next(e);
    }
  };

const authStack = [authenticate, requireRoles('MERCHANT', 'ADMIN'), resolveMerchant];

// ─── Endpoints ───────────────────────────────────────────────────────────────

// 1. Overview
router.get(
  '/',
  ...authStack,
  validateRequest({ query: periodQuery }),
  run((req) => analyticsService.getOverview(req.merchantId, parseDateRange(req.query as any)))
);

router.get(
  '/overview',
  ...authStack,
  validateRequest({ query: periodQuery }),
  run((req) => analyticsService.getOverview(req.merchantId, parseDateRange(req.query as any)))
);

// 2. Revenue
router.get(
  '/revenue',
  ...authStack,
  validateRequest({ query: periodQuery }),
  run((req) => analyticsService.getRevenueMetrics(req.merchantId, parseDateRange(req.query as any)))
);

// 3. Orders
router.get(
  '/orders',
  ...authStack,
  validateRequest({ query: periodQuery }),
  run((req) => analyticsService.getOrderMetrics(req.merchantId, parseDateRange(req.query as any)))
);

// 4. Products
router.get(
  '/products',
  ...authStack,
  validateRequest({ query: periodQuery }),
  run((req) =>
    analyticsService.getProductMetrics(
      req.merchantId,
      parseDateRange(req.query as any),
      (req.query as any).limit
    )
  )
);

// 5. AI Engine Performance
router.get(
  '/ai',
  ...authStack,
  validateRequest({ query: periodQuery }),
  run((req) => analyticsService.getAIMetrics(req.merchantId, parseDateRange(req.query as any)))
);

// 6. Conversion Funnel
router.get(
  '/funnel',
  ...authStack,
  validateRequest({ query: periodQuery }),
  run((req) => analyticsService.getConversionFunnel(req.merchantId, parseDateRange(req.query as any)))
);

// 7. Payment Performance
router.get(
  '/payments',
  ...authStack,
  validateRequest({ query: periodQuery }),
  run((req) => analyticsService.getPaymentMetrics(req.merchantId, parseDateRange(req.query as any)))
);

// 8. Growth Signals
router.get(
  '/signals',
  ...authStack,
  validateRequest({ query: periodQuery }),
  run((req) => analyticsService.getGrowthSignals(req.merchantId, parseDateRange(req.query as any)))
);

export const analyticsRoutes = router;
