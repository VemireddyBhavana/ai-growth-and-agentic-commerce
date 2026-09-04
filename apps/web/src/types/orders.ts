export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface OrderTimelineEvent {
  id: string;
  status: string;
  description: string;
  timestamp: string;
  completed: boolean;
}

export interface AIRecommendation {
  productsRecommended: string[];
  confidenceScore: number;
  reason: string;
  bundleSuggestions: string[];
  estimatedSavings: number;
  explainabilitySummary: string;
}

export interface PaymentDetails {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  transactionTime: string;
  method: string;
  verificationStatus: 'verified' | 'failed' | 'pending';
  status: PaymentStatus;
}

export interface OrderAddress {
  fullName: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  date: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  total: number;
  status: OrderStatus;
  paymentDetails: PaymentDetails;
  shippingAddress: OrderAddress;
  billingAddress: OrderAddress;
  timeline: OrderTimelineEvent[];
  aiRecommendation?: AIRecommendation;
  notes?: string;
  couponApplied?: string;
  refundStatus?: 'none' | 'requested' | 'processing' | 'completed' | 'rejected';
  refundAmount?: number;
  refundReason?: string;
}
