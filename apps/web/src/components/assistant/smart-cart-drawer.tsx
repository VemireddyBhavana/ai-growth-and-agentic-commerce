'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShieldCheck,
  Zap,
  Truck,
  Percent,
} from 'lucide-react';
import { useAssistantStore } from '@/stores/use-assistant-store';

export const SmartCartDrawer: React.FC = () => {
  const {
    cart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    openCheckoutModal,
  } = useAssistantStore();

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const bundleDiscount = cart.some((i) => i.bundleDiscountApplied) ? Math.round(subtotal * 0.1) : 0;
  const discountedSubtotal = subtotal - bundleDiscount;
  const tax = Math.round(discountedSubtotal * 0.18 * 100) / 100; // 18% GST
  const freeShippingThreshold = 999;
  const shipping = discountedSubtotal > freeShippingThreshold || cart.length === 0 ? 0 : 99;
  const total = Math.round((discountedSubtotal + tax + shipping) * 100) / 100;

  const totalSavings = cart.reduce((sum, item) => {
    const compareSavings =
      item.product.comparePrice && item.product.comparePrice > item.product.price
        ? (item.product.comparePrice - item.product.price) * item.quantity
        : 0;
    return sum + compareSavings;
  }, 0) + bundleDiscount;

  const handleCheckout = () => {
    if (cart.length === 0) return;
    openCheckoutModal();
  };

  return (
    <div className="p-4 flex flex-col h-full justify-between space-y-4 text-xs">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <ShoppingBag className="w-4 h-4 text-violet-400" />
          <span className="font-heading font-bold text-sm text-white">
            Smart Cart ({cart.reduce((sum, i) => sum + i.quantity, 0)})
          </span>
        </div>
        {cart.length > 0 && (
          <button
            type="button"
            onClick={clearCart}
            className="text-[11px] font-mono text-zinc-400 hover:text-rose-400 transition-colors"
          >
            Clear Cart
          </button>
        )}
      </div>

      {/* Free Shipping Tracker */}
      {cart.length > 0 && (
        <div className="p-2.5 rounded-xl bg-cyan-950/20 border border-cyan-500/20 space-y-1.5 font-mono">
          <div className="flex items-center justify-between text-[11px]">
            <span className="flex items-center gap-1.5 text-cyan-300">
              <Truck className="w-3.5 h-3.5" />
              {discountedSubtotal >= freeShippingThreshold
                ? 'Unlocked Free Express Shipping!'
                : `Add ₹${(freeShippingThreshold - discountedSubtotal).toLocaleString('en-IN')} for Free Shipping`}
            </span>
          </div>
          <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-cyan-400 rounded-full transition-all duration-300"
              style={{
                width: `${Math.min(100, (discountedSubtotal / freeShippingThreshold) * 100)}%`,
              }}
            />
          </div>
        </div>
      )}

      {/* Cart Items List */}
      <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 min-h-[160px]">
        {cart.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3 text-zinc-400">
            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
              <ShoppingBag className="w-6 h-6 text-zinc-400" />
            </div>
            <p className="text-xs">Your shopping cart is empty.</p>
            <p className="text-[11px] text-zinc-400">
              Ask the AI assistant for recommendations to add products!
            </p>
          </div>
        ) : (
          <AnimatePresence>
            {cart.map((item) => (
              <motion.div
                key={item.product.id}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="p-3 rounded-2xl border border-white/10 bg-zinc-900/80 backdrop-blur-xl flex items-center gap-3 group"
              >
                {/* Product Thumbnail */}
                <img
                  src={item.product.images[0]}
                  alt={item.product.name}
                  className="w-12 h-12 rounded-xl object-cover border border-white/10 shrink-0"
                />

                {/* Info */}
                <div className="min-w-0 flex-1 space-y-1">
                  <h4 className="font-heading font-semibold text-xs text-zinc-100 truncate">
                    {item.product.name}
                  </h4>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-bold text-white font-mono">
                      ₹{item.product.price.toLocaleString('en-IN')}
                    </span>
                    {item.bundleDiscountApplied && (
                      <span className="text-[10px] text-emerald-400 font-mono">
                        {item.bundleDiscountApplied}% bundle deal
                      </span>
                    )}
                  </div>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center gap-1.5 bg-black/40 p-1 rounded-xl border border-white/5">
                  <button
                    type="button"
                    onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                    className="p-1 rounded-lg hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="w-5 text-center font-mono font-semibold text-xs text-zinc-200">
                    {item.quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                    className="p-1 rounded-lg hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>

                {/* Remove button */}
                <button
                  type="button"
                  onClick={() => removeFromCart(item.product.id)}
                  className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-400 hover:bg-white/5 transition-colors"
                  aria-label="Remove item"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

      {/* Bill Breakdown & Checkout Button */}
      {cart.length > 0 && (
        <div className="pt-3 border-t border-white/10 space-y-3 font-mono">
          {/* Savings Highlight */}
          {totalSavings > 0 && (
            <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-[11px] flex items-center justify-between">
              <span className="flex items-center gap-1">
                <Percent className="w-3 h-3" />
                Total Savings Applied:
              </span>
              <span className="font-bold font-mono">₹{totalSavings.toLocaleString('en-IN')}</span>
            </div>
          )}

          {/* Subtotals */}
          <div className="space-y-1 text-xs text-zinc-400">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="text-zinc-200">₹{subtotal.toLocaleString('en-IN')}</span>
            </div>
            {bundleDiscount > 0 && (
              <div className="flex justify-between text-emerald-400">
                <span>Bundle Discount</span>
                <span>-₹{bundleDiscount.toLocaleString('en-IN')}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Estimated GST (18%)</span>
              <span className="text-zinc-200">₹{tax.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery</span>
              <span className="text-zinc-200">
                {shipping === 0 ? <span className="text-emerald-400">FREE</span> : `₹${shipping}`}
              </span>
            </div>
            <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-white/10">
              <span className="font-heading">Total Amount</span>
              <span className="font-heading text-base">₹{total.toLocaleString('en-IN')}</span>
            </div>
          </div>

          {/* Razorpay Test Checkout Button */}
          <button
            type="button"
            onClick={handleCheckout}
            className="w-full py-3 px-4 rounded-xl font-heading font-bold text-xs bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-xl shadow-violet-500/25 flex items-center justify-center gap-2 transition-all active:scale-95 group"
          >
            <Zap className="w-4 h-4 fill-current text-amber-300" />
            <span>Prepare Razorpay Test Checkout</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>

          <div className="flex items-center justify-center gap-1.5 text-[10px] text-zinc-400">
            <ShieldCheck className="w-3 h-3 text-emerald-400" />
            <span>Razorpay 256-bit Encrypted Test Mode</span>
          </div>
        </div>
      )}
    </div>
  );
};
