'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAssistantStore } from '@/stores/use-assistant-store';
import { AssistantSidebar } from './assistant-sidebar';
import { AssistantChat } from './assistant-chat';
import { AssistantRightPanel } from './assistant-right-panel';
import { ProductDetailModal } from './product-detail-modal';
import { RazorpayCheckoutModal } from './razorpay-checkout-modal';
import { SavedProductsModal } from './saved-products-modal';
import { OrdersHistoryModal } from './orders-history-modal';
import { AssistantSettingsModal } from './assistant-settings-modal';

export const AssistantLayout: React.FC = () => {
  const {
    isSidebarOpen,
    toggleSidebar,
    setSidebarOpen,
    isRightPanelOpen,
    toggleRightPanel,
    setRightPanelOpen,
  } = useAssistantStore();

  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isMobileRightPanelOpen, setIsMobileRightPanelOpen] = useState(false);

  return (
    <div className="w-full h-screen overflow-hidden bg-background flex text-foreground font-sans relative selection:bg-violet-600 selection:text-white">
      {/* ========================================================================= */}
      {/* 1. Left Sidebar (Desktop & Tablet)                                       */}
      {/* ========================================================================= */}
      <AnimatePresence initial={false}>
        {isSidebarOpen && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 280, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="hidden lg:block h-full shrink-0 z-30 overflow-hidden"
          >
            <div className="w-[280px] h-full">
              <AssistantSidebar />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile / Tablet Left Sidebar Drawer Overlay */}
      <AnimatePresence>
        {isMobileSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileSidebarOpen(false)}
              className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm lg:hidden"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 z-50 w-72 h-full bg-zinc-950 shadow-2xl lg:hidden"
            >
              <AssistantSidebar onCloseMobile={() => setIsMobileSidebarOpen(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* 2. Center Chat Window                                                    */}
      {/* ========================================================================= */}
      <main className="flex-1 h-full min-w-0 flex flex-col overflow-hidden relative">
        <AssistantChat
          onToggleSidebar={() => {
            if (window.innerWidth < 1024) {
              setIsMobileSidebarOpen(true);
            } else {
              toggleSidebar();
            }
          }}
          onToggleRightPanel={() => {
            if (window.innerWidth < 1280) {
              setIsMobileRightPanelOpen(true);
            } else {
              toggleRightPanel();
            }
          }}
        />
      </main>

      {/* ========================================================================= */}
      {/* 3. Right Panel (Desktop)                                                 */}
      {/* ========================================================================= */}
      <AnimatePresence initial={false}>
        {isRightPanelOpen && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 340, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="hidden xl:block h-full shrink-0 z-30 overflow-hidden"
          >
            <div className="w-[340px] h-full">
              <AssistantRightPanel />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile / Tablet Right Panel Drawer Overlay */}
      <AnimatePresence>
        {isMobileRightPanelOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileRightPanelOpen(false)}
              className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm xl:hidden"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 right-0 z-50 w-80 sm:w-96 h-full bg-zinc-950 shadow-2xl xl:hidden"
            >
              <AssistantRightPanel onCloseMobile={() => setIsMobileRightPanelOpen(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* 4. Global Modals & Dialogs                                               */}
      {/* ========================================================================= */}
      <ProductDetailModal />
      <RazorpayCheckoutModal />
      <SavedProductsModal />
      <OrdersHistoryModal />
      <AssistantSettingsModal />
    </div>
  );
};
