/**
 * Phase 7.6 — Payment Types
 * Razorpay-specific types and interfaces for the payment service layer.
 */

// ─── Checkout Response (returned to frontend) ────────────────────────────────

/** Safe checkout information returned to the frontend. Never contains secrets. */
export interface CheckoutResponse {
  /** Application order ID */
  orderId: string;
  /** Application payment record ID */
  paymentId: string;
  /** Razorpay order ID (order_xxxxx) */
  razorpayOrderId: string;
  /** Amount in smallest currency unit (paise for INR) */
  amount: number;
  /** ISO 4217 currency code */
  currency: string;
  /** Razorpay PUBLIC key ID — safe to expose */
  keyId: string;
  /** Order number for display/receipt */
  orderNumber: string;
}

// ─── Verification Request ────────────────────────────────────────────────────

/** Values returned by Razorpay Checkout after payment completion. */
export interface PaymentVerificationInput {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

// ─── Webhook Types ───────────────────────────────────────────────────────────

export interface RazorpayWebhookPayload {
  entity: string;
  account_id: string;
  event: string;
  contains: string[];
  payload: {
    payment?: {
      entity: RazorpayPaymentEntity;
    };
    order?: {
      entity: RazorpayOrderEntity;
    };
  };
  created_at: number;
}

export interface RazorpayPaymentEntity {
  id: string;
  entity: string;
  amount: number;
  currency: string;
  status: string;
  order_id: string;
  method: string;
  description?: string;
  error_code?: string;
  error_description?: string;
  error_reason?: string;
  notes?: Record<string, string>;
}

export interface RazorpayOrderEntity {
  id: string;
  entity: string;
  amount: number;
  currency: string;
  status: string;
  receipt?: string;
}

// ─── Provider Abstraction ────────────────────────────────────────────────────

export interface CreateOrderParams {
  amountPaise: number;
  currency: string;
  receipt: string;
  notes?: Record<string, string>;
}

export interface CreateOrderResult {
  razorpayOrderId: string;
  amount: number;
  currency: string;
  status: string;
}

// ─── Payment State ───────────────────────────────────────────────────────────

/** Valid payment status transitions. Monotonic — captured is terminal success. */
export const VALID_PAYMENT_TRANSITIONS: Record<string, string[]> = {
  CREATED: ['PENDING', 'AUTHORIZED', 'PROCESSING', 'CAPTURED', 'FAILED'],
  PENDING: ['AUTHORIZED', 'PROCESSING', 'CAPTURED', 'FAILED'],
  AUTHORIZED: ['PROCESSING', 'CAPTURED', 'FAILED'],
  PROCESSING: ['CAPTURED', 'FAILED'],
  // Terminal states — no forward transitions
  CAPTURED: [],
  COMPLETED: [],
  FAILED: [],
  REFUNDED: [],
};

/** Check whether a state transition is valid and forward-monotonic. */
export function isValidTransition(from: string, to: string): boolean {
  return VALID_PAYMENT_TRANSITIONS[from]?.includes(to) ?? false;
}

// ─── Currency ────────────────────────────────────────────────────────────────

/** Currencies supported for Razorpay payment, with their minor-unit multiplier. */
export const CURRENCY_MULTIPLIERS: Record<string, number> = {
  INR: 100,
  USD: 100,
  EUR: 100,
  GBP: 100,
};

/** Map Razorpay payment method strings to our PaymentMethod enum values. */
export function mapRazorpayMethod(method?: string): string {
  switch (method) {
    case 'upi':
      return 'UPI';
    case 'card':
      return 'CARD';
    case 'netbanking':
      return 'NET_BANKING';
    case 'wallet':
      return 'WALLET';
    default:
      return 'UPI'; // safe default for test mode
  }
}
