'use client';

import * as React from 'react';
import { motion, useInView, useSpring, useMotionValue, animate } from 'framer-motion';
import { TrendingUp, TrendingDown, ShoppingBag, Smile } from 'lucide-react';

export interface StatMetric {
  id: string;
  label: string;
  value: number;
  suffix: string;
  prefix?: string;
  direction: 'up' | 'down';
  tone: 'emerald' | 'brand' | 'cyan' | 'violet';
  Icon: React.ComponentType<{ className?: string }>;
}

export const DEFAULT_STATS: StatMetric[] = [
  {
    id: 'conversion',
    label: 'Conversion Rate',
    value: 278,
    suffix: '%',
    direction: 'up',
    tone: 'emerald',
    Icon: TrendingUp,
  },
  {
    id: 'abandonment',
    label: 'Cart Abandonment',
    value: 46,
    suffix: '%',
    direction: 'down',
    tone: 'brand',
    Icon: TrendingDown,
  },
  {
    id: 'aov',
    label: 'Average Order Value',
    value: 41,
    suffix: '%',
    direction: 'up',
    tone: 'cyan',
    Icon: ShoppingBag,
  },
  {
    id: 'csat',
    label: 'Customer Satisfaction',
    value: 92,
    suffix: '%',
    direction: 'up',
    tone: 'violet',
    Icon: Smile,
  },
];

const toneMap: Record<StatMetric['tone'], { text: string; glow: string; iconBg: string; border: string }> = {
  emerald: {
    text: 'text-emerald-500 dark:text-emerald-400',
    glow: 'hover:shadow-emerald-500/15',
    iconBg: 'bg-emerald-500/12 dark:bg-emerald-500/18 border-emerald-500/30',
    border: 'border-emerald-500/30',
  },
  brand: {
    text: 'text-brand-600 dark:text-brand-400',
    glow: 'hover:shadow-brand-500/15',
    iconBg: 'bg-brand-500/12 dark:bg-brand-500/18 border-brand-500/30',
    border: 'border-brand-500/30',
  },
  cyan: {
    text: 'text-ai-cyan',
    glow: 'hover:shadow-ai-cyan/15',
    iconBg: 'bg-ai-cyan/12 dark:bg-ai-cyan/18 border-ai-cyan/30',
    border: 'border-ai-cyan/30',
  },
  violet: {
    text: 'text-ai-violet',
    glow: 'hover:shadow-ai-violet/15',
    iconBg: 'bg-ai-violet/12 dark:bg-ai-violet/18 border-ai-violet/30',
    border: 'border-ai-violet/30',
  },
};

function AnimatedCounter({ value, suffix = '', prefix = '' }: { value: number; suffix?: string; prefix?: string }) {
  const ref = React.useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-40px' });
  const mv = useMotionValue(0);
  const display = useSpring(mv, { stiffness: 80, damping: 18, mass: 0.6 });
  const [formatted, setFormatted] = React.useState('0');

  React.useEffect(() => {
    if (!isInView) return;
    const controls = animate(mv, value, {
      duration: 1.8,
      ease: [0.22, 1, 0.36, 1],
    });
    const unsub = display.on('change', (v) => {
      setFormatted(Math.round(v).toString());
    });
    return () => {
      controls.stop();
      unsub();
    };
  }, [isInView, value, mv, display]);

  return (
    <span ref={ref} className="inline-flex items-baseline tabular-nums">
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
}

export interface StatsRowProps {
  stats?: StatMetric[];
  className?: string;
}

export function StatsRow({ stats = DEFAULT_STATS, className = '' }: StatsRowProps) {
  return (
    <div
      className={`relative grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 items-stretch ${className}`}
      role="list"
      aria-label="Performance improvements after AI Sales Assistant integration"
    >
      {stats.map((stat, idx) => {
        const Icon = stat.Icon;
        const tone = toneMap[stat.tone];
        const DirIcon = stat.direction === 'up' ? TrendingUp : TrendingDown;
        return (
          <motion.div
            role="listitem"
            key={stat.id}
            initial={{ opacity: 0, y: 18, scale: 0.98 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{
              duration: 0.55,
              delay: idx * 0.09,
              ease: [0.22, 1, 0.36, 1],
            }}
            whileHover={{ y: -4 }}
            className={`group relative flex flex-col items-center sm:items-start gap-3 p-5 sm:p-6 rounded-2xl border border-border/70 dark:border-white/10 bg-card/70 dark:bg-obsidian-900/70 backdrop-blur-xl bg-gradient-to-br from-white/10 via-white/[0.03] to-transparent dark:from-white/[0.04] shadow-[0_14px_40px_-26px_rgba(15,23,42,0.55)] hover:shadow-2xl ${tone.glow} transition-all duration-300`}
          >
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-t from-white/35 via-transparent to-transparent dark:from-white/[0.04] opacity-50 mix-blend-overlay"
            />

            <div className="relative flex items-center gap-3 w-full">
              <div className={`relative w-10 h-10 rounded-xl ${tone.iconBg} flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-300 ${tone.text}`}>
                <Icon className="w-5 h-5" aria-hidden="true" />
              </div>
              <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-mono font-bold uppercase tracking-wider border border-inherit bg-background/60 dark:bg-obsidian-950/60 ${tone.text}`}>
                <DirIcon className="w-3 h-3" strokeWidth={2.5} />
                {stat.direction === 'up' ? 'LIFT' : 'DROP'}
              </div>
            </div>

            <div className={`relative text-3xl sm:text-4xl font-heading font-extrabold tracking-tight ${tone.text} leading-none`}>
              <AnimatedCounter value={stat.value} suffix={stat.suffix} prefix={stat.prefix} />
            </div>

            <div className="relative text-xs sm:text-sm text-muted-foreground font-medium leading-snug text-center sm:text-left">
              {stat.label}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
