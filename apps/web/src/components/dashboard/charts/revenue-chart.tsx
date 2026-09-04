'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { ChevronDown, TrendingUp, Calendar, Zap } from 'lucide-react';
import { GlassCard, CardHeader } from '../shared';
import { useDashboardSlice } from '@/lib/dashboard/hooks';

const formatter = (n: number) => `₹ ${(n / 1000).toFixed(0)}K`;

function CustomTooltip({ active, payload, label }: {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;

  const total = payload.reduce((s, p) => s + p.value, 0);
  const aiPercentage = payload.find(p => p.name === 'AI-assisted')?.value || 0;
  const aiShare = total > 0 ? ((aiPercentage / total) * 100).toFixed(1) : '0';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: 10 }}
      transition={{ duration: 0.2 }}
      className="rounded-2xl border border-white/10 bg-obsidian-900/95 backdrop-blur-xl px-5 py-4 shadow-2xl"
    >
      <div className="flex items-center justify-between mb-3">
        <p className="text-[11px] font-mono uppercase tracking-[0.14em] text-muted-foreground">{label}</p>
        <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-ai-cyan/10 text-ai-cyan border border-ai-cyan/20">
          <Zap className="w-3 h-3" strokeWidth={2.5} />
          <span className="text-[10px] font-bold">{aiShare}% AI</span>
        </div>
      </div>
      <div className="space-y-2">
        {payload.map((entry, idx) => (
          <motion.div
            key={entry.name}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="flex items-center justify-between gap-6"
          >
            <div className="flex items-center gap-2">
              <motion.span
                className="inline-block w-2 h-2 rounded-full shadow-lg"
                style={{
                  backgroundColor: entry.color,
                  boxShadow: `0 0 12px ${entry.color}80`
                }}
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.6, repeat: Infinity }}
              />
              <span className="text-[12.5px] text-muted-foreground capitalize">{entry.name}</span>
            </div>
            <span className="text-[12.5px] font-semibold text-foreground tabular-nums">
              {formatter(entry.value)}
            </span>
          </motion.div>
        ))}
      </div>
      <div className="mt-3 pt-3 border-t border-white/10">
        <div className="flex items-center justify-between gap-6">
          <span className="text-[12px] text-muted-foreground font-medium">Total Revenue</span>
          <span className="text-[13px] font-bold text-foreground tabular-nums">
            {formatter(total)}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

export function RevenueChart() {
  const { data: revenueData = [] } = useDashboardSlice('revenue');
  const gradientTotalId = React.useId().replace(/:/g, '');
  const gradientAiId = React.useId().replace(/:/g, '');
  const [timeRange, setTimeRange] = React.useState('week');

  const timeRanges = [
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'quarter', label: 'This Quarter' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.14, ease: [0.22, 1, 0.36, 1] }}
      className="lg:col-span-2"
    >
      <GlassCard glow="brand">
        <CardHeader
          title="Revenue Overview"
          subtitle="Weekly performance split by AI-assisted vs organic purchases"
          action={
            <div className="flex items-center gap-2">
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setTimeRange(timeRange === 'week' ? 'month' : 'week')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[12px] font-semibold border border-border/60 dark:border-white/10 bg-background/60 dark:bg-obsidian-950/60 text-foreground hover:border-brand-500/40 transition-all hover:shadow-lg hover:shadow-brand-500/10"
                >
                  <Calendar className="w-3.5 h-3.5" strokeWidth={2} />
                  <span>{timeRanges.find(t => t.value === timeRange)?.label}</span>
                  <ChevronDown className="w-3.5 h-3.5" strokeWidth={2} />
                </button>
              </div>
              <motion.button
                type="button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[12px] font-semibold bg-gradient-to-r from-brand-600 to-ai-violet text-white shadow-lg shadow-brand-500/20 hover:shadow-xl hover:shadow-brand-500/30 transition-all"
              >
                <TrendingUp className="w-3.5 h-3.5" strokeWidth={2.1} />
                +18.2%
              </motion.button>
            </div>
          }
        />

        <div className="h-[340px] sm:h-[380px] -mx-2 relative">
          {/* Subtle grid pattern background */}
          <div className="absolute inset-0 bg-grid-white opacity-[0.02] pointer-events-none" />

          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={revenueData} margin={{ top: 10, right: 8, left: -8, bottom: 0 }}>
              <defs>
                <linearGradient id={gradientTotalId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366F1" stopOpacity={0.45} />
                  <stop offset="50%" stopColor="#8B5CF6" stopOpacity={0.18} />
                  <stop offset="100%" stopColor="#8B5CF6" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id={gradientAiId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#06B6D4" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#06B6D4" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="4 6"
                stroke="rgba(255,255,255,0.06)"
                vertical={false}
              />
              <XAxis
                dataKey="day"
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'rgba(148,163,184,0.75)', fontSize: 11, fontFamily: 'monospace' }}
                dy={8}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'rgba(148,163,184,0.6)', fontSize: 11, fontFamily: 'monospace' }}
                tickFormatter={(n) => `${(n / 1000).toFixed(0)}K`}
                width={48}
              />
              <Tooltip
                content={<CustomTooltip />}
                cursor={{
                  stroke: 'rgba(99,102,241,0.3)',
                  strokeWidth: 1,
                  strokeDasharray: '3 3'
                }}
                animationDuration={200}
              />
              <Legend
                iconType="circle"
                iconSize={8}
                wrapperStyle={{ paddingTop: 12, fontSize: 12 }}
                formatter={(value: string) => (
                  <motion.span
                    className="text-[12px] text-muted-foreground cursor-pointer hover:text-foreground transition-colors"
                    whileHover={{ scale: 1.05 }}
                  >
                    {value}
                  </motion.span>
                )}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                name="Total"
                stroke="#6366F1"
                strokeWidth={2.8}
                fill={`url(#${gradientTotalId})`}
                isAnimationActive
                animationDuration={1200}
                animationEasing="ease-out"
                dot={{ r: 0, strokeWidth: 0 }}
                activeDot={{
                  r: 6,
                  fill: '#6366F1',
                  stroke: '#0F1117',
                  strokeWidth: 2,
                  style: { filter: 'drop-shadow(0 0 8px rgba(99,102,241,0.6))' }
                }}
              />
              <Area
                type="monotone"
                dataKey="ai"
                name="AI-assisted"
                stroke="#06B6D4"
                strokeWidth={2.2}
                fill={`url(#${gradientAiId})`}
                isAnimationActive
                animationDuration={1400}
                animationEasing="ease-out"
                dot={{ r: 0 }}
                activeDot={{
                  r: 5,
                  fill: '#06B6D4',
                  stroke: '#0F1117',
                  strokeWidth: 2,
                  style: { filter: 'drop-shadow(0 0 8px rgba(6,182,212,0.6))' }
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </GlassCard>
    </motion.div>
  );
}
