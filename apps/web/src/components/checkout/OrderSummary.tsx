import React from 'react';
import { useCheckoutStore } from '@/stores/checkoutStore';

export const OrderSummary: React.FC = () => {
  const { items, subtotal, tax, shipping, total, discount } = useCheckoutStore();

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
      <h3 className="text-xl font-semibold text-white mb-6">Order Summary</h3>
      
      <div className="space-y-4 mb-6">
        {items.map((item) => (
          <div key={item.id} className="flex justify-between items-start">
            <div>
              <p className="text-white font-medium">{item.name}</p>
              <p className="text-white/60 text-sm">Qty: {item.quantity}</p>
            </div>
            <p className="text-white font-medium">₹{item.price * item.quantity}</p>
          </div>
        ))}
      </div>

      <div className="space-y-3 pt-6 border-t border-white/10">
        <div className="flex justify-between text-white/80">
          <span>Subtotal</span>
          <span>₹{subtotal.toFixed(2)}</span>
        </div>
        
        {discount > 0 && (
          <div className="flex justify-between text-green-400">
            <span>Discount (AI Applied)</span>
            <span>-₹{discount.toFixed(2)}</span>
          </div>
        )}
        
        <div className="flex justify-between text-white/80">
          <span>Tax</span>
          <span>₹{tax.toFixed(2)}</span>
        </div>
        
        <div className="flex justify-between text-white/80">
          <span>Shipping</span>
          <span>{shipping === 0 ? 'Free' : `₹${shipping.toFixed(2)}`}</span>
        </div>
        
        <div className="flex justify-between text-white font-bold text-lg pt-4 border-t border-white/10">
          <span>Grand Total</span>
          <span>₹{total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};
