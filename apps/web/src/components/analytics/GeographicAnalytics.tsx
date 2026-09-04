'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Globe, MapPin, Building2, TrendingUp } from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { GlassCard, CardHeader } from '@/components/dashboard/shared/glass-card';
import { AnimatedCounter } from '@/components/dashboard/shared/animated-counter';
import { useAnalyticsStore } from '@/stores/analyticsStore';
import { cn } from '@/lib/utils';

// ── Custom Tooltip ───────────────────────────────

function GeoTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-panel rounded-xl px-4 py-3 text-sm shadow-2xl min-w-[180px]">
      <p className="text-muted-foreground mb-2 font-mono text-xs">{label}</p>
      {payload.map((p: any) => (
        <div key={p.dataKey} className="flex items-center justify-between gap-4 mb-1">
          <span className="flex items-center gap-2">
            <span
              className="inline-block w-2 h-2 rounded-full"
              style={{ background: p.color }}
            />
            <span className="text-foreground/70 capitalize">{p.dataKey}</span>
          </span>
          <span className="font-mono font-bold text-foreground">
            {p.dataKey === 'orders'
              ? p.value.toLocaleString('en-IN')
              : `₹${(p.value / 100000).toFixed(1)}L`}
          </span>
        </div>
      ))}
    </div>
  );
}

// ── City Bar Colors ──────────────────────────────

const CITY_COLORS = [
  '#6366F1',
  '#8B5CF6',
  '#06B6D4',
  '#10B981',
  '#F59E0B',
  '#EC4899',
  '#EF4444',
  '#14B8A6',
];

// ── Geographic Analytics ─────────────────────────

export function GeographicAnalytics() {
  const geoData = useAnalyticsStore((s) => s.snapshot.geoData);

  // Aggregate by state
  const stateMap = React.useMemo(() => {
    const map = new Map<string, { revenue: number; orders: number }>();
    for (const g of geoData) {
      const existing = map.get(g.state) ?? { revenue: 0, orders: 0 };
      existing.revenue += g.revenue;
      existing.orders += g.orders;
      map.set(g.state, existing);
    }
    return Array.from(map.entries())
      .map(([state, data]) => ({ state, ...data }))
      .sort((a, b) => b.revenue - a.revenue);
  }, [geoData]);

  const totalRevenue = React.useMemo(
    () => geoData.reduce((sum, g) => sum + g.revenue, 0),
    [geoData],
  );

  const totalOrders = React.useMemo(
    () => geoData.reduce((sum, g) => sum + g.orders, 0),
    [geoData],
  );

  // Chart data
  const chartData = React.useMemo(
    () =>
      geoData.slice(0, 6).map((g) => ({
        city: g.city,
        revenue: g.revenue,
        orders: g.orders,
      })),
    [geoData],
  );

  return (
    <GlassCard glow="cyan" padded={false}>
      <div className="p-5 sm:p-6">
        {/* Header */}
        <div className="flex items-center gap-2.5 mb-5">
          <div className="w-9 h-9 rounded-xl bg-ai-cyan/15 flex items-center justify-center">
            <Globe className="w-5 h-5 text-ai-cyan" />
          </div>
          <div>
            <h3 className="font-heading font-bold text-base text-foreground">
              Geographic Analytics
            </h3>
            <p className="text-[12px] text-muted-foreground">
              Revenue distribution by region
            </p>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            {
              icon: MapPin,
              label: 'Cities',
              value: geoData.length,
              color: 'text-ai-cyan',
            },
            {
              icon: TrendingUp,
              label: 'Total Revenue',
              value: totalRevenue,
              prefix: '₹',
              color: 'text-brand-400',
              format: (n: number) =>
                `${(n / 100000).toFixed(1)}L`,
            },
            {
              icon: Building2,
              label: 'Total Orders',
              value: totalOrders,
              color: 'text-ai-emerald',
            },
          ].map(({ icon: Icon, label, value, color, prefix, format }) => (
            <div
              key={label}
              className="bg-obsidian-800/40 rounded-xl p-3 text-center"
            >
              <Icon className={cn('w-4 h-4 mx-auto mb-1', color)} />
              <p className={cn('font-heading font-bold text-base', color)}>
                {format ? (
                  format(value)
                ) : (
                  <AnimatedCounter value={value} prefix={prefix} />
                )}
              </p>
              <p className="text-[10px] text-muted-foreground font-mono">
                {label}
              </p>
            </div>
          ))}
        </div>

        {/* Bar Chart — Revenue by City */}
        <div className="mb-6">
          <p className="text-[10.5px] font-mono text-muted-foreground uppercase tracking-wider mb-3">
            Revenue by City
          </p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart
              data={chartData}
              margin={{ top: 0, right: 8, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="geoBarGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#06B6D4" stopOpacity={0.9} />
                  <stop offset="100%" stopColor="#06B6D4" stopOpacity={0.3} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(255,255,255,0.04)"
                vertical={false}
              />
              <XAxis
                dataKey="city"
                tick={{
                  fill: '#64748b',
                  fontSize: 10,
                  fontFamily: 'monospace',
                }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{
                  fill: '#64748b',
                  fontSize: 10,
                  fontFamily: 'monospace',
                }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `₹${(v / 100000).toFixed(0)}L`}
              />
              <Tooltip content={<GeoTooltip />} />
              <Bar
                dataKey="revenue"
                fill="url(#geoBarGrad)"
                radius={[6, 6, 0, 0]}
                isAnimationActive
                animationDuration={900}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Top Cities List */}
        <div className="space-y-2.5">
          <p className="text-[10.5px] font-mono text-muted-foreground uppercase tracking-wider mb-2">
            Top Cities by Revenue
          </p>
          {geoData.slice(0, 6).map((city, idx) => {
            const pct = (city.revenue / totalRevenue) * 100;
            const color = CITY_COLORS[idx % CITY_COLORS.length];
            return (
              <motion.div
                key={city.city}
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.07 }}
                className="flex items-center gap-3"
              >
                <span
                  className="w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-mono font-bold shrink-0"
                  style={{ background: color + '20', color }}
                >
                  {idx + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between mb-1">
                    <span className="text-xs text-foreground/80 truncate">
                      {city.city},{' '}
                      <span className="text-muted-foreground">
                        {city.state}
                      </span>
                    </span>
                    <span
                      className="text-xs font-mono font-bold ml-2 shrink-0"
                      style={{ color }}
                    >
                      ₹{(city.revenue / 100000).toFixed(1)}L
                    </span>
                  </div>
                  <div className="h-1.5 bg-obsidian-800/60 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{
                        duration: 0.8,
                        delay: 0.1 + idx * 0.07,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      className="h-full rounded-full"
                      style={{ background: color }}
                    />
                  </div>
                </div>
                <span className="text-[10px] font-mono text-muted-foreground shrink-0">
                  {city.orders.toLocaleString('en-IN')} orders
                </span>
              </motion.div>
            );
          })}
        </div>

        {/* Top States */}
        <div className="mt-6 space-y-2">
          <p className="text-[10.5px] font-mono text-muted-foreground uppercase tracking-wider mb-2">
            Top States
          </p>
          <div className="grid grid-cols-2 gap-2">
            {stateMap.slice(0, 4).map((s, idx) => (
              <motion.div
                key={s.state}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + idx * 0.08 }}
                className="bg-obsidian-800/40 rounded-xl p-3 border border-white/5"
              >
                <p className="text-[11px] font-medium text-foreground truncate">
                  {s.state}
                </p>
                <p className="text-sm font-heading font-bold text-ai-cyan mt-0.5">
                  ₹{(s.revenue / 100000).toFixed(1)}L
                </p>
                <p className="text-[10px] font-mono text-muted-foreground">
                  {s.orders.toLocaleString('en-IN')} orders
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </GlassCard>
  );
}
