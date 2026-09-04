export type AuditEventStatus = 'success' | 'failed' | 'pending' | 'warning';
export type RiskLevel = 'low' | 'medium' | 'high';

export interface TimelineStep {
  id: string;
  name: string;
  description: string;
  timestamp: string;
  status: AuditEventStatus;
  duration?: string;
  icon?: string;
}

export interface AIReasoning {
  customerIntent: string;
  extractedKeywords: string[];
  budget: string;
  category: string;
  confidenceScore: number;
  alternativeProductsConsidered: string[];
  finalRecommendation: string;
  expectedMargin: string;
  inventoryStatus: string;
  selectionReason: string;
  rejectionReason: string;
}

export interface SecurityDetails {
  riskScore: number;
  fraudCheckStatus: 'passed' | 'flagged' | 'failed';
  merchantApprovalRequired: boolean;
  ruleEngineDecision: string;
  systemHealth: string;
}

export interface PaymentAuditDetails {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  verificationStatus: string;
  method: string;
  amount: number;
  currency: string;
  verificationResult: string;
  signatureStatus: string;
}

export interface AuditRecord {
  id: string;
  timestamp: string;
  eventType: string; // The primary outcome of this trace (e.g., "End-to-End Checkout")
  user: string;
  orderId?: string;
  paymentId?: string;
  status: AuditEventStatus;
  riskLevel: RiskLevel;
  confidenceScore: number;
  timeline: TimelineStep[];
  aiReasoning?: AIReasoning;
  paymentDetails?: PaymentAuditDetails;
  securityDetails?: SecurityDetails;
}
