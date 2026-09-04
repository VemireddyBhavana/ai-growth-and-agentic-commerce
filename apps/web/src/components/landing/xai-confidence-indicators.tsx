'use client';

import * as React from 'react';
import { motion, useInView, useMotionValue, useSpring, animate } from 'framer-motion';
import {
  UserSearch,
  PackageCheck,
  TrendingUp,
  Sparkles,
  CreditCard,
  FileCheck2,
  type LucideIcon,
} from 'lucide-react';

export interface ConfidenceMetric {
  id: string;
  label: string;
  value: number;
  Icon: LucideIcon;
  tone: 'violet' | 'emerald' | 'amber' | 'teal' | 'razorpay' | 'brand';
}

export const CONFIDENCE_METRICS: ConfidenceMetric[] = [
  {
    id: 'intent',
    label: 'Customer Intent',
    value: 98,
    Icon: UserSearch,
    tone: 'violet',
  },
  {
    id: 'inventory',
    label: 'Inventory Match',
    value: 100,
    Icon: PackageCheck,
    tone: 'emerald',
  },
  {
    id: 'margin',
    label: 'Margin Safety',
    value: 96,
    Icon: TrendingUp,
    tone: 'amber',
  },
  {
    id: 'recommendation',
    label: 'Recommendation Quality',
    value: 99,
    Icon: Sparkles,
    tone: 'teal',
  },
  {
    id: 'payment',
    label: 'Payment Confidence',
    value: 100,
    Icon: CreditCard,
    tone: 'razorpay',
  },
  {
    id: 'audit',
    label: 'Audit Integrity',
    value: 100,
    Icon: FileCheck2,
    tone: 'brand',
  },
];

const toneMap: Record<
  ConfidenceMetric['tone'],
  { iconBg: string; iconText: string; bar: string; text: string; glow: string; chip: string }
> = {
  violet: {
    iconBg: 'bg-ai-violet/14 dark:bg-ai-violet/22 border-ai-violet/35',
    iconText: 'text-ai-violet',
    bar: 'from-ai-violet via-ai-violet/80 to-ai-violet/55',
    text: 'text-ai-violet',
    glow: 'shadow-[0_0_30px_-8px_rgba(139,92,246,0.5)]',
    chip: 'bg-ai-violet/12 dark:bg-ai-violet/18 border-ai-violet/30',
  },
  emerald: {
    iconBg: 'bg-ai-emerald/14 dark:bg-ai-emerald/22 border-ai-emerald/35',
    iconText: 'text-ai-emerald',
    bar: 'from-ai-emerald via-ai-emerald/80 to-ai-emerald/55',
    text: 'text-ai-emerald',
    glow: 'shadow-[0_0_30px_-8px_rgba(16,185,129,0.5)]',
    chip: 'bg-ai-emerald/12 dark:bg-ai-emerald/18 border-ai-emerald/30',
  },
  amber: {
    iconBg: 'bg-amber-500/14 dark:bg-amber-500/22 border-amber-500/35',
    iconText: 'text-amber-500 dark:text-amber-400',
    bar: 'from-amber-500 via-amber-500/80 to-amber-500/55',
    text: 'text-amber-600 dark:text-amber-400',
    glow: 'shadow-[0_0_30px_-8px_rgba(245,158,11,0.5)]',
    chip: 'bg-amber-500/12 dark:bg-amber-500/18 border-amber-500/30',
  },
  teal: {
    iconBg: 'bg-teal-500/14 dark:bg-teal-500/22 border-teal-500/35',
    iconText: 'text-teal-600 dark:text-teal-400',
    bar: 'from-teal-500 via-teal-500/80 to-teal-500/55',
    text: 'text-teal-600 dark:text-teal-400',
    glow: 'shadow-[0_0_30px_-8px_rgba(13,148,136,0.5)]',
    chip: 'bg-teal-500/12 dark:bg-teal-500/18 border-teal-500/30',
  },
  razorpay: {
    iconBg: 'bg-[#1366ef]/14 dark:bg-[#1366ef]/22 border-[#1366ef]/35',
    iconText: 'text-[#0f54c8] dark:text-[#60a5fa]',
    bar: 'from-[#1366ef] via-[#1366ef]/80 to-[#1366ef]/55',
    text: 'text-[#0f54c8] dark:text-[#60a5fa]',
    glow: 'shadow-[0_0_30px_-8px_rgba(19,102,239,0.5)]',
    chip: 'bg-[#1366ef]/12 dark:bg-[#1366ef]/18 border-[#1366ef]/30',
  },
  brand: {
    iconBg: 'bg-brand-500/14 dark:bg-brand-500/22 border-brand-500/35',
    iconText: 'text-brand-600 dark:text-brand-400',
    bar: 'from-brand-500 via-brand-500/80 to-brand-500/55',
    text: 'text-brand-600 dark:text-brand-400',
    glow: 'shadow-[0_0_30px_-8px_rgba(14,165,233,0.5)]',
    chip: 'bg-brand-500/12 dark:bg-brand-500/18 border-brand-500/30',
  },
};

function AnimatedCounter({ value }: { value: number }) {
  const ref = React.useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const mv = useMotionValue(0);
  const display = useSpring(mv, { stiffness: 70, damping: 16, mass: 0.55 });
  const [formatted, setFormatted] = React.useState('0');

  React.useEffect(() => {
    if (!inView) return;
    const ctrl = animate(mv, value, {
      duration: 1.7,
      ease: [0.22, 1, 0.36, 1],
    });
    const unsub = display.on('change', (v) => {
      setFormatted(Math.round(v).toString());
    });
    return () => {
      ctrl.stop();
      unsub();
    };
  }, [inView, value, mv, display]);

  return <span ref={ref} className="tabular-nums">{formatted}</span>;
}

function ConfidenceBar({ value, barClass }: { value: number; barClass: string }) {
  const ref = React.useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const pct = `${value}%`;
  return (
    <div ref={ref} className="relative h-2.5 w-full rounded-full bg-border/55 overflow-hidden">
      <motion.div
        className={`h-full rounded-full bg-gradient-to-r ${barClass}`}
        initial={{ width: '0%' }}
        animate={inView ? { width: pct } : { width: '0%' }}
        transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/40 via-transparent to-transparent opacity-50 mix-blend-overlay"
      />
    </div>
  );
}

export interface XAIConfidenceIndicatorsProps {
  metrics?: ConfidenceMetric[];
  className?: string;
}

export function XAIConfidenceIndicators({
  metrics = CONFIDENCE_METRICS,
  className = '',
}: XAIConfidenceIndicatorsProps) {
  return (
    <div
      className={`relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 items-stretch ${className}`}
      role="list"
      aria-label="AI decision confidence indicators"
    >
      {metrics.map((metric, idx) => {
        const Icon = metric.Icon;
        const tone = toneMap[metric.tone];
        return (
          <motion.div
            key={metric.id}
            role="listitem"
            initial={{ opacity: 0, y: 18, scale: 0.98 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{
              duration: 0.55,
              delay: idx * 0.07,
              ease: [0.22, 1, 0.36, 1],
            }}
            whileHover={{ y: -4 }}
            className={`group relative p-5 sm:p-6 rounded-2xl border border-border/70 dark:border-white/10 bg-card/70 dark:bg-obsidian-900/70 backdrop-blur-xl bg-gradient-to-br from-white/10 via-white/[0.03] to-transparent dark:from-white/[0.04] shadow-[0_14px_40px_-28px_rgba(15,23,42,0.65)] hover:shadow-2xl ${tone.glow} transition-all duration-300`}
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

            <div className="relative flex items-start justify-between gap-3 mb-4">
              <div className="flex items-center gap-3">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: [0, -3, 2, -1, 0] }}
                  transition={{ duration: 0.55, ease: 'easeOut' }}
                  className={`relative w-11 h-11 rounded-2xl ${tone.iconBg} flex items-center justify-center shadow-inner ${tone.iconText}`}
                >
                  <Icon className="w-5.5 h-5.5" strokeWidth={2.2} aria-hidden="true" />
                </motion.div>
                <div className="flex flex-col">
                  <span className="font-heading font-semibold text-sm sm:text-[15px] text-foreground leading-tight">
                    {metric.label}
                  </span>
                  <span className={`mt-0.5 inline-flex w-fit px-2 py-0.5 rounded-lg text-[9px] font-mono font-bold uppercase tracking-[0.16em] border ${tone.chip} ${tone.text}`}>
                    Confidence
                  </span>
                </div>
              </div>

              <div className={`text-2xl sm:text-3xl font-heading font-extrabold tabular-nums ${tone.text}`}>
                <AnimatedCounter value={metric.value} />
                <span className="text-[0.65em] align-super ml-0.5 opacity-90">%</span>
              </div>
            </div>

            <div className="relative">
              <ConfidenceBar value={metric.value} barClass={tone.bar} />
              <div className="mt-2 flex items-center justify-between text-[10px] font-mono text-muted-foreground/85">
                <span>0%</span>
                <span className={`${tone.text} font-semibold`}>Threshold: 90%</span>
                <span>100%</span>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
