import React from 'react';
import type { PaymentAuditDetails } from '@/types/audit';
import { CreditCard, Key } from 'lucide-react';

export const PaymentDetailsPanel: React.FC<{ payment: PaymentAuditDetails }> = ({ payment }) => {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
      <div className="flex items-center space-x-3 mb-6 pb-4 border-b border-white/10">
        <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
          <CreditCard className="w-5 h-5 text-blue-400" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white">Payment Verification</h3>
          <p className="text-sm text-blue-300">Amount: {payment.amount} {payment.currency}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-6">
        <div>
          <p className="text-xs font-bold text-white/40 uppercase tracking-wider mb-1">Razorpay Order ID</p>
          <p className="font-mono text-sm text-white/90">{payment.razorpayOrderId}</p>
        </div>
        <div>
          <p className="text-xs font-bold text-white/40 uppercase tracking-wider mb-1">Razorpay Payment ID</p>
          <p className="font-mono text-sm text-white/90">{payment.razorpayPaymentId}</p>
        </div>
        
        <div className="col-span-1 md:col-span-2 my-2 border-t border-white/5"></div>

        <div>
          <p className="text-xs font-bold text-white/40 uppercase tracking-wider mb-1">Method</p>
          <p className="text-sm text-white/90">{payment.method}</p>
        </div>
        <div>
          <p className="text-xs font-bold text-white/40 uppercase tracking-wider mb-1">Gateway Status</p>
          <p className="text-sm text-white/90">{payment.verificationStatus}</p>
        </div>

        <div>
          <p className="text-xs font-bold text-white/40 uppercase tracking-wider mb-1 flex items-center">
            <Key className="w-3 h-3 mr-1" /> HMAC Signature
          </p>
          <p className="text-sm text-green-400">{payment.signatureStatus}</p>
        </div>
        <div>
          <p className="text-xs font-bold text-white/40 uppercase tracking-wider mb-1">Verification Result</p>
          <p className="text-sm text-green-400">{payment.verificationResult}</p>
        </div>
      </div>
    </div>
  );
};
