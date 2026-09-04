'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  Sparkles,
  ShoppingBag,
  X,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import { useAssistantStore } from '@/stores/use-assistant-store';
import { AiInsightsPanel } from './ai-insights-panel';
import { SmartCartDrawer } from './smart-cart-drawer';

interface AssistantRightPanelProps {
  onCloseMobile?: () => void;
}

export const AssistantRightPanel: React.FC<AssistantRightPanelProps> = ({ onCloseMobile }) => {
  const { activeRightPanelTab, setActiveRightPanelTab, cart } = useAssistantStore();

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <aside className="w-full h-full flex flex-col justify-between bg-zinc-950/95 border-l border-white/10 text-zinc-200 select-none overflow-hidden">
      {/* Top Tab Bar */}
      <div className="p-3 border-b border-white/10 flex items-center justify-between shrink-0 bg-black/40">
        <div className="flex items-center gap-1.5 bg-zinc-900/90 p-1 rounded-xl border border-white/10">
          <button
            type="button"
            onClick={() => setActiveRightPanelTab('insights')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeRightPanelTab === 'insights'
                ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md shadow-violet-500/20'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Insights</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveRightPanelTab('cart')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all relative ${
              activeRightPanelTab === 'cart'
                ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md shadow-violet-500/20'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Smart Cart</span>
            {totalCartCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-emerald-500 text-zinc-950 text-[10px] font-bold flex items-center justify-center font-mono">
                {totalCartCount}
              </span>
            )}
          </button>
        </div>

        {onCloseMobile && (
          <button
            type="button"
            onClick={onCloseMobile}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 lg:hidden"
            aria-label="Close panel"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Main Content Body */}
      <div className="flex-1 overflow-y-auto">
        {activeRightPanelTab === 'insights' ? <AiInsightsPanel /> : <SmartCartDrawer />}
      </div>
    </aside>
  );
};
