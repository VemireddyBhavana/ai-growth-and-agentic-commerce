'use client';
import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useOrdersStore } from '@/stores/ordersStore';
import Link from 'next/link';
import { ChevronLeft, FileText, CreditCard, Truck, Receipt } from 'lucide-react';
import { OrderTimeline } from '@/components/orders/OrderTimeline';
import { AIRecommendationSummary } from '@/components/orders/AIRecommendationSummary';
import { RefundSection } from '@/components/orders/RefundSection';
import { InvoiceModal } from '@/components/orders/InvoiceModal';

export default function OrderDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const orders = useOrdersStore((state) => state.orders);
  const order = orders.find(o => o.id === id);
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);

  if (!order) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col items-center justify-center p-4">
        <FileText className="w-16 h-16 text-white/20 mb-4" />
        <h1 className="text-2xl font-bold mb-2">Order Not Found</h1>
        <p className="text-white/60 mb-6">The order you are looking for does not exist or has been removed.</p>
        <button onClick={() => router.back()} className="bg-white/10 hover:bg-white/20 px-6 py-2 rounded-lg transition-colors">
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white py-6 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6 sm:mb-8 gap-2">
          <Link href="/orders" className="flex items-center text-white/60 hover:text-white transition-colors text-sm sm:text-base">
            <ChevronLeft className="w-5 h-5 mr-1" />
            <span className="hidden sm:inline">Back to Orders</span>
            <span className="sm:hidden">Back</span>
          </Link>
          <button 
            onClick={() => setIsInvoiceOpen(true)}
            className="flex items-center text-violet-400 hover:text-violet-300 font-medium transition-colors bg-violet-500/10 px-3 sm:px-4 py-2 rounded-lg border border-violet-500/20 text-sm"
          >
            <Receipt className="w-4 h-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">View Invoice</span>
            <span className="sm:hidden">Invoice</span>
          </button>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 sm:mb-8 pb-6 sm:pb-8 border-b border-white/10 gap-3">
          <div>
            <h1 className="text-xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60 mb-1 sm:mb-2">
              Order {order.id}
            </h1>
            <p className="text-white/60 text-sm sm:text-base">Placed on {new Date(order.date).toLocaleString()}</p>
          </div>
          <div className="sm:text-right flex sm:flex-col items-center sm:items-end gap-3 sm:gap-0">
            <span className="inline-block px-3 py-1 bg-white/10 rounded-full text-xs sm:text-sm font-medium capitalize sm:mb-2">
              Status: {order.status}
            </span>
            <p className="text-xl sm:text-2xl font-bold">₹{order.total.toLocaleString()}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Items */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-6 backdrop-blur-sm">
              <h3 className="text-lg sm:text-xl font-semibold text-white mb-4 sm:mb-6">Order Items</h3>
              <div className="space-y-3 sm:space-y-4">
                {order.items.map(item => (
                  <div key={item.id} className="flex justify-between items-center py-3 sm:py-4 border-b border-white/5 last:border-0 gap-3">
                    <div className="flex items-center min-w-0">
                      <div className="w-10 h-10 sm:w-16 sm:h-16 bg-white/10 rounded-lg mr-3 sm:mr-4 flex items-center justify-center shrink-0">
                        <FileText className="w-4 h-4 sm:w-6 sm:h-6 text-white/40" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-white text-sm sm:text-base truncate">{item.name}</p>
                        <p className="text-xs sm:text-sm text-white/60">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <p className="font-medium shrink-0 text-sm sm:text-base">₹{(item.price * item.quantity).toLocaleString()}</p>
                  </div>
                ))}
              </div>
            </div>

            {order.aiRecommendation && (
              <AIRecommendationSummary ai={order.aiRecommendation} />
            )}

            <RefundSection order={order} />

            {/* Payment Information */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
              <div className="flex items-center space-x-2 mb-6">
                <CreditCard className="w-5 h-5 text-white/60" />
                <h3 className="text-xl font-semibold text-white">Payment Information</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-white/50 mb-1">Razorpay Payment ID</p>
                  <p className="font-mono text-sm">{order.paymentDetails.razorpayPaymentId}</p>
                </div>
                <div>
                  <p className="text-sm text-white/50 mb-1">Razorpay Order ID</p>
                  <p className="font-mono text-sm">{order.paymentDetails.razorpayOrderId}</p>
                </div>
                <div>
                  <p className="text-sm text-white/50 mb-1">Method</p>
                  <p>{order.paymentDetails.method}</p>
                </div>
                <div>
                  <p className="text-sm text-white/50 mb-1">Status</p>
                  <p className="capitalize text-green-400">{order.paymentDetails.status}</p>
                </div>
              </div>
            </div>
            
          </div>

          {/* Right Column */}
          <div className="lg:col-span-4 space-y-8">
            <OrderTimeline timeline={order.timeline} />

            {/* Address */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
              <div className="flex items-center space-x-2 mb-4">
                <Truck className="w-5 h-5 text-white/60" />
                <h3 className="text-lg font-semibold text-white">Shipping Address</h3>
              </div>
              <p className="font-medium">{order.shippingAddress.fullName}</p>
              <p className="text-white/60 text-sm mt-1">{order.shippingAddress.street}</p>
              <p className="text-white/60 text-sm">{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}</p>
              <p className="text-white/60 text-sm">{order.shippingAddress.country}</p>
            </div>

            {/* Summary */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
              <h3 className="text-lg font-semibold text-white mb-4">Summary</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-white/60">Subtotal</span>
                  <span>₹{order.subtotal.toFixed(2)}</span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-green-400">
                    <span>Discount</span>
                    <span>-₹{order.discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-white/60">Tax</span>
                  <span>₹{order.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Shipping</span>
                  <span>{order.shipping === 0 ? 'Free' : `₹${order.shipping.toFixed(2)}`}</span>
                </div>
                <div className="pt-3 border-t border-white/10 flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>₹{order.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <InvoiceModal 
        order={order} 
        isOpen={isInvoiceOpen} 
        onClose={() => setIsInvoiceOpen(false)} 
      />
    </div>
  );
}
