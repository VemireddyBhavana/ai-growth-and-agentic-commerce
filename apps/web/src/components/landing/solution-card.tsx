'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import {
  CheckCircle2,
  ArrowUpRight,
  Bot,
  Sparkles,
  TrendingUp,
  FileSearch2,
  LayoutDashboard,
  type LucideIcon,
} from 'lucide-react';

export interface SolutionCardData {
  id: string;
  icon: LucideIcon;
  title: string;
  description: string;
  tag: string;
  highlight: string;
  tone: 'emerald' | 'cyan' | 'brand' | 'violet' | 'teal';
}

export const SOLUTION_CARDS: SolutionCardData[] = [
  {
    id: 'ai-assistant',
    icon: Bot,
    title: 'AI Shopping Assistant',
    description:
      'A conversational concierge that understands shopper intent in natural language, narrows down catalogs in seconds, and guides customers to checkout with zero friction.',
    tag: 'Conversational AI',
    highlight: '3.8× Conversion Lift',
    tone: 'emerald',
  },
  {
    id: 'smart-recs',
    icon: Sparkles,
    title: 'Smart Product Recommendations',
    description:
      'Real-time vector search + persona-aware ranking surfaces exact matches, alternatives, and complementary items based on context, not popularity alone.',
    tag: 'Vector + LLM',
    highlight: '+34% Relevant Clicks',
    tone: 'cyan',
  },
  {
    id: 'upsell-engine',
    icon: TrendingUp,
    title: 'Upsell & Cross-sell Engine',
    description:
      'Margin-optimized bundling engine proposes add-ons, variants, and protection plans that maximize order value while feeling natural, not pushy.',
    tag: 'AOV Optimizer',
    highlight: '+41% AOV Boost',
    tone: 'brand',
  },
  {
    id: 'explainable-ai',
    icon: FileSearch2,
    title: 'Explainable AI Decisions',
    description:
      'Every recommendation ships with a human-readable reasoning trace and confidence score. Shoppers trust it, and compliance teams can audit it.',
    tag: 'XAI + Audit',
    highlight: '99.7% Explainable',
    tone: 'teal',
  },
  {
    id: 'analytics-dashboard',
    icon: LayoutDashboard,
    title: 'Merchant Analytics Dashboard',
    description:
      'Unified insights across conversion funnels, segment profitability, AI recommendation performance, and churn drivers — presented as actionable playbooks.',
    tag: 'Merchant OS',
    highlight: '10× Faster Decisions',
    tone: 'violet',
  },
];

const toneMap: Record<SolutionCardData['tone'], { gradient: string; text: string; border: string; shadow: string; ring: string; iconBg: string }> = {
  emerald: {
    gradient: 'from-ai-emerald/16 via-ai-emerald/[0.04] to-transparent',
    text: 'text-ai-emerald',
    border: 'border-ai-emerald/30 hover:border-ai-emerald/55',
    shadow: 'hover:shadow-ai-emerald/20',
    ring: 'focus-visible:ring-ai-emerald/40',
    iconBg: 'bg-ai-emerald/12 dark:bg-ai-emerald/18 border-ai-emerald/30',
  },
  cyan: {
    gradient: 'from-ai-cyan/16 via-ai-cyan/[0.04] to-transparent',
    text: 'text-ai-cyan',
    border: 'border-ai-cyan/30 hover:border-ai-cyan/55',
    shadow: 'hover:shadow-ai-cyan/20',
    ring: 'focus-visible:ring-ai-cyan/40',
    iconBg: 'bg-ai-cyan/12 dark:bg-ai-cyan/18 border-ai-cyan/30',
  },
  brand: {
    gradient: 'from-brand-500/16 via-brand-500/[0.04] to-transparent',
    text: 'text-brand-600 dark:text-brand-400',
    border: 'border-brand-500/30 hover:border-brand-500/55',
    shadow: 'hover:shadow-brand-500/20',
    ring: 'focus-visible:ring-brand-500/40',
    iconBg: 'bg-brand-500/12 dark:bg-brand-500/18 border-brand-500/30',
  },
  violet: {
    gradient: 'from-ai-violet/16 via-ai-violet/[0.04] to-transparent',
    text: 'text-ai-violet',
    border: 'border-ai-violet/30 hover:border-ai-violet/55',
    shadow: 'hover:shadow-ai-violet/20',
    ring: 'focus-visible:ring-ai-violet/40',
    iconBg: 'bg-ai-violet/12 dark:bg-ai-violet/18 border-ai-violet/30',
  },
  teal: {
    gradient: 'from-teal-500/16 via-teal-500/[0.04] to-transparent',
    text: 'text-teal-600 dark:text-teal-400',
    border: 'border-teal-500/30 hover:border-teal-500/55',
    shadow: 'hover:shadow-teal-500/20',
    ring: 'focus-visible:ring-teal-500/40',
    iconBg: 'bg-teal-500/12 dark:bg-teal-500/18 border-teal-500/30',
  },
};

export interface SolutionCardProps {
  solution: SolutionCardData;
  index?: number;
}

export function SolutionCard({ solution, index = 0 }: SolutionCardProps) {
  const Icon = solution.icon;
  const tone = toneMap[solution.tone];
  return (
    <motion.article
      role="article"
      initial={{ opacity: 0, x: 24, y: 8 }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{
        duration: 0.55,
        delay: index * 0.07,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{ y: -5, x: -2 }}
      className={`group relative flex flex-col gap-4 p-5 sm:p-6 rounded-2xl border border-border/70 dark:border-white/10 bg-card/75 dark:bg-obsidian-900/75 backdrop-blur-xl bg-gradient-to-br ${tone.gradient} ${tone.border} shadow-[0_14px_40px_-26px_rgba(15,23,42,0.55)] hover:shadow-2xl ${tone.shadow} transition-all duration-350 ease-out focus-within:outline-none focus-within:ring-2 ${tone.ring} focus-within:ring-offset-2 focus-within:ring-offset-background`}
      tabIndex={0}
      aria-label={`Solution: ${solution.title}`}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-t from-white/35 via-transparent to-transparent dark:from-white/[0.05] opacity-55 mix-blend-overlay"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-white/12 via-transparent to-white/5 dark:from-white/[0.09]"
        style={{ WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)', WebkitMaskComposite: 'xor', maskComposite: 'exclude', padding: '1px' }}
      />

      <header className="relative flex items-start justify-between gap-3">
        <div className={`relative w-11 h-11 sm:w-12 sm:h-12 rounded-2xl ${tone.iconBg} flex items-center justify-center shadow-inner group-hover:scale-110 group-hover:rotate-[2deg] transition-all duration-300 ${tone.text}`}>
          <Icon className="w-5.5 h-5.5 sm:w-6 sm:h-6 transition-transform duration-300 group-hover:scale-110" aria-hidden="true" />
        </div>
        <span className={`shrink-0 px-2.5 py-1 rounded-xl text-[10px] font-mono font-bold uppercase tracking-wider border border-inherit bg-background/60 dark:bg-obsidian-950/60 ${tone.text}`}>
          {solution.tag}
        </span>
      </header>

      <div className="relative space-y-2.5 flex-1">
        <h3 className="font-heading font-bold text-lg sm:text-xl leading-tight text-foreground transition-colors duration-300 group-hover:text-foreground">
          {solution.title}
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {solution.description}
        </p>
      </div>

      <footer className="relative flex items-center justify-between pt-2">
        <span className={`inline-flex items-center gap-1.5 text-[11px] sm:text-xs font-mono font-bold ${tone.text}`}>
          <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" aria-hidden="true" />
          {solution.highlight}
        </span>
        <div className={`w-8 h-8 rounded-full bg-background/70 dark:bg-obsidian-850/70 border border-border/60 flex items-center justify-center text-muted-foreground transition-all duration-300 ${tone.text} group-hover:scale-110 group-hover:bg-background/90`}>
          <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
        </div>
      </footer>
    </motion.article>
  );
}
