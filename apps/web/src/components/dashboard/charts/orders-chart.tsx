'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from 'recharts';
import { ChevronDown } from 'lucide-react';
import { GlassCard, CardHeader } from '../shared';
import { useDashboardSlice } from '@/lib/dashboard/hooks';

function CustomTooltip({ active, payload, label }: {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-white/10 bg-obsidian-900/95 backdrop-blur-xl px-4 py-3 shadow-2xl">
      <p className="text-[11px] font-mono uppercase tracking-[0.14em] text-muted-foreground mb-2">{label}</p>
      <div className="space-y-1.5">
        {payload.map((entry) => (
          <div key={entry.name} className="flex items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-sm" style={{ backgroundColor: entry.color }} />
              <span className="text-[12.5px] text-muted-foreground capitalize">{entry.name}</span>
            </div>
            <span className="text-[12.5px] font-semibold text-foreground tabular-nums">{entry.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function OrdersChart() {
  const { data: ordersData = [] } = useDashboardSlice('orders');
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
    >
      <GlassCard glow="cyan">
        <CardHeader
          title="Orders by Status"
          subtitle="Daily breakdown across paid, pending, and refunds"
          action={
            <button
              type="button"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[12px] font-semibold border border-border/60 dark:border-white/10 bg-background/60 dark:bg-obsidian-950/60 text-foreground hover:border-brand-500/40 transition-colors"
            >
              <span>7D</span>
              <ChevronDown className="w-3.5 h-3.5" strokeWidth={2} />
            </button>
          }
        />
        <div className="h-[320px] sm:h-[360px] -mx-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={ordersData} margin={{ top: 10, right: 8, left: -8, bottom: 0 }} barGap={3}>
              <CartesianGrid strokeDasharray="4 6" stroke="rgba(255,255,255,0.06)" vertical={false} />
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
                width={38}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(99,102,241,0.06)' }} />
              <defs>
                <linearGradient id="paidGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10B981" />
                  <stop offset="100%" stopColor="#059669" />
                </linearGradient>
                <linearGradient id="pendingGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#F59E0B" />
                  <stop offset="100%" stopColor="#D97706" />
                </linearGradient>
                <linearGradient id="refundedGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#EF4444" stopOpacity={0.85} />
                  <stop offset="100%" stopColor="#DC2626" stopOpacity={0.85} />
                </linearGradient>
              </defs>
              <Bar dataKey="paid" name="Paid" radius={[6, 6, 0, 0]} isAnimationActive animationDuration={900}>
                {ordersData.map((_, i) => (
                  <Cell key={`paid-${i}`} fill="url(#paidGrad)" />
                ))}
              </Bar>
              <Bar dataKey="pending" name="Pending" radius={[6, 6, 0, 0]} isAnimationActive animationDuration={1100}>
                {ordersData.map((_, i) => (
                  <Cell key={`pending-${i}`} fill="url(#pendingGrad)" />
                ))}
              </Bar>
              <Bar dataKey="refunded" name="Refunded" radius={[6, 6, 0, 0]} isAnimationActive animationDuration={1300}>
                {ordersData.map((_, i) => (
                  <Cell key={`refunded-${i}`} fill="url(#refundedGrad)" />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="flex flex-wrap items-center gap-4 pt-2">
          {[
            { k: 'Paid', c: '#10B981', v: '1,328' },
            { k: 'Pending', c: '#F59E0B', v: '234' },
            { k: 'Refunded', c: '#EF4444', v: '78' },
          ].map((s) => (
            <div key={s.k} className="flex items-center gap-2">
              <span className="inline-block w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: s.c }} />
              <span className="text-[12px] text-muted-foreground">{s.k}</span>
              <span className="text-[12px] font-bold text-foreground tabular-nums">{s.v}</span>
            </div>
          ))}
        </div>
      </GlassCard>
    </motion.div>
  );
}
