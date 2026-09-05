'use client';
import React, { useState } from 'react';
import { useOrdersStore } from '@/stores/ordersStore';
import type { Order } from '@/types/orders';
import { RefreshCcw, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export const RefundSection: React.FC<{ order: Order }> = ({ order }) => {
  const { requestRefund } = useOrdersStore();
  const [reason, setReason] = useState('');
  const [isRequesting, setIsRequesting] = useState(false);

  const handleRequestRefund = () => {
    if (!reason.trim()) {
      alert("Please provide a reason for the refund.");
      return;
    }
    requestRefund(order.id, reason);
    setIsRequesting(false);
  };

  if (order.refundStatus && order.refundStatus !== 'none') {
    return (
      <div className="bg-orange-500/10 border border-orange-500/20 rounded-2xl p-6 backdrop-blur-sm mt-6">
        <h3 className="text-xl font-semibold text-white mb-2 flex items-center">
          <RefreshCcw className="w-5 h-5 mr-2 text-orange-400" />
          Refund Status: <span className="capitalize ml-2 text-orange-400">{order.refundStatus}</span>
        </h3>
        {order.refundAmount && (
          <p className="text-white/80 mb-2">Amount: <span className="font-medium text-white">₹{order.refundAmount}</span></p>
        )}
        {order.refundReason && (
          <p className="text-sm text-white/60">Reason: {order.refundReason}</p>
        )}
      </div>
    );
  }

  // Only show for delivered orders within a mock 30-day window
  if (order.status !== 'delivered') return null;

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm mt-6">
      <h3 className="text-xl font-semibold text-white mb-4">Request Refund</h3>
      
      {!isRequesting ? (
        <button 
          onClick={() => setIsRequesting(true)}
          className="bg-white/10 hover:bg-white/20 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center"
        >
          <RefreshCcw className="w-4 h-4 mr-2" />
          Initiate Refund Request
        </button>
      ) : (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="space-y-4"
        >
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 flex items-start space-x-2">
            <AlertCircle className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
            <p className="text-sm text-blue-200">
              Refunds are subject to our return policy. Once approved, the amount will be credited back to your original payment method.
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-white/70 mb-1">Reason for Refund</label>
            <textarea 
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-violet-500 transition-colors h-24"
              placeholder="Please explain why you are requesting a refund..."
            />
          </div>
          
          <div className="flex space-x-3">
            <button 
              onClick={handleRequestRefund}
              className="bg-violet-600 hover:bg-violet-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
            >
              Submit Request
            </button>
            <button 
              onClick={() => setIsRequesting(false)}
              className="bg-white/5 hover:bg-white/10 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};
