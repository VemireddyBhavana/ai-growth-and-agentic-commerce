/**
 * Phase 7.7 — Explainability Service
 *
 * Deterministic, human-readable explanations for audit events.
 * NO LLM calls — pure template-based transformation.
 *
 * Strategy:
 * 1. If metadata.explanation exists, use it (Phases 7.5/7.6 already provide these)
 * 2. Otherwise, generate from eventType + metadata using templates
 */

interface AuditEventLike {
  eventType: string;
  metadata?: Record<string, unknown> | null;
  status?: string | null;
  riskLevel?: string | null;
  actorType?: string | null;
}

/**
 * Generate a concise human-readable explanation for an audit event.
 * Deterministic — same input always produces same output.
 */
export function explain(event: AuditEventLike): string {
  const meta = (event.metadata ?? {}) as Record<string, unknown>;

  // 1. Prefer pre-existing explanation from metadata
  if (typeof meta.explanation === 'string' && meta.explanation.length > 0) {
    return meta.explanation;
  }

  // 2. Template-based generation by event type
  switch (event.eventType) {
    // ── Auth ──────────────────────────────────────────────────────────────
    case 'AUTH_LOGIN':
      return 'User authenticated successfully.';
    case 'AUTH_FAILURE':
      return `Authentication failed${meta.reason ? `: ${meta.reason}` : '.'}`;
    case 'UNAUTHENTICATED_REQUEST':
      return 'Request was rejected because no valid authentication was provided.';
    case 'ACCESS_DENIED':
      return `Access was denied${meta.reason ? `: ${meta.reason}` : '.'}`;
    case 'CROSS_MERCHANT_ACCESS_ATTEMPT':
      return 'A cross-merchant access attempt was detected and blocked.';
    case 'RATE_LIMIT_EXCEEDED':
      return 'Request was rate-limited to protect system stability.';

    // ── Product / Catalog ────────────────────────────────────────────────
    case 'PRODUCT_CREATED':
      return `Product "${meta.name ?? meta.productId ?? 'unknown'}" was created.`;
    case 'PRODUCT_UPDATED':
      return `Product "${meta.name ?? meta.productId ?? 'unknown'}" was updated.`;
    case 'PRODUCT_ARCHIVED':
      return `Product "${meta.name ?? meta.productId ?? 'unknown'}" was archived.`;
    case 'PRODUCT_DELETED':
      return `Product was deleted.`;
    case 'VARIANT_CREATED':
      return `Variant "${meta.name ?? meta.variantId ?? 'unknown'}" was created for a product.`;
    case 'VARIANT_UPDATED':
      return `Variant was updated.`;
    case 'VARIANT_DELETED':
      return `Variant was deleted.`;
    case 'CATEGORY_CREATED':
      return `Category "${meta.name ?? 'unknown'}" was created.`;
    case 'CATEGORY_UPDATED':
      return `Category was updated.`;
    case 'CATEGORY_DELETED':
      return `Category was deleted.`;
    case 'INVENTORY_UPDATED':
      return `Inventory was updated${meta.quantity !== undefined ? ` to ${meta.quantity} units` : ''}.`;

    // ── Cart ─────────────────────────────────────────────────────────────
    case 'CART_CREATED':
      return `Shopping cart was created.`;
    case 'CART_ITEM_ADDED':
      return `Product${meta.productId ? ` ${meta.productId}` : ''} was added to the cart${meta.quantity ? ` (qty: ${meta.quantity})` : ''}.`;
    case 'CART_ITEM_UPDATED':
      return `Cart item quantity was updated${meta.quantity ? ` to ${meta.quantity}` : ''}.`;
    case 'CART_ITEM_REMOVED':
      return `Item was removed from the cart.`;
    case 'CART_CLEARED':
      return 'All items were removed from the cart.';

    // ── Order ────────────────────────────────────────────────────────────
    case 'ORDER_CREATED':
      return `Order ${meta.orderNumber ?? ''} was created${meta.total ? ` for ₹${meta.total}` : ''} after server-side product, price, and inventory validation.`;
    case 'ORDER_VALIDATION_FAILED':
      return `Order validation failed${meta.reason ? `: ${meta.reason}` : '.'}`;
    case 'ORDER_CANCELLED':
      return `Order was cancelled${meta.reason ? `: ${meta.reason}` : '.'}`;
    case 'ORDER_STATUS_UPDATED':
      return `Order status was updated${meta.from && meta.to ? ` from ${meta.from} to ${meta.to}` : ''}.`;

    // ── AI ────────────────────────────────────────────────────────────────
    case 'AI_REQUEST':
      return 'An AI recommendation request was submitted.';
    case 'AI_RECOMMENDATION_GENERATED':
    case 'AI_RECOMMENDATION_CREATED': {
      const count = Array.isArray(meta.recommendedProductIds) ? meta.recommendedProductIds.length : undefined;
      return `AI generated ${count ?? 'product'} recommendation${count !== 1 ? 's' : ''} based on the customer's requirements.`;
    }
    case 'AI_DECISION_CREATED':
      return `AI made a ${meta.decisionType ?? 'recommendation'} decision${meta.confidence ? ` with ${(Number(meta.confidence) * 100).toFixed(0)}% confidence` : ''}.`;
    case 'AI_CLARIFICATION_REQUESTED':
      return `AI requested additional clarification${meta.reason ? `: ${meta.reason}` : ''} before making a recommendation.`;

    // ── Payment ──────────────────────────────────────────────────────────
    case 'PAYMENT_ORDER_CREATED':
      return `Payment request created for ${meta.orderNumber ? `order ${meta.orderNumber}` : 'an order'} using the server-verified order total${meta.amount ? ` of ₹${meta.amount}` : ''}.`;
    case 'PAYMENT_VERIFIED':
      return `Payment${meta.amount ? ` of ₹${meta.amount}` : ''} was verified${meta.razorpayOrderId ? ` against Razorpay order ${meta.razorpayOrderId}` : ''}.`;
    case 'PAYMENT_VERIFICATION_REJECTED':
      return 'Payment verification failed because the provider signature was invalid.';
    case 'PAYMENT_FAILED':
      return `Payment failed${meta.errorDescription || meta.errorCode ? `: ${meta.errorDescription ?? meta.errorCode}` : '.'}`;
    case 'PAYMENT_WEBHOOK_RECEIVED':
      return `Razorpay webhook event "${meta.event ?? 'unknown'}" was received.`;
    case 'PAYMENT_WEBHOOK_PROCESSED':
      return `Razorpay webhook event "${meta.event ?? 'unknown'}" was processed successfully.`;
    case 'PAYMENT_WEBHOOK_DUPLICATE':
      return 'A duplicate Razorpay webhook event was safely ignored.';

    // ── Guardrails & Bounded Actions ─────────────────────────────────────
    case 'ACTION_PROPOSED':
      return `AI proposed a ${meta.actionType ?? 'growth'} action${meta.reason ? `: ${meta.reason}` : ''}.`;
    case 'ACTION_POLICY_EVALUATED':
      return `Policy engine evaluated action "${meta.actionType ?? 'action'}" as ${meta.allowed ? 'allowed' : 'rejected'}${meta.riskLevel ? ` (Risk: ${meta.riskLevel})` : ''}.`;
    case 'ACTION_APPROVAL_REQUIRED':
      return `Action "${meta.actionType ?? 'action'}" requires explicit merchant approval before execution.`;
    case 'ACTION_APPROVED':
      return `Merchant approved the proposed ${meta.actionType ?? 'growth'} action.`;
    case 'ACTION_REJECTED':
      return `Action "${meta.actionType ?? 'action'}" was rejected${meta.rejectionReason ? `: ${meta.rejectionReason}` : '.'}`;
    case 'ACTION_EXPIRED':
      return `Action approval expired after 24 hours without execution.`;
    case 'ACTION_EXECUTION_STARTED':
      return `Execution started for approved action "${meta.actionType ?? 'action'}".`;
    case 'ACTION_EXECUTED':
      return typeof meta.explanation === 'string'
        ? meta.explanation
        : `Action "${meta.actionType ?? 'action'}" was successfully executed and verified.`;
    case 'ACTION_EXECUTION_FAILED':
      return `Action execution failed${meta.error ? `: ${meta.error}` : '.'}`;
    case 'ACTION_STALE':
      return `Action execution aborted because target entity state changed since approval.`;
    case 'ACTION_LIMIT_EXCEEDED':
      return `Action proposal was rate-limited by merchant policy bounds.`;

    // ── Fallback ─────────────────────────────────────────────────────────
    default:
      return `Event "${event.eventType}" occurred${event.status ? ` with status ${event.status}` : ''}.`;
  }
}

/**
 * Infer an entity type from the event type string.
 * Used to enrich audit list responses.
 */
export function inferEntityType(eventType: string): string {
  if (eventType.startsWith('PRODUCT_') || eventType.startsWith('VARIANT_') || eventType.startsWith('CATEGORY_') || eventType.startsWith('INVENTORY_')) return 'PRODUCT';
  if (eventType.startsWith('CART_')) return 'CART';
  if (eventType.startsWith('ORDER_')) return 'ORDER';
  if (eventType.startsWith('PAYMENT_')) return 'PAYMENT';
  if (eventType.startsWith('AI_')) return 'AI';
  if (eventType.startsWith('ACTION_')) return 'GUARDRAIL_ACTION';
  if (eventType.startsWith('AUTH_') || eventType === 'UNAUTHENTICATED_REQUEST' || eventType === 'ACCESS_DENIED' || eventType === 'CROSS_MERCHANT_ACCESS_ATTEMPT' || eventType === 'RATE_LIMIT_EXCEEDED') return 'AUTH';
  return 'SYSTEM';
}

/**
 * Event type taxonomy — canonical set from Phases 7.3–7.10.
 * Used for validation of filter queries.
 */
export const KNOWN_EVENT_TYPES = [
  // Auth
  'AUTH_LOGIN', 'AUTH_FAILURE', 'UNAUTHENTICATED_REQUEST', 'ACCESS_DENIED',
  'CROSS_MERCHANT_ACCESS_ATTEMPT', 'RATE_LIMIT_EXCEEDED',
  // Product / Catalog
  'PRODUCT_CREATED', 'PRODUCT_UPDATED', 'PRODUCT_ARCHIVED', 'PRODUCT_DELETED',
  'VARIANT_CREATED', 'VARIANT_UPDATED', 'VARIANT_DELETED',
  'CATEGORY_CREATED', 'CATEGORY_UPDATED', 'CATEGORY_DELETED',
  'INVENTORY_UPDATED',
  // Cart
  'CART_CREATED', 'CART_ITEM_ADDED', 'CART_ITEM_UPDATED', 'CART_ITEM_REMOVED', 'CART_CLEARED',
  // Order
  'ORDER_CREATED', 'ORDER_VALIDATION_FAILED', 'ORDER_CANCELLED', 'ORDER_STATUS_UPDATED',
  // AI
  'AI_REQUEST', 'AI_RECOMMENDATION_GENERATED', 'AI_RECOMMENDATION_CREATED',
  'AI_DECISION_CREATED', 'AI_CLARIFICATION_REQUESTED',
  // Payment
  'PAYMENT_ORDER_CREATED', 'PAYMENT_VERIFIED', 'PAYMENT_VERIFICATION_REJECTED',
  'PAYMENT_FAILED', 'PAYMENT_WEBHOOK_RECEIVED', 'PAYMENT_WEBHOOK_PROCESSED',
  'PAYMENT_WEBHOOK_DUPLICATE',
  // Guardrails & Bounded Actions
  'ACTION_PROPOSED', 'ACTION_POLICY_EVALUATED', 'ACTION_APPROVAL_REQUIRED',
  'ACTION_APPROVED', 'ACTION_REJECTED', 'ACTION_EXPIRED',
  'ACTION_EXECUTION_STARTED', 'ACTION_EXECUTED', 'ACTION_EXECUTION_FAILED',
  'ACTION_STALE', 'ACTION_LIMIT_EXCEEDED',
] as const;

export type KnownEventType = (typeof KNOWN_EVENT_TYPES)[number];
