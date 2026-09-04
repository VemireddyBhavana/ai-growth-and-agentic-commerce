'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import {
  XCircle,
  TrendingDown,
  ShoppingCart,
  SearchX,
  Headphones,
  BarChart3,
  type LucideIcon,
} from 'lucide-react';

export interface ProblemCardData {
  id: string;
  icon: LucideIcon;
  title: string;
  description: string;
  badge: string;
  tone: 'rose' | 'amber' | 'orange' | 'red' | 'terracotta';
}

export const PROBLEM_CARDS: ProblemCardData[] = [
  {
    id: 'low-conversion',
    icon: TrendingDown,
    title: 'Low Conversion Rate',
    description:
      'Most visitors browse and leave without purchasing. Static product pages and rigid navigation fail to guide intent-driven shoppers toward a decision.',
    badge: '2–3% avg.',
    tone: 'rose',
  },
  {
    id: 'cart-abandonment',
    icon: ShoppingCart,
    title: 'Cart Abandonment',
    description:
      'Shoppers add items to cart but leave during multi-step checkout, account creation walls, and hidden shipping costs — losing up to 70% of ready-to-buy revenue.',
    badge: '~70% drop-off',
    tone: 'red',
  },
  {
    id: 'generic-recs',
    icon: SearchX,
    title: 'Generic Product Recommendations',
    description:
      'Rule-based "customers also bought" widgets suggest the same top-sellers to every shopper, ignoring intent, context, taste, and margin signals.',
    badge: 'Static widgets',
    tone: 'orange',
  },
  {
    id: 'manual-support',
    icon: Headphones,
    title: 'Manual Customer Support',
    description:
      'Human support teams cannot scale across time zones, flash sales, or 3AM traffic spikes. Response delays directly translate to lost purchases.',
    badge: '24/7 burden',
    tone: 'terracotta',
  },
  {
    id: 'limited-insights',
    icon: BarChart3,
    title: 'Limited Business Insights',
    description:
      'Dashboards show vanity revenue numbers, not why shoppers leave, which products underperform, or which segments drive lifetime value.',
    badge: 'Data blind spots',
    tone: 'amber',
  },
];

const toneMap: Record<ProblemCardData['tone'], { gradient: string; text: string; border: string; shadow: string; ring: string }> = {
  rose: {
    gradient: 'from-rose-500/15 via-rose-500/[0.04] to-transparent',
    text: 'text-rose-500 dark:text-rose-400',
    border: 'border-rose-500/30 hover:border-rose-500/50',
    shadow: 'hover:shadow-rose-500/15',
    ring: 'focus-visible:ring-rose-500/40',
  },
  amber: {
    gradient: 'from-amber-500/15 via-amber-500/[0.04] to-transparent',
    text: 'text-amber-500 dark:text-amber-400',
    border: 'border-amber-500/30 hover:border-amber-500/50',
    shadow: 'hover:shadow-amber-500/15',
    ring: 'focus-visible:ring-amber-500/40',
  },
  orange: {
    gradient: 'from-orange-500/15 via-orange-500/[0.04] to-transparent',
    text: 'text-orange-500 dark:text-orange-400',
    border: 'border-orange-500/30 hover:border-orange-500/50',
    shadow: 'hover:shadow-orange-500/15',
    ring: 'focus-visible:ring-orange-500/40',
  },
  red: {
    gradient: 'from-red-500/15 via-red-500/[0.04] to-transparent',
    text: 'text-red-500 dark:text-red-400',
    border: 'border-red-500/30 hover:border-red-500/50',
    shadow: 'hover:shadow-red-500/15',
    ring: 'focus-visible:ring-red-500/40',
  },
  terracotta: {
    gradient: 'from-[#e76f51]/15 via-[#e76f51]/[0.04] to-transparent',
    text: 'text-[#d8572a] dark:text-[#fb923c]',
    border: 'border-[#e76f51]/30 hover:border-[#e76f51]/50',
    shadow: 'hover:shadow-[#e76f51]/15',
    ring: 'focus-visible:ring-[#e76f51]/40',
  },
};

export interface ProblemCardProps {
  problem: ProblemCardData;
  index?: number;
}

export function ProblemCard({ problem, index = 0 }: ProblemCardProps) {
  const Icon = problem.icon;
  const tone = toneMap[problem.tone];
  return (
    <motion.article
      role="article"
      initial={{ opacity: 0, x: -24, y: 8 }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{
        duration: 0.55,
        delay: index * 0.07,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{ y: -5, x: 2 }}
      className={`group relative flex flex-col gap-4 p-5 sm:p-6 rounded-2xl border border-border/70 dark:border-white/10 bg-card/70 dark:bg-obsidian-900/70 backdrop-blur-xl bg-gradient-to-br ${tone.gradient} ${tone.border} shadow-[0_14px_40px_-26px_rgba(15,23,42,0.55)] hover:shadow-2xl ${tone.shadow} transition-all duration-350 ease-out focus-within:outline-none focus-within:ring-2 ${tone.ring} focus-within:ring-offset-2 focus-within:ring-offset-background`}
      tabIndex={0}
      aria-label={`Problem: ${problem.title}`}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-t from-white/35 via-transparent to-transparent dark:from-white/[0.04] opacity-55 mix-blend-overlay"
      />

      <header className="relative flex items-start justify-between gap-3">
        <div className={`relative w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-background/75 dark:bg-obsidian-850/75 border border-border/60 flex items-center justify-center shadow-inner group-hover:scale-110 group-hover:rotate-[-2deg] transition-all duration-300 ${tone.text}`}>
          <Icon className="w-5.5 h-5.5 sm:w-6 sm:h-6 transition-transform duration-300 group-hover:scale-110" aria-hidden="true" />
        </div>
        <span className={`shrink-0 px-2.5 py-1 rounded-xl text-[10px] font-mono font-bold uppercase tracking-wider border border-inherit bg-background/60 dark:bg-obsidian-950/60 ${tone.text}`}>
          {problem.badge}
        </span>
      </header>

      <div className="relative space-y-2.5">
        <h3 className="font-heading font-bold text-lg sm:text-xl leading-tight text-foreground">
          {problem.title}
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {problem.description}
        </p>
      </div>

      <footer className="relative flex items-center justify-between pt-2">
        <span className={`inline-flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-wider ${tone.text} opacity-90`}>
          <XCircle className="w-3.5 h-3.5" aria-hidden="true" />
          Pain Point
        </span>
      </footer>
    </motion.article>
  );
}
