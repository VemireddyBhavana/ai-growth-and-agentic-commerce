'use client';

import * as React from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';
import {
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  ShoppingCart,
  Percent,
  Banknote,
  MessageSquare,
  TrendingUp,
  Sparkles,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  BarChart,
  Bar,
} from 'recharts';
import { cn } from '@/lib/utils';
import { AnimatedCounter, GlassCard } from '../shared';
import { useDashboardSlice } from '@/lib/dashboard/hooks';
import type { KpiMetric } from '@/lib/dashboard/types';

const iconMap: Record<
  KpiMetric['icon'],
  React.ComponentType<{ className?: string; strokeWidth?: number }>
> = {
  revenue: DollarSign,
  orders: ShoppingCart,
  conversion: Percent,
  aov: Banknote,
  conversations: MessageSquare,
  growth: TrendingUp,
};

const sparkColors: Record<KpiMetric['glow'], string> = {
  brand: '#6366F1',
  violet: '#8B5CF6',
  cyan: '#06B6D4',
  emerald: '#10B981',
};

function MiniSparkline({
  data,
  color,
  type,
}: {
  data: { v: number }[];
  color: string;
  type: 'area' | 'line' | 'bar';
}) {
  const gradientId = React.useId().replace(/:/g, '');
  return (
    <div className="h-12 w-full -mx-1">
      <ResponsiveContainer width="100%" height="100%">
        {type === 'area' ? (
          <AreaChart data={data} margin={{ top: 0, right: 4, left: 4, bottom: 0 }}>
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={color} stopOpacity={0.55} />
                <stop offset="100%" stopColor={color} stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <Area
              type="monotone"
              dataKey="v"
              stroke={color}
              strokeWidth={2}
              fill={`url(#${gradientId})`}
              isAnimationActive
              animationDuration={1200}
              animationEasing="ease-out"
            />
          </AreaChart>
        ) : type === 'bar' ? (
          <BarChart data={data} margin={{ top: 4, right: 4, left: 4, bottom: 0 }}>
            <Bar
              dataKey="v"
              fill={color}
              radius={[3, 3, 0, 0]}
              opacity={0.85}
              isAnimationActive
              animationDuration={1000}
              animationEasing="ease-out"
            />
          </BarChart>
        ) : (
          <LineChart data={data} margin={{ top: 2, right: 4, left: 4, bottom: 0 }}>
            <Line
              type="monotone"
              dataKey="v"
              stroke={color}
              strokeWidth={2.2}
              dot={false}
              isAnimationActive
              animationDuration={1400}
              animationEasing="ease-out"
            />
          </LineChart>
        )}
      </ResponsiveContainer>
    </div>
  );
}

function TrendBadge({ value, up }: { value: number; up: boolean }) {
  const Icon = up ? ArrowUpRight : ArrowDownRight;
  const spring = useSpring(0, { stiffness: 300, damping: 20 });
  const scale = useTransform(spring, [0, 1], [0.8, 1]);
  const opacity = useTransform(spring, [0, 1], [0, 1]);

  React.useEffect(() => {
    spring.set(1);
  }, [spring]);

  return (
    <motion.span
      style={{ scale, opacity }}
      className={cn(
        'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-mono font-bold backdrop-blur-sm',
        up
          ? 'bg-ai-emerald/12 text-ai-emerald border border-ai-emerald/25 shadow-[0_0_20px_-4px_rgba(16,185,129,0.3)]'
          : 'bg-red-500/12 text-red-600 dark:text-red-400 border border-red-500/25 shadow-[0_0_20px_-4px_rgba(239,68,68,0.3)]',
      )}
    >
      <Icon className="w-3 h-3" strokeWidth={2.5} />
      {value.toFixed(1)}%
    </motion.span>
  );
}

export { TrendBadge };

function PremiumKpiCard({ kpi, idx }: { kpi: KpiMetric; idx: number }) {
  const Icon = (kpi?.icon && iconMap[kpi.icon]) || TrendingUp;
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.5,
        delay: 0.1 + idx * 0.08,
        ease: [0.22, 1, 0.36, 1]
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <GlassCard glow={kpi.glow} interactive padded={false}>
        <motion.div
          className="p-5 space-y-4 relative overflow-hidden"
          animate={{
            background: isHovered ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0)',
          }}
          transition={{ duration: 0.3 }}
        >
          {/* Premium glow effect on hover */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0"
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          />

          <div className="relative flex items-start justify-between gap-3">
            <motion.div
              className={cn('relative p-2.5 rounded-2xl border bg-gradient-to-br', kpi.tone)}
              whileHover={{ scale: 1.05, rotate: [0, -5, 5, 0] }}
              transition={{ duration: 0.4 }}
            >
              <motion.div
                className="absolute inset-0 rounded-2xl bg-white/20 blur-xl opacity-0"
                animate={{ opacity: isHovered ? 0.6 : 0 }}
                transition={{ duration: 0.3 }}
              />
              <Icon className="w-5 h-5 relative z-10" strokeWidth={2.1} />
            </motion.div>
            <TrendBadge value={kpi.trend} up={kpi.trendUp} />
          </div>

          <div className="relative space-y-1">
            <p className="text-[11px] font-mono uppercase tracking-[0.14em] text-muted-foreground flex items-center gap-2">
              {kpi.label}
              {kpi.trendUp && kpi.trend > 15 && (
                <motion.span
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-ai-emerald/10 text-ai-emerald border border-ai-emerald/20"
                >
                  <Sparkles className="w-2.5 h-2.5" strokeWidth={2.5} />
                  <span className="text-[8px] font-bold">HOT</span>
                </motion.span>
              )}
            </p>
            <p className="font-heading font-extrabold text-2xl tracking-tight text-foreground">
              <AnimatedCounter
                value={kpi.value}
                prefix={kpi.prefix}
                suffix={kpi.suffix}
                decimals={kpi.decimals ?? 0}
              />
            </p>
          </div>

          <div className="relative">
            <MiniSparkline
              data={kpi?.sparkline || []}
              color={(kpi?.glow && sparkColors[kpi.glow]) || '#6366F1'}
              type={kpi?.chartType || 'area'}
            />
            {/* Subtle grid pattern overlay */}
            <div className="absolute inset-0 bg-grid-white opacity-[0.03] pointer-events-none" />
          </div>
        </motion.div>
      </GlassCard>
    </motion.div>
  );
}

export function KpiStats() {
  const { data: kpis = [] } = useDashboardSlice('kpis');

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.06, ease: [0.22, 1, 0.36, 1] }}
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6 gap-4"
    >
      {kpis.map((kpi, idx) => (
        <PremiumKpiCard key={kpi.key} kpi={kpi} idx={idx} />
      ))}
    </motion.section>
  );
}

type SectionHeaderProps = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  className?: string;
};

export function SectionHeader({ eyebrow, title, subtitle, action, className }: SectionHeaderProps) {
  return (
    <div className={cn('flex items-end justify-between gap-4 flex-wrap', className)}>
      <div className="space-y-1">
        {eyebrow && (
          <motion.p
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-[10.5px] font-mono font-bold uppercase tracking-[0.18em] text-muted-foreground mb-1.5"
          >
            {eyebrow}
          </motion.p>
        )}
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="font-heading font-extrabold text-xl sm:text-2xl tracking-tight text-foreground"
        >
          {title}
        </motion.h2>
        {subtitle && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-[13px] text-muted-foreground mt-1 max-w-2xl"
          >
            {subtitle}
          </motion.p>
        )}
      </div>
      {action && (
        <motion.div
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15 }}
        >
          {action}
        </motion.div>
      )}
    </div>
  );
}
