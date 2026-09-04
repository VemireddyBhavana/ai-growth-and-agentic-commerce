import React from 'react';
import { CreditCard, Smartphone, Building2, Wallet } from 'lucide-react';

export const PaymentMethodIcons: React.FC = () => {
  const methods = [
    { icon: Smartphone, label: 'UPI' },
    { icon: CreditCard, label: 'Card' },
    { icon: Building2, label: 'Net Banking' },
    { icon: Wallet, label: 'Wallet' },
  ];

  return (
    <div className="flex space-x-4 mb-6 mt-4">
      {methods.map(({ icon: Icon, label }, index) => (
        <div key={index} className="flex flex-col items-center justify-center p-3 bg-white/5 rounded-xl border border-white/10 flex-1 hover:bg-white/10 transition-colors cursor-pointer group">
          <Icon className="w-6 h-6 text-white/70 group-hover:text-white mb-2 transition-colors" />
          <span className="text-xs text-white/60 group-hover:text-white/90 font-medium">{label}</span>
        </div>
      ))}
    </div>
  );
};
