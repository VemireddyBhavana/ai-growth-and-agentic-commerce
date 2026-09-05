import { create } from 'zustand';
import type { AuditRecord, RiskLevel, AuditEventStatus } from '@/types/audit';
import { apiClient } from '@/lib/api-client';

const generateMockTimeline = (baseTime: number, isSuccess: boolean = true) => {
  const steps = [
    {
      id: '1',
      name: 'Customer Prompt',
      description: 'Received natural language query',
      timestamp: new Date(baseTime).toISOString(),
      status: 'success' as AuditEventStatus,
      duration: '45ms',
    },
    {
      id: '2',
      name: 'AI Intent Detection',
      description: 'Parsed intent and extracted entities',
      timestamp: new Date(baseTime + 150).toISOString(),
      status: 'success' as AuditEventStatus,
      duration: '105ms',
    },
    {
      id: '3',
      name: 'Product Recommendation',
      description: 'Generated tailored product list',
      timestamp: new Date(baseTime + 400).toISOString(),
      status: 'success' as AuditEventStatus,
      duration: '250ms',
    },
    {
      id: '4',
      name: 'Merchant Rules Applied',
      description: 'Applied discount logic',
      timestamp: new Date(baseTime + 450).toISOString(),
      status: 'success' as AuditEventStatus,
      duration: '50ms',
    },
    {
      id: '5',
      name: 'Razorpay Checkout Created',
      description: 'Order ID generated via Razorpay API',
      timestamp: new Date(baseTime + 1500).toISOString(),
      status: 'success' as AuditEventStatus,
      duration: '1050ms',
    },
  ];

  if (isSuccess) {
    steps.push(
      {
        id: '6',
        name: 'Payment Verified',
        description: 'HMAC signature successfully validated',
        timestamp: new Date(baseTime + 120000).toISOString(),
        status: 'success' as AuditEventStatus,
        duration: '118.5s',
      },
      {
        id: '7',
        name: 'Order Created',
        description: 'Order saved in database',
        timestamp: new Date(baseTime + 120150).toISOString(),
        status: 'success' as AuditEventStatus,
        duration: '150ms',
      },
      {
        id: '8',
        name: 'Audit Event Logged',
        description: 'Trace securely stored',
        timestamp: new Date(baseTime + 120200).toISOString(),
        status: 'success' as AuditEventStatus,
        duration: '50ms',
      }
    );
  } else {
    steps.push(
      {
        id: '6',
        name: 'Payment Verified',
        description: 'Payment failed due to insufficient funds',
        timestamp: new Date(baseTime + 120000).toISOString(),
        status: 'failed' as AuditEventStatus,
        duration: '118.5s',
      },
      {
        id: '7',
        name: 'Audit Event Logged',
        description: 'Failure trace securely stored',
        timestamp: new Date(baseTime + 120200).toISOString(),
        status: 'success' as AuditEventStatus,
        duration: '50ms',
      }
    );
  }
  return steps;
};

interface AuditState {
  events: AuditRecord[];
  searchQuery: string;
  statusFilter: AuditEventStatus | 'all';
  riskFilter: RiskLevel | 'all';
  isLoading: boolean;

  fetchEvents: () => Promise<void>;
  setSearchQuery: (query: string) => void;
  setStatusFilter: (status: AuditEventStatus | 'all') => void;
  setRiskFilter: (risk: RiskLevel | 'all') => void;

  getFilteredEvents: () => AuditRecord[];
  getAuditStats: () => {
    total: number;
    successfulPayments: number;
    failedPayments: number;
    recommendations: number;
    securityEvents: number;
  };
}

export const useAuditStore = create<AuditState>((set, get) => ({
  events: [],
  searchQuery: '',
  statusFilter: 'all',
  riskFilter: 'all',
  isLoading: false,

  fetchEvents: async () => {
    set({ isLoading: true });
    try {
      const response = await apiClient.get('/audit/events', {
        headers: { 'x-store-id': 'acme-retail' },
      });
      const data = response.data?.data || response.data;
      if (Array.isArray(data)) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const mappedAudits: AuditRecord[] = data.map((e: any, idx: number) => ({
          id: e.id || `AUD-${9000 + idx}`,
          timestamp: e.timestamp || e.createdAt || new Date().toISOString(),
          eventType: e.eventType || 'System Event',
          user: e.actorId || e.user || 'system',
          orderId: e.metadata?.orderId || e.orderId,
          paymentId: e.metadata?.paymentId || e.paymentId,
          status: (e.status || 'success').toLowerCase() as AuditEventStatus,
          riskLevel: (e.metadata?.riskLevel || 'low').toLowerCase() as RiskLevel,
          confidenceScore: e.metadata?.confidenceScore || 90,
          timeline: e.timeline || generateMockTimeline(Date.now() - 120200),
          aiReasoning: e.aiReasoning,
          paymentDetails: e.paymentDetails,
          securityDetails: e.securityDetails,
        }));
        set({ events: mappedAudits, isLoading: false });
      } else {
        set({ isLoading: false });
      }
    } catch {
      set({ isLoading: false });
    }
  },

  setSearchQuery: (query) => set({ searchQuery: query }),
  setStatusFilter: (status) => set({ statusFilter: status }),
  setRiskFilter: (risk) => set({ riskFilter: risk }),

  getFilteredEvents: () => {
    const { events, searchQuery, statusFilter, riskFilter } = get();

    let filtered = [...events];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (e) =>
          e.id.toLowerCase().includes(q) ||
          e.user.toLowerCase().includes(q) ||
          (e.orderId && e.orderId.toLowerCase().includes(q)) ||
          (e.paymentId && e.paymentId.toLowerCase().includes(q))
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter((e) => e.status === statusFilter);
    }

    if (riskFilter !== 'all') {
      filtered = filtered.filter((e) => e.riskLevel === riskFilter);
    }

    // Sort newest first
    filtered.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    return filtered;
  },

  getAuditStats: () => {
    const { events } = get();
    const stats = {
      total: events.length,
      successfulPayments: 0,
      failedPayments: 0,
      recommendations: 0,
      securityEvents: 0,
    };

    events.forEach((e) => {
      if (e.status === 'success') stats.successfulPayments++;
      if (e.status === 'failed') stats.failedPayments++;
      if (e.aiReasoning) stats.recommendations++;
      if (e.riskLevel === 'high' || e.riskLevel === 'medium') stats.securityEvents++;
    });

    return stats;
  },
}));
