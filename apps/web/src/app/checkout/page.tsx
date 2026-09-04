'use client';
import React from 'react';
import { useCheckoutStore } from '@/stores/checkoutStore';
import { OrderSummary } from '@/components/checkout/OrderSummary';
import { PaymentMethodIcons } from '@/components/checkout/PaymentMethodIcons';
import { AIExplainabilityPanel } from '@/components/checkout/AIExplainabilityPanel';
import { PaymentHandler } from '@/components/checkout/PaymentHandler';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';

export default function CheckoutPage() {
  const { address, contact, setAddress, setContact } = useCheckoutStore();

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 flex items-center">
          <Link href="/" className="flex items-center text-white/60 hover:text-white transition-colors">
            <ChevronLeft className="w-5 h-5 mr-1" />
            Back to Cart
          </Link>
        </div>
        
        <h1 className="text-3xl font-bold mb-10 text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60">
          Secure Checkout
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Forms */}
          <div className="lg:col-span-7 space-y-8">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
              <h2 className="text-xl font-semibold mb-6">Contact Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-1">Email</label>
                  <input 
                    type="email" 
                    value={contact.email}
                    onChange={e => setContact({ email: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-violet-500 transition-colors"
                    placeholder="john@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-1">Phone</label>
                  <input 
                    type="tel" 
                    value={contact.phone}
                    onChange={e => setContact({ phone: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-violet-500 transition-colors"
                    placeholder="+91 9876543210"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
              <h2 className="text-xl font-semibold mb-6">Shipping Address</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-1">Full Name</label>
                  <input 
                    type="text" 
                    value={address.fullName}
                    onChange={e => setAddress({ fullName: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-violet-500 transition-colors"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-1">Street Address</label>
                  <input 
                    type="text" 
                    value={address.streetAddress}
                    onChange={e => setAddress({ streetAddress: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-violet-500 transition-colors"
                    placeholder="123 AI Avenue"
                  />
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-white/70 mb-1">City</label>
                    <input 
                      type="text" 
                      value={address.city}
                      onChange={e => setAddress({ city: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-violet-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-1">State</label>
                    <input 
                      type="text" 
                      value={address.state}
                      onChange={e => setAddress({ state: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-violet-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-1">ZIP</label>
                    <input 
                      type="text" 
                      value={address.zipCode}
                      onChange={e => setAddress({ zipCode: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-violet-500 transition-colors"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary & Payment */}
          <div className="lg:col-span-5 space-y-6">
            <OrderSummary />
            <AIExplainabilityPanel />
            
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
              <h3 className="text-lg font-semibold mb-2">Payment Methods</h3>
              <p className="text-sm text-white/60 mb-4">Secured by Razorpay</p>
              
              <PaymentMethodIcons />
              <PaymentHandler />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
