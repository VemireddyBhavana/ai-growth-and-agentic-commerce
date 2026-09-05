'use client';

import React from 'react';
import Link from 'next/link';
import {
  Sparkles,
  MessageSquare,
  Package,
  Receipt,
  Rocket,
  TrendingUp,
  Settings,
  HelpCircle,
  X,
  Flame,
  ChevronRight,
  Headphones,
} from 'lucide-react';
import { useAssistantStore } from '@/stores/use-assistant-store';
import { toast } from 'sonner';

interface AssistantSidebarProps {
  onCloseMobile?: () => void;
}

export const AssistantSidebar: React.FC<AssistantSidebarProps> = ({ onCloseMobile }) => {
  const {
    openProductModal,
    savedProducts,
    setOrdersModalOpen,
    setSettingsModalOpen,
    sendUserMessage,
  } = useAssistantStore();

  const handleExploreDeals = () => {
    sendUserMessage('Show me the Weekend Deals and discounted gaming accessories!');
    if (onCloseMobile) onCloseMobile();
  };

  const handleNeedHelp = () => {
    toast.info('Merchant Support Concierge', {
      description: 'Support representative available 24/7. Live chat connected.',
    });
  };

  return (
    <aside className="w-full h-full flex flex-col justify-between bg-[#121524] text-zinc-200 select-none overflow-y-auto border-r border-zinc-800/80 p-4">
      {/* Top Section: Brand & Nav Links */}
      <div className="space-y-6">
        {/* Brand Header */}
        <div className="flex items-center justify-between pt-1">
          <Link href="/dashboard" className="flex items-center gap-2.5 group cursor-pointer">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-violet-600 via-indigo-600 to-purple-500 p-0.5 shadow-md shadow-violet-500/30 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="font-heading font-bold text-sm text-white tracking-tight leading-none group-hover:text-violet-300 transition-colors">
                Ai Sales Assistant
              </h2>
              <p className="text-[10px] text-zinc-400 mt-0.5">Your Smart Shopping Concierge</p>
            </div>
          </Link>

          {onCloseMobile && (
            <button
              type="button"
              onClick={onCloseMobile}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 lg:hidden cursor-pointer"
              aria-label="Close sidebar"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Navigation Menu */}
        <nav className="space-y-1">
          {/* 1. Chat Assistant (Active) */}
          <Link
            href="/assistant"
            onClick={() => onCloseMobile?.()}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold bg-[#635BFF] text-white shadow-md shadow-violet-600/30 transition-all cursor-pointer"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Chat Assistant</span>
          </Link>

          {/* 2. Products */}
          <Link
            href="/products"
            onClick={() => onCloseMobile?.()}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium text-zinc-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
          >
            <Package className="w-4 h-4" />
            <span>Products</span>
          </Link>

          {/* 3. Orders */}
          <Link
            href="/orders"
            onClick={() => onCloseMobile?.()}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium text-zinc-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
          >
            <Receipt className="w-4 h-4" />
            <span>Orders</span>
          </Link>

          {/* 4. Campaigns */}
          <Link
            href="/analytics"
            onClick={() => onCloseMobile?.()}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium text-zinc-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
          >
            <Rocket className="w-4 h-4" />
            <span>Campaigns</span>
          </Link>

          {/* 5. Analytics */}
          <Link
            href="/analytics"
            onClick={() => onCloseMobile?.()}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium text-zinc-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
          >
            <TrendingUp className="w-4 h-4" />
            <span>Analytics</span>
          </Link>

          {/* 6. Settings */}
          <Link
            href="/settings"
            onClick={() => onCloseMobile?.()}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium text-zinc-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
          >
            <Settings className="w-4 h-4" />
            <span>Settings</span>
          </Link>
        </nav>
      </div>

      {/* Middle/Bottom Cards Section */}
      <div className="space-y-3 pt-6">
        {/* Merchant Summary Card */}
        <div className="p-3.5 rounded-2xl bg-zinc-900/80 border border-zinc-800/80 space-y-2 text-xs">
          <h4 className="font-heading font-semibold text-zinc-200">Merchant Summary</h4>

          <div className="space-y-1.5 pt-1">
            <div>
              <span className="text-[11px] text-zinc-400 block">Total Revenue (Test)</span>
              <span className="font-heading font-bold text-sm text-white">₹ 1,24,680</span>
            </div>

            <div className="flex items-center justify-between text-[11px] pt-1">
              <div>
                <span className="text-zinc-400">Orders: </span>
                <span className="font-semibold text-white">48</span>
              </div>
              <div>
                <span className="text-zinc-400">Growth: </span>
                <span className="font-semibold text-emerald-400">+ 23%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Weekend Deal Card (Purple gradient) */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-900/90 via-purple-900/80 to-violet-950 border border-violet-500/30 shadow-lg space-y-2.5">
          <div className="flex items-center gap-1.5 text-xs font-bold text-white">
            <Flame className="w-4 h-4 text-amber-400 fill-amber-400" />
            <span>Weekend Deal</span>
          </div>

          <p className="text-[11px] text-zinc-200 leading-snug">
            Get up to 15% OFF on selected accessories
          </p>

          <button
            type="button"
            onClick={handleExploreDeals}
            className="w-full py-2 px-3 rounded-xl bg-white hover:bg-zinc-100 text-[#121524] text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer text-center"
          >
            Explore Deals
          </button>
        </div>

        {/* Need Help Button */}
        <button
          type="button"
          onClick={handleNeedHelp}
          className="w-full py-2.5 px-3 rounded-xl bg-violet-950/60 hover:bg-violet-900/60 border border-violet-700/40 text-violet-300 hover:text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <Headphones className="w-4 h-4 text-violet-400" />
          <span>Need Help?</span>
        </button>
      </div>
    </aside>
  );
};
