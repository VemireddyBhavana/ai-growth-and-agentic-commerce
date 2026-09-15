import { prisma } from '../config/prisma.config.js';
import type {
  DashboardSnapshot,
  KpiMetric,
  RevenuePoint,
  OrdersPoint,
  FunnelStep,
  ConversationPoint,
  ConversationStat,
  TopProduct,
  LiveVisitor,
  Insight,
  Recommendation,
  SuggestedCampaign,
  DashboardAlert,
  RecentOrder,
  AiMetric,
} from '@ai-sales-assistant/types';

/**
 * NOTE: These are minimal structural types describing the shape of the
 * Prisma query results actually consumed below. They exist so this file
 * typechecks in environments where `prisma generate` cannot run (e.g. no
 * network access to download the native query engine). They are
 * structurally compatible with the real `@prisma/client` generated types,
 * so once `npx prisma generate` has been run normally these annotations
 * remain valid (and can be removed in favor of the generated types).
 */
interface OrderItemWithProduct {
  quantity: number;
  totalPrice: unknown;
  product: { name: string };
}

interface ProductWithOrderItems {
  id: string;
  name: string;
  sku: string;
  orderItems: OrderItemWithProduct[];
}

interface SessionWithCustomer {
  id: string;
  device: string | null;
  aiEnabled: boolean;
}

interface CampaignRecord {
  id: string;
  name: string;
  channel: string;
  status: string;
}

interface NotificationRecord {
  id: string;
  title: string;
  message: string;
  createdAt: Date;
  level: string;
}

interface OrderWithItems {
  orderNumber: string;
  customerName: string | null;
  customerEmail: string | null;
  total: unknown;
  status: string;
  paymentMethod: string;
  createdAt: Date;
  aiAssisted: boolean;
  items: Array<{ quantity: number; product: { name: string } }>;
}

/**
 * Dashboard Repository
 * Handles all data access operations for dashboard analytics
 */
export class DashboardRepository {
  /**
   * Get complete dashboard snapshot for a store
   */
  async getDashboardSnapshot(storeIdOrSlug: string): Promise<DashboardSnapshot> {
    const store = await this.getStoreInfo(storeIdOrSlug);
    const storeId = store.id;

    const [
      kpis,
      revenue,
      orders,
      funnel,
      conversations,
      topProducts,
      visitors,
      insights,
      campaigns,
      alerts,
      recentOrders,
      aiMetrics,
    ] = await Promise.all([
      this.getKpiMetrics(storeId),
      this.getRevenueData(storeId),
      this.getOrdersData(storeId),
      this.getSalesFunnel(storeId),
      this.getConversationData(storeId),
      this.getTopProducts(storeId),
      this.getLiveVisitors(storeId),
      this.getAiInsights(storeId),
      this.getSuggestedCampaigns(storeId),
      this.getDashboardAlerts(storeId),
      this.getRecentOrders(storeId),
      this.getAiPerformanceMetrics(storeId),
    ]);

    return {
      merchantName: store.name,
      kpis,
      revenue,
      orders,
      funnel,
      conversations,
      conversationStats: this.getConversationStats(storeId),
      topProducts,
      visitors,
      insights,
      recommendations: this.getSmartRecommendations(storeId),
      campaigns,
      alerts,
      notifications: alerts.map((a) => ({ ...a, unread: true })),
      recentOrders,
      aiMetrics,
    };
  }

  /**
   * Get store information
   */
  private async getStoreInfo(storeIdOrSlug: string) {
    let store = await prisma.store.findFirst({
      where: {
        OR: [{ id: storeIdOrSlug }, { slug: storeIdOrSlug }],
      },
      select: { id: true, name: true, slug: true },
    });

    if (!store) {
      store = await prisma.store.findFirst({
        select: { id: true, name: true, slug: true },
      });
    }

    if (!store) {
      throw new Error(`Store not found: ${storeIdOrSlug}`);
    }

    return store;
  }

  /**
   * Get KPI metrics for dashboard
   */
  private async getKpiMetrics(storeId: string): Promise<KpiMetric[]> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const [todayRevenue, todayOrders, yesterdayRevenue] = await Promise.all([
      prisma.order.aggregate({
        where: {
          storeId,
          createdAt: { gte: today },
          paymentStatus: 'COMPLETED',
        },
        _sum: { total: true },
      }),
      prisma.order.count({
        where: {
          storeId,
          createdAt: { gte: today },
          paymentStatus: 'COMPLETED',
        },
      }),
      prisma.order.aggregate({
        where: {
          storeId,
          createdAt: { gte: yesterday, lt: today },
          paymentStatus: 'COMPLETED',
        },
        _sum: { total: true },
      }),
    ]);

    const revenue = Number(todayRevenue._sum.total || 0);
    const yesterdayRev = Number(yesterdayRevenue._sum.total || 0);
    const revenueGrowth = yesterdayRev > 0 ? ((revenue - yesterdayRev) / yesterdayRev) * 100 : 0;

    const [totalVisitors, completedOrders] = await Promise.all([
      prisma.session.count({
        where: {
          storeId,
          createdAt: { gte: today },
        },
      }),
      todayOrders,
    ]);

    const conversionRate = totalVisitors > 0 ? (completedOrders / totalVisitors) * 100 : 0;
    const aov = completedOrders > 0 ? revenue / completedOrders : 0;

    const activeAiSessions = await prisma.session.count({
      where: {
        storeId,
        aiEnabled: true,
        isActive: true,
        createdAt: { gte: today },
      },
    });

    const sparklineData = [{ v: revenue }];

    return [
      {
        key: 'revenue',
        label: "Today's Revenue",
        value: revenue,
        prefix: '₹ ',
        trend: revenueGrowth,
        trendUp: revenueGrowth >= 0,
        icon: 'revenue',
        tone: 'from-brand-600/20 to-brand-500/10 text-brand-500 dark:text-brand-400 border-brand-500/20',
        glow: 'brand',
        sparkline: sparklineData,
        chartType: 'area',
      },
      {
        key: 'orders',
        label: "Today's Orders",
        value: completedOrders,
        trend: 0,
        trendUp: false,
        icon: 'orders',
        tone: 'from-ai-cyan/20 to-ai-cyan/10 text-ai-cyan border-ai-cyan/20',
        glow: 'cyan',
        sparkline: sparklineData.map((d) => ({ v: Math.floor(d.v * 0.4) })),
        chartType: 'bar',
      },
      {
        key: 'conversion',
        label: 'Conversion Rate',
        value: conversionRate,
        suffix: '%',
        decimals: 2,
        trend: 0,
        trendUp: false,
        icon: 'conversion',
        tone: 'from-ai-emerald/20 to-ai-emerald/10 text-ai-emerald border-ai-emerald/20',
        glow: 'emerald',
        sparkline: sparklineData.map((d) => ({ v: d.v * 0.8 })),
        chartType: 'line',
      },
      {
        key: 'aov',
        label: 'Average Order Value',
        value: aov,
        prefix: '₹ ',
        trend: 0,
        trendUp: false,
        icon: 'aov',
        tone: 'from-ai-violet/20 to-ai-violet/10 text-ai-violet border-ai-violet/20',
        glow: 'violet',
        sparkline: sparklineData.map((d) => ({ v: d.v * 1.2 })),
        chartType: 'area',
      },
      {
        key: 'ai-convos',
        label: 'Active AI Conversations',
        value: activeAiSessions,
        trend: 0,
        trendUp: false,
        icon: 'conversations',
        tone: 'from-ai-violet/20 via-brand-500/15 to-ai-cyan/10 text-ai-violet border-ai-violet/25',
        glow: 'violet',
        sparkline: sparklineData.map((d) => ({ v: d.v * 0.6 })),
        chartType: 'area',
      },
      {
        key: 'growth',
        label: 'Revenue Growth',
        value: revenueGrowth,
        suffix: '%',
        decimals: 1,
        trend: revenueGrowth,
        trendUp: revenueGrowth >= 0,
        icon: 'growth',
        tone: 'from-ai-emerald/20 via-ai-cyan/15 to-brand-500/10 text-ai-emerald border-ai-emerald/25',
        glow: 'emerald',
        sparkline: sparklineData.map((d) => ({ v: d.v * 0.3 })),
        chartType: 'line',
      },
    ];
  }

  /**
   * Get revenue data for chart
   */
  private async getRevenueData(storeId: string): Promise<RevenuePoint[]> {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const data: RevenuePoint[] = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);

      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);

      const [totalRevenue, aiRevenue] = await Promise.all([
        prisma.order.aggregate({
          where: {
            storeId,
            createdAt: { gte: date, lt: nextDate },
            paymentStatus: { in: ['COMPLETED', 'CAPTURED'] },
          },
          _sum: { total: true },
        }),
        prisma.order.aggregate({
          where: {
            storeId,
            createdAt: { gte: date, lt: nextDate },
            paymentStatus: { in: ['COMPLETED', 'CAPTURED'] },
            aiAssisted: true,
          },
          _sum: { total: true },
        }),
      ]);

      const total = Number(totalRevenue._sum.total || 0);
      let ai = Number(aiRevenue._sum.total || 0);

      ai = Math.min(ai, total);

      data.push({
        day: days[date.getDay()]!,
        revenue: total,
        ai: ai,
        organic: Math.max(0, total - ai),
      });
    }

    return data;
  }

  /**
   * Get orders data for chart
   */
  private async getOrdersData(storeId: string): Promise<OrdersPoint[]> {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const data: OrdersPoint[] = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);

      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);

      const [paid, pending, refunded] = await Promise.all([
        prisma.order.count({
          where: {
            storeId,
            createdAt: { gte: date, lt: nextDate },
            status: { in: ['CONFIRMED', 'DELIVERED', 'SHIPPED', 'PROCESSING'] },
          },
        }),
        prisma.order.count({
          where: {
            storeId,
            createdAt: { gte: date, lt: nextDate },
            status: 'PENDING',
          },
        }),
        prisma.order.count({
          where: {
            storeId,
            createdAt: { gte: date, lt: nextDate },
            status: 'REFUNDED',
          },
        }),
      ]);

      data.push({
        day: days[date.getDay()]!,
        paid,
        pending,
        refunded,
      });
    }

    return data;
  }

  /**
   * Get sales funnel data
   */
  private async getSalesFunnel(storeId: string): Promise<FunnelStep[]> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [todaySessions, todayOrders] = await Promise.all([
      prisma.session.count({
        where: { storeId, createdAt: { gte: today } },
      }),
      prisma.order.count({
        where: { storeId, createdAt: { gte: today } },
      }),
    ]);

    const visitors = todaySessions;
    const viewedProducts = 0;
    const searched = 0;
    const addedToCart = 0;
    const checkoutStarted = 0;
    const purchaseCount = todayOrders;

    return [
      {
        step: 'Visitors',
        count: visitors,
        rate: 100,
        icon: 'visitors',
        tone: 'from-brand-600/30 to-brand-500/10 text-brand-500 border-brand-500/25',
        glow: 'rgba(99,102,241,0.35)',
      },
      {
        step: 'Viewed Product',
        count: viewedProducts,
        rate: Math.round((viewedProducts / visitors) * 100),
        icon: 'viewed',
        tone: 'from-ai-violet/30 to-ai-violet/10 text-ai-violet border-ai-violet/25',
        glow: 'rgba(139,92,246,0.35)',
      },
      {
        step: 'Searched / Filtered',
        count: searched,
        rate: Math.round((searched / visitors) * 100),
        icon: 'searched',
        tone: 'from-ai-cyan/30 to-ai-cyan/10 text-ai-cyan border-ai-cyan/25',
        glow: 'rgba(6,182,212,0.35)',
      },
      {
        step: 'Added to Cart',
        count: addedToCart,
        rate: Math.round((addedToCart / visitors) * 100),
        icon: 'cart',
        tone: 'from-ai-emerald/30 to-ai-emerald/10 text-ai-emerald border-ai-emerald/25',
        glow: 'rgba(16,185,129,0.35)',
      },
      {
        step: 'Checkout Started',
        count: checkoutStarted,
        rate: Math.round((checkoutStarted / visitors) * 100),
        icon: 'checkout',
        tone: 'from-amber-500/30 to-amber-500/10 text-amber-400 border-amber-500/25',
        glow: 'rgba(245,158,11,0.35)',
      },
      {
        step: 'Purchase',
        count: purchaseCount,
        rate: Math.round((purchaseCount / visitors) * 100),
        icon: 'purchase',
        tone: 'from-emerald-500/30 to-emerald-500/10 text-emerald-400 border-emerald-500/25',
        glow: 'rgba(16,185,129,0.35)',
      },
    ];
  }

  /**
   * Get AI conversation data
   */
  private async getConversationData(storeId: string): Promise<ConversationPoint[]> {
    const hours = ['00', '04', '08', '12', '16', '20', 'Now'];
    const data: ConversationPoint[] = [];
    const now = new Date();
    const currentHour = now.getHours();

    for (let i = 0; i < hours.length; i++) {
      const isNow = hours[i] === 'Now';
      const hour = isNow ? currentHour : parseInt(hours[i]!, 10) || 0;
      const hourStart = new Date(now);
      hourStart.setHours(hour, 0, 0, 0);

      const hourEnd = new Date(hourStart);
      if (isNow) {
        hourEnd.setTime(now.getTime());
      } else {
        hourEnd.setHours(hour + 4, 0, 0, 0);
      }

      const sessions = await prisma.session.count({
        where: {
          storeId,
          aiEnabled: true,
          createdAt: { gte: hourStart, lte: hourEnd },
        },
      });

      const conversations = await prisma.aiConversation.count({
        where: {
          session: {
            storeId,
            createdAt: { gte: hourStart, lte: hourEnd },
          },
        },
      });

      data.push({
        hr: hours[i]!,
        sessions,
        conversions: conversations,
        avgResp: 0,
      });
    }

    return data;
  }

  /**
   * Get conversation statistics
   */
  private getConversationStats(_storeId: string): ConversationStat[] {
    return [];
  }

  /**
   * Get top performing products
   */
  private async getTopProducts(storeId: string): Promise<TopProduct[]> {
    const products = await prisma.product.findMany({
      where: { storeId, isActive: true },
      include: {
        orderItems: {
          include: {
            order: true,
          },
        },
      },
      take: 10,
    });

    return (products as unknown as ProductWithOrderItems[])
      .map((product) => {
        const revenue = product.orderItems.reduce(
          (sum: number, item) => sum + Number(item.totalPrice),
          0
        );
        const units = product.orderItems.reduce((sum: number, item) => sum + item.quantity, 0);

        return {
          id: product.id,
          name: product.name,
          sku: product.sku,
          revenue,
          units,
          views: 0,
          conversion: 0,
          trend: 0,
          trendUp: false,
          aiBoosted: false,
          tone: 'from-brand-600/25 via-brand-500/15 to-transparent text-brand-500 border-brand-500/20',
        };
      })
      .sort((a: TopProduct, b: TopProduct) => b.revenue - a.revenue);
  }

  /**
   * Get live visitors
   */
  private async getLiveVisitors(storeId: string): Promise<LiveVisitor[]> {
    let sessions = await prisma.session.findMany({
      where: {
        storeId,
        createdAt: { gte: new Date(Date.now() - 60 * 60 * 1000) },
      },
      include: {
        customer: true,
      },
      take: 10,
      orderBy: { createdAt: 'desc' },
    });

    if (sessions.length === 0) {
      sessions = await prisma.session.findMany({
        where: { storeId },
        include: {
          customer: true,
        },
        take: 10,
        orderBy: { createdAt: 'desc' },
      });
    }

    return (sessions as SessionWithCustomer[]).map((session) => ({
      id: session.id,
      location: 'Unknown',
      country: 'Unknown',
      flag: '',
      device: session.device as 'mobile' | 'desktop',
      page: 'Unknown',
      activity: session.aiEnabled ? 'AI active' : 'Active session',
      duration: 'Unavailable',
      aiActive: session.aiEnabled,
      tone: 'from-brand-600/25 to-brand-500/10 text-brand-500 border-brand-500/20',
      activityKind: session.aiEnabled ? 'ai' : 'view',
    }));
  }

  /**
   * Get AI insights
   */
  private getAiInsights(_storeId: string): Insight[] {
    return [];
  }

  /**
   * Get smart recommendations
   */
  private getSmartRecommendations(_storeId: string): Recommendation[] {
    return [];
  }

  /**
   * Get suggested campaigns
   */
  private async getSuggestedCampaigns(storeId: string): Promise<SuggestedCampaign[]> {
    const campaigns = await prisma.campaign.findMany({
      where: { storeId },
      take: 5,
      orderBy: { createdAt: 'desc' },
    });

    return (campaigns as CampaignRecord[]).map((campaign) => ({
      id: campaign.id,
      name: campaign.name,
      audience: 'Active customers',
      channel: campaign.channel,
      predictedLift: '+15% conv',
      status: campaign.status as 'ready' | 'draft',
    }));
  }

  /**
   * Get dashboard alerts
   */
  private async getDashboardAlerts(storeId: string): Promise<DashboardAlert[]> {
    const notifications = await prisma.notification.findMany({
      where: {
        user: {
          stores: {
            some: { id: storeId },
          },
        },
      },
      take: 10,
      orderBy: { createdAt: 'desc' },
    });

    return (notifications as NotificationRecord[]).map((notification) => ({
      id: notification.id,
      title: notification.title,
      detail: notification.message,
      time: this.formatTimeAgo(notification.createdAt),
      level: notification.level as DashboardAlert['level'],
    }));
  }

  /**
   * Get recent orders
   */
  private async getRecentOrders(storeId: string): Promise<RecentOrder[]> {
    const orders = await prisma.order.findMany({
      where: { storeId },
      include: {
        items: {
          include: { product: true },
        },
      },
      take: 10,
      orderBy: { createdAt: 'desc' },
    });

    return (orders as OrderWithItems[]).map((order) => {
      const productNames = order.items
        .map((item) => `${item.product.name} × ${item.quantity}`)
        .join(', ');

      return {
        id: order.orderNumber,
        customer: order.customerName || 'Guest',
        email: order.customerEmail || 'guest@example.com',
        product: productNames,
        amount: Number(order.total),
        status: order.status as 'paid' | 'pending' | 'refunded',
        payment: this.formatPaymentMethod(order.paymentMethod),
        time: this.formatTimeAgo(order.createdAt),
        aiAssisted: order.aiAssisted,
      };
    });
  }

  /**
   * Get AI performance metrics
   */
  private getAiPerformanceMetrics(_storeId: string): AiMetric[] {
    return [];
  }

  /**
   * Helper: Format time ago
   */
  private formatTimeAgo(date: Date): string {
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);

    if (seconds < 60) return `${seconds} min ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)} min ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hr ago`;
    return `${Math.floor(seconds / 86400)} days ago`;
  }

  /**
   * Helper: Format payment method
   */
  private formatPaymentMethod(method: string): 'UPI' | 'Card' | 'Net Banking' | 'Razorpay Wallet' {
    const methodMap: Record<string, 'UPI' | 'Card' | 'Net Banking' | 'Razorpay Wallet'> = {
      UPI: 'UPI',
      CARD: 'Card',
      NET_BANKING: 'Net Banking',
      WALLET: 'Razorpay Wallet',
    };
    return methodMap[method] || 'UPI';
  }
}

export const dashboardRepository = new DashboardRepository();
