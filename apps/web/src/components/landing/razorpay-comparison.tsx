'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { XCircle, CheckCircle2, Zap, ArrowRight } from 'lucide-react';

export interface ComparisonSide {
  title: string;
  items: string[];
}

export interface RazorpayComparisonData {
  without: ComparisonSide;
  with: ComparisonSide;
}

export const RAZORPAY_COMPARISON: RazorpayComparisonData = {
  without: {
    title: 'Without Razorpay',
    items: [
      'Manual Checkout',
      'Complex Payment Flow',
      'Low Trust',
      'Fragmented APIs',
      'High Drop-Off',
    ],
  },
  with: {
    title: 'With Razorpay + AI Sales Assistant',
    items: [
      '1-click Checkout',
      'AI Conversation',
      'Secure Payments',
      'Explainable Decisions',
      'Audit Trail',
      'Higher Conversion',
    ],
  },
};

export interface RazorpayComparisonProps {
  data?: RazorpayComparisonData;
  className?: string;
}

export function RazorpayComparison({
  data = RAZORPAY_COMPARISON,
  className = '',
}: RazorpayComparisonProps) {
  return (
    <div
      className={`relative w-full rounded-3xl border border-border/70 dark:border-white/10 bg-card/60 dark:bg-obsidian-900/60 backdrop-blur-2xl shadow-[0_22px_60px_-32px_rgba(15,23,42,0.7)] overflow-hidden ${className}`}
      role="region"
      aria-label="Without Razorpay vs With Razorpay and AI Sales Assistant comparison"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-r from-rose-500/[0.03] via-transparent to-emerald-500/[0.04] dark:from-rose-500/[0.04] dark:to-emerald-500/[0.05]"
      />

      <div className="relative grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] items-stretch">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="p-6 sm:p-8 relative flex flex-col gap-5"
        >
          <header className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-xl bg-rose-500/12 dark:bg-rose-500/18 border border-rose-500/30 flex items-center justify-center text-rose-500">
              <XCircle className="w-5 h-5" strokeWidth={2.4} />
            </div>
            <div>
              <div className="text-[10px] font-mono font-bold uppercase tracking-[0.18em] text-rose-500/80 mb-1">
                Status Quo
              </div>
              <h3 className="font-heading font-bold text-lg sm:text-xl text-foreground leading-tight">
                {data.without.title}
              </h3>
            </div>
          </header>

          <ul className="flex flex-col gap-3" role="list">
            {data.without.items.map((item, idx) => (
              <motion.li
                key={item}
                role="listitem"
                initial={{ opacity: 0, x: -8 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.06 }}
                whileHover={{ x: 2 }}
                className="group flex items-center gap-3 p-3.5 rounded-xl border border-border/60 dark:border-white/5 bg-rose-500/[0.04] dark:bg-rose-500/[0.05] hover:border-rose-500/30 hover:bg-rose-500/[0.07] transition-all duration-300"
              >
                <div className="shrink-0 w-7 h-7 rounded-lg bg-rose-500/12 dark:bg-rose-500/20 flex items-center justify-center text-rose-500 group-hover:scale-110 transition-transform">
                  <XCircle className="w-3.5 h-3.5" strokeWidth={2.8} />
                </div>
                <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground/90 transition-colors">
                  {item}
                </span>
              </motion.li>
            ))}
          </ul>
        </motion.div>

        <div className="relative flex md:flex-col items-center justify-center py-4 md:py-0 border-y md:border-y-0 md:border-x border-border/50">
          <div className="absolute inset-0 md:w-px md:h-full bg-gradient-to-b from-transparent via-border/70 to-transparent hidden md:block" aria-hidden="true" />

          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.6, delay: 0.15, type: 'spring', stiffness: 220, damping: 20 }}
            className="relative z-10"
          >
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#1366ef]/40 via-brand-500/40 to-ai-violet/40 blur-xl opacity-70 animate-pulse" />
            <div className="relative flex flex-col items-center justify-center gap-2 w-16 h-16 md:w-[72px] md:h-[72px] rounded-2xl border border-[#1366ef]/40 dark:border-[#60a5fa]/40 bg-gradient-to-br from-[#1366ef]/15 via-brand-500/15 to-ai-violet/15 backdrop-blur-xl shadow-lg">
              <span className="text-[9px] font-mono font-black uppercase tracking-[0.2em] text-foreground/80 leading-none">
                VS
              </span>
              <motion.div
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
                className="text-[#0f54c8] dark:text-[#60a5fa]"
              >
                <ArrowRight className="w-4.5 h-4.5" strokeWidth={2.6} />
              </motion.div>
              <div className="absolute -top-2.5 -right-2.5 w-6 h-6 rounded-full bg-gradient-to-br from-[#1366ef] to-brand-500 flex items-center justify-center shadow-lg shadow-[#1366ef]/40">
                <Zap className="w-3.5 h-3.5 text-white" strokeWidth={2.8} fill="currentColor" />
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.55, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
          className="p-6 sm:p-8 relative flex flex-col gap-5 bg-emerald-500/[0.035] dark:bg-emerald-500/[0.045]"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute top-0 right-0 w-48 h-48 rounded-full bg-emerald-500/10 dark:bg-emerald-500/15 blur-3xl"
          />
          <header className="flex items-center gap-3 relative">
            <div className="relative w-10 h-10 rounded-xl bg-emerald-500/12 dark:bg-emerald-500/18 border border-emerald-500/30 flex items-center justify-center text-emerald-500 shadow-[0_0_20px_-4px_rgba(16,185,129,0.45)]">
              <CheckCircle2 className="w-5 h-5" strokeWidth={2.4} />
            </div>
            <div>
              <div className="text-[10px] font-mono font-bold uppercase tracking-[0.18em] text-emerald-500/90 mb-1 flex items-center gap-1.5">
                Recommended
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <h3 className="font-heading font-bold text-lg sm:text-xl text-foreground leading-tight">
                {data.with.title}
              </h3>
            </div>
          </header>

          <ul className="flex flex-col gap-3 relative" role="list">
            {data.with.items.map((item, idx) => (
              <motion.li
                key={item}
                role="listitem"
                initial={{ opacity: 0, x: 8 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.06 }}
                whileHover={{ x: -2 }}
                className="group flex items-center gap-3 p-3.5 rounded-xl border border-emerald-500/20 dark:border-emerald-500/25 bg-emerald-500/[0.06] dark:bg-emerald-500/[0.08] hover:border-emerald-500/45 hover:bg-emerald-500/[0.1] hover:shadow-emerald-500/10 transition-all duration-300"
              >
                <div className="shrink-0 w-7 h-7 rounded-lg bg-emerald-500/15 dark:bg-emerald-500/25 flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform shadow-[0_0_15px_-3px_rgba(16,185,129,0.5)]">
                  <CheckCircle2 className="w-3.5 h-3.5" strokeWidth={2.8} />
                </div>
                <span className="text-sm font-semibold text-foreground/95">
                  {item}
                </span>
              </motion.li>
            ))}
          </ul>
        </motion.div>
      </div>
    </div>
  );
}
