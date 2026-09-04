'use client';
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { XCircle, RefreshCcw, ShoppingCart, MessageSquareWarning } from 'lucide-react';
import { motion } from 'framer-motion';

function PaymentFailedContent() {
  const searchParams = useSearchParams();
  const [reason, setReason] = useState('Payment failed or was cancelled.');

  useEffect(() => {
    const r = searchParams.get('reason');
    if (r) {
      setReason(decodeURIComponent(r));
    }
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
          className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <XCircle className="w-10 h-10 text-red-500" />
        </motion.div>
        
        <h1 className="text-3xl font-bold mb-2">Payment Failed</h1>
        <p className="text-white/60 mb-8">We couldn&apos;t process your payment at this time.</p>

        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-8 text-left flex items-start space-x-3">
          <MessageSquareWarning className="w-5 h-5 text-red-400 mt-0.5" />
          <div>
            <span className="text-sm font-medium text-red-400 block mb-1">Reason</span>
            <span className="text-white/80 text-sm">{reason}</span>
          </div>
        </div>

        <div className="space-y-3">
          <Link href="/checkout" className="w-full bg-violet-600 hover:bg-violet-700 text-white font-medium py-3 px-4 rounded-xl flex items-center justify-center transition-colors">
            <RefreshCcw className="w-4 h-4 mr-2" />
            Retry Payment
          </Link>
          
          <div className="grid grid-cols-2 gap-3">
            <Link href="/" className="bg-white/10 hover:bg-white/15 text-white font-medium py-3 px-4 rounded-xl flex items-center justify-center transition-colors text-sm">
              <ShoppingCart className="w-4 h-4 mr-2" />
              Return to Cart
            </Link>
            <button className="bg-white/10 hover:bg-white/15 text-white font-medium py-3 px-4 rounded-xl flex items-center justify-center transition-colors text-sm">
              Contact Support
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function PaymentFailedPage() {
  return (
    <React.Suspense fallback={<div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center">Loading...</div>}>
      <PaymentFailedContent />
    </React.Suspense>
  );
}
