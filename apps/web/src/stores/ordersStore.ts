import { create } from 'zustand';
import { Order, OrderStatus, PaymentStatus } from '@/types/orders';
import { apiClient } from '@/lib/api-client';

const mockOrders: Order[] = [
  {
    id: 'ORD-2026-8901',
    customerId: 'CUST-001',
    customerName: 'Sarah Jenkins',
    customerEmail: 'sarah.j@example.com',
    date: new Date().toISOString(),
    items: [
      { id: '1', name: 'Premium Wireless Headphones', price: 299, quantity: 1 },
      { id: '2', name: 'Ergonomic Desk Chair', price: 199, quantity: 1 }
    ],
    subtotal: 498,
    tax: 49.8,
    shipping: 0,
    discount: 50,
    total: 497.8,
    status: 'delivered',
    paymentDetails: {
      razorpayOrderId: 'order_KjU8YhY',
      razorpayPaymentId: 'pay_KjU9ZmY',
      transactionTime: new Date(Date.now() - 86400000).toISOString(),
      method: 'Credit Card',
      verificationStatus: 'verified',
      status: 'completed'
    },
    shippingAddress: {
      fullName: 'Sarah Jenkins',
      street: '445 Tech Park Way',
      city: 'San Francisco',
      state: 'CA',
      zip: '94105',
      country: 'USA'
    },
    billingAddress: {
      fullName: 'Sarah Jenkins',
      street: '445 Tech Park Way',
      city: 'San Francisco',
      state: 'CA',
      zip: '94105',
      country: 'USA'
    },
    timeline: [
      { id: 't1', status: 'Order Created', description: 'Order placed successfully', timestamp: new Date(Date.now() - 172800000).toISOString(), completed: true },
      { id: 't2', status: 'Payment Successful', description: 'Payment verified via Razorpay', timestamp: new Date(Date.now() - 172700000).toISOString(), completed: true },
      { id: 't3', status: 'Packed', description: 'Order packed and ready for dispatch', timestamp: new Date(Date.now() - 86400000).toISOString(), completed: true },
      { id: 't4', status: 'Shipped', description: 'Handed over to delivery partner', timestamp: new Date(Date.now() - 43200000).toISOString(), completed: true },
      { id: 't5', status: 'Delivered', description: 'Delivered to customer', timestamp: new Date().toISOString(), completed: true }
    ],
    aiRecommendation: {
      productsRecommended: ['Ergonomic Desk Chair', 'Premium Wireless Headphones'],
      confidenceScore: 92,
      reason: 'Customer viewed both items during the session and spends 8+ hours at a desk.',
      bundleSuggestions: ['Wireless Mouse', 'Keyboard Pad'],
      estimatedSavings: 50,
      explainabilitySummary: 'AI identified a high intent for home office setup and bundled items with a dynamic 10% discount to secure the conversion.'
    },
    couponApplied: 'HOME_OFFICE_10',
    refundStatus: 'none'
  },
  {
    id: 'ORD-2026-8902',
    customerId: 'CUST-002',
    customerName: 'Michael Chen',
    customerEmail: 'm.chen@example.com',
    date: new Date(Date.now() - 432000000).toISOString(),
    items: [
      { id: '3', name: '4K Ultra HD Monitor', price: 450, quantity: 1 }
    ],
    subtotal: 450,
    tax: 45,
    shipping: 15,
    discount: 0,
    total: 510,
    status: 'refunded',
    paymentDetails: {
      razorpayOrderId: 'order_LkU8YhZ',
      razorpayPaymentId: 'pay_LkU9Zma',
      transactionTime: new Date(Date.now() - 432000000).toISOString(),
      method: 'UPI',
      verificationStatus: 'verified',
      status: 'refunded'
    },
    shippingAddress: {
      fullName: 'Michael Chen',
      street: '128 Innovation Dr',
      city: 'Austin',
      state: 'TX',
      zip: '78701',
      country: 'USA'
    },
    billingAddress: {
      fullName: 'Michael Chen',
      street: '128 Innovation Dr',
      city: 'Austin',
      state: 'TX',
      zip: '78701',
      country: 'USA'
    },
    timeline: [
      { id: 't1', status: 'Order Created', description: 'Order placed successfully', timestamp: new Date(Date.now() - 432000000).toISOString(), completed: true },
      { id: 't2', status: 'Payment Successful', description: 'Payment verified via Razorpay', timestamp: new Date(Date.now() - 431900000).toISOString(), completed: true },
      { id: 't3', status: 'Refund Requested', description: 'Customer requested refund (Defective product)', timestamp: new Date(Date.now() - 86400000).toISOString(), completed: true },
      { id: 't4', status: 'Refund Processed', description: 'Amount credited back to original payment source', timestamp: new Date().toISOString(), completed: true }
    ],
    refundStatus: 'completed',
    refundAmount: 510,
    refundReason: 'Defective product on arrival'
  }
];

interface OrdersState {
  orders: Order[];
  searchQuery: string;
  statusFilter: OrderStatus | 'all';
  dateFilter: 'today' | '7days' | '30days' | 'all';
  sortBy: 'newest' | 'oldest' | 'highest_amount' | 'lowest_amount';
  isLoading: boolean;
  
  fetchOrders: () => Promise<void>;
  setSearchQuery: (query: string) => void;
  setStatusFilter: (status: OrderStatus | 'all') => void;
  setDateFilter: (filter: 'today' | '7days' | '30days' | 'all') => void;
  setSortBy: (sort: 'newest' | 'oldest' | 'highest_amount' | 'lowest_amount') => void;
  requestRefund: (orderId: string, reason: string) => void;
  
  getFilteredAndSortedOrders: () => Order[];
  getOrderStats: () => { total: number; completed: number; pending: number; cancelled: number; refunded: number; revenue: number };
}

export const useOrdersStore = create<OrdersState>((set, get) => ({
  orders: mockOrders,
  searchQuery: '',
  statusFilter: 'all',
  dateFilter: 'all',
  sortBy: 'newest',
  isLoading: false,

  fetchOrders: async () => {
    set({ isLoading: true });
    try {
      const response = await apiClient.get('/orders');
      const data = response.data?.data || response.data;
      if (Array.isArray(data) && data.length > 0) {
        const mappedOrders: Order[] = data.map((o: any) => ({
          id: o.id || o.orderId,
          customerId: o.customerId || 'CUST-001',
          customerName: o.customerName || o.customer?.name || 'Customer',
          customerEmail: o.customerEmail || o.customer?.email || 'customer@example.com',
          date: o.createdAt || o.date || new Date().toISOString(),
          items: (o.items || []).map((i: any, idx: number) => ({
            id: i.id || String(idx + 1),
            name: i.productName || i.name || i.product?.name || 'Product',
            price: Number(i.price || i.unitPrice || 0),
            quantity: i.quantity || 1,
          })),
          subtotal: Number(o.subtotal || o.totalAmount || 0),
          tax: Number(o.tax || 0),
          shipping: Number(o.shipping || 0),
          discount: Number(o.discount || 0),
          total: Number(o.total || o.totalAmount || 0),
          status: (o.status || 'processing').toLowerCase() as OrderStatus,
          paymentDetails: {
            razorpayOrderId: o.razorpayOrderId || o.paymentDetails?.razorpayOrderId,
            razorpayPaymentId: o.razorpayPaymentId || o.paymentDetails?.razorpayPaymentId,
            transactionTime: o.paidAt || o.createdAt || new Date().toISOString(),
            method: o.paymentMethod || 'Razorpay',
            verificationStatus: o.paymentStatus === 'PAID' || o.status === 'PAID' ? 'verified' : 'pending',
            status: o.paymentStatus === 'PAID' || o.status === 'PAID' ? 'completed' : 'pending',
          },
          shippingAddress: o.shippingAddress || {
            fullName: o.customerName || 'Customer',
            street: 'Standard Delivery',
            city: 'Bengaluru',
            state: 'KA',
            zip: '560001',
            country: 'India',
          },
          billingAddress: o.billingAddress || {
            fullName: o.customerName || 'Customer',
            street: 'Standard Delivery',
            city: 'Bengaluru',
            state: 'KA',
            zip: '560001',
            country: 'India',
          },
          timeline: o.timeline || [
            { id: 't1', status: 'Order Created', description: 'Order created', timestamp: o.createdAt || new Date().toISOString(), completed: true },
          ],
          refundStatus: 'none',
        }));
        set({ orders: mappedOrders, isLoading: false });
      } else {
        set({ isLoading: false });
      }
    } catch {
      set({ isLoading: false });
    }
  },

  setSearchQuery: (query) => set({ searchQuery: query }),
  setStatusFilter: (status) => set({ statusFilter: status }),
  setDateFilter: (filter) => set({ dateFilter: filter }),
  setSortBy: (sort) => set({ sortBy: sort }),

  requestRefund: (orderId, reason) => set((state) => ({
    orders: state.orders.map(order => 
      order.id === orderId 
        ? { ...order, refundStatus: 'requested' as const, refundReason: reason }
        : order
    )
  })),

  getFilteredAndSortedOrders: () => {
    const { orders, searchQuery, statusFilter, dateFilter, sortBy } = get();
    
    let filtered = [...orders];

    // Search
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(o => 
        o.id.toLowerCase().includes(q) || 
        o.customerName.toLowerCase().includes(q) ||
        o.items.some(i => i.name.toLowerCase().includes(q))
      );
    }

    // Status Filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(o => o.status === statusFilter);
    }

    // Date Filter
    const now = Date.now();
    if (dateFilter === 'today') {
      filtered = filtered.filter(o => now - new Date(o.date).getTime() <= 86400000);
    } else if (dateFilter === '7days') {
      filtered = filtered.filter(o => now - new Date(o.date).getTime() <= 7 * 86400000);
    } else if (dateFilter === '30days') {
      filtered = filtered.filter(o => now - new Date(o.date).getTime() <= 30 * 86400000);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'oldest': return new Date(a.date).getTime() - new Date(b.date).getTime();
        case 'highest_amount': return b.total - a.total;
        case 'lowest_amount': return a.total - b.total;
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
      revenue: 0
    };

    orders.forEach(o => {
      if (o.status === 'delivered') stats.completed++;
      if (o.status === 'pending' || o.status === 'processing' || o.status === 'shipped') stats.pending++;
      if (o.status === 'cancelled') stats.cancelled++;
      if (o.status === 'refunded') stats.refunded++;
      if (o.status !== 'cancelled' && o.status !== 'refunded') stats.revenue += o.total;
    });

    return stats;
  }
}));
