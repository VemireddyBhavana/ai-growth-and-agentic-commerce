'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Plus,
  MessageSquare,
  History,
  Heart,
  Package,
  Settings,
  Trash2,
  Sparkles,
  Search,
  LayoutDashboard,
  X,
  ExternalLink,
  Zap,
} from 'lucide-react';
import type { ChatSession } from '@ai-sales-assistant/types';
import { useAssistantStore } from '@/stores/use-assistant-store';

interface AssistantSidebarProps {
  onCloseMobile?: () => void;
}

export const AssistantSidebar: React.FC<AssistantSidebarProps> = ({ onCloseMobile }) => {
  const {
    sessions,
    activeSessionId,
    selectSession,
    createNewSession,
    deleteSession,
    recentSearches,
    clearRecentSearches,
    sendUserMessage,
    savedProducts,
    orders,
    setSavedModalOpen,
    setOrdersModalOpen,
    setSettingsModalOpen,
  } = useAssistantStore();

  // Group sessions by date
  const now = new Date();
  const todaySessions: ChatSession[] = [];
  const yesterdaySessions: ChatSession[] = [];
  const olderSessions: ChatSession[] = [];

  for (const session of sessions) {
    const sessionDate = new Date(session.createdAt);
    const diffDays = Math.floor((now.getTime() - sessionDate.getTime()) / (1000 * 3600 * 24));
    if (diffDays === 0) {
      todaySessions.push(session);
    } else if (diffDays === 1) {
      yesterdaySessions.push(session);
    } else {
      olderSessions.push(session);
    }
  }

  const handleSelectSession = (id: string) => {
    selectSession(id);
    if (onCloseMobile) onCloseMobile();
  };

  const handleNewChat = () => {
    createNewSession();
    if (onCloseMobile) onCloseMobile();
  };

  const handleRecentSearchClick = (query: string) => {
    sendUserMessage(query);
    if (onCloseMobile) onCloseMobile();
  };

  return (
    <aside className="w-full h-full flex flex-col justify-between bg-zinc-950/95 border-r border-white/10 text-zinc-200 select-none overflow-hidden">
      {/* Top Header & New Chat */}
      <div className="p-4 space-y-4 border-b border-white/10 shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-violet-600 via-indigo-600 to-cyan-500 p-0.5 shadow-md shadow-violet-500/30 flex items-center justify-center">
              <div className="w-full h-full bg-zinc-950 rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-violet-400" />
              </div>
            </div>
            <div>
              <span className="font-heading font-bold text-sm text-white tracking-wide flex items-center gap-1.5">
                AI Shopping
                <span className="text-[10px] font-mono px-1.5 py-0.2 bg-violet-500/20 text-violet-300 rounded border border-violet-500/30">
                  v2.4
                </span>
              </span>
              <p className="text-[10px] text-zinc-400">Autonomous Commerce</p>
            </div>
          </div>

          {onCloseMobile && (
            <button
              type="button"
              onClick={onCloseMobile}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 lg:hidden"
              aria-label="Close sidebar"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* New Chat Button */}
        <button
          type="button"
          onClick={handleNewChat}
          className="w-full py-2.5 px-3 rounded-xl font-medium text-xs bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-md shadow-violet-600/25 flex items-center justify-center gap-2 transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>New Chat</span>
        </button>
      </div>

      {/* Scrollable Middle Content: History & Searches */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6 text-xs">
        {/* Conversation History */}
        <div className="space-y-4">
          <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400 px-2">
            <span className="flex items-center gap-1.5">
              <History className="w-3.5 h-3.5" />
              Conversation History
            </span>
            <span className="text-zinc-400">({sessions.length})</span>
          </div>

          {/* Today Group */}
          {todaySessions.length > 0 && (
            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase text-zinc-400 px-2 font-semibold tracking-wider">
                Today
              </span>
              {todaySessions.map((session) => (
                <SessionItem
                  key={session.id}
                  session={session}
                  isActive={session.id === activeSessionId}
                  onSelect={() => handleSelectSession(session.id)}
                  onDelete={(e) => {
                    e.stopPropagation();
                    deleteSession(session.id);
                  }}
                />
              ))}
            </div>
          )}

          {/* Yesterday Group */}
          {yesterdaySessions.length > 0 && (
            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase text-zinc-400 px-2 font-semibold tracking-wider">
                Yesterday
              </span>
              {yesterdaySessions.map((session) => (
                <SessionItem
                  key={session.id}
                  session={session}
                  isActive={session.id === activeSessionId}
                  onSelect={() => handleSelectSession(session.id)}
                  onDelete={(e) => {
                    e.stopPropagation();
                    deleteSession(session.id);
                  }}
                />
              ))}
            </div>
          )}

          {/* Older Group */}
          {olderSessions.length > 0 && (
            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase text-zinc-400 px-2 font-semibold tracking-wider">
                Previous 7 Days
              </span>
              {olderSessions.map((session) => (
                <SessionItem
                  key={session.id}
                  session={session}
                  isActive={session.id === activeSessionId}
                  onSelect={() => handleSelectSession(session.id)}
                  onDelete={(e) => {
                    e.stopPropagation();
                    deleteSession(session.id);
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Recent Searches */}
        {recentSearches.length > 0 && (
          <div className="space-y-2 pt-2 border-t border-white/5">
            <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400 px-2">
              <span className="flex items-center gap-1.5">
                <Search className="w-3 h-3 text-cyan-400" />
                Recent Searches
              </span>
              <button
                type="button"
                onClick={clearRecentSearches}
                className="text-[10px] text-zinc-400 hover:text-zinc-300"
              >
                Clear
              </button>
            </div>

            <div className="flex flex-wrap gap-1.5 px-1">
              {recentSearches.slice(0, 6).map((search, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleRecentSearchClick(search)}
                  className="px-2.5 py-1 rounded-lg text-[11px] bg-white/[0.04] hover:bg-white/[0.08] text-zinc-300 hover:text-white border border-white/5 transition-all text-left truncate max-w-full"
                  title={search}
                >
                  {search}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Nav: Wishlist, Orders, Settings, Dashboard Switch */}
      <div className="p-3 border-t border-white/10 space-y-1.5 shrink-0 bg-black/40 text-xs">
        {/* Saved Products */}
        <button
          type="button"
          onClick={() => {
            setSavedModalOpen(true);
            if (onCloseMobile) onCloseMobile();
          }}
          className="w-full px-3 py-2 rounded-xl hover:bg-white/[0.06] text-zinc-300 hover:text-white flex items-center justify-between transition-colors group"
        >
          <div className="flex items-center gap-2.5">
            <Heart className="w-4 h-4 text-rose-400 group-hover:scale-110 transition-transform" />
            <span>Saved Products</span>
          </div>
          <span className="text-[11px] font-mono px-1.5 py-0.5 rounded-full bg-rose-500/10 text-rose-300 border border-rose-500/20">
            {savedProducts.length}
          </span>
        </button>

        {/* Orders Tracker */}
        <button
          type="button"
          onClick={() => {
            setOrdersModalOpen(true);
            if (onCloseMobile) onCloseMobile();
          }}
          className="w-full px-3 py-2 rounded-xl hover:bg-white/[0.06] text-zinc-300 hover:text-white flex items-center justify-between transition-colors group"
        >
          <div className="flex items-center gap-2.5">
            <Package className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
            <span>My Orders</span>
          </div>
          <span className="text-[11px] font-mono px-1.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
            {orders.length}
          </span>
        </button>

        {/* Settings */}
        <button
          type="button"
          onClick={() => {
            setSettingsModalOpen(true);
            if (onCloseMobile) onCloseMobile();
          }}
          className="w-full px-3 py-2 rounded-xl hover:bg-white/[0.06] text-zinc-300 hover:text-white flex items-center gap-2.5 transition-colors group"
        >
          <Settings className="w-4 h-4 text-zinc-400 group-hover:text-zinc-200 group-hover:rotate-45 transition-transform" />
          <span>Assistant Settings</span>
        </button>

        {/* Link back to Merchant Dashboard */}
        <Link
          href="/dashboard"
          className="w-full px-3 py-2 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] text-zinc-400 hover:text-zinc-200 border border-white/5 flex items-center justify-between transition-colors mt-2"
        >
          <span className="flex items-center gap-2 text-[11px] font-mono">
            <LayoutDashboard className="w-3.5 h-3.5 text-violet-400" />
            Merchant Dashboard
          </span>
          <ExternalLink className="w-3 h-3 text-zinc-400" />
        </Link>
      </div>
    </aside>
  );
};

interface SessionItemProps {
  session: ChatSession;
  isActive: boolean;
  onSelect: () => void;
  onDelete: (e: React.MouseEvent) => void;
}

const SessionItem: React.FC<SessionItemProps> = ({ session, isActive, onSelect, onDelete }) => {
  return (
    <div
      onClick={onSelect}
      className={`group w-full px-2.5 py-2 rounded-xl flex items-center justify-between text-left cursor-pointer transition-all ${
        isActive
          ? 'bg-violet-600/15 border border-violet-500/40 text-white font-medium shadow-sm'
          : 'hover:bg-white/[0.05] text-zinc-300 hover:text-white border border-transparent'
      }`}
    >
      <div className="flex items-center gap-2 min-w-0 flex-1">
        <MessageSquare className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-violet-400' : 'text-zinc-400'}`} />
        <span className="truncate text-xs">{session.title}</span>
      </div>

      <button
        type="button"
        onClick={onDelete}
        className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-white/10 text-zinc-400 hover:text-rose-400 transition-opacity ml-1"
        title="Delete chat"
        aria-label="Delete chat"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
