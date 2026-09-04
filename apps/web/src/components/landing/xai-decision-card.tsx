'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import {
  MessageSquareText,
  BrainCircuit,
  Search,
  TrendingUp,
  PackageCheck,
  Sparkles,
  ShieldCheck,
  CreditCard,
  ArrowDown,
  type LucideIcon,
} from 'lucide-react';

export interface DecisionStep {
  id: string;
  icon: LucideIcon;
  title: string;
  detail: string;
  tone: 'violet' | 'cyan' | 'brand' | 'emerald' | 'amber' | 'teal' | 'indigo' | 'razorpay';
}

export const DECISION_PIPELINE: DecisionStep[] = [
  {
    id: 'prompt',
    icon: MessageSquareText,
    title: 'Customer Prompt',
    detail: '"I need wireless earbuds under ₹3000."',
    tone: 'violet',
  },
  {
    id: 'intent',
    icon: BrainCircuit,
    title: 'Intent Detection',
    detail: 'Intent: purchase • Category: audio • Budget ≤ ₹3000',
    tone: 'cyan',
  },
  {
    id: 'search',
    icon: Search,
    title: 'Catalog Search',
    detail: 'Vector similarity search across 42 SKUs returned 7 candidates',
    tone: 'brand',
  },
  {
    id: 'margin',
    icon: TrendingUp,
    title: 'Margin Analysis',
    detail: 'Ranked by gross margin: 43% → 38% → 34% weighted by relevance',
    tone: 'amber',
  },
  {
    id: 'inventory',
    icon: PackageCheck,
    title: 'Inventory Check',
    detail: 'Top 3 verified in-stock • reserved for 15 min (TTL lock)',
    tone: 'emerald',
  },
  {
    id: 'recommend',
    icon: Sparkles,
    title: 'Recommendation',
    detail: 'boAt Airdopes 141 — ₹2499 • best overall match',
    tone: 'teal',
  },
  {
    id: 'confidence',
    icon: ShieldCheck,
    title: 'Confidence Score',
    detail: '98.7% confidence • rationale: 7 factors aligned',
    tone: 'indigo',
  },
  {
    id: 'checkout',
    icon: CreditCard,
    title: 'Generate Razorpay Checkout',
    detail: 'order_Na9f… tokenized session • 1-click UPI ready',
    tone: 'razorpay',
  },
];

const toneMap: Record<
  DecisionStep['tone'],
  { iconBg: string; iconText: string; chipBg: string; ring: string; bar: string; glow: string }
> = {
  violet: {
    iconBg: 'bg-ai-violet/14 dark:bg-ai-violet/22 border-ai-violet/35',
    iconText: 'text-ai-violet',
    chipBg: 'bg-ai-violet/12 dark:bg-ai-violet/18 border-ai-violet/30 text-ai-violet',
    ring: 'ring-ai-violet/35',
    bar: 'bg-gradient-to-r from-ai-violet to-ai-violet/70',
    glow: 'shadow-[0_0_20px_-4px_rgba(139,92,246,0.45)]',
  },
  cyan: {
    iconBg: 'bg-ai-cyan/14 dark:bg-ai-cyan/22 border-ai-cyan/35',
    iconText: 'text-ai-cyan',
    chipBg: 'bg-ai-cyan/12 dark:bg-ai-cyan/18 border-ai-cyan/30 text-ai-cyan',
    ring: 'ring-ai-cyan/35',
    bar: 'bg-gradient-to-r from-ai-cyan to-ai-cyan/70',
    glow: 'shadow-[0_0_20px_-4px_rgba(6,182,212,0.45)]',
  },
  brand: {
    iconBg: 'bg-brand-500/14 dark:bg-brand-500/22 border-brand-500/35',
    iconText: 'text-brand-600 dark:text-brand-400',
    chipBg: 'bg-brand-500/12 dark:bg-brand-500/18 border-brand-500/30 text-brand-600 dark:text-brand-400',
    ring: 'ring-brand-500/35',
    bar: 'bg-gradient-to-r from-brand-500 to-brand-500/70',
    glow: 'shadow-[0_0_20px_-4px_rgba(14,165,233,0.45)]',
  },
  amber: {
    iconBg: 'bg-amber-500/14 dark:bg-amber-500/22 border-amber-500/35',
    iconText: 'text-amber-500 dark:text-amber-400',
    chipBg: 'bg-amber-500/12 dark:bg-amber-500/18 border-amber-500/30 text-amber-600 dark:text-amber-400',
    ring: 'ring-amber-500/35',
    bar: 'bg-gradient-to-r from-amber-500 to-amber-500/70',
    glow: 'shadow-[0_0_20px_-4px_rgba(245,158,11,0.45)]',
  },
  emerald: {
    iconBg: 'bg-ai-emerald/14 dark:bg-ai-emerald/22 border-ai-emerald/35',
    iconText: 'text-ai-emerald',
    chipBg: 'bg-ai-emerald/12 dark:bg-ai-emerald/18 border-ai-emerald/30 text-ai-emerald',
    ring: 'ring-ai-emerald/35',
    bar: 'bg-gradient-to-r from-ai-emerald to-ai-emerald/70',
    glow: 'shadow-[0_0_20px_-4px_rgba(16,185,129,0.45)]',
  },
  teal: {
    iconBg: 'bg-teal-500/14 dark:bg-teal-500/22 border-teal-500/35',
    iconText: 'text-teal-600 dark:text-teal-400',
    chipBg: 'bg-teal-500/12 dark:bg-teal-500/18 border-teal-500/30 text-teal-600 dark:text-teal-400',
    ring: 'ring-teal-500/35',
    bar: 'bg-gradient-to-r from-teal-500 to-teal-500/70',
    glow: 'shadow-[0_0_20px_-4px_rgba(13,148,136,0.45)]',
  },
  indigo: {
    iconBg: 'bg-indigo-500/14 dark:bg-indigo-500/22 border-indigo-500/35',
    iconText: 'text-indigo-600 dark:text-indigo-400',
    chipBg: 'bg-indigo-500/12 dark:bg-indigo-500/18 border-indigo-500/30 text-indigo-600 dark:text-indigo-400',
    ring: 'ring-indigo-500/35',
    bar: 'bg-gradient-to-r from-indigo-500 to-indigo-500/70',
    glow: 'shadow-[0_0_20px_-4px_rgba(99,102,241,0.45)]',
  },
  razorpay: {
    iconBg: 'bg-[#1366ef]/14 dark:bg-[#1366ef]/22 border-[#1366ef]/35',
    iconText: 'text-[#0f54c8] dark:text-[#60a5fa]',
    chipBg: 'bg-[#1366ef]/12 dark:bg-[#1366ef]/18 border-[#1366ef]/30 text-[#0f54c8] dark:text-[#60a5fa]',
    ring: 'ring-[#1366ef]/35',
    bar: 'bg-gradient-to-r from-[#1366ef] to-[#1366ef]/70',
    glow: 'shadow-[0_0_20px_-4px_rgba(19,102,239,0.45)]',
  },
};

export interface XAIDecisionCardProps {
  steps?: DecisionStep[];
  className?: string;
}

export function XAIDecisionCard({
  steps = DECISION_PIPELINE,
  className = '',
}: XAIDecisionCardProps) {
  const [activeIndex, setActiveIndex] = React.useState<number>(0);
  const [autoCycle, setAutoCycle] = React.useState<boolean>(true);

  React.useEffect(() => {
    if (!autoCycle) return;
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % steps.length);
    }, 1400);
    return () => clearInterval(timer);
  }, [autoCycle, steps.length]);

  return (
    <div
      className={`group relative w-full rounded-3xl border border-border/70 dark:border-white/10 bg-card/65 dark:bg-obsidian-900/65 backdrop-blur-2xl shadow-[0_22px_65px_-32px_rgba(15,23,42,0.75)] overflow-hidden ${className}`}
      role="region"
      aria-label="Interactive AI decision pipeline"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-br from-ai-violet/[0.05] via-transparent to-[#1366ef]/[0.05] dark:from-ai-violet/[0.08] dark:to-[#1366ef]/[0.07]"
      />

      <header className="relative flex items-center justify-between px-5 sm:px-6 py-4 border-b border-border/60 bg-secondary/25 dark:bg-obsidian-950/40">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="absolute inset-0 rounded-xl bg-ai-violet/40 blur-md animate-pulse opacity-70" />
            <div className="relative w-9 h-9 rounded-xl bg-ai-violet/15 dark:bg-ai-violet/25 border border-ai-violet/40 flex items-center justify-center text-ai-violet">
              <BrainCircuit className="w-4.5 h-4.5" strokeWidth={2.3} />
            </div>
          </div>
          <div>
            <div className="text-[10px] font-mono font-bold uppercase tracking-[0.18em] text-muted-foreground mb-0.5">
              Reasoning Trace &bull; Live
            </div>
            <h3 className="font-heading font-bold text-base sm:text-lg text-foreground leading-tight">
              AI Decision Pipeline
            </h3>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setAutoCycle(!autoCycle)}
          className={`px-3 py-1.5 rounded-xl text-[10px] font-mono font-bold uppercase tracking-wider border transition-colors ${
            autoCycle
              ? 'bg-emerald-500/12 border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
              : 'bg-secondary/60 border-border text-muted-foreground'
          }`}
          aria-pressed={autoCycle}
        >
          {autoCycle ? '● Auto-cycle' : '○ Manual'}
        </button>
      </header>

      <div className="relative px-4 sm:px-5 py-5 sm:py-6 space-y-0">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          const tone = toneMap[step.tone];
          const isActive = idx === activeIndex;
          const isDone = idx < activeIndex;
          return (
            <React.Fragment key={step.id}>
              <motion.div
                initial={{ opacity: 0, x: -8 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: idx * 0.04 }}
                whileHover={{ x: 2 }}
                onClick={() => {
                  setAutoCycle(false);
                  setActiveIndex(idx);
                }}
                className={`relative flex items-start gap-3 sm:gap-4 p-3 sm:p-3.5 rounded-2xl cursor-pointer transition-all duration-300 ${
                  isActive
                    ? `bg-white/50 dark:bg-obsidian-850/70 border border-border/80 ring-2 ${tone.ring} ${tone.glow}`
                    : 'hover:bg-white/25 dark:hover:bg-obsidian-850/30 border border-transparent'
                }`}
                role="button"
                tabIndex={0}
                aria-current={isActive ? 'step' : undefined}
                aria-label={`Step ${idx + 1}: ${step.title}`}
              >
                <div className="flex flex-col items-center pt-0.5 shrink-0">
                  <motion.div
                    whileHover={{ scale: 1.08, rotate: isActive ? [0, -4, 3, -1, 0] : 0 }}
                    animate={isActive ? { scale: [1, 1.1, 1] } : {}}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                    className={`relative w-10 h-10 sm:w-11 sm:h-11 rounded-2xl ${tone.iconBg} flex items-center justify-center shadow-inner ${tone.iconText} z-10`}
                  >
                    <Icon className="w-5 h-5 sm:w-5.5 sm:h-5.5" strokeWidth={2.2} aria-hidden="true" />
                  </motion.div>
                </div>

                <div className="min-w-0 flex-1 flex flex-col gap-1.5 pt-0.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-heading font-bold text-sm sm:text-[15px] text-foreground leading-tight">
                      {step.title}
                    </span>
                    <span className={`shrink-0 px-2 py-0.5 rounded-lg text-[9px] font-mono font-bold uppercase tracking-[0.16em] border ${tone.chipBg}`}>
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                    {isDone && (
                      <span className="shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[9px] font-mono font-bold uppercase tracking-wider bg-emerald-500/12 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400">
                        ✓ Done
                      </span>
                    )}
                  </div>
                  <p className="text-xs sm:text-[13px] text-muted-foreground leading-relaxed break-words font-mono/[1.55]">
                    {step.detail}
                  </p>
                  <div className="h-1.5 w-full rounded-full bg-border/50 overflow-hidden mt-0.5">
                    <motion.div
                      className={`h-full rounded-full ${tone.bar}`}
                      initial={{ width: '0%' }}
                      animate={{ width: isDone ? '100%' : isActive ? '72%' : '0%' }}
                      transition={{ duration: 0.5, ease: 'easeOut' }}
                    />
                  </div>
                </div>
              </motion.div>

              {idx < steps.length - 1 && (
                <div className="relative flex items-center justify-center py-1.5" aria-hidden="true">
                  <motion.div
                    animate={isActive ? { y: [0, 3, 0], opacity: [0.5, 1, 0.5] } : {}}
                    transition={{ duration: 1.1, repeat: Infinity, ease: 'easeInOut' }}
                    className="text-muted-foreground/60"
                  >
                    <ArrowDown className="w-3.5 h-3.5" strokeWidth={2.5} />
                  </motion.div>
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
