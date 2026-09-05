import { create } from 'zustand';
import { toast } from 'sonner';
import type { Order, OrderStatus } from '@/types/orders';
import { apiClient } from '@/lib/api-client';

const STORE_ID =
  (typeof process !== 'undefined' ? (process.env as any)?.NEXT_PUBLIC_STORE_ID : undefined) ||
  'acme-retail';

// No mock data — store fetches exclusively from the real API.

interface OrdersState {
  orders: Order[];
  searchQuery: string;
  statusFilter: OrderStatus | 'all';
  dateFilter: 'today' | '7days' | '30days' | 'all';
  sortBy: 'newest' | 'oldest' | 'highest_amount' | 'lowest_amount';
  isLoading: boolean;
  error: string | null;

  fetchOrders: () => Promise<void>;
  setSearchQuery: (query: string) => void;
  setStatusFilter: (status: OrderStatus | 'all') => void;
  setDateFilter: (filter: 'today' | '7days' | '30days' | 'all') => void;
  setSortBy: (sort: 'newest' | 'oldest' | 'highest_amount' | 'lowest_amount') => void;
  requestRefund: (orderId: string, reason: string) => void;

  getFilteredAndSortedOrders: () => Order[];
  getOrderStats: () => {
    total: number;
    completed: number;
    pending: number;
    cancelled: number;
    refunded: number;
    revenue: number;
  };
}

function mapApiOrder(o: any, idx: number): Order {
  const items = Array.isArray(o.items)
    ? o.items.map((i: any, j: number) => ({
        id: String(i.id ?? j + 1),
        name: String(i.productName ?? i.name ?? i.product?.name ?? 'Product'),
        price: Number(i.price ?? i.unitPrice ?? 0),
        quantity: Number(i.quantity ?? 1),
      }))
    : [];

  const rawStatus = String(o.status ?? 'processing').toLowerCase();
  const subtotal = Number(o.subtotal ?? o.totalAmount ?? 0);
  const tax = Number(o.tax ?? 0);
  const shipping = Number(o.shipping ?? 0);
  const discount = Number(o.discount ?? 0);
  const total = Number(o.total ?? o.totalAmount ?? subtotal + tax + shipping - discount);

  const pay = o.payment ?? o.paymentDetails ?? {};
  const timeline =
    Array.isArray(o.timeline) && o.timeline.length
      ? o.timeline
      : [
          {
            id: 't1',
            status: 'Order Created',
            description: 'Order created',
            timestamp: String(o.createdAt ?? new Date().toISOString()),
            completed: true,
          },
        ];
  const ship =
    o.shippingAddress && typeof o.shippingAddress === 'object'
      ? o.shippingAddress
      : {
          fullName: o.customerName || 'Customer',
          street: 'Standard Delivery',
          city: 'Bengaluru',
          state: 'KA',
          zip: '560001',
          country: 'India',
        };
  const bill = o.billingAddress && typeof o.billingAddress === 'object' ? o.billingAddress : ship;
  void idx;
  const validStatus: OrderStatus =
    rawStatus === 'confirmed' || rawStatus === 'packed'
      ? 'processing'
      : rawStatus === 'out_for_delivery'
        ? 'shipped'
        : ['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'].includes(
              rawStatus
            )
          ? (rawStatus as OrderStatus)
          : 'processing';

  return {
    id: String(o.id ?? o.orderNumber ?? `ORD-${Date.now()}-${idx}`),
    customerId: String(o.customerId ?? 'CUST-001'),
    customerName: String(o.customerName ?? o.customer?.name ?? 'Customer'),
    customerEmail: String(o.customerEmail ?? o.customer?.email ?? 'customer@example.com'),
    date: String(o.createdAt ?? o.date ?? new Date().toISOString()),
    items,
    subtotal,
    tax,
    shipping,
    discount,
    total,
    status: validStatus,
    paymentDetails: {
      razorpayOrderId: String(pay.razorpayOrderId ?? pay.providerOrderId ?? ''),
      razorpayPaymentId: String(pay.razorpayPaymentId ?? pay.providerPaymentId ?? ''),
      transactionTime: String(
        pay.verifiedAt ?? pay.transactionTime ?? o.paidAt ?? o.createdAt ?? new Date().toISOString()
      ),
      method: String(pay.method ?? o.paymentMethod ?? 'Razorpay'),
      verificationStatus:
        String(pay.status) === 'CAPTURED' ||
        String(pay.status) === 'COMPLETED' ||
        o.paymentStatus === 'PAID'
          ? 'verified'
          : 'pending',
      status: String(pay.status ?? o.paymentStatus ?? 'pending').toLowerCase() as any,
    },
    shippingAddress: ship,
    billingAddress: bill,
    timeline,
    refundStatus: 'none',
  };
}

export const useOrdersStore = create<OrdersState>((set, get) => ({
  orders: [],
  searchQuery: '',
  statusFilter: 'all',
  dateFilter: 'all',
  sortBy: 'newest',
  isLoading: false,
  error: null,

  fetchOrders: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.get('/orders', {
        params: { page: 1, limit: 100 },
        headers: { 'x-store-id': STORE_ID },
      });
      const payload = response?.data?.data ?? response?.data;
      const list = Array.isArray(payload)
        ? payload
        : Array.isArray(payload?.items)
          ? payload.items
          : Array.isArray(payload?.orders)
            ? payload.orders
            : [];
      const mapped = list.map(mapApiOrder);
      set({ orders: mapped, isLoading: false, error: null });
    } catch (err: any) {
      const msg = err?.response?.data?.error?.message || err?.message || 'Could not load orders';
      set({ isLoading: false, error: msg });
      if (typeof window !== 'undefined')
        toast.warning(msg + ' — connect the API backend to see real orders');
    }
  },

  setSearchQuery: (query) => set({ searchQuery: query }),
  setStatusFilter: (status) => set({ statusFilter: status }),
  setDateFilter: (filter) => set({ dateFilter: filter }),
  setSortBy: (sort) => set({ sortBy: sort }),

  requestRefund: (orderId, reason) =>
    set((state) => ({
      orders: state.orders.map((order) =>
        order.id === orderId ? { ...order, refundStatus: 'requested', refundReason: reason } : order
      ),
    })),

  getFilteredAndSortedOrders: () => {
    const { orders, searchQuery, statusFilter, dateFilter, sortBy } = get();
    let filtered = [...orders];
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (o) =>
          o.id.toLowerCase().includes(q) ||
          o.customerName.toLowerCase().includes(q) ||
          o.items.some((i) => i.name.toLowerCase().includes(q))
      );
    }
    if (statusFilter !== 'all') {
      filtered = filtered.filter((o) => o.status === statusFilter);
    }
    const now = Date.now();
    if (dateFilter === 'today')
      filtered = filtered.filter((o) => now - new Date(o.date).getTime() <= 86400000);
    else if (dateFilter === '7days')
      filtered = filtered.filter((o) => now - new Date(o.date).getTime() <= 7 * 86400000);
    else if (dateFilter === '30days')
      filtered = filtered.filter((o) => now - new Date(o.date).getTime() <= 30 * 86400000);

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'oldest':
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case 'highest_amount':
          return b.total - a.total;
        case 'lowest_amount':
          return a.total - b.total;
        case 'newest':
        default:
          return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
    });
    return filtered;
  },

  getOrderStats: () => {
    const { orders } = get();
    const stats = {
      total: orders.length,
      completed: 0,
      pending: 0,
      cancelled: 0,
      refunded: 0,
      revenue: 0,
    };
    orders.forEach((o) => {
      if (
        o.status === 'delivered' ||
        o.status === 'processing' ||
        o.status === 'shipped' ||
        o.status === 'pending'
      ) {
        if (o.status === 'delivered') stats.completed++;
        else stats.pending++;
      }
      if (o.status === 'cancelled') stats.cancelled++;
      if (o.status === 'refunded') stats.refunded++;
      if (o.status !== 'cancelled' && o.status !== 'refunded') stats.revenue += o.total;
    });
    return stats;
  },
}));
