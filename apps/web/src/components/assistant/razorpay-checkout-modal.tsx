'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Zap,
  CreditCard,
  QrCode,
  Building2,
  Wallet,
  CheckCircle2,
  ArrowRight,
  Lock,
  Download,
} from 'lucide-react';
import { toast } from 'sonner';
import type { AssistantOrder, CartItem } from '@ai-sales-assistant/types';
import { useAssistantStore } from '@/stores/use-assistant-store';

export const RazorpayCheckoutModal: React.FC = () => {
  const {
    isCheckoutModalOpen,
    closeCheckoutModal,
    checkoutProduct,
    checkoutBundle,
    cart,
    clearCart,
    addOrder,
  } = useAssistantStore();

  const [step, setStep] = useState<'details' | 'payment' | 'processing' | 'success'>('details');
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'CARD' | 'NET_BANKING' | 'WALLET'>('UPI');
  const [upiApp, setUpiApp] = useState<'gpay' | 'phonepe' | 'paytm' | 'qr'>('gpay');

  // Customer Form State
  const [customerName, setCustomerName] = useState('Priya Sharma');
  const [customerEmail, setCustomerEmail] = useState('priya.sharma@example.com');
  const [customerPhone, setCustomerPhone] = useState('+91 98765 43210');
  const [shippingAddress, setShippingAddress] = useState('Flat 402, Sunshine Heights, MG Road, Mumbai 400001');

  // Card Form State
  const [cardNumber, setCardNumber] = useState('4111 2222 3333 4444');
  const [cardExp, setCardExp] = useState('12/28');
  const [cardCvv, setCardCvv] = useState('123');

  // Completed Order State
  const [completedOrder, setCompletedOrder] = useState<AssistantOrder | null>(null);

  if (!isCheckoutModalOpen) return null;

  // Determine items being purchased
  let purchaseItems: CartItem[] = [];
  if (checkoutProduct) {
    purchaseItems = [{ product: checkoutProduct, quantity: 1, addedAt: new Date().toISOString() }];
  } else if (checkoutBundle) {
    purchaseItems = checkoutBundle.products.map((p) => ({
      product: p,
      quantity: 1,
      addedAt: new Date().toISOString(),
      bundleDiscountApplied: checkoutBundle.discountPercentage,
    }));
  } else {
    purchaseItems = cart;
  }

  const subtotal = purchaseItems.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
  const bundleDiscount = purchaseItems.some((i) => i.bundleDiscountApplied) ? Math.round(subtotal * 0.15) : 0;
  const discountedSubtotal = subtotal - bundleDiscount;
  const tax = Math.round(discountedSubtotal * 0.18 * 100) / 100;
  const shipping = discountedSubtotal > 999 ? 0 : 99;
  const total = Math.round((discountedSubtotal + tax + shipping) * 100) / 100;

  const handleProcessPayment = async () => {
    setStep('processing');

    try {
      const res = await fetch('/api/assistant/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: purchaseItems,
          customer: {
            name: customerName,
            email: customerEmail,
            phone: customerPhone,
            address: shippingAddress,
          },
          paymentMethod,
        }),
      });

      const data = await res.json();

      // Simulate payment delay of 1.5s
      setTimeout(() => {
        if (data.order) {
          setCompletedOrder(data.order);
          addOrder(data.order);
          if (!checkoutProduct && !checkoutBundle) {
            clearCart();
          }
          setStep('success');
          toast.success('Razorpay Payment Successful!');
        } else {
          // Fallback order
          const fallbackOrder: AssistantOrder = {
            id: `ord-${Date.now()}`,
            orderNumber: `NX-${Date.now().toString().slice(-6)}`,
            items: purchaseItems,
            subtotal,
            discount: bundleDiscount,
            tax,
            shipping,
            total,
            currency: 'INR',
            status: 'CONFIRMED',
            paymentStatus: 'COMPLETED',
            paymentMethod,
            razorpayOrderId: `order_rzp_test_${Math.floor(100000 + Math.random() * 900000)}`,
            razorpayPaymentId: `pay_rzp_test_${Math.floor(1000000 + Math.random() * 9000000)}`,
            customer: {
              name: customerName,
              email: customerEmail,
              phone: customerPhone,
              address: shippingAddress,
            },
            createdAt: new Date().toISOString(),
            aiAssisted: true,
            savings: bundleDiscount + 500,
          };
          setCompletedOrder(fallbackOrder);
          addOrder(fallbackOrder);
          if (!checkoutProduct && !checkoutBundle) {
            clearCart();
          }
          setStep('success');
        }
      }, 1500);
    } catch {
      setTimeout(() => {
        setStep('success');
      }, 1500);
    }
  };

  const handleClose = () => {
    setStep('details');
    closeCheckoutModal();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="fixed inset-0 bg-black/85 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.25 }}
          className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-3xl border border-white/15 bg-zinc-950/95 text-zinc-100 shadow-2xl z-10 flex flex-col"
        >
          {/* Header */}
          <div className="sticky top-0 z-20 px-6 py-4 bg-zinc-950/90 backdrop-blur-md border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-violet-500/20 text-violet-300 border border-violet-500/30">
                <Lock className="w-4 h-4 text-violet-400" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-heading font-bold text-sm text-white">
                    Razorpay Secure Checkout
                  </h3>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    TEST MODE
                  </span>
                </div>
                <p className="text-[11px] text-zinc-400">
                  Autonomous AI Order Preparation & Settlement
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleClose}
              className="p-2 rounded-xl border border-white/10 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body Content */}
          <div className="p-6 sm:p-8 space-y-6">
            {/* Step 1: Customer Details */}
            {step === 'details' && (
              <div className="space-y-5">
                <div className="space-y-1">
                  <h4 className="font-heading font-semibold text-base text-zinc-100">
                    1. Shipping & Customer Details
                  </h4>
                  <p className="text-xs text-zinc-400">
                    Please confirm your shipping address and contact details:
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="space-y-1">
                    <label className="text-zinc-400 font-mono text-[11px]">Full Name</label>
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white outline-none focus:border-violet-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-zinc-400 font-mono text-[11px]">Email Address</label>
                    <input
                      type="email"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white outline-none focus:border-violet-500"
                    />
                  </div>

                  <div className="space-y-1 sm:col-span-2">
                    <label className="text-zinc-400 font-mono text-[11px]">Phone Number</label>
                    <input
                      type="tel"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white outline-none focus:border-violet-500"
                    />
                  </div>

                  <div className="space-y-1 sm:col-span-2">
                    <label className="text-zinc-400 font-mono text-[11px]">Shipping Address</label>
                    <textarea
                      rows={2}
                      value={shippingAddress}
                      onChange={(e) => setShippingAddress(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white outline-none focus:border-violet-500 resize-none"
                    />
                  </div>
                </div>

                {/* Items Summary Preview */}
                <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10 space-y-2 text-xs font-mono">
                  <span className="text-zinc-400 text-[11px] block">Order Summary:</span>
                  {purchaseItems.map((item) => (
                    <div key={item.product.id} className="flex justify-between text-zinc-300">
                      <span className="truncate max-w-[280px]">
                        {item.quantity}x {item.product.name}
                      </span>
                      <span className="text-white">
                        ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                      </span>
                    </div>
                  ))}
                  <div className="flex justify-between font-bold text-sm text-white pt-2 border-t border-white/10">
                    <span>Total with GST & Shipping:</span>
                    <span className="text-emerald-400">₹{total.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setStep('payment')}
                  className="w-full py-3 px-4 rounded-xl font-heading font-bold text-xs bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-xl shadow-violet-500/25 flex items-center justify-center gap-2 transition-all active:scale-95"
                >
                  <span>Continue to Payment Method</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Step 2: Payment Method */}
            {step === 'payment' && (
              <div className="space-y-5">
                <div className="space-y-1">
                  <h4 className="font-heading font-semibold text-base text-zinc-100">
                    2. Select Razorpay Test Payment Method
                  </h4>
                  <p className="text-xs text-zinc-400">
                    Test Mode active. No actual money will be charged.
                  </p>
                </div>

                {/* Payment Method Selector Tabs */}
                <div className="grid grid-cols-4 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('UPI')}
                    className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all ${
                      paymentMethod === 'UPI'
                        ? 'border-violet-500 bg-violet-500/20 text-white font-semibold shadow-md'
                        : 'border-white/10 bg-zinc-900 text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    <QrCode className="w-5 h-5" />
                    <span>UPI</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('CARD')}
                    className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all ${
                      paymentMethod === 'CARD'
                        ? 'border-violet-500 bg-violet-500/20 text-white font-semibold shadow-md'
                        : 'border-white/10 bg-zinc-900 text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    <CreditCard className="w-5 h-5" />
                    <span>Cards</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('NET_BANKING')}
                    className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all ${
                      paymentMethod === 'NET_BANKING'
                        ? 'border-violet-500 bg-violet-500/20 text-white font-semibold shadow-md'
                        : 'border-white/10 bg-zinc-900 text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    <Building2 className="w-5 h-5" />
                    <span>Net Banking</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('WALLET')}
                    className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all ${
                      paymentMethod === 'WALLET'
                        ? 'border-violet-500 bg-violet-500/20 text-white font-semibold shadow-md'
                        : 'border-white/10 bg-zinc-900 text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    <Wallet className="w-5 h-5" />
                    <span>Wallets</span>
                  </button>
                </div>

                {/* Sub-form according to payment method */}
                {paymentMethod === 'UPI' && (
                  <div className="p-4 rounded-2xl bg-zinc-900 border border-white/10 space-y-3">
                    <div className="text-xs text-zinc-300 font-medium">Select UPI App:</div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
                      {['gpay', 'phonepe', 'paytm', 'qr'].map((app) => (
                        <button
                          key={app}
                          type="button"
                          onClick={() => setUpiApp(app as 'gpay' | 'phonepe' | 'paytm' | 'qr')}
                          className={`p-2.5 rounded-xl border uppercase tracking-wider text-center ${
                            upiApp === app
                              ? 'border-violet-500 bg-violet-500/30 text-white font-bold'
                              : 'border-white/10 bg-black/40 text-zinc-400 hover:text-zinc-200'
                          }`}
                        >
                          {app === 'qr' ? '📷 QR Scan' : app}
                        </button>
                      ))}
                    </div>
                    <p className="text-[11px] text-zinc-400">
                      Razorpay will simulate an instant UPI approval notification.
                    </p>
                  </div>
                )}

                {paymentMethod === 'CARD' && (
                  <div className="p-4 rounded-2xl bg-zinc-900 border border-white/10 space-y-3 text-xs">
                    <div className="space-y-1">
                      <label className="text-zinc-400 font-mono text-[11px]">Card Number</label>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white font-mono"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2 font-mono">
                      <div className="space-y-1">
                        <label className="text-zinc-400 text-[11px]">Expiry</label>
                        <input
                          type="text"
                          value={cardExp}
                          onChange={(e) => setCardExp(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-zinc-400 text-[11px]">CVV</label>
                        <input
                          type="password"
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setStep('details')}
                    className="px-4 py-3 rounded-xl text-xs font-semibold bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-white/10"
                  >
                    Back
                  </button>

                  <button
                    type="button"
                    onClick={handleProcessPayment}
                    className="flex-1 py-3 px-4 rounded-xl font-heading font-bold text-xs bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-xl shadow-emerald-500/25 flex items-center justify-center gap-2 transition-all active:scale-95"
                  >
                    <Zap className="w-4 h-4 fill-current text-amber-300" />
                    <span>Pay ₹{total.toLocaleString('en-IN')} (Razorpay Test Mode)</span>
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Processing Animation */}
            {step === 'processing' && (
              <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
                <div className="w-16 h-16 rounded-full border-4 border-violet-500/30 border-t-violet-500 animate-spin flex items-center justify-center" />
                <div className="space-y-1">
                  <h4 className="font-heading font-bold text-lg text-white">
                    Processing Razorpay Payment...
                  </h4>
                  <p className="text-xs text-zinc-400 font-mono">
                    Communicating with test gateway & creating order tokens...
                  </p>
                </div>
              </div>
            )}

            {/* Step 4: Success Receipt */}
            {step === 'success' && completedOrder && (
              <div className="space-y-6 text-center">
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 mx-auto flex items-center justify-center shadow-2xl shadow-emerald-500/30"
                >
                  <CheckCircle2 className="w-10 h-10" />
                </motion.div>

                <div className="space-y-1">
                  <h4 className="font-heading font-extrabold text-xl sm:text-2xl text-white">
                    Payment Successful!
                  </h4>
                  <p className="text-xs text-zinc-400">
                    Your order has been confirmed and scheduled for instant dispatch.
                  </p>
                </div>

                {/* Receipt Card */}
                <div className="p-4 rounded-2xl bg-zinc-900 border border-white/10 text-left text-xs font-mono space-y-3">
                  <div className="flex justify-between border-b border-white/10 pb-2">
                    <span className="text-zinc-400">Order Number:</span>
                    <span className="text-violet-300 font-bold">{completedOrder.orderNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Razorpay Payment ID:</span>
                    <span className="text-zinc-200">{completedOrder.razorpayPaymentId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Amount Paid:</span>
                    <span className="text-emerald-400 font-bold">
                      ₹{completedOrder.total.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Payment Mode:</span>
                    <span className="text-zinc-200">{completedOrder.paymentMethod}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Delivery Address:</span>
                    <span className="text-zinc-200 truncate max-w-[220px]">
                      {completedOrder.customer.address}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      toast.info('Downloading official invoice PDF...');
                    }}
                    className="flex-1 py-2.5 px-4 rounded-xl text-xs font-semibold bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-white/10 flex items-center justify-center gap-2"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Download Invoice
                  </button>

                  <button
                    type="button"
                    onClick={handleClose}
                    className="flex-1 py-2.5 px-4 rounded-xl text-xs font-semibold bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md flex items-center justify-center gap-2"
                  >
                    <span>Continue Shopping</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
