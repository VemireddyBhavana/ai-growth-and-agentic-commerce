'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCheckoutStore } from '@/stores/checkoutStore';
import { Loader2, ShieldCheck } from 'lucide-react';
import { logAuditEvent } from '@/lib/auditLogger';

export const PaymentHandler: React.FC = () => {
  const router = useRouter();
  const { total, address, contact, items } = useCheckoutStore();
  const [isProcessing, setIsProcessing] = useState(false);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    if (!address.fullName || !contact.email || !contact.phone) {
      alert("Please fill in all contact and address details.");
      return;
    }

    setIsProcessing(true);
    
    await logAuditEvent({
      eventType: 'Checkout Started',
      status: 'INFO',
      details: { total, itemsCount: items.length },
    });

    const isScriptLoaded = await loadRazorpayScript();
    if (!isScriptLoaded) {
      alert('Razorpay SDK failed to load. Please check your connection.');
      setIsProcessing(false);
      return;
    }

    try {
      // Create Order
      const res = await fetch('/api/checkout/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: total }),
      });
      const order = await res.json();

      if (!res.ok) {
        throw new Error(order.error || 'Failed to create order');
      }

      await logAuditEvent({
        eventType: 'Payment Initiated',
        status: 'INFO',
        orderId: order.id,
      });

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: 'AI Sales Assistant',
        description: 'Test Transaction',
        order_id: order.id,
        handler: async function (response: any) {
          try {
            const verifyRes = await fetch('/api/checkout/verify-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(response),
            });
            
            const verifyData = await verifyRes.json();
            
            if (verifyData.success) {
              router.push(`/payment/success?order_id=${response.razorpay_order_id}&payment_id=${response.razorpay_payment_id}`);
            } else {
              router.push(`/payment/failed?reason=verification_failed`);
            }
          } catch (error) {
            console.error('Verification error', error);
            router.push(`/payment/failed?reason=verification_error`);
          }
        },
        prefill: {
          name: address.fullName,
          email: contact.email,
          contact: contact.phone,
        },
        theme: {
          color: '#8b5cf6',
        },
        modal: {
          ondismiss: async function() {
            setIsProcessing(false);
            await logAuditEvent({
              eventType: 'Payment Failed',
              status: 'INFO',
              orderId: order.id,
              details: { reason: 'User dismissed checkout' },
            });
          }
        }
      };

      const rzp = new (window as any).Razorpay(options);
      
      rzp.on('payment.failed', async function (response: any) {
        await logAuditEvent({
          eventType: 'Payment Failed',
          status: 'ERROR',
          orderId: response.error.metadata.order_id,
          paymentId: response.error.metadata.payment_id,
          details: { reason: response.error.description },
        });
        setIsProcessing(false);
        router.push(`/payment/failed?reason=${encodeURIComponent(response.error.description)}`);
      });

      rzp.open();
    } catch (error) {
      console.error('Payment initialization error', error);
      setIsProcessing(false);
      alert('Could not initiate payment. Please try again later.');
    }
  };

  return (
    <button
      onClick={handlePayment}
      disabled={isProcessing}
      className="w-full bg-violet-600 hover:bg-violet-700 text-white font-medium py-4 px-6 rounded-xl flex items-center justify-center space-x-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
    >
      {isProcessing ? (
        <Loader2 className="w-5 h-5 animate-spin" />
      ) : (
        <ShieldCheck className="w-5 h-5" />
      )}
      <span>{isProcessing ? 'Processing...' : 'Pay Securely'}</span>
    </button>
  );
};
