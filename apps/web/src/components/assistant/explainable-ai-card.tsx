'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  TrendingUp,
  Percent,
  Layers,
  ChevronDown,
  ChevronUp,
  Info,
  DollarSign,
  Box,
} from 'lucide-react';
import type { RecommendationExplainability } from '@ai-sales-assistant/types';

interface ExplainableAiCardProps {
  explainability: RecommendationExplainability;
  initiallyExpanded?: boolean;
}

export const ExplainableAiCard: React.FC<ExplainableAiCardProps> = ({
  explainability,
  initiallyExpanded = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(initiallyExpanded);

  // Determine tone color based on confidence score
  const getConfidenceColor = (score: number) => {
    if (score >= 90) return 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10';
    if (score >= 80) return 'text-brand-400 border-brand-500/30 bg-brand-500/10';
    return 'text-amber-400 border-amber-500/30 bg-amber-500/10';
  };

  const getProgressGradient = (score: number) => {
    if (score >= 90) return 'from-emerald-500 to-teal-400';
    if (score >= 80) return 'from-indigo-500 to-violet-400';
    return 'from-amber-500 to-orange-400';
  };

  return (
    <div className="rounded-xl border border-white/10 bg-black/40 backdrop-blur-md overflow-hidden transition-all duration-300">
      {/* Header / Summary Toggle */}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-3.5 py-2.5 flex items-center justify-between text-left hover:bg-white/[0.03] transition-colors group"
        aria-expanded={isExpanded}
        aria-label="Toggle Explainable AI reasoning breakdown"
      >
        <div className="flex items-center gap-2 min-w-0">
          <div className="p-1 rounded-md bg-violet-500/15 text-violet-400 border border-violet-500/20 group-hover:scale-105 transition-transform">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <div className="min-w-0">
            <span className="text-xs font-semibold text-zinc-200 flex items-center gap-1.5">
              Explainable AI Match
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-violet-500/20 text-violet-300 border border-violet-500/30">
                {explainability.confidenceScore}% Confidence
              </span>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-zinc-400 group-hover:text-zinc-200">
          <span className="text-[11px] text-zinc-400 hidden sm:inline">
            {isExpanded ? 'Hide breakdown' : 'Why this pick?'}
          </span>
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      {/* Collapsible Details */}
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="border-t border-white/10 px-3.5 py-3 space-y-3 bg-zinc-950/60"
          >
            {/* Natural Language Reason */}
            <div className="text-xs text-zinc-300 leading-relaxed bg-white/[0.03] p-2.5 rounded-lg border border-white/5">
              <span className="font-medium text-violet-300">💡 AI Reasoning: </span>
              {explainability.reason}
            </div>

            {/* Confidence Score Bar */}
            <div>
              <div className="flex justify-between text-[11px] mb-1 font-mono">
                <span className="text-zinc-400">Match Confidence</span>
                <span className="text-zinc-200 font-semibold">{explainability.confidenceScore}%</span>
              </div>
              <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${explainability.confidenceScore ?? 85}%` }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                  className={`h-full bg-gradient-to-r ${getProgressGradient(explainability.confidenceScore ?? 85)} rounded-full`}
                />
              </div>
            </div>

            {/* Key AI Match Metrics Grid */}
            <div className="grid grid-cols-2 gap-2 pt-1 text-[11px]">
              {/* Intent */}
              <div className="p-2 rounded-lg bg-zinc-900/80 border border-white/5 space-y-0.5">
                <div className="text-zinc-400 flex items-center gap-1">
                  <Info className="w-3 h-3 text-cyan-400" />
                  <span>Customer Intent</span>
                </div>
                <div className="text-zinc-200 font-medium truncate" title={explainability.customerIntent}>
                  {explainability.customerIntent}
                </div>
              </div>

              {/* Price Match */}
              <div className="p-2 rounded-lg bg-zinc-900/80 border border-white/5 space-y-0.5">
                <div className="text-zinc-400 flex items-center gap-1">
                  <DollarSign className="w-3 h-3 text-emerald-400" />
                  <span>Price Match</span>
                </div>
                <div className="text-zinc-200 font-medium truncate" title={explainability.priceMatch}>
                  {explainability.priceMatch}
                </div>
              </div>

              {/* Inventory */}
              <div className="p-2 rounded-lg bg-zinc-900/80 border border-white/5 space-y-0.5">
                <div className="text-zinc-400 flex items-center gap-1">
                  <Box className="w-3 h-3 text-amber-400" />
                  <span>Inventory Stock</span>
                </div>
                <div className="text-zinc-200 font-medium truncate" title={explainability.inventoryAvailability}>
                  {explainability.inventoryAvailability}
                </div>
              </div>

              {/* Popularity */}
              <div className="p-2 rounded-lg bg-zinc-900/80 border border-white/5 space-y-0.5">
                <div className="text-zinc-400 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3 text-pink-400" />
                  <span>Popularity Score</span>
                </div>
                <div className="text-zinc-200 font-medium">
                  {explainability.popularityScore}/100 Index
                </div>
              </div>
            </div>

            {/* Value & Margin Transparency */}
            <div className="flex items-center justify-between text-[10px] text-zinc-400 pt-1 border-t border-white/5 font-mono">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                Verified Merchant Authenticity
              </span>
              <span className="text-zinc-300 font-medium">{explainability.expectedMargin}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
