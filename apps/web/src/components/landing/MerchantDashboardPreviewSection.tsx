'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  ShoppingBag, 
  Users, 
  CreditCard, 
  ArrowUpRight, 
  Sparkles, 
  Zap, 
  Layers, 
  CheckCircle2,
  Calendar,
  Filter,
  BarChart2,
  Activity,
  Bot
} from 'lucide-react';

const kpis = [
  {
    label: 'Total Revenue (GMV)',
    value: '₹18,42,900',
    change: '+28.4%',
    sublabel: 'vs. previous 30 days',
    isPositive: true,
  },
  {
    label: 'AI-Assisted Orders',
    value: '1,482',
    change: '+34.1%',
    sublabel: '68.4% of total catalog checkout',
    isPositive: true,
  },
  {
    label: 'Autonomous Conversion',
    value: '14.8%',
    change: '+4.2x',
    sublabel: 'Industry average: 3.1%',
    isPositive: true,
  },
  {
    label: 'Average Order Value (AOV)',
    value: '₹2,840',
    change: '+22.5%',
    sublabel: 'Boosted by dynamic bundles',
    isPositive: true,
  },
];

const liveEvents = [
  {
    time: '2m ago',
    event: 'Autonomous Dynamic Bundle Converted',
    details: 'Customer bought AeroStride Pro + Performance Socks',
    amount: '₹3,499',
    status: 'Settled via Razorpay',
  },
  {
    time: '6m ago',
    event: 'High-Intent Cart Restored',
    details: 'Conversational Concierge resolved sizing query',
    amount: '₹4,899',
    status: 'Settled via Razorpay',
  },
  {
    time: '14m ago',
    event: 'Vector Semantic Search Discovery',
    details: 'Customer query: "minimalist mechanical keyboard"',
    amount: '₹4,899',
    status: 'Settled via Razorpay',
  },
];

export function MerchantDashboardPreviewSection() {
  const [activeTab, setActiveTab] = React.useState<'30d' | '7d' | '24h'>('30d');
  const [campaignsActive, setCampaignsActive] = React.useState<boolean>(true);

  return (
    <section id="dashboard" className="py-28 relative overflow-hidden bg-secondary/15 dark:bg-obsidian-950/50 border-t border-border/40">
      {/* Background glow */}
      <div className="absolute top-1/2 right-10 w-[700px] h-[450px] bg-ai-emerald/10 dark:bg-ai-emerald/15 blur-[160px] rounded-full pointer-events-none -z-10" />

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-mono font-semibold uppercase tracking-wider mb-4">
            <TrendingUp className="w-3.5 h-3.5" />
            Merchant Intelligence Hub
          </div>
          <h2 className="font-heading font-extrabold text-3xl sm:text-4xl md:text-5xl text-foreground tracking-tight text-balance">
            Real-Time Telemetry &amp; Revenue Command Center
          </h2>
          <p className="mt-4 text-base sm:text-lg text-muted-foreground text-balance">
            Track live agent conversions, monitor autonomous bundling lift, review explainable AI reasoning metrics, and inspect tokenized Razorpay settlements in real time.
          </p>
        </div>

        {/* Master Dashboard Container */}
        <div className="mt-16 rounded-3xl bg-card dark:bg-obsidian-900 border border-border/80 p-6 sm:p-8 shadow-2xl backdrop-blur-2xl">
          {/* Top Control Bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-border/60">
            <div>
              <h3 className="font-heading font-bold text-2xl text-foreground flex items-center gap-2">
                Merchant Operations Console
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono bg-brand-500/15 text-brand-600 dark:text-brand-400 border border-brand-500/30">
                  Live Production
                </span>
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5 font-mono">
                Store ID: store_hyper_0982 &bull; Razorpay Integration: Connected
              </p>
            </div>

            {/* Timeframe Filters */}
            <div className="flex items-center gap-2 bg-secondary/80 dark:bg-obsidian-850 p-1 rounded-xl border border-border">
              {(['24h', '7d', '30d'] as const).map((period) => (
                <button
                  key={period}
                  onClick={() => setActiveTab(period)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all ${
                    activeTab === period
                      ? 'bg-brand-600 text-white shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {period === '24h' ? 'Last 24 Hours' : period === '7d' ? 'Last 7 Days' : 'Last 30 Days'}
                </button>
              ))}
            </div>
          </div>

          {/* 4 KPI Summary Cards */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {kpis.map((kpi, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-secondary/30 dark:bg-obsidian-850/70 border border-border/70 flex flex-col justify-between"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-muted-foreground font-mono">
                    {kpi.label}
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md">
                    {kpi.change}
                  </span>
                </div>
                <div className="mt-3">
                  <div className="text-2xl font-extrabold font-mono text-foreground tracking-tight">
                    {kpi.value}
                  </div>
                  <div className="text-[11px] text-muted-foreground mt-0.5">
                    {kpi.sublabel}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Chart & Live Activity Two-Column Layout */}
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: Revenue Curve Chart Canvas */}
            <div className="lg:col-span-7 p-6 rounded-2xl bg-secondary/20 dark:bg-obsidian-850/50 border border-border/70 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="text-sm font-bold font-heading text-foreground">
                    Autonomous Revenue Trajectory
                  </h4>
                  <span className="text-xs text-muted-foreground font-mono">
                    Blue = Total Revenue &bull; Green = AI Autonomous Lift
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-brand-500" />
                  <span className="text-xs text-muted-foreground font-mono">Baseline</span>
                  <span className="w-2.5 h-2.5 rounded-full bg-ai-emerald ml-2" />
                  <span className="text-xs text-muted-foreground font-mono">AI Boost (+38.4%)</span>
                </div>
              </div>

              {/* Dynamic SVG Mock Line Chart with glowing gradients */}
              <div className="relative h-56 w-full pt-4">
                <svg viewBox="0 0 500 180" className="w-full h-full overflow-visible">
                  <defs>
                    <linearGradient id="chart-emerald-grad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10B981" stopOpacity="0.35" />
                      <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
                    </linearGradient>
                    <linearGradient id="chart-brand-grad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#6366F1" stopOpacity="0.2" />
                      <stop offset="100%" stopColor="#6366F1" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  {/* Grid Lines */}
                  <line x1="0" y1="30" x2="500" y2="30" stroke="currentColor" strokeOpacity="0.08" strokeDasharray="3 3" />
                  <line x1="0" y1="80" x2="500" y2="80" stroke="currentColor" strokeOpacity="0.08" strokeDasharray="3 3" />
                  <line x1="0" y1="130" x2="500" y2="130" stroke="currentColor" strokeOpacity="0.08" strokeDasharray="3 3" />

                  {/* Baseline Area & Line */}
                  <path
                    d="M0 140 Q 70 120, 140 130 T 280 100 T 420 90 T 500 70 L 500 180 L 0 180 Z"
                    fill="url(#chart-brand-grad)"
                  />
                  <path
                    d="M0 140 Q 70 120, 140 130 T 280 100 T 420 90 T 500 70"
                    fill="none"
                    stroke="#6366F1"
                    strokeWidth="2.5"
                  />

                  {/* AI Lift Area & Line */}
                  <path
                    d="M0 120 Q 70 90, 140 85 T 280 50 T 420 30 T 500 15 L 500 180 L 0 180 Z"
                    fill="url(#chart-emerald-grad)"
                  />
                  <path
                    d="M0 120 Q 70 90, 140 85 T 280 50 T 420 30 T 500 15"
                    fill="none"
                    stroke="#10B981"
                    strokeWidth="3.5"
                  />

                  {/* Data Points */}
                  <circle cx="280" cy="50" r="5" fill="#10B981" className="animate-pulse" />
                  <circle cx="500" cy="15" r="5" fill="#10B981" />
                </svg>

                {/* Tooltip Simulation */}
                <div className="absolute top-8 right-24 p-2.5 rounded-xl bg-obsidian-950 text-white text-xs font-mono border border-emerald-500/40 shadow-xl pointer-events-none">
                  <div className="text-emerald-400 font-bold">Peak AI Lift: +₹3,84,000</div>
                  <div className="text-[10px] text-slate-400">Dynamic Bundling Conversion</div>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground font-mono border-t border-border/40 pt-3">
                <span>Week 1</span>
                <span>Week 2</span>
                <span>Week 3</span>
                <span>Week 4 (Current)</span>
              </div>
            </div>

            {/* Right: Live Agent Events & Campaign Health */}
            <div className="lg:col-span-5 space-y-4">
              {/* Campaign Health Toggle Box */}
              <div className="p-5 rounded-2xl bg-secondary/30 dark:bg-obsidian-850/60 border border-border/70">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Sparkles className="w-5 h-5 text-ai-violet" />
                    <div>
                      <h4 className="text-sm font-bold text-foreground font-heading">
                        Autonomous Bundling Agent
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        Auto-negotiates margin &amp; dynamic discounts
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setCampaignsActive(!campaignsActive)}
                    className={`w-11 h-6 rounded-full transition-colors relative flex items-center p-0.5 ${
                      campaignsActive ? 'bg-emerald-500' : 'bg-slate-600'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${
                        campaignsActive ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Live Real-time Activity Feed */}
              <div className="p-5 rounded-2xl bg-secondary/30 dark:bg-obsidian-850/60 border border-border/70">
                <div className="flex items-center justify-between pb-3 border-b border-border/50 mb-3">
                  <h4 className="text-xs font-mono uppercase font-bold text-muted-foreground flex items-center gap-2">
                    <Activity className="w-3.5 h-3.5 text-ai-cyan" />
                    Live Conversion Telemetry
                  </h4>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                </div>

                <div className="space-y-3">
                  {liveEvents.map((evt, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-card dark:bg-obsidian-900 border border-border/60 text-left space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-foreground">
                          {evt.event}
                        </span>
                        <span className="text-xs font-bold font-mono text-emerald-500">
                          {evt.amount}
                        </span>
                      </div>
                      <p className="text-[11px] text-muted-foreground leading-snug">
                        {evt.details}
                      </p>
                      <div className="flex items-center justify-between pt-1 text-[10px] font-mono text-muted-foreground">
                        <span className="flex items-center gap-1 text-emerald-500">
                          <CheckCircle2 className="w-3 h-3" />
                          {evt.status}
                        </span>
                        <span>{evt.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
