/**
 * Phase 7.7 — Centralized Audit Service
 *
 * Responsibilities:
 * - Query audit events (merchant-isolated, filtered, paginated)
 * - Retrieve single event detail
 * - Retrieve entity timelines (order, payment)
 * - Redact sensitive metadata before storage and retrieval
 * - Attach human-readable explanations to query results
 *
 * Append-only — no update or delete methods.
 */

import type { Prisma } from '@prisma/client';
import { prisma } from '../config/prisma.config.js';
import { AppError } from '../utils/app-error.js';
import { explain, inferEntityType } from './explainability.service.js';

// ─── Sensitive Field Redaction ───────────────────────────────────────────────

/** Fields that must NEVER be stored or returned in audit metadata. */
const REDACTED_KEYS = new Set([
  'authorization',
  'token',
  'accessToken',
  'refreshToken',
  'jwt',
  'secret',
  'key_secret',
  'keySecret',
  'apiKey',
  'api_key',
  'password',
  'passwordHash',
  'razorpay_signature',
  'razorpaySignature',
  'webhook_secret',
  'webhookSecret',
  'openai_api_key',
  'chain_of_thought',
  'chainOfThought',
  'hidden_prompt',
  'system_prompt',
  'RAZORPAY_KEY_SECRET',
  'RAZORPAY_WEBHOOK_SECRET',
  'OPENAI_API_KEY',
  'JWT_SECRET',
]);

/**
 * Deep-redact sensitive fields from a metadata object.
 * Returns a new object — never mutates the input.
 */
export function redactMetadata(obj: unknown): unknown {
  if (obj === null || obj === undefined) return obj;
  if (typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj.map(redactMetadata);

  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
    if (REDACTED_KEYS.has(key)) {
      result[key] = '[REDACTED]';
    } else if (typeof value === 'object' && value !== null) {
      result[key] = redactMetadata(value);
    } else {
      result[key] = value;
    }
  }
  return result;
}

// ─── Query Types ─────────────────────────────────────────────────────────────

export interface AuditQueryFilters {
  eventType?: string;
  actorType?: string;
  actorId?: string;
  orderId?: string;
  paymentId?: string;
  customerId?: string;
  riskLevel?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  page: number;
  limit: number;
  sort?: 'createdAt';
  order?: 'asc' | 'desc';
}

// ─── Response Shapes ─────────────────────────────────────────────────────────

interface AuditEventView {
  id: string;
  eventType: string;
  entityType: string;
  actorType: string;
  actorId: string | null;
  status: string;
  riskLevel: string;
  explanation: string;
  orderId: string | null;
  paymentId: string | null;
  customerId: string | null;
  requestId: string | null;
  createdAt: Date;
}

interface AuditEventDetail extends AuditEventView {
  storeId: string;
  metadata: unknown;
}

// ─── Audit Service ───────────────────────────────────────────────────────────

export class AuditService {
  /**
   * Transform a raw DB audit event into a safe view (list item).
   */
  private toView(event: {
    id: string;
    eventType: string;
    actorType: string;
    actorId: string | null;
    status: string;
    riskLevel: string;
    orderId: string | null;
    paymentId: string | null;
    customerId: string | null;
    requestId: string | null;
    metadata: Prisma.JsonValue;
    createdAt: Date;
  }): AuditEventView {
    return {
      id: event.id,
      eventType: event.eventType,
      entityType: inferEntityType(event.eventType),
      actorType: event.actorType,
      actorId: event.actorId,
      status: event.status,
      riskLevel: event.riskLevel,
      explanation: explain({
        eventType: event.eventType,
        metadata: event.metadata as Record<string, unknown> | null,
        status: event.status,
        riskLevel: event.riskLevel,
        actorType: event.actorType,
      }),
      orderId: event.orderId,
      paymentId: event.paymentId,
      customerId: event.customerId,
      requestId: event.requestId,
      createdAt: event.createdAt,
    };
  }

  /**
   * Transform a raw DB audit event into a safe detail (includes redacted metadata).
   */
  private toDetail(
    event: {
      id: string;
      storeId: string;
      eventType: string;
      actorType: string;
      actorId: string | null;
      status: string;
      riskLevel: string;
      orderId: string | null;
      paymentId: string | null;
      customerId: string | null;
      requestId: string | null;
      metadata: Prisma.JsonValue;
      createdAt: Date;
    }
  ): AuditEventDetail {
    return {
      ...this.toView(event),
      storeId: event.storeId,
      metadata: redactMetadata(event.metadata),
    };
  }

  // ── List Events ──────────────────────────────────────────────────────────

  /**
   * Query audit events with filters and pagination.
   * Always scoped to the authenticated merchant's storeId.
   */
  async listEvents(storeId: string, filters: AuditQueryFilters) {
    const where: Prisma.AuditEventWhereInput = { storeId };

    if (filters.eventType) where.eventType = filters.eventType;
    if (filters.actorType) where.actorType = filters.actorType as any;
    if (filters.actorId) where.actorId = filters.actorId;
    if (filters.orderId) where.orderId = filters.orderId;
    if (filters.paymentId) where.paymentId = filters.paymentId;
    if (filters.customerId) where.customerId = filters.customerId;
    if (filters.riskLevel) where.riskLevel = filters.riskLevel as any;
    if (filters.status) where.status = filters.status as any;

    if (filters.startDate || filters.endDate) {
      where.createdAt = {};
      if (filters.startDate) where.createdAt.gte = new Date(filters.startDate);
      if (filters.endDate) where.createdAt.lte = new Date(filters.endDate);
    }

    const orderBy: Prisma.AuditEventOrderByWithRelationInput = {
      createdAt: filters.order ?? 'desc',
    };

    const [events, total] = await prisma.$transaction([
      prisma.auditEvent.findMany({
        where,
        orderBy,
        skip: (filters.page - 1) * filters.limit,
        take: filters.limit,
      }),
      prisma.auditEvent.count({ where }),
    ]);

    return {
      items: events.map((e) => this.toView(e)),
      pagination: {
        page: filters.page,
        limit: filters.limit,
        total,
        totalPages: Math.ceil(total / filters.limit),
      },
    };
  }

  // ── Get Event Detail ─────────────────────────────────────────────────────

  /**
   * Get a single audit event by ID. Merchant-isolated.
   */
  async getEvent(storeId: string, eventId: string) {
    const event = await prisma.auditEvent.findFirst({
      where: { id: eventId, storeId },
    });

    if (!event) {
      throw new AppError({
        statusCode: 404,
        code: 'AUDIT_EVENT_NOT_FOUND',
        message: 'Audit event not found.',
      });
    }

    return this.toDetail(event);
  }

  // ── Entity Timelines ─────────────────────────────────────────────────────

  /**
   * Get chronological audit trail for a specific order.
   */
  async getOrderTimeline(storeId: string, orderId: string) {
    const events = await prisma.auditEvent.findMany({
      where: { storeId, orderId },
      orderBy: { createdAt: 'asc' },
      take: 200,
    });

    return {
      entityType: 'ORDER',
      entityId: orderId,
      timeline: events.map((e) => this.toView(e)),
    };
  }

  /**
   * Get chronological audit trail for a specific payment.
   */
  async getPaymentTimeline(storeId: string, paymentId: string) {
    const events = await prisma.auditEvent.findMany({
      where: { storeId, paymentId },
      orderBy: { createdAt: 'asc' },
      take: 200,
    });

    return {
      entityType: 'PAYMENT',
      entityId: paymentId,
      timeline: events.map((e) => this.toView(e)),
    };
  }
}

export const auditService = new AuditService();
