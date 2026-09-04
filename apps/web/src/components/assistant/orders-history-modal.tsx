'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Package, CheckCircle2, Truck, Download } from 'lucide-react';
import { toast } from 'sonner';
import { useAssistantStore } from '@/stores/use-assistant-store';

export const OrdersHistoryModal: React.FC = () => {
  const { isOrdersModalOpen, setOrdersModalOpen, orders } = useAssistantStore();

  if (!isOrdersModalOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setOrdersModalOpen(false)}
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-3xl max-h-[88vh] overflow-y-auto rounded-3xl border border-white/15 bg-zinc-950/95 text-zinc-100 shadow-2xl z-10 flex flex-col"
        >
          {/* Header */}
          <div className="sticky top-0 z-20 px-6 py-4 bg-zinc-950/90 backdrop-blur-md border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Package className="w-5 h-5 text-cyan-400" />
              <h3 className="font-heading font-bold text-base text-white">
                Orders & Deliveries ({orders.length})
              </h3>
            </div>

            <button
              type="button"
              onClick={() => setOrdersModalOpen(false)}
              className="p-2 rounded-xl border border-white/10 hover:bg-white/10 text-zinc-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 space-y-4 flex-1 overflow-y-auto">
            {orders.length === 0 ? (
              <div className="py-12 text-center text-zinc-400 space-y-2">
                <Package className="w-10 h-10 mx-auto text-zinc-400" />
                <p className="text-sm">No recent orders found.</p>
                <p className="text-xs text-zinc-400">
                  Complete a Razorpay checkout to track deliveries here.
                </p>
              </div>
            ) : (
              orders.map((order) => (
                <div
                  key={order.id}
                  className="p-4 sm:p-5 rounded-2xl border border-white/10 bg-zinc-900/80 backdrop-blur-xl space-y-4"
                >
                  {/* Order Top Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-heading font-bold text-sm text-white">
                          Order #{order.orderNumber}
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          {order.status}
                        </span>
                      </div>
                      <span className="text-[11px] font-mono text-zinc-400">
                        Placed on {new Date(order.createdAt).toLocaleDateString()} at{' '}
                        {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    <div className="text-right">
                      <div className="font-heading font-bold text-base text-white">
                        ₹{order.total.toLocaleString('en-IN')}
                      </div>
                      <span className="text-[10px] font-mono text-zinc-400">
                        Paid via {order.paymentMethod} (Razorpay)
                      </span>
                    </div>
                  </div>

                  {/* Delivery Progress Bar */}
                  <div className="space-y-2 font-mono text-[11px]">
                    <div className="flex justify-between text-zinc-400">
                      <span className="text-emerald-400 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Order Confirmed
                      </span>
                      <span className="text-cyan-400 font-semibold flex items-center gap-1">
                        <Truck className="w-3.5 h-3.5" />
                        Estimated Delivery: Tomorrow 2 PM
                      </span>
                    </div>
                    <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 w-3/4 rounded-full" />
                    </div>
                  </div>

                  {/* Itemized Items */}
                  <div className="space-y-2 pt-1">
                    {order.items.map((item) => (
                      <div
                        key={item.product.id}
                        className="flex items-center justify-between p-2.5 rounded-xl bg-black/40 border border-white/5 text-xs"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={item.product.images[0]}
                            alt={item.product.name}
                            className="w-10 h-10 rounded-lg object-cover border border-white/10"
                          />
                          <div>
                            <span className="font-medium text-zinc-200 block truncate max-w-[240px]">
                              {item.product.name}
                            </span>
                            <span className="text-[11px] text-zinc-400 font-mono">
                              Qty: {item.quantity} · ₹{item.product.price.toLocaleString('en-IN')} each
                            </span>
                          </div>
                        </div>

                        <span className="font-mono font-bold text-white">
                          ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Footer & Actions */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-white/5 text-xs font-mono text-zinc-400">
                    <span className="text-[11px] truncate max-w-[280px]">
                      Razorpay ID: {order.razorpayPaymentId || order.razorpayOrderId}
                    </span>

                    <button
                      type="button"
                      onClick={() => {
                        toast.info(`Downloading official invoice for #${order.orderNumber}...`);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 hover:text-white border border-white/10 flex items-center gap-1.5 transition-all text-xs"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Invoice Receipt
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
