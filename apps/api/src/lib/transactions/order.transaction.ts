import { prisma } from '../../config/prisma.config.js';
import type {
  CreateOrderInput,
  CreatePaymentInput,
  CreateAuditEventInput,
} from '../../repositories/data.repository.js';
import { createTransactionalDataRepository } from '../../repositories/data.repository.js';
import type { Order, Payment, AuditEvent, Prisma } from '@prisma/client';

export interface OrderLineInventoryRef {
  productId: string;
  variantId?: string;
  quantity: number;
}

export interface CreateOrderTransactionInput {
  order: CreateOrderInput;
  inventoryLines: OrderLineInventoryRef[];
  pendingPayment: Omit<CreatePaymentInput, 'storeId' | 'orderId' | 'status' | 'amount'> & {
    amount?: Prisma.Decimal;
    status?: any;
  };
  audit: Omit<
    CreateAuditEventInput,
    'storeId' | 'orderId' | 'eventType' | 'status' | 'riskLevel'
  > & {
    eventType?: string;
    status?: any;
    riskLevel?: any;
  };
  /**
   * If true, will throw an explicit inventory error rather than allowing
   * negative or below-threshold stock. Default true.
   */
  strictInventory?: boolean;
}

export interface CreateOrderTransactionResult {
  order: Order;
  payment: Payment;
  audit: AuditEvent;
  reservedInventoryCount: number;
}

/**
 * Atomic Prisma interactive transaction for Order creation.
 *
 * Guarantees either ALL of the following succeed, or the entire transaction
 * is rolled back:
 *   1. Create Order record + nested OrderItem rows
 *   2. Reserve inventory (decrement quantity, increment reservedQuantity)
 *      for each line — matching variantId first, then product-level fallback.
 *   3. Create a PENDING Payment row (one-to-one with the Order)
 *   4. Append an ORDER_CREATED AuditEvent
 *
 * Uses a Prisma interactive transaction so validation between steps can
 * inspect row-counts and decide to roll back before the transaction commits.
 */
export async function createOrderWithInventoryReservationAndAuditTransaction(
  input: CreateOrderTransactionInput
): Promise<CreateOrderTransactionResult> {
  const strictInventory = input.strictInventory ?? true;

  return prisma.$transaction(
    async (tx: Prisma.TransactionClient) => {
      const db = createTransactionalDataRepository(tx);

      // ---- 1. CREATE ORDER + ORDER ITEMS ----
      const order = await db.createOrder({
        ...input.order,
        status: input.order.status ?? 'PENDING',
        paymentStatus: input.order.paymentStatus ?? 'PENDING',
      });

      // ---- 2. RESERVE INVENTORY ----
      let reservedInventoryCount = 0;

      for (const line of input.inventoryLines) {
        // Prefer variant-level inventory, fall back to product-level
        const match: Prisma.InventoryWhereInput = line.variantId
          ? { variantId: line.variantId }
          : { productId: line.productId, variantId: null };

        const inventory = await tx.inventory.findFirst({
          where: { ...match, productId: line.productId },
          orderBy: { id: 'asc' },
        });

        if (!inventory) {
          if (strictInventory) {
            throw new Error(
              `Inventory record not found for productId=${line.productId}, variantId=${line.variantId ?? 'null'}`
            );
          }
          continue;
        }

        const available = inventory.quantity - inventory.reservedQuantity;
        if (strictInventory && available < line.quantity) {
          throw new Error(
            `Insufficient inventory for productId=${line.productId}, variantId=${line.variantId ?? 'null'}: ` +
              `requested=${line.quantity}, available=${available}`
          );
        }

        await tx.inventory.update({
          where: { id: inventory.id },
          data: {
            quantity: { decrement: line.quantity },
            reservedQuantity: { increment: line.quantity },
            status:
              inventory.quantity - line.quantity <= 0
                ? 'OUT_OF_STOCK'
                : inventory.quantity - line.quantity <= (inventory.lowStockThreshold ?? 0)
                  ? 'RESERVED'
                  : inventory.status,
          },
        });

        reservedInventoryCount += 1;
      }

      // ---- 3. CREATE PENDING PAYMENT ----
      const paymentInput: CreatePaymentInput = {
        storeId: order.storeId,
        orderId: order.id,
        provider: input.pendingPayment.provider,
        providerOrderId: input.pendingPayment.providerOrderId,
        providerPaymentId: input.pendingPayment.providerPaymentId,
        amount: input.pendingPayment.amount ?? order.total,
        currency: input.pendingPayment.currency ?? order.currency ?? 'INR',
        status: input.pendingPayment.status ?? 'PENDING',
        method: input.pendingPayment.method,
        failureCode: input.pendingPayment.failureCode,
        failureMessage: input.pendingPayment.failureMessage,
        verifiedAt: input.pendingPayment.verifiedAt,
      };
      const payment = await db.createPayment(paymentInput);

      // ---- 4. APPEND AUDIT EVENT (append-only) ----
      const auditInput: CreateAuditEventInput = {
        storeId: order.storeId,
        customerId: order.customerId ?? undefined,
        orderId: order.id,
        paymentId: payment.id,
        eventType: input.audit.eventType ?? 'ORDER_CREATED',
        status: input.audit.status ?? 'SUCCESS',
        riskLevel: input.audit.riskLevel ?? 'LOW',
        requestId: input.audit.requestId,
        actorType: input.audit.actorType,
        actorId: input.audit.actorId,
        metadata: input.audit.metadata ?? {
          orderNumber: order.orderNumber,
          itemsCount: input.order.items.length,
          total: order.total.toString(),
          currency: order.currency,
        },
      };
      const audit = await db.createAuditEvent(auditInput);

      return {
        order,
        payment,
        audit,
        reservedInventoryCount,
      };
    },
    {
      // Prisma isolation level hint — optional, preserved for future tuning.
      // isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
    }
  );
}

/**
 * Small helper that builds the `inventoryLines` array directly from the
 * order input so callers don't have to duplicate data.
 */
export function buildInventoryLinesFromOrder(order: CreateOrderInput): OrderLineInventoryRef[] {
  return order.items.map((it) => ({
    productId: it.productId,
    variantId: it.variantId,
    quantity: it.quantity,
  }));
}
