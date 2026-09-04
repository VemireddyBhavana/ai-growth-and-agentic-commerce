'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  Sparkles,
  Headphones,
  Watch,
  Lamp,
  BatteryCharging,
  Gamepad2,
  Package,
  TrendingUp,
  ArrowRight,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { useAssistantStore } from '@/stores/use-assistant-store';

const POPULAR_PROMPTS = [
  {
    title: 'Wireless earbuds under ₹3000',
    subtitle: 'Find ANC earbuds with deep bass & long battery',
    icon: Headphones,
    query: 'I need wireless earbuds under ₹3000 with active noise cancellation',
    color: 'from-violet-500/20 to-purple-500/10 text-violet-300 border-violet-500/30',
  },
  {
    title: 'Smartwatch for fitness & calling',
    subtitle: 'Compare AMOLED displays & health sensors',
    icon: Watch,
    query: 'Show me smartwatches with AMOLED display and fitness tracking',
    color: 'from-cyan-500/20 to-blue-500/10 text-cyan-300 border-cyan-500/30',
  },
  {
    title: 'Home office desk setup kit',
    subtitle: 'Save 15% on curated lamp + speaker + 4K webcam',
    icon: Lamp,
    query: 'What is the best home office setup bundle with discounts?',
    color: 'from-amber-500/20 to-orange-500/10 text-amber-300 border-amber-500/30',
  },
  {
    title: '65W Fast charging power bank',
    subtitle: 'Flight-safe 20,000mAh for laptops & phones',
    icon: BatteryCharging,
    query: 'I need a fast charging 65W power bank under ₹3000',
    color: 'from-emerald-500/20 to-teal-500/10 text-emerald-300 border-emerald-500/30',
  },
];

const CATEGORIES = [
  { name: 'Audio & ANC', icon: Headphones, query: 'Show me trending audio and headphones' },
  { name: 'Smart Wearables', icon: Watch, query: 'Show best seller smartwatches and fitness bands' },
  { name: 'Home & Workspace', icon: Lamp, query: 'Show desk lamps and office setup essentials' },
  { name: 'Power & Tech', icon: BatteryCharging, query: 'Show high capacity power banks and fast chargers' },
  { name: 'Gaming & Keyboards', icon: Gamepad2, query: 'Show mechanical keyboards and gaming accessories' },
  { name: 'Curated Bundles', icon: Package, query: 'Show all multi-item bundles with discount savings' },
];

export const ChatEmptyState: React.FC = () => {
  const { sendUserMessage } = useAssistantStore();

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 sm:py-12 flex flex-col items-center text-center space-y-8">
      {/* Hero Badge & Icon */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col items-center space-y-4"
      >
        <div className="relative">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-gradient-to-tr from-violet-600 via-indigo-600 to-cyan-500 p-0.5 shadow-2xl shadow-violet-500/30 flex items-center justify-center">
            <div className="w-full h-full bg-zinc-950 rounded-[22px] flex items-center justify-center">
              <Sparkles className="w-8 h-8 sm:w-10 sm:h-10 text-violet-400 animate-pulse" />
            </div>
          </div>
          <div className="absolute -bottom-1 -right-1 px-2 py-0.5 rounded-full bg-emerald-500 text-zinc-950 text-[10px] font-bold tracking-wider flex items-center gap-1 shadow-lg">
            <span className="w-1.5 h-1.5 rounded-full bg-zinc-950 animate-ping" />
            ONLINE
          </div>
        </div>

        <div className="space-y-2 max-w-xl">
          <h1 className="text-2xl sm:text-4xl font-extrabold font-heading tracking-tight text-white">
            How can I help you{' '}
            <span className="aurora-gradient-text">shop today?</span>
          </h1>
          <p className="text-sm sm:text-base text-zinc-400 leading-relaxed">
            Your autonomous AI commerce concierge. Ask about any product, compare specs, explore dynamic bundles, or prepare instant Razorpay checkout.
          </p>
        </div>
      </motion.div>

      {/* Popular Prompts Grid */}
      <div className="w-full space-y-3">
        <div className="flex items-center justify-center gap-2 text-xs font-mono text-zinc-400">
          <TrendingUp className="w-3.5 h-3.5 text-violet-400" />
          <span>Popular Shopping Inquiries</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
          {POPULAR_PROMPTS.map((prompt, idx) => {
            const Icon = prompt.icon;
            return (
              <motion.button
                key={prompt.title}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.08 }}
                onClick={() => sendUserMessage(prompt.query)}
                className={`p-4 rounded-2xl border bg-gradient-to-br ${prompt.color} backdrop-blur-md hover:scale-[1.02] active:scale-[0.99] transition-all flex items-start gap-3.5 group shadow-lg`}
              >
                <div className="p-2.5 rounded-xl bg-black/40 border border-white/10 text-white shrink-0 group-hover:scale-110 transition-transform">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="min-w-0 flex-1 space-y-1">
                  <div className="font-semibold text-sm text-zinc-100 group-hover:text-white flex items-center justify-between">
                    <span>{prompt.title}</span>
                    <ArrowRight className="w-4 h-4 text-zinc-400 group-hover:text-white group-hover:translate-x-1 transition-all" />
                  </div>
                  <div className="text-xs text-zinc-400 line-clamp-1">
                    {prompt.subtitle}
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Suggested Categories */}
      <div className="w-full space-y-3 pt-2">
        <span className="text-xs font-mono text-zinc-400">Explore by Category</span>
        <div className="flex flex-wrap items-center justify-center gap-2">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.name}
                type="button"
                onClick={() => sendUserMessage(cat.query)}
                className="px-3.5 py-2 rounded-xl text-xs font-medium bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-white/10 hover:border-violet-500/40 flex items-center gap-2 transition-all hover:scale-105 active:scale-95"
              >
                <Icon className="w-3.5 h-3.5 text-violet-400" />
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Feature Highlights Footer */}
      <div className="grid grid-cols-3 gap-3 w-full pt-4 border-t border-white/5 text-[11px] text-zinc-400 font-mono">
        <div className="flex items-center justify-center gap-1.5">
          <Zap className="w-3.5 h-3.5 text-amber-400" />
          <span>Sub-second Neural Search</span>
        </div>
        <div className="flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>100% Explainable Picks</span>
        </div>
        <div className="flex items-center justify-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>Razorpay Instant Checkout</span>
        </div>
      </div>
    </div>
  );
};
