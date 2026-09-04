'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { BrainCircuit } from 'lucide-react';
import {
  ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis,
  PolarRadiusAxis, Tooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from 'recharts';
import { GlassCard, CardHeader } from '@/components/dashboard/shared/glass-card';
import { AnimatedCounter } from '@/components/dashboard/shared/animated-counter';
import { useAnalyticsStore } from '@/stores/analyticsStore';

const RADAR_DATA = [
  { metric: 'Accuracy',  value: 83 },
  { metric: 'Speed',     value: 91 },
  { metric: 'Relevance', value: 78 },
  { metric: 'Diversity', value: 70 },
  { metric: 'Personalization', value: 86 },
  { metric: 'Lift',      value: 88 },
];

export function AIPerformancePanel() {
  const aiPerformance = useAnalyticsStore((s) => s.snapshot.aiPerformance);

  const barData = [
    { label: 'Generated', value: 24520, fill: '#6366F1' },
    { label: 'Accepted',  value: 19550, fill: '#10B981' },
    { label: 'Rejected',  value: 4970,  fill: '#EF4444' },
  ];

  return (
    <GlassCard glow="violet" padded={false}>
      <div className="p-5 sm:p-6">
        <div className="flex items-center gap-2.5 mb-5">
          <div className="w-9 h-9 rounded-xl bg-ai-violet/15 flex items-center justify-center">
            <BrainCircuit className="w-5 h-5 text-ai-violet" />
          </div>
          <div>
            <h3 className="font-heading font-bold text-base text-foreground">AI Performance</h3>
            <p className="text-[12px] text-muted-foreground">Recommendations, accuracy & response time</p>
          </div>
        </div>

        {/* metric pills */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {aiPerformance.map((m, idx) => (
            <motion.div
              key={m.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.06 }}
              className="bg-obsidian-800/50 rounded-xl p-3 text-center border border-white/5"
            >
              <div className="w-2 h-2 rounded-full mx-auto mb-1.5" style={{ background: m.color }} />
              <p className="font-heading font-bold text-lg text-foreground">
                <AnimatedCounter value={m.value} suffix={m.suffix} prefix={m.prefix} decimals={m.decimals ?? 0} />
              </p>
              <p className="text-[10px] text-muted-foreground font-mono leading-tight mt-0.5">{m.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Rec bar */}
        <ResponsiveContainer width="100%" height={130}>
          <BarChart data={barData} margin={{ top: 0, right: 8, left: 0, bottom: 0 }} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" horizontal={false} />
            <XAxis type="number" tick={{ fill: '#64748b', fontSize: 10, fontFamily: 'monospace' }} axisLine={false} tickLine={false} tickFormatter={(v) => (v / 1000).toFixed(0) + 'K'} />
            <YAxis dataKey="label" type="category" tick={{ fill: '#94a3b8', fontSize: 11, fontFamily: 'monospace' }} axisLine={false} tickLine={false} width={60} />
            <Tooltip
              formatter={(v: any) => [v.toLocaleString('en-IN'), 'Count']}
              contentStyle={{ background: 'rgba(15,17,23,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, fontSize: 12 }}
            />
            {barData.map((d) => (
              <Bar key={d.label} dataKey="value" fill={d.fill} radius={[0, 6, 6, 0]} isAnimationActive animationDuration={900} />
            ))}
          </BarChart>
        </ResponsiveContainer>

        {/* radar */}
        <div className="mt-4">
          <p className="text-[10.5px] font-mono text-muted-foreground uppercase tracking-wider mb-2">AI Quality Radar</p>
          <ResponsiveContainer width="100%" height={220}>
            <RadarChart data={RADAR_DATA} cx="50%" cy="50%" outerRadius={80}>
              <PolarGrid stroke="rgba(255,255,255,0.06)" />
              <PolarAngleAxis dataKey="metric" tick={{ fill: '#64748b', fontSize: 10, fontFamily: 'monospace' }} />
              <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
              <Radar name="AI Score" dataKey="value" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.25} strokeWidth={2} isAnimationActive animationDuration={1000} />
              <Tooltip
                formatter={(v: any) => [`${v}%`, 'Score']}
                contentStyle={{ background: 'rgba(15,17,23,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, fontSize: 12 }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </GlassCard>
  );
}
