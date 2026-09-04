/**
 * Phase 7.6 — Payment Routes
 *
 * POST /payments/create-order   — Create Razorpay order for application order
 * POST /payments/verify         — Verify Razorpay payment signature
 * POST /payments/webhook        — Razorpay webhook handler
 * GET  /payments/order/:orderId — Get payment status for an order
 */

import { Router } from 'express';
import { z } from 'zod';
import { authenticate, requireRoles } from '../middleware/auth.middleware.js';
import { resolveMerchant } from '../middleware/merchant.middleware.js';
import { validateRequest } from '../middleware/validate.middleware.js';
import { paymentService } from '../services/payment/payment.service.js';
import { BaseController } from '../controllers/base.controller.js';

const router: Router = Router();
const ctrl = new (class extends BaseController {})();

// ─── Schemas ─────────────────────────────────────────────────────────────────

const createOrderSchema = z
  .object({
    orderId: z.string().cuid(),
  })
  .strict(); // Reject amount, currency, total, subtotal, etc.

const verifySchema = z.object({
  razorpay_order_id: z.string().min(1),
  razorpay_payment_id: z.string().min(1),
  razorpay_signature: z.string().min(1),
});

const orderIdParam = z.object({
  orderId: z.string().cuid(),
});

// ─── Helpers ─────────────────────────────────────────────────────────────────

const run =
  (fn: (req: Express.Request & any) => Promise<unknown>, status = 200) =>
  async (req: any, res: any, next: any) => {
    try {
      ctrl['sendSuccess'](res, await fn(req), undefined, status);
    } catch (e) {
      next(e);
    }
  };

// ─── Authenticated Endpoints ─────────────────────────────────────────────────

// Create Razorpay order — only orderId accepted, amount comes from DB
router.post(
  '/create-order',
  authenticate,
  requireRoles('MERCHANT', 'ADMIN'),
  resolveMerchant,
  validateRequest({ body: createOrderSchema }),
  run(
    (req) =>
      paymentService.createPaymentOrder(req.merchantId, req.user.userId, req.body.orderId),
    201
  )
);

// Verify payment signature
router.post(
  '/verify',
  authenticate,
  requireRoles('MERCHANT', 'ADMIN'),
  resolveMerchant,
  validateRequest({ body: verifySchema }),
  run((req) =>
    paymentService.verifyPayment(
      req.merchantId,
      req.user.userId,
      req.body.razorpay_order_id,
      req.body.razorpay_payment_id,
      req.body.razorpay_signature
    )
  )
);

// Get payment status for an order
router.get(
  '/order/:orderId',
  authenticate,
  requireRoles('MERCHANT', 'ADMIN'),
  resolveMerchant,
  validateRequest({ params: orderIdParam }),
  run((req) => paymentService.getPaymentByOrderId(req.merchantId, req.params.orderId))
);

// ─── Webhook Endpoint (no JWT auth — uses Razorpay webhook signature) ────────

/**
 * Razorpay sends webhooks as POST requests.
 * The raw body is required for signature verification.
 * The raw body is attached by the webhook-specific middleware in app.ts.
 */
router.post('/webhook', async (req: any, res, next) => {
  try {
    const signature = req.headers['x-razorpay-signature'] as string;
    if (!signature) {
      res.status(400).json({
        success: false,
        error: { code: 'MISSING_SIGNATURE', message: 'x-razorpay-signature header is required' },
      });
      return;
    }

    // rawBody is attached by the middleware in app.ts
    const rawBody: Buffer | string = req.rawBody ?? JSON.stringify(req.body);

    const result = await paymentService.handleWebhook(rawBody, signature);
    res.status(200).json({ success: true, data: result });
  } catch (e) {
    next(e);
  }
});

export const paymentsRoutes = router;
