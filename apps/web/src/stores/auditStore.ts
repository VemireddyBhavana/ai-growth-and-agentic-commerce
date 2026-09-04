import { create } from 'zustand';
import { AuditRecord, RiskLevel, AuditEventStatus } from '@/types/audit';

const generateMockTimeline = (baseTime: number, isSuccess: boolean = true) => {
  const steps = [
    { id: '1', name: 'Customer Prompt', description: 'Received natural language query', timestamp: new Date(baseTime).toISOString(), status: 'success' as AuditEventStatus, duration: '45ms' },
    { id: '2', name: 'AI Intent Detection', description: 'Parsed intent and extracted entities', timestamp: new Date(baseTime + 150).toISOString(), status: 'success' as AuditEventStatus, duration: '105ms' },
    { id: '3', name: 'Product Recommendation', description: 'Generated tailored product list', timestamp: new Date(baseTime + 400).toISOString(), status: 'success' as AuditEventStatus, duration: '250ms' },
    { id: '4', name: 'Merchant Rules Applied', description: 'Applied discount logic', timestamp: new Date(baseTime + 450).toISOString(), status: 'success' as AuditEventStatus, duration: '50ms' },
    { id: '5', name: 'Razorpay Checkout Created', description: 'Order ID generated via Razorpay API', timestamp: new Date(baseTime + 1500).toISOString(), status: 'success' as AuditEventStatus, duration: '1050ms' },
  ];

  if (isSuccess) {
    steps.push(
      { id: '6', name: 'Payment Verified', description: 'HMAC signature successfully validated', timestamp: new Date(baseTime + 120000).toISOString(), status: 'success' as AuditEventStatus, duration: '118.5s' },
      { id: '7', name: 'Order Created', description: 'Order saved in database', timestamp: new Date(baseTime + 120150).toISOString(), status: 'success' as AuditEventStatus, duration: '150ms' },
      { id: '8', name: 'Audit Event Logged', description: 'Trace securely stored', timestamp: new Date(baseTime + 120200).toISOString(), status: 'success' as AuditEventStatus, duration: '50ms' }
    );
  } else {
    steps.push(
      { id: '6', name: 'Payment Verified', description: 'Payment failed due to insufficient funds', timestamp: new Date(baseTime + 120000).toISOString(), status: 'failed' as AuditEventStatus, duration: '118.5s' },
      { id: '7', name: 'Audit Event Logged', description: 'Failure trace securely stored', timestamp: new Date(baseTime + 120200).toISOString(), status: 'success' as AuditEventStatus, duration: '50ms' }
    );
  }
  return steps;
};

const mockAudits: AuditRecord[] = [
  {
    id: 'AUD-9001',
    timestamp: new Date().toISOString(),
    eventType: 'End-to-End Checkout',
    user: 'sarah.j@example.com',
    orderId: 'ORD-2026-8901',
    paymentId: 'pay_KjU9ZmY',
    status: 'success',
    riskLevel: 'low',
    confidenceScore: 92,
    timeline: generateMockTimeline(Date.now() - 120200),
    aiReasoning: {
      customerIntent: 'Looking for a comfortable setup for long working hours',
      extractedKeywords: ['comfortable', 'setup', 'long hours', 'work'],
      budget: 'Flexible',
      category: 'Office Furniture & Electronics',
      confidenceScore: 92,
      alternativeProductsConsidered: ['Basic Office Chair', 'Standard Earbuds'],
      finalRecommendation: 'Ergonomic Desk Chair + Premium Wireless Headphones',
      expectedMargin: '24%',
      inventoryStatus: 'In Stock',
      selectionReason: 'Matches intent for comfort and long hours, high margin bundle.',
      rejectionReason: 'Basic chair rejected due to low comfort rating for "long hours".'
    },
    paymentDetails: {
      razorpayOrderId: 'order_KjU8YhY',
      razorpayPaymentId: 'pay_KjU9ZmY',
      verificationStatus: 'Verified',
      method: 'Credit Card',
      amount: 497.8,
      currency: 'INR',
      verificationResult: 'Signature Matched',
      signatureStatus: 'Valid'
    },
    securityDetails: {
      riskScore: 12,
      fraudCheckStatus: 'passed',
      merchantApprovalRequired: false,
      ruleEngineDecision: 'Auto-approved standard transaction',
      systemHealth: 'Optimal'
    }
  },
  {
    id: 'AUD-9002',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    eventType: 'End-to-End Checkout',
    user: 'm.chen@example.com',
    orderId: 'ORD-2026-8902',
    status: 'failed',
    riskLevel: 'medium',
    confidenceScore: 85,
    timeline: generateMockTimeline(Date.now() - 3600000 - 120200, false),
    aiReasoning: {
      customerIntent: 'Looking for a secondary monitor for coding',
      extractedKeywords: ['secondary monitor', 'coding'],
      budget: '$300-$500',
      category: 'Electronics',
      confidenceScore: 85,
      alternativeProductsConsidered: ['1080p Monitor', 'Ultrawide Monitor'],
      finalRecommendation: '4K Ultra HD Monitor',
      expectedMargin: '15%',
      inventoryStatus: 'Low Stock',
      selectionReason: 'Fits budget, ideal for crisp text rendering (coding).',
      rejectionReason: '1080p rejected due to low resolution for text.'
    },
    securityDetails: {
      riskScore: 45,
      fraudCheckStatus: 'passed',
      merchantApprovalRequired: false,
      ruleEngineDecision: 'Failed at payment gateway',
      systemHealth: 'Optimal'
    }
  }
];

import { apiClient } from '@/lib/api-client';

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
  getAuditStats: () => { total: number; successfulPayments: number; failedPayments: number; recommendations: number; securityEvents: number };
}

export const useAuditStore = create<AuditState>((set, get) => ({
  events: mockAudits,
  searchQuery: '',
  statusFilter: 'all',
  riskFilter: 'all',
  isLoading: false,

  fetchEvents: async () => {
    set({ isLoading: true });
    try {
      const response = await apiClient.get('/audit/events');
      const data = response.data?.data || response.data;
      if (Array.isArray(data) && data.length > 0) {
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
      filtered = filtered.filter(e => 
        e.id.toLowerCase().includes(q) || 
        e.user.toLowerCase().includes(q) ||
        (e.orderId && e.orderId.toLowerCase().includes(q)) ||
        (e.paymentId && e.paymentId.toLowerCase().includes(q))
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(e => e.status === statusFilter);
    }

    if (riskFilter !== 'all') {
      filtered = filtered.filter(e => e.riskLevel === riskFilter);
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
      securityEvents: 0
    };

    events.forEach(e => {
      if (e.status === 'success') stats.successfulPayments++;
      if (e.status === 'failed') stats.failedPayments++;
      if (e.aiReasoning) stats.recommendations++;
      if (e.riskLevel === 'high' || e.riskLevel === 'medium') stats.securityEvents++;
    });

    return stats;
  }
}));
