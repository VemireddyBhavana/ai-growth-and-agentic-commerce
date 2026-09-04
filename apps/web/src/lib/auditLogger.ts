export type AuditEventType = 
  | 'Checkout Started'
  | 'Order Created'
  | 'Payment Initiated'
  | 'Payment Succeeded'
  | 'Payment Failed'
  | 'Payment Retried'
  | 'Verification Completed';

export interface AuditEvent {
  timestamp: string;
  eventType: AuditEventType;
  status: 'SUCCESS' | 'ERROR' | 'INFO';
  orderId?: string;
  paymentId?: string;
  details?: Record<string, any>;
}

export const logAuditEvent = async (event: Omit<AuditEvent, 'timestamp'>) => {
  const auditEvent: AuditEvent = {
    ...event,
    timestamp: new Date().toISOString(),
  };

  // In a real application, you'd send this to your backend/database
  console.log(`[AUDIT] ${auditEvent.timestamp} - ${auditEvent.eventType} - ${auditEvent.status}`, auditEvent);
  
  // Example of saving to DB if there was an endpoint
  // try {
  //   await fetch('/api/audit', {
  //     method: 'POST',
  //     headers: { 'Content-Type': 'application/json' },
  //     body: JSON.stringify(auditEvent),
  //   });
  // } catch (e) {
  //   console.error('Failed to log audit event', e);
  // }
};
