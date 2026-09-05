/**
 * Phase 7.6 — Payment Service
 *
 * Business logic for the full Razorpay payment lifecycle:
 *   create-order → verify → webhook → state transitions
 *
 * CRITICAL MONEY SAFETY:
 *   - Amount always read from the authoritative application Order in PostgreSQL
 *   - Never from client, AI, or any untrusted source
 *   - Converted to paise server-side using Decimal arithmetic
 *   - Signature verification required before any paid state transition
 */

import type { Prisma } from '@prisma/client';
import { prisma } from '../../config/prisma.config.js';
import { AppError } from '../../utils/app-error.js';
import { logger } from '../../utils/logger.js';
import { razorpayProvider } from './razorpay.provider.js';
import {
  CURRENCY_MULTIPLIERS,
  isValidTransition,
  mapRazorpayMethod,
  type CheckoutResponse,
  type RazorpayWebhookPayload,
} from './payment.types.js';

// ─── Amount Conversion ───────────────────────────────────────────────────────

/**
 * Convert a Prisma Decimal amount to the smallest currency unit (e.g. paise).
 * Uses Decimal arithmetic — NO floating-point.
 *
 * ₹4,999.00 → 499900 paise
 */
export function toSmallestUnit(amount: Prisma.Decimal, currency: string): number {
  const multiplier = CURRENCY_MULTIPLIERS[currency];
  if (!multiplier) {
    throw new AppError({
      statusCode: 422,
      code: 'UNSUPPORTED_CURRENCY',
      message: `Currency "${currency}" is not supported for payment processing.`,
    });
  }
  // Decimal.mul returns Decimal; toFixed(0) gives integer string; parseInt is safe
  return parseInt(amount.mul(multiplier).toFixed(0), 10);
}

// ─── Payment Service ─────────────────────────────────────────────────────────

export class PaymentService {
  // ── CREATE PAYMENT ORDER ─────────────────────────────────────────────────

  /**
   * Create a Razorpay order for an existing validated application order.
   *
   * Flow:
   * 1. Load order from DB (authoritative total)
   * 2. Validate ownership, payability, not-already-paid
   * 3. Check for existing Payment record (idempotent reuse / prevent duplicates)
   * 4. Convert total to paise (server-side Decimal math)
   * 5. Create Razorpay order
   * 6. Persist Payment record + update Order.razorpayOrderId
   * 7. Audit + Analytics
   * 8. Return safe checkout info (no secrets)
   */
  async createPaymentOrder(
    storeId: string,
    actorId: string,
    orderId: string
  ): Promise<CheckoutResponse> {
    // 1. Load authoritative order
    const order = await prisma.order.findFirst({
      where: { id: orderId, storeId },
    });

    if (!order) {
      throw new AppError({ statusCode: 404, code: 'ORDER_NOT_FOUND', message: 'Order not found' });
    }

    // 2. Validate payability
    if (order.status === 'CANCELLED') {
      throw new AppError({
        statusCode: 409,
        code: 'ORDER_CANCELLED',
        message: 'Cannot create payment for a cancelled order.',
      });
    }

    // 3. Check for existing payment
    const existingPayment = await prisma.payment.findUnique({
      where: { orderId: order.id },
    });

    if (existingPayment) {
      // Already captured — reject
      if (existingPayment.status === 'CAPTURED' || existingPayment.status === 'COMPLETED') {
        throw new AppError({
          statusCode: 409,
          code: 'ORDER_ALREADY_PAID',
          message: 'This order has already been paid.',
        });
      }

      // Existing pending/created payment — reuse the Razorpay order
      if (
        existingPayment.providerOrderId &&
        (existingPayment.status === 'CREATED' || existingPayment.status === 'PENDING')
      ) {
        logger.info(
          { orderId, paymentId: existingPayment.id },
          'Reusing existing pending Razorpay order'
        );
        return {
          orderId: order.id,
          paymentId: existingPayment.id,
          razorpayOrderId: existingPayment.providerOrderId,
          amount: toSmallestUnit(existingPayment.amount, existingPayment.currency),
          currency: existingPayment.currency,
          keyId: razorpayProvider.getPublicKeyId(),
          orderNumber: order.orderNumber,
        };
      }
    }

    // 4. Authoritative amount from DB
    const amountPaise = toSmallestUnit(order.total, order.currency);

    if (amountPaise <= 0) {
      throw new AppError({
        statusCode: 422,
        code: 'INVALID_ORDER_AMOUNT',
        message: 'Order total must be greater than zero.',
      });
    }

    // 5. Create Razorpay order
    const rzpOrder = await razorpayProvider.createOrder({
      amountPaise,
      currency: order.currency,
      receipt: order.orderNumber,
      notes: { appOrderId: order.id, storeId },
    });

    // 6. Persist Payment + update Order atomically
    const payment = await prisma.$transaction(async (tx) => {
      const pay = await tx.payment.create({
        data: {
          storeId,
          orderId: order.id,
          provider: 'RAZORPAY',
          providerOrderId: rzpOrder.razorpayOrderId,
          amount: order.total,
          currency: order.currency,
          status: 'CREATED',
          method: order.paymentMethod,
        },
      });

      await tx.order.update({
        where: { id: order.id },
        data: { razorpayOrderId: rzpOrder.razorpayOrderId },
      });

      // 7. Audit
      await tx.auditEvent.create({
        data: {
          storeId,
          orderId: order.id,
          paymentId: pay.id,
          eventType: 'PAYMENT_ORDER_CREATED',
          actorType: 'USER',
          actorId,
          metadata: {
            razorpayOrderId: rzpOrder.razorpayOrderId,
            amount: order.total.toString(),
            amountPaise,
            currency: order.currency,
            orderNumber: order.orderNumber,
            explanation: `Payment request created for order ${order.orderNumber} using the server-verified order total of ₹${order.total}.`,
          },
        },
      });

      await tx.analyticsEvent.create({
        data: {
          storeId,
          orderId: order.id,
          eventType: 'RAZORPAY_ORDER_CREATED',
          value: order.total,
          currency: order.currency,
          metadata: {
            razorpayOrderId: rzpOrder.razorpayOrderId,
            paymentId: pay.id,
          },
        },
      });

      return pay;
    });

    // 8. Return safe checkout info
    return {
      orderId: order.id,
      paymentId: payment.id,
      razorpayOrderId: rzpOrder.razorpayOrderId,
      amount: amountPaise,
      currency: order.currency,
      keyId: razorpayProvider.getPublicKeyId(),
      orderNumber: order.orderNumber,
    };
  }

  // ── VERIFY PAYMENT ───────────────────────────────────────────────────────

  /**
   * Verify Razorpay payment signature and update Payment+Order status.
   *
   * Flow:
   * 1. Find Payment by provider order ID
   * 2. Verify ownership
   * 3. Verify signature using server-side secret
   * 4. Update Payment → CAPTURED, Order → CONFIRMED transactionally
   * 5. Audit + Analytics
   */
  async verifyPayment(
    storeId: string,
    actorId: string,
    razorpayOrderId: string,
    razorpayPaymentId: string,
    razorpaySignature: string
  ) {
    // 1. Find Payment
    const payment = await prisma.payment.findFirst({
      where: { providerOrderId: razorpayOrderId, storeId },
      include: { order: true },
    });

    if (!payment) {
      throw new AppError({
        statusCode: 404,
        code: 'PAYMENT_NOT_FOUND',
        message: 'No payment record found for the given Razorpay order.',
      });
    }

    // 2. Already captured — idempotent success
    if (payment.status === 'CAPTURED' || payment.status === 'COMPLETED') {
      logger.info({ paymentId: payment.id }, 'Payment already captured — returning success');
      return {
        verified: true,
        orderId: payment.orderId,
        paymentId: payment.id,
        status: payment.status,
        alreadyCaptured: true,
      };
    }

    // 3. Verify signature
    let signatureValid: boolean;
    try {
      signatureValid = razorpayProvider.verifyPaymentSignature(
        razorpayOrderId,
        razorpayPaymentId,
        razorpaySignature
      );
    } catch {
      signatureValid = false;
    }

    if (!signatureValid) {
      // Record the failed verification attempt
      await prisma.$transaction([
        prisma.auditEvent.create({
          data: {
            storeId,
            orderId: payment.orderId,
            paymentId: payment.id,
            eventType: 'PAYMENT_VERIFICATION_REJECTED',
            actorType: 'USER',
            actorId,
            riskLevel: 'HIGH',
            status: 'FAILED',
            metadata: {
              razorpayOrderId,
              razorpayPaymentId,
              reason: 'Invalid payment signature',
              explanation:
                'Payment verification failed because the provider signature was invalid.',
            },
          },
        }),
        prisma.analyticsEvent.create({
          data: {
            storeId,
            orderId: payment.orderId,
            eventType: 'PAYMENT_VERIFICATION_FAILED',
            metadata: { razorpayOrderId, razorpayPaymentId, reason: 'invalid_signature' },
          },
        }),
      ]);

      throw new AppError({
        statusCode: 400,
        code: 'PAYMENT_SIGNATURE_INVALID',
        message: 'Payment signature verification failed.',
        remediation: 'Please retry the payment. Do not tamper with payment data.',
      });
    }

    // 4. Transactional state update
    if (!isValidTransition(payment.status, 'CAPTURED')) {
      throw new AppError({
        statusCode: 409,
        code: 'INVALID_PAYMENT_STATE',
        message: `Cannot transition payment from ${payment.status} to CAPTURED.`,
      });
    }

    const result = await prisma.$transaction(async (tx) => {
      const updatedPayment = await tx.payment.update({
        where: { id: payment.id },
        data: {
          status: 'CAPTURED',
          providerPaymentId: razorpayPaymentId,
          verifiedAt: new Date(),
        },
      });

      const updatedOrder = await tx.order.update({
        where: { id: payment.orderId },
        data: {
          status: 'CONFIRMED',
          paymentStatus: 'CAPTURED',
          razorpayPaymentId,
        },
      });

      await tx.auditEvent.create({
        data: {
          storeId,
          orderId: payment.orderId,
          paymentId: payment.id,
          eventType: 'PAYMENT_VERIFIED',
          actorType: 'USER',
          actorId,
          metadata: {
            razorpayOrderId,
            razorpayPaymentId,
            amount: payment.amount.toString(),
            currency: payment.currency,
            explanation: `Payment verified for ₹${payment.amount} against Razorpay order ${razorpayOrderId}.`,
          },
        },
      });

      await tx.analyticsEvent.create({
        data: {
          storeId,
          orderId: payment.orderId,
          eventType: 'PAYMENT_VERIFICATION_SUCCESS',
          value: payment.amount,
          currency: payment.currency,
          metadata: { razorpayOrderId, razorpayPaymentId },
        },
      });

      return { payment: updatedPayment, order: updatedOrder };
    });

    return {
      verified: true,
      orderId: result.order.id,
      paymentId: result.payment.id,
      status: result.payment.status,
      orderStatus: result.order.status,
    };
  }

  // ── WEBHOOK HANDLER ──────────────────────────────────────────────────────

  /**
   * Handle Razorpay webhook events.
   *
   * Idempotency:
   *   - Duplicate captured events are safely ignored
   *   - providerPaymentId unique constraint prevents double-processing
   *
   * Supported events: payment.captured, payment.failed
   * Unknown events: logged and ignored (200 response)
   */
  async handleWebhook(rawBody: string | Buffer, signature: string) {
    // 1. Verify webhook signature
    const valid = razorpayProvider.verifyWebhookSignature(rawBody, signature);
    if (!valid) {
      logger.warn('Webhook signature verification failed');
      throw new AppError({
        statusCode: 400,
        code: 'WEBHOOK_SIGNATURE_INVALID',
        message: 'Webhook signature verification failed.',
      });
    }

    // 2. Parse payload
    const bodyStr = typeof rawBody === 'string' ? rawBody : rawBody.toString('utf-8');
    let payload: RazorpayWebhookPayload;
    try {
      payload = JSON.parse(bodyStr) as RazorpayWebhookPayload;
    } catch {
      throw new AppError({
        statusCode: 400,
        code: 'WEBHOOK_INVALID_PAYLOAD',
        message: 'Could not parse webhook payload.',
      });
    }

    const event = payload.event;
    logger.info({ event }, 'Processing Razorpay webhook event');

    // 3. Route to handler
    switch (event) {
      case 'payment.captured':
        return this.handlePaymentCaptured(payload);
      case 'payment.failed':
        return this.handlePaymentFailed(payload);
      case 'order.paid':
        // order.paid is redundant with payment.captured — log and acknowledge
        logger.info({ event }, 'Received order.paid webhook — acknowledged');
        return { acknowledged: true, event };
      default:
        logger.info({ event }, 'Unknown webhook event — acknowledged');
        return { acknowledged: true, event };
    }
  }

  private async handlePaymentCaptured(payload: RazorpayWebhookPayload) {
    const paymentEntity = payload.payload.payment?.entity;
    if (!paymentEntity) {
      logger.warn('payment.captured webhook missing payment entity');
      return { acknowledged: true, event: 'payment.captured' };
    }

    const rzpOrderId = paymentEntity.order_id;
    const rzpPaymentId = paymentEntity.id;

    // Find payment
    const payment = await prisma.payment.findFirst({
      where: { providerOrderId: rzpOrderId },
    });

    if (!payment) {
      logger.warn({ rzpOrderId }, 'Webhook references unknown Razorpay order');
      return { acknowledged: true, event: 'payment.captured', skipped: true };
    }

    // Idempotency: already captured
    if (payment.status === 'CAPTURED' || payment.status === 'COMPLETED') {
      logger.info({ paymentId: payment.id }, 'Webhook duplicate — payment already captured');

      await prisma.auditEvent.create({
        data: {
          storeId: payment.storeId,
          orderId: payment.orderId,
          paymentId: payment.id,
          eventType: 'PAYMENT_WEBHOOK_DUPLICATE',
          actorType: 'SYSTEM',
          metadata: {
            razorpayOrderId: rzpOrderId,
            razorpayPaymentId: rzpPaymentId,
            event: 'payment.captured',
          },
        },
      });

      return { acknowledged: true, event: 'payment.captured', duplicate: true };
    }

    // Transition to captured
    if (!isValidTransition(payment.status, 'CAPTURED')) {
      logger.warn(
        { from: payment.status, to: 'CAPTURED' },
        'Invalid payment state transition from webhook'
      );
      return { acknowledged: true, event: 'payment.captured', skipped: true };
    }

    await prisma.$transaction(async (tx) => {
      await tx.payment.update({
        where: { id: payment.id },
        data: {
          status: 'CAPTURED',
          providerPaymentId: rzpPaymentId,
          method: mapRazorpayMethod(paymentEntity.method) as any,
          verifiedAt: new Date(),
        },
      });

      await tx.order.update({
        where: { id: payment.orderId },
        data: {
          status: 'CONFIRMED',
          paymentStatus: 'CAPTURED',
          razorpayPaymentId: rzpPaymentId,
        },
      });

      await tx.auditEvent.create({
        data: {
          storeId: payment.storeId,
          orderId: payment.orderId,
          paymentId: payment.id,
          eventType: 'PAYMENT_WEBHOOK_PROCESSED',
          actorType: 'SYSTEM',
          metadata: {
            razorpayOrderId: rzpOrderId,
            razorpayPaymentId: rzpPaymentId,
            event: 'payment.captured',
            amount: payment.amount.toString(),
            currency: payment.currency,
            method: paymentEntity.method,
            explanation: `Webhook confirmed payment capture for ₹${payment.amount}.`,
          },
        },
      });

      await tx.analyticsEvent.create({
        data: {
          storeId: payment.storeId,
          orderId: payment.orderId,
          eventType: 'PAYMENT_WEBHOOK_PROCESSED',
          value: payment.amount,
          currency: payment.currency,
          metadata: {
            razorpayOrderId: rzpOrderId,
            razorpayPaymentId: rzpPaymentId,
            event: 'payment.captured',
          },
        },
      });
    });

    return { acknowledged: true, event: 'payment.captured', processed: true };
  }

  private async handlePaymentFailed(payload: RazorpayWebhookPayload) {
    const paymentEntity = payload.payload.payment?.entity;
    if (!paymentEntity) {
      logger.warn('payment.failed webhook missing payment entity');
      return { acknowledged: true, event: 'payment.failed' };
    }

    const rzpOrderId = paymentEntity.order_id;
    const rzpPaymentId = paymentEntity.id;

    const payment = await prisma.payment.findFirst({
      where: { providerOrderId: rzpOrderId },
    });

    if (!payment) {
      logger.warn({ rzpOrderId }, 'Webhook references unknown Razorpay order');
      return { acknowledged: true, event: 'payment.failed', skipped: true };
    }

    // Do NOT downgrade a captured payment to failed
    if (payment.status === 'CAPTURED' || payment.status === 'COMPLETED') {
      logger.info({ paymentId: payment.id }, 'Ignoring payment.failed — payment already captured');
      return { acknowledged: true, event: 'payment.failed', skipped: true };
    }

    if (!isValidTransition(payment.status, 'FAILED')) {
      return { acknowledged: true, event: 'payment.failed', skipped: true };
    }

    await prisma.$transaction(async (tx) => {
      await tx.payment.update({
        where: { id: payment.id },
        data: {
          status: 'FAILED',
          providerPaymentId: rzpPaymentId,
          failureCode: paymentEntity.error_code ?? null,
          failureMessage: paymentEntity.error_description ?? null,
        },
      });

      await tx.order.update({
        where: { id: payment.orderId },
        data: { paymentStatus: 'FAILED' },
      });

      await tx.auditEvent.create({
        data: {
          storeId: payment.storeId,
          orderId: payment.orderId,
          paymentId: payment.id,
          eventType: 'PAYMENT_FAILED',
          actorType: 'SYSTEM',
          status: 'FAILED',
          metadata: {
            razorpayOrderId: rzpOrderId,
            razorpayPaymentId: rzpPaymentId,
            event: 'payment.failed',
            errorCode: paymentEntity.error_code,
            errorDescription: paymentEntity.error_description,
            errorReason: paymentEntity.error_reason,
            explanation: `Payment failed: ${paymentEntity.error_description ?? 'Unknown error'}.`,
          },
        },
      });

      await tx.analyticsEvent.create({
        data: {
          storeId: payment.storeId,
          orderId: payment.orderId,
          eventType: 'PAYMENT_FAILED',
          value: payment.amount,
          currency: payment.currency,
          metadata: {
            razorpayOrderId: rzpOrderId,
            razorpayPaymentId: rzpPaymentId,
            event: 'payment.failed',
            errorCode: paymentEntity.error_code,
          },
        },
      });
    });

    return { acknowledged: true, event: 'payment.failed', processed: true };
  }

  // ── GET PAYMENT STATUS ───────────────────────────────────────────────────

  /**
   * Get payment information for an order.
   * Merchant-isolated: only returns payment for the requesting store.
   */
  async getPaymentByOrderId(storeId: string, orderId: string) {
    const payment = await prisma.payment.findFirst({
      where: { orderId, storeId },
      include: { order: { select: { orderNumber: true, status: true } } },
    });

    if (!payment) {
      throw new AppError({
        statusCode: 404,
        code: 'PAYMENT_NOT_FOUND',
        message: 'No payment found for this order.',
      });
    }

    return {
      id: payment.id,
      orderId: payment.orderId,
      orderNumber: payment.order.orderNumber,
      orderStatus: payment.order.status,
      provider: payment.provider,
      providerOrderId: payment.providerOrderId,
      amount: Number(payment.amount),
      currency: payment.currency,
      status: payment.status,
      method: payment.method,
      failureCode: payment.failureCode,
      failureMessage: payment.failureMessage,
      verifiedAt: payment.verifiedAt,
      createdAt: payment.createdAt,
      updatedAt: payment.updatedAt,
    };
  }

  // ── LIST PAYMENTS ────────────────────────────────────────────────────────

  async listPayments(
    storeId: string,
    query: {
      page?: number;
      limit?: number;
      status?: string;
      method?: string;
      search?: string;
    } = {}
  ) {
    const page = Math.max(1, query.page ?? 1);
    const limit = Math.min(100, Math.max(1, query.limit ?? 25));
    const skip = (page - 1) * limit;

    const where: Prisma.PaymentWhereInput = { storeId };
    if (query.status) where.status = query.status as any;
    if (query.method) where.method = query.method as any;
    if (query.search) {
      where.OR = [
        { providerOrderId: { contains: query.search, mode: 'insensitive' } },
        { providerPaymentId: { contains: query.search, mode: 'insensitive' } },
        { order: { orderNumber: { contains: query.search, mode: 'insensitive' } } },
      ];
    }

    const [items, total, summary] = await Promise.all([
      prisma.payment.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          order: {
            select: {
              orderNumber: true,
              status: true,
              customer: { select: { name: true, email: true, phone: true } },
            },
          },
        },
      }),
      prisma.payment.count({ where }),
      prisma.payment.aggregate({
        where: { storeId },
        _sum: { amount: true },
        _count: { id: true },
      }),
    ]);

    const statusTotals: Record<string, number> = {};
    const statuses = await prisma.payment.groupBy({
      where: { storeId },
      by: ['status'],
      _count: { id: true },
    });
    statuses.forEach((row) => {
      statusTotals[row.status] = row._count.id;
    });

    return {
      items: items.map((p) => ({
        id: p.id,
        orderId: p.orderId,
        orderNumber: p.order.orderNumber,
        customer: p.order.customer
          ? {
              name: p.order.customer.name,
              email: p.order.customer.email,
              phone: p.order.customer.phone,
            }
          : undefined,
        provider: p.provider,
        providerOrderId: p.providerOrderId,
        providerPaymentId: p.providerPaymentId,
        amount: Number(p.amount),
        currency: p.currency,
        status: p.status,
        method: p.method,
        failureCode: p.failureCode,
        failureMessage: p.failureMessage,
        verifiedAt: p.verifiedAt,
        createdAt: p.createdAt,
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      summary: {
        totalVolume: Number(summary._sum.amount ?? 0),
        totalCount: summary._count.id,
        byStatus: statusTotals,
      },
    };
  }
}

export const paymentService = new PaymentService();
