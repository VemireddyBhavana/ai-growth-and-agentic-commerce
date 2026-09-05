'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAssistantStore } from '@/stores/use-assistant-store';
import { AssistantSidebar } from './assistant-sidebar';
import { AssistantChat } from './assistant-chat';
import { AssistantTopHeader } from './assistant-top-header';
import { TopRecommendationsColumn } from './top-recommendations-column';
import { AuditTrailColumn } from './audit-trail-column';
import { AssistantBottomBar } from './assistant-bottom-bar';
import { AssistantMobileNav } from './assistant-mobile-nav';
import { ProductDetailModal } from './product-detail-modal';
import { RazorpayCheckoutModal } from './razorpay-checkout-modal';
import { SavedProductsModal } from './saved-products-modal';
import { OrdersHistoryModal } from './orders-history-modal';
import { AssistantSettingsModal } from './assistant-settings-modal';
import { SmartCartDrawer } from './smart-cart-drawer';
import { Sparkles, ShoppingBag, X } from 'lucide-react';

export const AssistantLayout: React.FC = () => {
  const {
    isSidebarOpen,
    isRightPanelOpen,
    setRightPanelOpen,
    cart,
  } = useAssistantStore();

  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isMobileAuditOpen, setIsMobileAuditOpen] = useState(false);

  return (
    <div className="w-full h-screen overflow-hidden bg-zinc-100 dark:bg-[#0d101d] flex text-zinc-900 dark:text-zinc-100 font-sans relative selection:bg-[#635BFF] selection:text-white">
      {/* ========================================================================= */}
      {/* 1. Left Sidebar (Dark Navy, exactly matching reference image)             */}
      {/* ========================================================================= */}
      <div className="hidden lg:block h-full w-[260px] shrink-0 z-30 overflow-hidden">
        <AssistantSidebar />
      </div>

      {/* Mobile Sidebar Overlay Drawer */}
      <AnimatePresence>
        {isMobileSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileSidebarOpen(false)}
              className="fixed inset-0 z-40 bg-black/70 backdrop-blur-xs lg:hidden"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="fixed inset-y-0 left-0 z-50 w-72 h-full bg-[#121524] shadow-2xl lg:hidden"
            >
              <AssistantSidebar onCloseMobile={() => setIsMobileSidebarOpen(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* 2. Main Center & Columns Area                                             */}
      {/* ========================================================================= */}
      <div className="flex-1 h-full min-w-0 flex flex-col overflow-hidden bg-white dark:bg-[#0f1222]">
        {/* Top Header Bar */}
        <AssistantTopHeader onOpenCart={() => setRightPanelOpen(true)} />

        {/* 3-Column Workspace (Desktop View in reference screenshot) */}
        <main className="flex-1 min-h-0 flex overflow-hidden relative">
          {/* Column 1: Top Recommendations (Left, 250px) */}
          <div className="hidden 2xl:block w-[260px] h-full shrink-0">
            <TopRecommendationsColumn />
          </div>

          {/* Column 2: Center Chat Assistant */}
          <div className="flex-1 h-full min-w-0 flex flex-col overflow-hidden relative bg-white dark:bg-zinc-950/60">
            <AssistantChat
              onToggleSidebar={() => setIsMobileSidebarOpen(true)}
              onToggleRightPanel={() => setRightPanelOpen(!isRightPanelOpen)}
            />
          </div>

          {/* Column 3: Audit Trail & Payment Summary (Right, 280px) */}
          <div className="hidden xl:block w-[280px] h-full shrink-0">
            <AuditTrailColumn />
          </div>
        </main>

        {/* Desktop Bottom Status Indicators: Bounded, Explainable, Gated, Audit Trail */}
        <div className="hidden lg:block">
          <AssistantBottomBar />
        </div>

        {/* Mobile View: Bottom Navigation & Mini Audit Bar */}
        <AssistantMobileNav onOpenAudit={() => setIsMobileAuditOpen(true)} />
      </div>

      {/* ========================================================================= */}
      {/* 3. Mobile Audit Trail Drawer (from "View All" in screenshot)               */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {isMobileAuditOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileAuditOpen(false)}
              className="fixed inset-0 z-40 bg-black/70 backdrop-blur-xs xl:hidden"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="fixed inset-x-0 bottom-0 z-50 max-h-[85vh] h-[550px] bg-white dark:bg-zinc-950 rounded-t-2xl shadow-2xl flex flex-col xl:hidden border-t border-zinc-200 dark:border-zinc-800"
            >
              <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
                <span className="font-heading font-bold text-sm">Real-time Audit Trail</span>
                <button
                  type="button"
                  onClick={() => setIsMobileAuditOpen(false)}
                  className="p-1 rounded-lg text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto">
                <AuditTrailColumn />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* 4. Smart Cart Slide-out Drawer                                            */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {isRightPanelOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setRightPanelOpen(false)}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="fixed inset-y-0 right-0 z-50 w-80 sm:w-96 h-full bg-white dark:bg-zinc-950 shadow-2xl border-l border-zinc-200 dark:border-zinc-800 flex flex-col"
            >
              <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-violet-600 dark:text-violet-400" />
                  <span className="font-heading font-bold text-sm">Shopping Cart ({cart.reduce((s, i) => s + i.quantity, 0)})</span>
                </div>
                <button
                  type="button"
                  onClick={() => setRightPanelOpen(false)}
                  className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto">
                <SmartCartDrawer />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* 5. Global Modals & Dialogs                                               */}
      {/* ========================================================================= */}
      <ProductDetailModal />
      <RazorpayCheckoutModal />
      <SavedProductsModal />
      <OrdersHistoryModal />
      <AssistantSettingsModal />
    </div>
  );
};
