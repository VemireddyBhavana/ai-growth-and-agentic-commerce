import type {
  Prisma,
  Store,
  Product,
  Customer,
  ShoppingCart,
  CartItem,
  Order,
  Payment,
  AuditEvent,
  AnalyticsEvent,
  ProductStatus,
  CartStatus,
  OrderStatus,
  PaymentStatus,
  PaymentMethod,
  AuditEventStatus,
  RiskLevel,
  ActorType,
} from '@prisma/client';
import { BaseRepository } from './base.repository.js';

export interface ProductFilters {
  categoryId?: string;
  status?: ProductStatus;
  isFeatured?: boolean;
  isBestSeller?: boolean;
  search?: string;
  skip?: number;
  take?: number;
  orderBy?: 'createdAt' | 'price' | 'name';
  orderDir?: 'asc' | 'desc';
}

export interface CreateOrderItemInput {
  productId: string;
  variantId?: string;
  productName: string;
  sku?: string;
  quantity: number;
  unitPrice: Prisma.Decimal;
  discount?: Prisma.Decimal;
  totalPrice: Prisma.Decimal;
}

export interface CreateOrderInput {
  storeId: string;
  customerId?: string;
  customerEmail?: string;
  customerName?: string;
  orderNumber: string;
  status?: OrderStatus;
  paymentStatus?: PaymentStatus;
  paymentMethod: PaymentMethod;
  items: CreateOrderItemInput[];
  subtotal: Prisma.Decimal;
  discount?: Prisma.Decimal;
  tax?: Prisma.Decimal;
  shipping?: Prisma.Decimal;
  total: Prisma.Decimal;
  currency?: string;
  couponCode?: string;
  aiAssisted?: boolean;
  aiSessionId?: string;
  shippingAddress?: Prisma.InputJsonValue;
  billingAddress?: Prisma.InputJsonValue;
  notes?: string;
}

export interface CreatePaymentInput {
  storeId: string;
  orderId: string;
  provider: string;
  providerOrderId?: string;
  providerPaymentId?: string;
  amount: Prisma.Decimal;
  currency?: string;
  status?: PaymentStatus;
  method: PaymentMethod;
  failureCode?: string;
  failureMessage?: string;
  verifiedAt?: Date;
}

export interface CreateAuditEventInput {
  storeId: string;
  customerId?: string;
  orderId?: string;
  paymentId?: string;
  eventType: string;
  status?: AuditEventStatus;
  riskLevel?: RiskLevel;
  requestId?: string;
  actorType: ActorType;
  actorId?: string;
  metadata?: Prisma.InputJsonValue;
}

export interface CreateAnalyticsEventInput {
  storeId: string;
  customerId?: string;
  sessionId?: string;
  eventType: string;
  productId?: string;
  orderId?: string;
  value?: Prisma.Decimal;
  currency?: string;
  metadata?: Prisma.InputJsonValue;
}

export interface CreateCartInput {
  storeId: string;
  customerId?: string;
  currency?: string;
  status?: CartStatus;
}

export interface AddCartItemInput {
  cartId: string;
  productId: string;
  variantId?: string;
  quantity: number;
  unitPrice: Prisma.Decimal;
}

export class DataRepository extends BaseRepository {
  // ============================================================
  // Merchant / Store
  // ============================================================
  async findMerchantById(id: string): Promise<Store | null> {
    return this.db.store.findUnique({
      where: { id },
      include: {
        owner: true,
        products: { take: 20, orderBy: { createdAt: 'desc' } },
        customers: { take: 20, orderBy: { createdAt: 'desc' } },
        categories: { orderBy: { name: 'asc' } },
        orders: { take: 10, orderBy: { createdAt: 'desc' } },
        payments: { take: 10, orderBy: { createdAt: 'desc' } },
        aiDecisions: { take: 10, orderBy: { createdAt: 'desc' } },
        auditEvents: { take: 10, orderBy: { createdAt: 'desc' } },
        analyticsEvents: { take: 10, orderBy: { createdAt: 'desc' } },
      },
    });
  }

  // ============================================================
  // Product
  // ============================================================
  async findProducts(storeId: string, filters: ProductFilters = {}): Promise<Product[]> {
    const where: Prisma.ProductWhereInput = { storeId };

    if (filters.categoryId) where.categoryId = filters.categoryId;
    if (filters.status) where.status = filters.status;
    if (filters.isFeatured !== undefined) where.isFeatured = filters.isFeatured;
    if (filters.isBestSeller !== undefined) where.isBestSeller = filters.isBestSeller;
    if (filters.search) {
      where.OR = [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } },
        { sku: { contains: filters.search, mode: 'insensitive' } },
        { brand: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    const orderByArg: Prisma.ProductOrderByWithRelationInput = {};
    if (filters.orderBy && filters.orderDir) {
      orderByArg[filters.orderBy] = filters.orderDir;
    } else {
      orderByArg.createdAt = 'desc';
    }

    return this.db.product.findMany({
      where,
      include: {
        variants: true,
        inventory: true,
        productCategory: true,
      },
      skip: filters.skip,
      take: filters.take ?? 50,
      orderBy: orderByArg,
    });
  }

  async findProductById(id: string): Promise<Product | null> {
    return this.db.product.findUnique({
      where: { id },
      include: {
        variants: true,
        inventory: true,
        productCategory: true,
        orderItems: { take: 10, orderBy: { createdAt: 'desc' } },
        recommendations: { take: 10, orderBy: { createdAt: 'desc' } },
      },
    });
  }

  // ============================================================
  // Customer
  // ============================================================
  async findCustomerById(id: string): Promise<Customer | null> {
    return this.db.customer.findUnique({
      where: { id },
      include: {
        orders: { take: 20, orderBy: { createdAt: 'desc' }, include: { items: true } },
        carts: { take: 5, orderBy: { createdAt: 'desc' }, include: { items: true } },
        aiConversations: { take: 5, orderBy: { createdAt: 'desc' } },
        auditEvents: { take: 10, orderBy: { createdAt: 'desc' } },
        analyticsEvents: { take: 10, orderBy: { createdAt: 'desc' } },
      },
    });
  }

  // ============================================================
  // Shopping Cart
  // ============================================================
  async createCart(input: CreateCartInput): Promise<ShoppingCart> {
    return this.db.shoppingCart.create({
      data: {
        storeId: input.storeId,
        customerId: input.customerId,
        currency: input.currency ?? 'INR',
        status: input.status ?? 'ACTIVE',
      },
      include: { items: true, customer: true, store: true },
    });
  }

  async addCartItem(input: AddCartItemInput): Promise<CartItem> {
    const existing = await this.db.cartItem.findFirst({
      where: {
        cartId: input.cartId,
        productId: input.productId,
        variantId: input.variantId ?? null,
      },
    });

    if (existing) {
      return this.db.cartItem.update({
        where: { id: existing.id },
        data: { quantity: existing.quantity + input.quantity },
      });
    }

    return this.db.cartItem.create({
      data: {
        cartId: input.cartId,
        productId: input.productId,
        variantId: input.variantId,
        quantity: input.quantity,
        unitPrice: input.unitPrice,
      },
    });
  }

  // ============================================================
  // Order
  // ============================================================
  async createOrder(input: CreateOrderInput): Promise<Order> {
    return this.db.order.create({
      data: {
        storeId: input.storeId,
        customerId: input.customerId,
        customerEmail: input.customerEmail,
        customerName: input.customerName,
        orderNumber: input.orderNumber,
        status: input.status ?? 'PENDING',
        paymentStatus: input.paymentStatus ?? 'PENDING',
        paymentMethod: input.paymentMethod,
        subtotal: input.subtotal,
        discount: input.discount ?? 0,
        tax: input.tax ?? 0,
        shipping: input.shipping ?? 0,
        total: input.total,
        currency: input.currency ?? 'INR',
        couponCode: input.couponCode,
        aiAssisted: input.aiAssisted ?? false,
        aiSessionId: input.aiSessionId,
        shippingAddress: input.shippingAddress,
        billingAddress: input.billingAddress,
        notes: input.notes,
        items: {
          createMany: {
            data: input.items.map((it) => ({
              productId: it.productId,
              variantId: it.variantId,
              productName: it.productName,
              sku: it.sku,
              quantity: it.quantity,
              unitPrice: it.unitPrice,
              discount: it.discount ?? 0,
              totalPrice: it.totalPrice,
            })),
          },
        },
      },
      include: {
        items: true,
        customer: true,
        store: true,
        payment: true,
        refunds: true,
        session: true,
      },
    });
  }

  async findOrderById(id: string): Promise<Order | null> {
    return this.db.order.findUnique({
      where: { id },
      include: {
        items: true,
        customer: true,
        store: true,
        payment: true,
        refunds: true,
        session: true,
      },
    });
  }

  // ============================================================
  // Payment
  // ============================================================
  async createPayment(input: CreatePaymentInput): Promise<Payment> {
    return this.db.payment.create({
      data: {
        storeId: input.storeId,
        orderId: input.orderId,
        provider: input.provider,
        providerOrderId: input.providerOrderId,
        providerPaymentId: input.providerPaymentId,
        amount: input.amount,
        currency: input.currency ?? 'INR',
        status: input.status ?? 'PENDING',
        method: input.method,
        failureCode: input.failureCode,
        failureMessage: input.failureMessage,
        verifiedAt: input.verifiedAt,
      },
      include: { order: true, store: true },
    });
  }

  // ============================================================
  // Audit Event (append-only)
  // ============================================================
  async createAuditEvent(input: CreateAuditEventInput): Promise<AuditEvent> {
    return this.db.auditEvent.create({
      data: {
        storeId: input.storeId,
        customerId: input.customerId,
        orderId: input.orderId,
        paymentId: input.paymentId,
        eventType: input.eventType,
        status: input.status ?? 'SUCCESS',
        riskLevel: input.riskLevel ?? 'LOW',
        requestId: input.requestId,
        actorType: input.actorType,
        actorId: input.actorId,
        metadata: input.metadata,
      },
    });
  }

  // ============================================================
  // Analytics Event
  // ============================================================
  async createAnalyticsEvent(input: CreateAnalyticsEventInput): Promise<AnalyticsEvent> {
    return this.db.analyticsEvent.create({
      data: {
        storeId: input.storeId,
        customerId: input.customerId,
        sessionId: input.sessionId,
        eventType: input.eventType,
        productId: input.productId,
        orderId: input.orderId,
        value: input.value,
        currency: input.currency,
        metadata: input.metadata,
      },
    });
  }
}

// ============================================================
// Expose singleton + re-export transactional variant consumer
// ============================================================
export const dataRepository = new DataRepository();

export function createTransactionalDataRepository(
  client: Prisma.TransactionClient
): Omit<DataRepository, 'pingDatabase'> {
  const repo = new DataRepository();
  Object.defineProperty(repo, 'db', {
    value: client,
    writable: false,
  });
  return repo;
}
