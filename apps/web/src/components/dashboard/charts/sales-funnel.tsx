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
import { Users, ShoppingBag, Search, Eye, ArrowRight, CheckCircle } from 'lucide-react';
import { GlassCard, CardHeader } from '../shared';
import { cn } from '@/lib/utils';
import { useDashboardSlice } from '@/lib/dashboard/hooks';
import type { FunnelStep } from '@/lib/dashboard/types';

const funnelIcons: Record<
  FunnelStep['icon'],
  React.ComponentType<{ className?: string; strokeWidth?: number }>
> = {
  visitors: Users,
  viewed: Eye,
  searched: Search,
  cart: ShoppingBag,
  checkout: ArrowRight,
  purchase: CheckCircle,
};

const funnelColors = ['#6366F1', '#8B5CF6', '#06B6D4', '#10B981', '#F59E0B', '#34D399'];

export function SalesFunnel() {
  const { data: funnelData = [] } = useDashboardSlice('funnel');
  const chartData = funnelData.map((d) => ({ name: d.step, value: d.count }));
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.22, ease: [0.22, 1, 0.36, 1] }}
    >
      <GlassCard glow="violet">
        <CardHeader
          title="Sales Funnel"
          subtitle="End-to-end conversion journey with AI optimization"
        />
        <div className="space-y-4 mb-5">
          {funnelData.map((step, i) => {
            const Icon = funnelIcons[step.icon];
            return (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.35, delay: 0.28 + i * 0.06, ease: [0.22, 1, 0.36, 1] }}
                className="group relative"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      'relative shrink-0 p-2 rounded-xl border bg-gradient-to-br',
                      step.tone,
                    )}
                    style={{ boxShadow: `0 0 18px -4px ${step.glow}` }}
                  >
                    <Icon className="w-4 h-4" strokeWidth={2.1} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="text-[12.5px] font-semibold text-foreground truncate">{step.step}</span>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-[12px] font-bold text-foreground tabular-nums">
                          {step.count.toLocaleString('en-IN')}
                        </span>
                        <span className="text-[11px] font-mono text-muted-foreground">
                          {step.rate.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                    <div className="h-2 rounded-full bg-border/40 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${step.rate}%` }}
                        transition={{ duration: 0.9, delay: 0.34 + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                        className="h-full rounded-full"
                        style={{
                          background: `linear-gradient(90deg, ${funnelColors[i]} 0%, ${funnelColors[(i + 1) % funnelColors.length]} 100%)`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
        <div className="h-[180px] -mx-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} layout="vertical" margin={{ top: 4, right: 8, left: -8, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 5" stroke="rgba(255,255,255,0.05)" horizontal={false} />
              <XAxis type="number" hide />
              <YAxis
                type="category"
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'rgba(148,163,184,0)', fontSize: 0 }}
                width={0}
              />
              <Tooltip
                cursor={{ fill: 'rgba(99,102,241,0.06)' }}
                content={({ active, payload }) => {
                  if (!active || !payload?.length) return null;
                  const p = payload[0];
                  return (
                    <div className="rounded-xl border border-white/10 bg-obsidian-900/95 backdrop-blur-xl px-4 py-2.5 shadow-2xl">
                      <p className="text-[12px] font-semibold text-foreground">
                        {p.payload.name}
                      </p>
                      <p className="text-[13px] font-bold text-brand-400 tabular-nums mt-0.5">
                        {Number(p.value).toLocaleString('en-IN')}
                      </p>
                    </div>
                  );
                }}
              />
              <Bar dataKey="value" radius={[0, 8, 8, 0]} isAnimationActive animationDuration={1200}>
                {chartData.map((_, i) => (
                  <Cell key={i} fill={funnelColors[i]} fillOpacity={0.75} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </GlassCard>
    </motion.div>
  );
}
