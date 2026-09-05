'use client';

import React from 'react';
import { MessageSquare, Package, Receipt, Rocket, MoreHorizontal, Check, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { useAssistantStore } from '@/stores/use-assistant-store';

interface AssistantMobileNavProps {
  onOpenAudit?: () => void;
}

export const AssistantMobileNav: React.FC<AssistantMobileNavProps> = ({ onOpenAudit }) => {
  const { setOrdersModalOpen, setSettingsModalOpen } = useAssistantStore();

  return (
    <div className="w-full flex flex-col bg-white dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-800 lg:hidden shrink-0 z-30 select-none">
      {/* Mini Audit Trail Floating Card (from Mobile View in screenshot) */}
      <div className="px-4 py-2 bg-zinc-50 dark:bg-zinc-900/90 border-b border-zinc-200 dark:border-zinc-800/80 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2 overflow-hidden">
          <div className="w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
            <Check className="w-2.5 h-2.5 stroke-[3]" />
          </div>
          <span className="font-mono text-[11px] text-zinc-500 dark:text-zinc-400">10:33 AM</span>
          <span className="font-semibold text-emerald-600 dark:text-emerald-400 truncate">
            Payment Successful
          </span>
          <span className="text-zinc-600 dark:text-zinc-400 text-[11px] truncate hidden sm:inline">
            ₹71,298 via UPI (Test Mode)
          </span>
        </div>

        <button
          type="button"
          onClick={onOpenAudit}
          className="text-xs font-semibold text-violet-600 dark:text-violet-400 hover:underline shrink-0 ml-2 cursor-pointer"
        >
          View All
        </button>
      </div>

      {/* Bottom Navigation Tabs */}
      <nav className="flex items-center justify-around py-2 px-2 bg-white dark:bg-zinc-950">
        <button
          type="button"
          className="flex flex-col items-center gap-1 text-violet-600 dark:text-violet-400 cursor-pointer"
        >
          <MessageSquare className="w-5 h-5 fill-violet-100 dark:fill-violet-950" />
          <span className="text-[11px] font-semibold">Chat</span>
        </button>

        <button
          type="button"
          onClick={() => useAssistantStore.getState().openProductModal(useAssistantStore.getState().savedProducts[0])}
          className="flex flex-col items-center gap-1 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 cursor-pointer"
        >
          <Package className="w-5 h-5" />
          <span className="text-[11px] font-medium">Products</span>
        </button>

        <button
          type="button"
          onClick={() => setOrdersModalOpen(true)}
          className="flex flex-col items-center gap-1 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 cursor-pointer"
        >
          <Receipt className="w-5 h-5" />
          <span className="text-[11px] font-medium">Orders</span>
        </button>

        <Link
          href="/analytics"
          className="flex flex-col items-center gap-1 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 cursor-pointer"
        >
          <Rocket className="w-5 h-5" />
          <span className="text-[11px] font-medium">Campaigns</span>
        </Link>

        <button
          type="button"
          onClick={() => setSettingsModalOpen(true)}
          className="flex flex-col items-center gap-1 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 cursor-pointer"
        >
          <MoreHorizontal className="w-5 h-5" />
          <span className="text-[11px] font-medium">More</span>
        </button>
      </nav>
    </div>
  );
};
