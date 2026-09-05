'use client';

import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  ShoppingBag,
  PanelLeft,
  PanelRight,
  RotateCcw,
  Bot,
  Zap,
  SlidersHorizontal,
  ChevronDown,
} from 'lucide-react';
import { toast } from 'sonner';
import { useAssistantStore } from '@/stores/use-assistant-store';
import { ChatMessageItem } from './chat-message-item';
import { ChatInput } from './chat-input';
import { ChatEmptyState } from './chat-empty-state';

interface AssistantChatProps {
  onToggleSidebar?: () => void;
  onToggleRightPanel?: () => void;
}

export const AssistantChat: React.FC<AssistantChatProps> = ({
  onToggleSidebar,
  onToggleRightPanel,
}) => {
  const {
    sessions,
    activeSessionId,
    createNewSession,
    cart,
    setActiveRightPanelTab,
    isGenerating,
  } = useAssistantStore();

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const activeSession = sessions.find((s) => s.id === activeSessionId) || sessions[0];
  const messages = activeSession?.messages || [];
  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Auto-scroll to bottom on messages change
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isGenerating]);

  const handleResetChat = () => {
    createNewSession();
    toast.info('Started a new shopping session');
  };

  const handleOpenCart = () => {
    setActiveRightPanelTab('cart');
    if (onToggleRightPanel) onToggleRightPanel();
  };

  return (
    <div className="flex-1 h-full flex flex-col justify-between bg-zinc-950/60 relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-64 bg-violet-600/10 blur-[120px] pointer-events-none rounded-full" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-cyan-600/5 blur-[120px] pointer-events-none rounded-full" />

      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-20 px-4 sm:px-6 py-3.5 bg-zinc-950/80 backdrop-blur-xl border-b border-white/10 flex items-center justify-between shrink-0">
        {/* Left: Sidebar Toggle + Title */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onToggleSidebar}
            className="p-2 rounded-xl border border-white/10 hover:bg-white/5 text-zinc-300 hover:text-white transition-colors"
            title="Toggle Sidebar"
            aria-label="Toggle Sidebar"
          >
            <PanelLeft className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2.5">
            <div className="relative">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-600 p-0.5 flex items-center justify-center shadow-md shadow-violet-500/20">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white dark:border-zinc-950 animate-pulse" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-heading font-bold text-sm text-zinc-900 dark:text-white tracking-wide">
                  Ai Shopping Assistant
                </h2>
              </div>
              <p className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                <span>Online</span>
              </p>
            </div>
          </div>
        </div>

        {/* Right: Refresh & Settings Actions */}
        <div className="flex items-center gap-2">
          {/* Refresh Button */}
          <button
            type="button"
            onClick={handleResetChat}
            className="p-2 rounded-xl border border-zinc-200 dark:border-white/10 hover:bg-zinc-100 dark:hover:bg-white/5 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors cursor-pointer"
            title="Refresh Conversation"
            aria-label="Refresh"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Settings / Options Button */}
          <button
            type="button"
            onClick={() => useAssistantStore.getState().setSettingsModalOpen(true)}
            className="p-2 rounded-xl border border-zinc-200 dark:border-white/10 hover:bg-zinc-100 dark:hover:bg-white/5 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors cursor-pointer"
            title="Assistant Settings"
            aria-label="Settings"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Message Feed Area */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-8 py-6 space-y-6">
        {messages.length <= 1 ? (
          <ChatEmptyState />
        ) : (
          messages.map((msg) => <ChatMessageItem key={msg.id} message={msg} />)
        )}
        <div ref={messagesEndRef} className="h-2" />
      </div>

      {/* Fixed Bottom Input Area */}
      <div className="sticky bottom-0 z-20 px-4 sm:px-8 pb-4 pt-2 bg-gradient-to-t from-zinc-950 via-zinc-950/90 to-transparent">
        <div className="max-w-4xl mx-auto">
          <ChatInput />
        </div>
      </div>
    </div>
  );
};
