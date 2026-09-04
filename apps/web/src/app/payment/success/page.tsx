'use client';
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle2, Download, Package, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const [orderDetails, setOrderDetails] = useState({
    orderId: '',
    paymentId: '',
  });

  useEffect(() => {
    setOrderDetails({
      orderId: searchParams.get('order_id') || 'ORD_UNKNOWN',
      paymentId: searchParams.get('payment_id') || 'PAY_UNKNOWN',
    });
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-xl text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <CheckCircle2 className="w-10 h-10 text-green-500" />
        </motion.div>
        
        <h1 className="text-3xl font-bold mb-2">Payment Successful!</h1>
        <p className="text-white/60 mb-8">Thank you for your purchase. Your order has been placed successfully.</p>

        <div className="bg-black/20 rounded-xl p-4 mb-8 text-left space-y-3 border border-white/5">
          <div className="flex justify-between">
            <span className="text-white/60 text-sm">Order ID</span>
            <span className="font-mono text-sm">{orderDetails.orderId}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-white/60 text-sm">Payment ID</span>
            <span className="font-mono text-sm">{orderDetails.paymentId}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-white/60 text-sm">Est. Delivery</span>
            <span className="text-sm font-medium">3-5 Business Days</span>
          </div>
        </div>

        <div className="space-y-3">
          <Link href="/" className="w-full bg-violet-600 hover:bg-violet-700 text-white font-medium py-3 px-4 rounded-xl flex items-center justify-center transition-colors">
            Continue Shopping
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
          
          <div className="grid grid-cols-2 gap-3">
            <button className="bg-white/10 hover:bg-white/15 text-white font-medium py-3 px-4 rounded-xl flex items-center justify-center transition-colors text-sm">
              <Package className="w-4 h-4 mr-2" />
              View Orders
            </button>
            <button className="bg-white/10 hover:bg-white/15 text-white font-medium py-3 px-4 rounded-xl flex items-center justify-center transition-colors text-sm">
              <Download className="w-4 h-4 mr-2" />
              Receipt
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <React.Suspense fallback={<div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center">Loading...</div>}>
      <PaymentSuccessContent />
    </React.Suspense>
  );
}
