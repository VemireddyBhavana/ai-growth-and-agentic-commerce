'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TrendingUp, TrendingDown,
  DollarSign, ShoppingCart, Target, Banknote,
  CheckCircle, Sparkles, ShoppingBag, Star,
  ArrowUpRight, ArrowDownRight,
} from 'lucide-react';
import {
  ResponsiveContainer, AreaChart, Area, LineChart, Line, BarChart, Bar,
} from 'recharts';
import { GlassCard } from '@/components/dashboard/shared/glass-card';
import { AnimatedCounter } from '@/components/dashboard/shared/animated-counter';
import { useAnalyticsStore } from '@/stores/analyticsStore';
import { cn } from '@/lib/utils';

type KpiConfig = {
  key: keyof ReturnType<typeof useAnalyticsStore.getState>['snapshot']['kpis'];
  changeKey: keyof ReturnType<typeof useAnalyticsStore.getState>['snapshot']['kpis'];
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  color: string;
  bg: string;
  glow: 'brand' | 'violet' | 'cyan' | 'emerald';
  chartType: 'area' | 'bar' | 'line';
  invertTrend?: boolean;
};

const KPI_CONFIGS: KpiConfig[] = [
  { key: 'totalRevenue',        changeKey: 'revenueChange',         label: 'Total Revenue',            icon: DollarSign,   prefix: '₹', color: '#6366F1', bg: 'from-brand-600/20 to-brand-500/10 text-brand-400 border-brand-500/20',     glow: 'brand',   chartType: 'area'  },
  { key: 'totalOrders',         changeKey: 'ordersChange',          label: 'Total Orders',             icon: ShoppingCart, color: '#06B6D4', bg: 'from-ai-cyan/20 to-ai-cyan/10 text-ai-cyan border-ai-cyan/20',                 glow: 'cyan',    chartType: 'bar'   },
  { key: 'conversionRate',      changeKey: 'conversionChange',      label: 'Conversion Rate',          icon: Target,       suffix: '%', decimals: 2, color: '#10B981', bg: 'from-ai-emerald/20 to-ai-emerald/10 text-ai-emerald border-ai-emerald/20', glow: 'emerald', chartType: 'line'  },
  { key: 'avgOrderValue',       changeKey: 'aovChange',             label: 'Avg. Order Value',         icon: Banknote,     prefix: '₹', color: '#8B5CF6', bg: 'from-ai-violet/20 to-ai-violet/10 text-ai-violet border-ai-violet/20',    glow: 'violet',  chartType: 'area'  },
  { key: 'paymentSuccessRate',  changeKey: 'paymentSuccessChange',  label: 'Payment Success',          icon: CheckCircle,  suffix: '%', decimals: 1, color: '#10B981', bg: 'from-ai-emerald/20 to-ai-emerald/10 text-ai-emerald border-ai-emerald/20', glow: 'emerald', chartType: 'line'  },
  { key: 'aiAccuracy',          changeKey: 'aiAccuracyChange',      label: 'AI Rec. Accuracy',         icon: Sparkles,     suffix: '%', decimals: 1, color: '#8B5CF6', bg: 'from-ai-violet/20 to-ai-violet/10 text-ai-violet border-ai-violet/20',    glow: 'violet',  chartType: 'area'  },
  { key: 'cartAbandonmentRate', changeKey: 'cartAbandonmentChange', label: 'Cart Abandonment',         icon: ShoppingBag,  suffix: '%', decimals: 1, color: '#EF4444', bg: 'from-red-500/20 to-red-500/10 text-red-400 border-red-500/20',           glow: 'brand',   chartType: 'line', invertTrend: true  },
  { key: 'csat',                changeKey: 'csatChange',            label: 'Customer Satisfaction',   icon: Star,         suffix: '/5', decimals: 1, color: '#F59E0B', bg: 'from-amber-500/20 to-amber-500/10 text-amber-400 border-amber-500/20',   glow: 'cyan',    chartType: 'bar'   },
];

// stable sparkline shapes per card
const SPARKLINES: { v: number }[][] = [
  [32,45,38,52,48,61,70,65,78,85,79,92,98,110].map((v) => ({ v })),
  [18,22,28,25,34,40,38,46,52,49,58,65,72,80].map((v) => ({ v })),
  [42,44,40,46,48,45,50,52,51,55,58,56,60,62].map((v) => ({ v })),
  [70,72,68,74,78,76,82,80,86,88,85,92,95,98].map((v) => ({ v })),
  [80,82,85,83,88,90,89,93,95,94,97,96,98,99].map((v) => ({ v })),
  [60,65,62,68,71,70,74,76,74,78,80,81,83,85].map((v) => ({ v })),
  [55,52,58,50,45,48,42,44,40,38,35,36,34,33].map((v) => ({ v })),
  [40,42,45,44,47,48,50,51,53,52,55,56,57,58].map((v) => ({ v })),
];

function SparkMini({ data, color, type }: { data: { v: number }[]; color: string; type: 'area' | 'bar' | 'line' }) {
  const gId = React.useId().replace(/:/g, '');
  return (
    <div className="h-10 w-full">
      <ResponsiveContainer width="100%" height="100%">
        {type === 'area' ? (
          <AreaChart data={data} margin={{ top: 0, right: 2, left: 2, bottom: 0 }}>
            <defs>
              <linearGradient id={gId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={color} stopOpacity={0.5} />
                <stop offset="100%" stopColor={color} stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <Area type="monotone" dataKey="v" stroke={color} strokeWidth={2} fill={`url(#${gId})`} dot={false} isAnimationActive animationDuration={1200} />
          </AreaChart>
        ) : type === 'bar' ? (
          <BarChart data={data} margin={{ top: 2, right: 2, left: 2, bottom: 0 }}>
            <Bar dataKey="v" fill={color} radius={[2,2,0,0]} opacity={0.8} isAnimationActive animationDuration={1000} />
          </BarChart>
        ) : (
          <LineChart data={data} margin={{ top: 2, right: 2, left: 2, bottom: 0 }}>
            <Line type="monotone" dataKey="v" stroke={color} strokeWidth={2} dot={false} isAnimationActive animationDuration={1400} />
          </LineChart>
        )}
      </ResponsiveContainer>
    </div>
  );
}

function KpiCard({ cfg, idx }: { cfg: KpiConfig; idx: number }) {
  const kpis = useAnalyticsStore((s) => s.snapshot.kpis);
  const value = kpis[cfg.key] as number;
  const change = kpis[cfg.changeKey] as number;
  const isUp = cfg.invertTrend ? change < 0 : change > 0;
  const Icon = cfg.icon;
  const TrendIcon = isUp ? ArrowUpRight : ArrowDownRight;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.45, delay: 0.08 + idx * 0.06, ease: [0.22, 1, 0.36, 1] }}
    >
      <GlassCard glow={cfg.glow} interactive padded={false}>
        <div className="p-5 space-y-3 relative overflow-hidden">
          {/* ambient glow */}
          <div className="absolute -top-10 -right-10 w-28 h-28 rounded-full blur-2xl opacity-30" style={{ background: cfg.color }} />

          <div className="relative flex items-start justify-between">
            <div className={cn('p-2.5 rounded-2xl border bg-gradient-to-br', cfg.bg)}>
              <Icon className="w-4 h-4" />
            </div>
            <span className={cn(
              'inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[11px] font-mono font-bold',
              isUp
                ? 'bg-ai-emerald/10 text-ai-emerald border border-ai-emerald/25'
                : 'bg-red-500/10 text-red-400 border border-red-500/25'
            )}>
              <TrendIcon className="w-3 h-3" />
              {Math.abs(change).toFixed(1)}%
            </span>
          </div>

          <div className="relative">
            <p className="text-[10.5px] font-mono uppercase tracking-[0.14em] text-muted-foreground mb-0.5">{cfg.label}</p>
            <p className="font-heading font-extrabold text-[22px] tracking-tight text-foreground">
              <AnimatedCounter value={value} prefix={cfg.prefix} suffix={cfg.suffix} decimals={cfg.decimals ?? 0} />
            </p>
          </div>

          <SparkMini data={SPARKLINES[idx]} color={cfg.color} type={cfg.chartType} />
        </div>
      </GlassCard>
    </motion.div>
  );
}

export function AnalyticsKpiGrid() {
  return (
    <section className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 xl:grid-cols-8 gap-4">
      {KPI_CONFIGS.map((cfg, idx) => (
        <KpiCard key={cfg.key} cfg={cfg} idx={idx} />
      ))}
    </section>
  );
}
