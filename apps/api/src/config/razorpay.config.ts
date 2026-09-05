import Razorpay from 'razorpay';
import { env } from './env.config.js';

/**
 * Razorpay Payment Gateway Configuration (Test Mode)
 * Used for order creation, signature verification, and webhook handling.
 */
export const razorpay = new Razorpay({
  key_id: env.RAZORPAY_KEY_ID,
  key_secret: env.RAZORPAY_KEY_SECRET,
});

export const razorpayConfig = {
  mode: env.RAZORPAY_MODE,
  keyId: env.RAZORPAY_KEY_ID,
  keySecret: env.RAZORPAY_KEY_SECRET,
  webhookSecret: env.RAZORPAY_WEBHOOK_SECRET,
  isConfigured: Boolean(env.RAZORPAY_KEY_ID && !env.RAZORPAY_KEY_ID.includes('mock')),
};
