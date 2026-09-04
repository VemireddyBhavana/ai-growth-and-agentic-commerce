/**
 * Phase 7.6 — Razorpay Provider
 *
 * Thin wrapper around the Razorpay SDK.
 * All cryptographic verification is performed here.
 * Never exposes secrets beyond this module.
 */

import crypto from 'node:crypto';
import { razorpay, razorpayConfig } from '../../config/razorpay.config.js';
import { AppError } from '../../utils/app-error.js';
import { logger } from '../../utils/logger.js';
import type { CreateOrderParams, CreateOrderResult } from './payment.types.js';

export class RazorpayProvider {
  /**
   * Create a Razorpay order via the SDK.
   * Amount must already be in the smallest currency unit (paise for INR).
   */
  async createOrder(params: CreateOrderParams): Promise<CreateOrderResult> {
    try {
      const order = await razorpay.orders.create({
        amount: params.amountPaise,
        currency: params.currency,
        receipt: params.receipt,
        notes: params.notes ?? {},
      });

      logger.info(
        { razorpayOrderId: order.id, amount: params.amountPaise, currency: params.currency },
        'Razorpay order created successfully'
      );

      return {
        razorpayOrderId: order.id,
        amount: order.amount as number,
        currency: order.currency,
        status: order.status as string,
      };
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Razorpay order creation failed';
      logger.error({ error, amount: params.amountPaise }, 'Razorpay order creation failed');
      throw new AppError({
        statusCode: 502,
        code: 'RAZORPAY_ORDER_FAILED',
        message: `Payment provider error: ${message}`,
        remediation: 'Please retry. If the issue persists, contact support.',
      });
    }
  }

  /**
   * Verify Razorpay payment signature using HMAC-SHA256.
   *
   * Razorpay standard:
   *   generated_signature = HMAC-SHA256(razorpay_order_id + "|" + razorpay_payment_id, key_secret)
   *   verify: generated_signature === razorpay_signature
   */
  verifyPaymentSignature(
    razorpayOrderId: string,
    razorpayPaymentId: string,
    razorpaySignature: string
  ): boolean {
    const body = `${razorpayOrderId}|${razorpayPaymentId}`;
    const expectedSignature = crypto
      .createHmac('sha256', razorpayConfig.keySecret)
      .update(body)
      .digest('hex');

    return crypto.timingSafeEqual(
      Buffer.from(expectedSignature, 'hex'),
      Buffer.from(razorpaySignature, 'hex')
    );
  }

  /**
   * Verify Razorpay webhook signature using HMAC-SHA256.
   *
   * Razorpay standard:
   *   generated_signature = HMAC-SHA256(raw_webhook_body, webhook_secret)
   *   verify: generated_signature === x-razorpay-signature header
   */
  verifyWebhookSignature(rawBody: string | Buffer, signature: string): boolean {
    const webhookSecret = razorpayConfig.webhookSecret;
    if (!webhookSecret) {
      logger.warn('Webhook secret not configured — cannot verify webhook signature');
      return false;
    }

    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(rawBody)
      .digest('hex');

    try {
      return crypto.timingSafeEqual(
        Buffer.from(expectedSignature, 'hex'),
        Buffer.from(signature, 'hex')
      );
    } catch {
      // timingSafeEqual throws if lengths differ → signature is invalid
      return false;
    }
  }

  /** Return only the public key ID — safe for frontend. */
  getPublicKeyId(): string {
    return razorpayConfig.keyId;
  }
}

export const razorpayProvider = new RazorpayProvider();
