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
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-violet-600 to-indigo-600 p-0.5 flex items-center justify-center shadow-md">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-zinc-950 animate-pulse" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-heading font-bold text-sm text-white tracking-wide">
                  AI Commerce Concierge
                </h2>
                <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.2 rounded-full bg-violet-500/15 text-violet-300 border border-violet-500/25">
                  <Sparkles className="w-2.5 h-2.5 text-violet-400" />
                  GPT-4o Agentic
                </span>
              </div>
              <p className="text-[10px] text-zinc-400 hidden sm:block">
                Sub-second multi-attribute discovery & instant checkout
              </p>
            </div>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {/* New Chat Button */}
          <button
            type="button"
            onClick={handleResetChat}
            className="p-2 rounded-xl border border-white/10 hover:bg-white/5 text-zinc-400 hover:text-white transition-colors hidden sm:flex items-center gap-1.5 text-xs"
            title="New Chat"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>

          {/* Cart Trigger */}
          <button
            type="button"
            onClick={handleOpenCart}
            className="p-2 sm:px-3 sm:py-2 rounded-xl border border-white/10 bg-zinc-900/80 hover:bg-zinc-800 text-zinc-200 hover:text-white flex items-center gap-2 transition-all shadow-sm relative active:scale-95"
            aria-label="Open cart"
          >
            <ShoppingBag className="w-4 h-4 text-violet-400" />
            <span className="hidden sm:inline text-xs font-semibold">Cart</span>
            {totalCartCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold font-mono bg-emerald-500 text-zinc-950 shadow-md">
                {totalCartCount}
              </span>
            )}
          </button>

          {/* Right Panel Toggle */}
          <button
            type="button"
            onClick={onToggleRightPanel}
            className="p-2 rounded-xl border border-white/10 hover:bg-white/5 text-zinc-300 hover:text-white transition-colors"
            title="Toggle AI Insights"
            aria-label="Toggle AI Insights"
          >
            <PanelRight className="w-4 h-4" />
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
