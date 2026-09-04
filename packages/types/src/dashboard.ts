/**
 * Dashboard Types
 * Shared types for dashboard data structures between API and frontend
 */

export type SparklinePoint = { v: number };

export type KpiChartType = 'area' | 'line' | 'bar';

export type KpiMetric = {
  key: string;
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  trend: number;
  trendUp: boolean;
  icon: 'revenue' | 'orders' | 'conversion' | 'aov' | 'conversations' | 'growth';
  tone: string;
  glow: 'brand' | 'violet' | 'cyan' | 'emerald';
  sparkline: SparklinePoint[];
  chartType: KpiChartType;
};

export type RevenuePoint = {
  day: string;
  revenue: number;
  ai: number;
  organic: number;
};

export type OrdersPoint = {
  day: string;
  paid: number;
  pending: number;
  refunded: number;
};

export type FunnelStep = {
  step: string;
  count: number;
  rate: number;
  icon: 'visitors' | 'viewed' | 'searched' | 'cart' | 'checkout' | 'purchase';
  tone: string;
  glow: string;
};

export type ConversationPoint = {
  hr: string;
  sessions: number;
  conversions: number;
  avgResp: number;
};

export type ConversationStat = {
  label: string;
  value: number;
  icon: 'sessions' | 'shown' | 'accepted' | 'assisted';
  tone: string;
};

export type TopProduct = {
  id: string;
  name: string;
  sku: string;
  revenue: number;
  units: number;
  views: number;
  conversion: number;
  trend: number;
  trendUp: boolean;
  aiBoosted: boolean;
  tone: string;
};

export type LiveVisitor = {
  id: string;
  location: string;
  country: string;
  flag: string;
  device: 'mobile' | 'desktop';
  page: string;
  activity: string;
  duration: string;
  aiActive: boolean;
  tone: string;
  activityKind: 'view' | 'ai' | 'cart' | 'search' | 'checkout';
};

export type Insight = {
  id: string;
  title: string;
  detail: string;
  impact: string;
  impactTone: 'positive' | 'neutral';
  icon: 'bag' | 'target' | 'cart';
  tone: string;
  tag: string;
};

export type Recommendation = {
  id: string;
  title: string;
  subtitle: string;
  kind: 'campaign' | 'pricing' | 'bundle' | 'nudge';
  roi: string;
  effort: 'Low' | 'Medium' | 'High';
  icon: 'volume' | 'gift' | 'bulb';
  tone: string;
};

export type SuggestedCampaign = {
  id: string;
  name: string;
  audience: string;
  channel: string;
  predictedLift: string;
  status: 'ready' | 'draft';
};

export type DashboardAlert = {
  id: string;
  title: string;
  detail: string;
  time: string;
  level: 'critical' | 'warning' | 'info' | 'success';
};

export type NotificationItem = DashboardAlert & {
  unread: boolean;
};

export type OrderStatus = 'paid' | 'pending' | 'refunded';
export type PaymentMethod = 'UPI' | 'Card' | 'Net Banking' | 'Razorpay Wallet';

export type RecentOrder = {
  id: string;
  customer: string;
  email: string;
  product: string;
  amount: number;
  status: OrderStatus;
  payment: PaymentMethod;
  time: string;
  aiAssisted: boolean;
};

export type AiMetric = {
  label: string;
  value: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
  target?: number;
  icon: 'confidence' | 'latency' | 'recs' | 'checkout' | 'lift';
  tone: string;
  description: string;
  trend: { value: number; up: boolean };
};

export type DashboardSnapshot = {
  merchantName: string;
  kpis: KpiMetric[];
  revenue: RevenuePoint[];
  orders: OrdersPoint[];
  funnel: FunnelStep[];
  conversations: ConversationPoint[];
  conversationStats: ConversationStat[];
  topProducts: TopProduct[];
  visitors: LiveVisitor[];
  insights: Insight[];
  recommendations: Recommendation[];
  campaigns: SuggestedCampaign[];
  alerts: DashboardAlert[];
  notifications: NotificationItem[];
  recentOrders: RecentOrder[];
  aiMetrics: AiMetric[];
};