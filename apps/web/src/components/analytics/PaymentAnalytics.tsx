'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Smartphone, Wallet, Building2, CheckCircle, XCircle, RefreshCcw, ArrowDownLeft } from 'lucide-react';
import {
  ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend,
} from 'recharts';
import { GlassCard, CardHeader } from '@/components/dashboard/shared/glass-card';
import { AnimatedCounter } from '@/components/dashboard/shared/animated-counter';
import { useAnalyticsStore } from '@/stores/analyticsStore';

const METHOD_ICONS: Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>> = {
  'UPI':         Smartphone,
  'Cards':       CreditCard,
  'Wallets':     Wallet,
  'Net Banking': Building2,
};

export function PaymentAnalytics() {
  const { paymentBreakdown, paymentStats } = useAnalyticsStore((s) => s.snapshot);

  const statItems = [
    { icon: CheckCircle, label: 'Successful', value: paymentStats.successful, color: 'text-ai-emerald' },
    { icon: XCircle,     label: 'Failed',     value: paymentStats.failed,     color: 'text-red-400'    },
    { icon: RefreshCcw,  label: 'Retry Rate', value: paymentStats.retrySuccessRate, suffix: '%', decimals: 1, color: 'text-ai-cyan' },
    { icon: ArrowDownLeft,label:'Refunds',    value: paymentStats.refundRate,  suffix: '%', decimals: 1, color: 'text-amber-400' },
  ];

  return (
    <GlassCard glow="cyan" padded={false}>
      <div className="p-5 sm:p-6">
        <CardHeader title="Payment Analytics" subtitle="Methods, success & failure breakdown" />

        {/* stat strip */}
        <div className="grid grid-cols-4 gap-2 my-5">
          {statItems.map(({ icon: Icon, label, value, color, suffix, decimals }) => (
            <div key={label} className="bg-obsidian-800/40 rounded-xl p-2.5 text-center">
              <Icon className={`w-4 h-4 mx-auto mb-1 ${color}`} />
              <p className={`font-heading font-bold text-sm sm:text-base ${color}`}>
                <AnimatedCounter value={value} suffix={suffix} decimals={decimals ?? 0} />
              </p>
              <p className="text-[10px] text-muted-foreground font-mono leading-tight">{label}</p>
            </div>
          ))}
        </div>

        {/* pie */}
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={paymentBreakdown}
              cx="50%" cy="50%"
              outerRadius={82} innerRadius={50}
              paddingAngle={3}
              dataKey="pct"
              nameKey="method"
              isAnimationActive
              animationDuration={900}
            >
              {paymentBreakdown.map((entry) => (
                <Cell key={entry.method} fill={entry.color} opacity={0.88} />
              ))}
            </Pie>
            <Tooltip
              formatter={(v: any, name: any) => [`${v}%`, name]}
              contentStyle={{ background: 'rgba(15,17,23,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, fontSize: 12 }}
            />
            <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11, fontFamily: 'monospace' }} />
          </PieChart>
        </ResponsiveContainer>

        {/* method rows */}
        <div className="mt-4 space-y-2.5">
          {paymentBreakdown.map((m, idx) => {
            const Icon = METHOD_ICONS[m.method] ?? CreditCard;
            return (
              <motion.div
                key={m.method}
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.08 }}
                className="flex items-center gap-3"
              >
                <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{ background: m.color + '25' }}>
                  <Icon className="w-3.5 h-3.5" style={{ color: m.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between mb-1">
                    <span className="text-xs text-foreground/80">{m.method}</span>
                    <span className="text-xs font-mono font-bold" style={{ color: m.color }}>{m.pct}%</span>
                  </div>
                  <div className="h-1.5 bg-obsidian-800/60 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${m.pct}%` }}
                      transition={{ duration: 0.8, delay: 0.1 + idx * 0.08 }}
                      className="h-full rounded-full"
                      style={{ background: m.color }}
                    />
                  </div>
                </div>
                <span className="text-[11px] font-mono text-muted-foreground shrink-0">
                  ₹{(m.amount / 100000).toFixed(1)}L
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </GlassCard>
  );
}
