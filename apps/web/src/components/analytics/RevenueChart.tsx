'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend,
} from 'recharts';
import { GlassCard, CardHeader } from '@/components/dashboard/shared/glass-card';
import { useAnalyticsStore } from '@/stores/analyticsStore';
import type { DateRange } from '@/types/analytics';
import { cn } from '@/lib/utils';

const RANGES: { label: string; value: DateRange }[] = [
  { label: '7D', value: '7d' },
  { label: '30D', value: '30d' },
  { label: '90D', value: '90d' },
  { label: '1Y', value: '1y' },
];

const SERIES = [
  { key: 'revenue', label: 'Revenue', color: '#6366F1', prefix: '₹' },
  { key: 'orders',  label: 'Orders',  color: '#06B6D4', prefix: '' },
  { key: 'profit',  label: 'Profit',  color: '#10B981', prefix: '₹' },
];

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-panel rounded-xl px-4 py-3 text-sm shadow-2xl min-w-[180px]">
      <p className="text-muted-foreground mb-2 font-mono text-xs">{label}</p>
      {payload.map((p: any) => (
        <div key={p.dataKey} className="flex items-center justify-between gap-4 mb-1">
          <span className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full" style={{ background: p.color }} />
            <span className="text-foreground/70 capitalize">{p.dataKey}</span>
          </span>
          <span className="font-mono font-bold text-foreground">
            {p.dataKey !== 'orders' ? '₹' : ''}{p.value.toLocaleString('en-IN')}
          </span>
        </div>
      ))}
    </div>
  );
}

export function RevenueChart() {
  const { snapshot, dateRange, setDateRange } = useAnalyticsStore();
  const data = snapshot.revenue;

  return (
    <GlassCard glow="brand" padded={false}>
      <div className="p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <CardHeader
            title="Revenue Analytics"
            subtitle="Revenue, orders & profit over time"
          />
          <div className="flex gap-1.5 bg-obsidian-800/60 p-1 rounded-xl">
            {RANGES.map((r) => (
              <button
                key={r.value}
                onClick={() => setDateRange(r.value)}
                className={cn(
                  'px-3 py-1.5 text-xs font-mono font-bold rounded-lg transition-all duration-200',
                  dateRange === r.value
                    ? 'bg-brand-600 text-white shadow-md'
                    : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
                )}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={dateRange}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
          >
            <ResponsiveContainer width="100%" height={320}>
              <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <defs>
                  {SERIES.map((s) => (
                    <linearGradient key={s.key} id={`grad-${s.key}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%"   stopColor={s.color} stopOpacity={0.35} />
                      <stop offset="100%" stopColor={s.color} stopOpacity={0.02} />
                    </linearGradient>
                  ))}
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 11, fontFamily: 'monospace' }} axisLine={false} tickLine={false} interval="preserveStartEnd" />
                <YAxis tick={{ fill: '#64748b', fontSize: 11, fontFamily: 'monospace' }} axisLine={false} tickLine={false} tickFormatter={(v) => v >= 1000 ? `₹${(v/1000).toFixed(0)}K` : `${v}`} />
                <Tooltip content={<CustomTooltip />} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12, fontFamily: 'monospace', paddingTop: 12 }} />
                {SERIES.map((s) => (
                  <Area
                    key={s.key}
                    type="monotone"
                    dataKey={s.key}
                    name={s.label}
                    stroke={s.color}
                    strokeWidth={2.2}
                    fill={`url(#grad-${s.key})`}
                    dot={false}
                    isAnimationActive
                    animationDuration={900}
                    animationEasing="ease-out"
                  />
                ))}
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>
        </AnimatePresence>
      </div>
    </GlassCard>
  );
}
