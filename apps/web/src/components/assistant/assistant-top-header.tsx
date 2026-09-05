'use client';

import React from 'react';
import { ShoppingCart, ChevronDown, Store, User, Sparkles } from 'lucide-react';
import { useAssistantStore } from '@/stores/use-assistant-store';

interface AssistantTopHeaderProps {
  onOpenCart?: () => void;
}

export const AssistantTopHeader: React.FC<AssistantTopHeaderProps> = ({ onOpenCart }) => {
  const { cart, setActiveRightPanelTab, setRightPanelOpen } = useAssistantStore();
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleCartClick = () => {
    setActiveRightPanelTab('cart');
    setRightPanelOpen(true);
    if (onOpenCart) onOpenCart();
  };

  return (
    <header className="w-full bg-white dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800 px-4 sm:px-6 py-2.5 flex items-center justify-between shrink-0 shadow-xs z-20">
      {/* Left: Merchant Info */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        <div className="flex items-center gap-1.5 text-zinc-900 dark:text-zinc-100 font-semibold text-xs sm:text-sm">
          <Store className="w-4 h-4 text-violet-600 dark:text-violet-400" />
          <span>Merchant: <span className="font-bold">TechKart Electronics</span></span>
        </div>

        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>Live (Test Mode)</span>
        </span>
      </div>

      {/* Right: Cart & Merchant Account Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Cart Button */}
        <button
          type="button"
          onClick={handleCartClick}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg border border-violet-500 text-violet-700 dark:text-violet-400 hover:bg-violet-50 dark:hover:bg-violet-950/40 text-xs sm:text-sm font-semibold transition-colors shadow-xs active:scale-95 cursor-pointer"
        >
          <ShoppingCart className="w-4 h-4 text-violet-600 dark:text-violet-400" />
          <span>Cart ({totalItems})</span>
        </button>

        {/* Merchant Dropdown */}
        <div className="relative">
          <button
            type="button"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-700 dark:text-zinc-300 text-xs sm:text-sm font-medium transition-colors cursor-pointer"
          >
            <User className="w-3.5 h-3.5 text-zinc-500" />
            <span className="hidden sm:inline">Merchant</span>
            <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
          </button>
        </div>
      </div>
    </header>
  );
};
