'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  Sparkles,
  Target,
  DollarSign,
  Layers,
  Package,
  CheckCircle2,
  TrendingUp,
  Tag,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { toast } from 'sonner';
import { useAssistantStore } from '@/stores/use-assistant-store';
import { PRECONFIGURED_BUNDLES } from '@/lib/assistant/catalog-data';

export const AiInsightsPanel: React.FC = () => {
  const { currentInsights, addBundleToCart, openCheckoutModal } = useAssistantStore();

  const bundle = currentInsights?.recommendedBundle || PRECONFIGURED_BUNDLES[0];
  const intent = currentInsights?.intent || 'Conversational Product Search';
  const category = currentInsights?.detectedCategory || 'Audio & Wearables';
  const brand = currentInsights?.preferredBrand || 'Nexus & Bolt';
  const budget = currentInsights?.budget;
  const savings = currentInsights?.estimatedSavings || bundle.savings;
  const confidenceScore = currentInsights?.confidenceScore || 94;

  const handleAddBundle = () => {
    addBundleToCart(bundle);
    toast.success(`Added ${bundle.name} to cart!`, {
      description: `Saved ₹${bundle.savings.toLocaleString('en-IN')} with instant bundle discount`,
    });
  };

  return (
    <div className="p-4 space-y-4 text-xs">
      {/* Header Info */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 font-mono text-zinc-300">
          <Sparkles className="w-4 h-4 text-violet-400" />
          <span className="font-semibold text-white">Live AI Insights</span>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          {confidenceScore}% Match
        </span>
      </div>

      {/* Detected Intent & Budget Card */}
      <div className="p-3.5 rounded-2xl border border-white/10 bg-zinc-900/80 backdrop-blur-xl space-y-3 shadow-lg">
        {/* Intent */}
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-zinc-400 font-mono text-[11px]">
            <Target className="w-3.5 h-3.5 text-cyan-400" />
            <span>Detected Customer Intent</span>
          </div>
          <div className="font-heading font-semibold text-sm text-zinc-100">
            {intent}
          </div>
        </div>

        {/* Budget Tracker */}
        <div className="pt-2 border-t border-white/5 space-y-1.5">
          <div className="flex items-center justify-between text-zinc-400 text-[11px] font-mono">
            <span className="flex items-center gap-1">
              <DollarSign className="w-3 h-3 text-emerald-400" />
              Budget Tracking
            </span>
            <span className="text-zinc-200 font-medium">
              {budget?.max ? `Max ₹${budget.max.toLocaleString('en-IN')}` : 'Flexible Budget'}
            </span>
          </div>

          <div className="p-2 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between">
            <span className="text-zinc-400">Current AI Match:</span>
            <span className="font-bold text-emerald-400 font-mono">
              {budget?.currentMatch ? `₹${budget.currentMatch.toLocaleString('en-IN')}` : 'Optimized Value'}
            </span>
          </div>
        </div>

        {/* Category & Preferred Brand */}
        <div className="grid grid-cols-2 gap-2 pt-1 text-[11px]">
          <div className="p-2 rounded-xl bg-black/30 border border-white/5 space-y-0.5">
            <span className="text-zinc-400 block font-mono">Category</span>
            <span className="text-zinc-200 font-semibold truncate block">{category}</span>
          </div>
          <div className="p-2 rounded-xl bg-black/30 border border-white/5 space-y-0.5">
            <span className="text-zinc-400 block font-mono">Preferred Brand</span>
            <span className="text-zinc-200 font-semibold truncate block">{brand}</span>
          </div>
        </div>
      </div>

      {/* Recommended Dynamic Bundle */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-4 rounded-2xl border border-violet-500/40 bg-gradient-to-b from-violet-950/40 via-zinc-900/90 to-zinc-950/90 shadow-xl backdrop-blur-xl space-y-3.5"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-violet-500/20 text-violet-300 border border-violet-500/30">
              <Package className="w-4 h-4" />
            </div>
            <div>
              <span className="font-heading font-bold text-sm text-zinc-100 block">
                Recommended Bundle
              </span>
              <span className="text-[10px] font-mono text-emerald-400 font-semibold">
                {bundle.tag}
              </span>
            </div>
          </div>
        </div>

        <h4 className="font-semibold text-xs text-zinc-200">{bundle.name}</h4>
        <p className="text-[11px] text-zinc-400 leading-relaxed">{bundle.description}</p>

        {/* Bundle Items List */}
        <div className="space-y-1.5 pt-1">
          {bundle.products.map((p) => (
            <div
              key={p.id}
              className="flex items-center justify-between p-2 rounded-xl bg-black/40 border border-white/5 text-[11px]"
            >
              <div className="flex items-center gap-2 min-w-0">
                <img
                  src={p.images[0]}
                  alt={p.name}
                  className="w-7 h-7 rounded-lg object-cover border border-white/10 shrink-0"
                />
                <span className="truncate text-zinc-200 font-medium">{p.name}</span>
              </div>
              <span className="text-zinc-400 font-mono shrink-0 ml-2">
                ₹{p.price.toLocaleString('en-IN')}
              </span>
            </div>
          ))}
        </div>

        {/* Pricing Summary */}
        <div className="p-2.5 rounded-xl bg-zinc-950/80 border border-white/10 flex items-center justify-between font-mono">
          <div>
            <span className="text-[10px] text-zinc-400 block line-through">
              ₹{bundle.originalTotal.toLocaleString('en-IN')}
            </span>
            <span className="text-base font-bold text-white">
              ₹{bundle.bundlePrice.toLocaleString('en-IN')}
            </span>
          </div>
          <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
            Save ₹{bundle.savings.toLocaleString('en-IN')}
          </span>
        </div>

        {/* Add Bundle Button */}
        <button
          type="button"
          onClick={handleAddBundle}
          className="w-full py-2.5 px-3 rounded-xl font-semibold text-xs bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-md shadow-violet-500/20 flex items-center justify-center gap-1.5 transition-all active:scale-95"
        >
          <Package className="w-3.5 h-3.5" />
          Add Bundle to Cart (Save ₹{bundle.savings.toLocaleString('en-IN')})
        </button>
      </motion.div>

      {/* Estimated Savings Counter */}
      <div className="p-3.5 rounded-2xl border border-emerald-500/20 bg-emerald-950/20 backdrop-blur-md flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] font-mono text-zinc-400 block">Total Estimated Savings</span>
            <span className="text-sm font-bold font-heading text-emerald-300">
              ₹{savings.toLocaleString('en-IN')} Available
            </span>
          </div>
        </div>
        <span className="text-[10px] font-mono text-emerald-400/80">Active Promo</span>
      </div>
    </div>
  );
};
