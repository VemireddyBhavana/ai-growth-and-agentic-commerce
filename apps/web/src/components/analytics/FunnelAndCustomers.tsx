'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Users, UserPlus, ShoppingCart, TrendingUp, ArrowDownRight } from 'lucide-react';
import {
  ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from 'recharts';
import { GlassCard, CardHeader } from '@/components/dashboard/shared/glass-card';
import { AnimatedCounter } from '@/components/dashboard/shared/animated-counter';
import { useAnalyticsStore } from '@/stores/analyticsStore';

// ── Funnel ───────────────────────────────────────

export function ConversionFunnel() {
  const funnel = useAnalyticsStore((s) => s.snapshot.funnel);

  return (
    <GlassCard glow="violet" padded={false}>
      <div className="p-5 sm:p-6">
        <CardHeader title="Conversion Funnel" subtitle="Where customers drop off in the journey" />
        <div className="space-y-2 mt-4">
          {funnel.map((stage, idx) => {
            const widthPct = (stage.count / funnel[0].count) * 100;
            return (
              <motion.div
                key={stage.label}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.08, duration: 0.4 }}
                className="group"
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-mono text-muted-foreground">{stage.label}</span>
                  <div className="flex gap-3 text-xs font-mono">
                    <span className="text-foreground font-bold">{stage.count.toLocaleString('en-IN')}</span>
                    {idx > 0 && (
                      <span className="text-ai-emerald flex items-center gap-0.5">
                        {stage.pct.toFixed(1)}%
                      </span>
                    )}
                  </div>
                </div>
                <div className="h-7 bg-obsidian-800/60 rounded-lg overflow-hidden relative">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${widthPct}%` }}
                    transition={{ duration: 0.7, delay: 0.1 + idx * 0.08, ease: [0.22, 1, 0.36, 1] }}
                    className="h-full rounded-lg relative"
                    style={{
                      background: `linear-gradient(90deg, ${idx === 0 ? '#6366F1' : idx === 1 ? '#8B5CF6' : idx === 2 ? '#06B6D4' : idx === 3 ? '#10B981' : idx === 4 ? '#F59E0B' : '#EF4444'}, transparent)`,
                      opacity: 1 - idx * 0.08,
                    }}
                  />
                  {idx > 0 && (
                    <div className="absolute inset-y-0 right-2 flex items-center">
                      <span className="text-[10px] font-mono text-white/40 flex items-center gap-0.5">
                        <ArrowDownRight className="w-2.5 h-2.5 text-red-400" />
                        {(100 - stage.pct).toFixed(1)}% drop
                      </span>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </GlassCard>
  );
}

// ── Customer Insights ───────────────────────────

export function CustomerInsightsChart() {
  const { snapshot } = useAnalyticsStore();
  const { returningCustomers, newCustomers, customerSegments } = snapshot;

  const pieData = [
    { name: 'Returning', value: returningCustomers, color: '#6366F1' },
    { name: 'New',       value: newCustomers,       color: '#10B981' },
  ];

  return (
    <GlassCard glow="emerald" padded={false}>
      <div className="p-5 sm:p-6">
        <CardHeader title="Customer Insights" subtitle="Returning vs new customer mix" />

        <div className="grid grid-cols-2 gap-4 mt-2 mb-6">
          {[
            { icon: Users,     label: 'Returning', value: returningCustomers, color: 'text-brand-400' },
            { icon: UserPlus,  label: 'New',       value: newCustomers,       color: 'text-ai-emerald' },
          ].map(({ icon: Icon, label, value, color }) => (
            <div key={label} className="bg-obsidian-800/40 rounded-xl p-3 text-center">
              <Icon className={`w-5 h-5 mx-auto mb-1.5 ${color}`} />
              <p className={`font-heading font-bold text-xl ${color}`}>
                <AnimatedCounter value={value} />
              </p>
              <p className="text-[11px] text-muted-foreground font-mono">{label}</p>
            </div>
          ))}
        </div>

        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie data={pieData} cx="50%" cy="50%" outerRadius={80} innerRadius={50} paddingAngle={4} dataKey="value" isAnimationActive animationDuration={900}>
              {pieData.map((entry) => (
                <Cell key={entry.name} fill={entry.color} opacity={0.85} />
              ))}
            </Pie>
            <Tooltip formatter={(v: any, name: any) => [v.toLocaleString(), name]} contentStyle={{ background: 'rgba(15,17,23,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12 }} />
            <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12, fontFamily: 'monospace' }} />
          </PieChart>
        </ResponsiveContainer>

        <div className="mt-4 space-y-2">
          <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-2">Customer Segments</p>
          {customerSegments.map((seg) => (
            <div key={seg.label} className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full shrink-0" style={{ background: seg.color }} />
              <div className="flex-1 min-w-0">
                <div className="flex justify-between mb-0.5">
                  <span className="text-xs text-foreground/80 truncate">{seg.label}</span>
                  <span className="text-xs font-mono text-muted-foreground ml-2">{seg.pct}%</span>
                </div>
                <div className="h-1.5 bg-obsidian-800/60 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${seg.pct}%` }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    className="h-full rounded-full"
                    style={{ background: seg.color }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </GlassCard>
  );
}
