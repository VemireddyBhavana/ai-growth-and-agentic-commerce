'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import {
  Target,
  Zap,
  CheckCircle2,
  ShoppingCart,
  TrendingUp,
  Gauge,
  Activity,
  ArrowUpRight,
  Sparkles,
  Flame,
} from 'lucide-react';
import { GlassCard, CardHeader } from '../shared';
import { AnimatedCounter } from '../shared/animated-counter';
import { cn } from '@/lib/utils';
import { useDashboardSlice } from '@/lib/dashboard/hooks';
import type { AiMetric } from '@/lib/dashboard/types';

const metricIcons: Record<
  AiMetric['icon'],
  React.ComponentType<{ className?: string; strokeWidth?: number }>
> = {
  confidence: Target,
  latency: Zap,
  recs: CheckCircle2,
  checkout: ShoppingCart,
  lift: TrendingUp,
};

function CircularProgress({
  value,
  max,
  tone,
  size = 64,
  stroke = 5,
}: {
  value: number;
  max: number;
  tone: string;
  size?: number;
  stroke?: number;
}) {
  const pct = Math.min(100, (value / max) * 100);
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - pct / 100);

  const colorMap: Record<string, string> = {
    'from-brand-600/30 via-brand-500/15 to-transparent text-brand-500 dark:text-brand-400 border-brand-500/25':
      '#6366F1',
    'from-ai-cyan/30 via-ai-cyan/15 to-transparent text-ai-cyan border-ai-cyan/25': '#06B6D4',
    'from-ai-emerald/30 via-ai-emerald/15 to-transparent text-ai-emerald border-ai-emerald/25':
      '#10B981',
    'from-ai-violet/30 via-ai-violet/15 to-transparent text-ai-violet border-ai-violet/25':
      '#8B5CF6',
    'from-amber-500/30 via-amber-500/15 to-transparent text-amber-400 border-amber-500/25':
      '#F59E0B',
  };
  const color = colorMap[tone] || '#6366F1';
  const gradId = React.useId().replace(/:/g, '');

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <defs>
          <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={color} stopOpacity={1} />
            <stop offset="100%" stopColor={color} stopOpacity={0.5} />
          </linearGradient>
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={stroke}
        />
        <motion.circle
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: dashOffset }}
          transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={`url(#${gradId})`}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          style={{ filter: `drop-shadow(0 0 8px ${color}66)` }}
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center">
        <motion.span
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="text-[11px] font-bold tabular-nums"
          style={{ color }}
        >
          {pct.toFixed(0)}%
        </motion.span>
      </div>
    </div>
  );
}

function PremiumMetricCard({ metric, idx }: { metric: AiMetric; idx: number }) {
  const Icon = metricIcons[metric.icon];
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <motion.div
      key={metric.label}
      initial={{ opacity: 0, x: -20, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      transition={{ duration: 0.4, delay: 0.48 + idx * 0.07, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative flex items-center gap-4 p-3 rounded-2xl border border-transparent hover:border-white/10 hover:bg-background/50 dark:hover:bg-obsidian-950/50 transition-all duration-300 overflow-hidden"
    >
      {/* Premium hover effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-brand-500/5 via-ai-violet/5 to-transparent opacity-0"
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />

      {metric.target !== undefined && (
        <motion.div
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ duration: 0.3 }}
        >
          <CircularProgress value={metric.value} max={metric.target} tone={metric.tone} />
        </motion.div>
      )}

      <div className="flex-1 min-w-0 relative">
        <div className="flex items-center gap-2 flex-wrap">
          <motion.div
            className={cn(
              'inline-flex p-1 rounded-lg border bg-gradient-to-br',
              metric.tone,
            )}
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div
              className="absolute inset-0 rounded-lg bg-white/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity"
            />
            <Icon className="w-3.5 h-3.5 relative z-10" strokeWidth={2.1} />
          </motion.div>
          <p className="text-[12.5px] font-bold text-foreground">{metric.label}</p>
          <motion.span
            initial={{ opacity: 0, x: -5 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 + idx * 0.05 }}
            className={cn(
              'inline-flex items-center gap-0.5 text-[10px] font-mono font-bold',
              metric.trend.up ? 'text-ai-emerald' : 'text-red-500',
            )}
          >
            <motion.div
              animate={{ y: [0, -2, 0] }}
              transition={{ duration: 2, repeat: Infinity, delay: idx * 0.3 }}
            >
              <ArrowUpRight
                className={cn('w-3 h-3', !metric.trend.up && 'rotate-180')}
                strokeWidth={2.4}
              />
            </motion.div>
            {metric.trend.value.toFixed(1)}%
          </motion.span>
        </div>
        <div className="flex items-baseline gap-2 mt-1">
          <motion.span
            className="font-heading font-extrabold text-xl tracking-tight text-foreground tabular-nums"
            animate={{ scale: isHovered ? 1.05 : 1 }}
            transition={{ duration: 0.2 }}
          >
            <AnimatedCounter
              value={metric.value}
              prefix={metric.prefix}
              suffix={metric.suffix}
              decimals={metric.decimals ?? 0}
            />
          </motion.span>
          {metric.target !== undefined && (
            <span className="text-[11px] font-mono text-muted-foreground">
              target {metric.target}
              {metric.suffix ?? ''}
            </span>
          )}
        </div>
        <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">
          {metric.description}
        </p>
      </div>
    </motion.div>
  );
}

export function AiPerformance() {
  const { data: aiMetrics = [] } = useDashboardSlice('aiMetrics');
  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.42, ease: [0.22, 1, 0.36, 1] }}
      className="xl:col-span-1"
    >
      <GlassCard glow="emerald">
        <CardHeader
          title="AI Performance"
          subtitle="Health metrics for your AI sales concierge"
          action={
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-ai-emerald/12 text-ai-emerald border border-ai-emerald/25 shadow-[0_0_12px_rgba(16,185,129,0.3)]"
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <Gauge className="w-3.5 h-3.5" strokeWidth={2.2} />
              </motion.div>
              <span className="text-[10.5px] font-mono font-bold uppercase tracking-[0.14em]">
                Healthy · 94/100
              </span>
            </motion.div>
          }
        />
        <div className="space-y-4">
          {aiMetrics.map((metric, idx) => (
            <PremiumMetricCard key={metric.label} metric={metric} idx={idx} />
          ))}
        </div>
        <div className="mt-4 pt-4 border-t border-white/10 dark:border-white/10">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex items-center gap-3 p-3 rounded-2xl bg-gradient-to-r from-brand-600/10 via-ai-violet/10 to-ai-cyan/10 border border-white/10 dark:border-white/10 hover:shadow-lg hover:shadow-brand-500/10 transition-shadow"
          >
            <motion.div
              className="p-2 rounded-xl bg-ai-violet/15 border border-ai-violet/25 text-ai-violet"
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ duration: 0.2 }}
            >
              <Activity className="w-4 h-4" strokeWidth={2.1} />
            </motion.div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-[12px] font-semibold text-foreground leading-snug">
                  AI is performing above baseline
                </p>
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Flame className="w-3 h-3 text-ai-emerald" strokeWidth={2} />
                </motion.div>
              </div>
              <p className="text-[11px] text-muted-foreground leading-relaxed mt-0.5">
                Enable Premium mode for A/B testing, model selection and explainable audit trails.
              </p>
            </div>
            <motion.button
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="shrink-0 inline-flex h-8 px-3 items-center rounded-lg text-[11px] font-bold uppercase tracking-[0.12em] bg-gradient-to-r from-brand-600 to-ai-violet text-white hover:opacity-95 transition-opacity shadow-lg shadow-brand-500/20 hover:shadow-xl hover:shadow-brand-500/30"
            >
              <Sparkles className="w-3 h-3 mr-1" strokeWidth={2} />
              Upgrade
            </motion.button>
          </motion.div>
        </div>
      </GlassCard>
    </motion.section>
  );
}
