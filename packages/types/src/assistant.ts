/**
 * AI Shopping Assistant Types
 * Shared types for conversational discovery, explainable recommendations, dynamic bundling, and Razorpay checkout
 */

export interface ProductSpec {
  name: string;
  value: string;
}

export interface ProductReview {
  id: string;
  author: string;
  rating: number;
  date: string;
  comment: string;
  verified: boolean;
}

export interface AssistantProduct {
  id: string;
  name: string;
  sku: string;
  brand: string;
  description: string;
  longDescription?: string;
  price: number;
  comparePrice?: number;
  costPrice?: number;
  images: string[];
  category: string;
  tags: string[];
  stock: number;
  lowStock?: number;
  rating: number;
  reviewsCount: number;
  features: string[];
  specs?: ProductSpec[];
  reviews?: ProductReview[];
  deliveryEstimate: string;
  margin?: number; // e.g. 0.35 for 35% margin
  isFeatured?: boolean;
  badge?: string; // "Best Seller" | "Top Pick" | "Trending" | "Save 25%"
}

export interface RecommendationExplainability {
  reason?: string;
  confidenceScore?: number; // 0 to 100
  customerIntent?: string;
  inventoryAvailability?: string; // e.g. "142 units in stock • High Stock"
  priceMatch?: string; // e.g. "100% within budget (₹2,999 vs ₹3,000 max)"
  popularityScore?: number; // 0 to 100
  expectedMargin?: string; // e.g. "High Margin (38%)" or "Great Customer Value"
  bundleAdvantage?: string;
  intentFit?: string;
  marginContribution?: string;
  inventoryHealth?: string;
  confidenceBreakdown?: Array<{ factor: string; score: number }>;
}

export interface RecommendationCardData {
  product: AssistantProduct;
  explainability: RecommendationExplainability;
  isTopPick?: boolean;
  isUpsell?: boolean;
  isCrossSell?: boolean;
  confidenceScore?: number;
  matchReason?: string;
}

export interface DynamicBundle {
  id: string;
  name: string;
  description: string;
  tag: string;
  products: AssistantProduct[];
  originalTotal: number;
  bundlePrice: number;
  savings: number;
  discountPercentage: number;
  reason: string;
}

export interface ComparisonRow {
  label: string;
  values: string[];
  highlightBest?: boolean;
}

export interface ComparisonData {
  title: string;
  columns: string[];
  rows: ComparisonRow[];
  recommendationNote: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  status?: 'sending' | 'streaming' | 'complete' | 'error';
  thinkingSteps?: string[];
  recommendations?: RecommendationCardData[];
  followUpSuggestions?: string[];
  detectedIntent?: string;
  comparison?: ComparisonData;
  bundleOffer?: DynamicBundle;
  errorMessage?: string;
}

export interface ChatSession {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messages: ChatMessage[];
  pinned?: boolean;
  lastSummary?: string;
}

export interface AiInsightsData {
  intent: string;
  budget: {
    max: number | null;
    currentMatch: number;
    currency: string;
    isBudgetMatch: boolean;
  };
  detectedCategory: string;
  preferredBrand: string;
  recommendedBundle: DynamicBundle | null;
  estimatedSavings: number;
  activeTags: string[];
  confidenceScore: number;
}

export interface CartItem {
  product: AssistantProduct;
  quantity: number;
  addedAt: string;
  bundleDiscountApplied?: number;
}

export interface AssistantOrderCustomer {
  name: string;
  email: string;
  phone: string;
  address?: string;
  city?: string;
  state?: string;
  postalCode?: string;
}

export interface AssistantOrder {
  id: string;
  orderNumber: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  tax: number;
  shipping: number;
  total: number;
  currency: string;
  status: 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  paymentStatus: 'PENDING' | 'COMPLETED' | 'FAILED';
  paymentMethod: 'UPI' | 'CARD' | 'NET_BANKING' | 'WALLET';
  razorpayOrderId: string;
  razorpayPaymentId?: string;
  customer: AssistantOrderCustomer;
  createdAt: string;
  aiAssisted: boolean;
  savings: number;
}

export interface AssistantSettings {
  currency: 'INR' | 'USD' | 'EUR';
  aiModel: 'agentic-4o' | 'speed-turbo';
  creativity: number; // 0.1 to 1.0
  soundEnabled: boolean;
  testMode: boolean;
  maxRecommendations: number;
  autoApplyBundles: boolean;
  showMarginMetrics: boolean;
}

export interface ChatApiRequest {
  message: string;
  sessionId: string;
  conversationHistory?: { role: 'user' | 'assistant'; content: string }[];
  settings?: Partial<AssistantSettings>;
  cartItems?: CartItem[];
}

export interface ChatApiResponse {
  reply: string;
  thinkingSteps: string[];
  recommendations: RecommendationCardData[];
  followUpSuggestions: string[];
  insights: AiInsightsData;
  comparison?: ComparisonData;
  bundleOffer?: DynamicBundle;
}
