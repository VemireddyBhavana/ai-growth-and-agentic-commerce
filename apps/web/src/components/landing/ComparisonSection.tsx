'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { 
  XCircle, 
  CheckCircle2, 
  Sparkles, 
  Layers, 
  Zap, 
  ShieldCheck, 
  ArrowRight 
} from 'lucide-react';

const comparisonRows = [
  {
    dimension: 'Search & Product Discovery',
    traditional: 'Exact-match keyword search bars that fail on multi-attribute queries & typos.',
    aiSales: 'Sub-second neural vector search with natural language reasoning & semantic intent.',
  },
  {
    dimension: 'Personalization & Empathy',
    traditional: 'Generic demographic segments and stale cookie trackers with zero context.',
    aiSales: 'Live conversational empathy, budget awareness, and instant preference adaptation.',
  },
  {
    dimension: 'Cross-Selling & Upselling',
    traditional: 'Rigid static recommendation widgets ("Customers also bought...") with no margin logic.',
    aiSales: 'Dynamic bundle generation in real-time optimized for merchant gross margin and shopper affinity.',
  },
  {
    dimension: 'Checkout & Conversion Flow',
    traditional: '5-step friction funnels with 70%+ cart abandonment and redirect delays.',
    aiSales: '1-Click tokenized in-chat Razorpay payment links with zero friction.',
  },
  {
    dimension: '24/7 Availability & Scale',
    traditional: 'Limited human support hours, high payroll overhead, and slow queue response times.',
    aiSales: 'Autonomous 24/7 sub-450ms agentic response capacity handling unlimited concurrent shoppers.',
  },
  {
    dimension: 'Explainability & Governance',
    traditional: 'Black-box manual scripts with no audit trails or confidence scores.',
    aiSales: 'Transparent reasoning breakdowns, confidence score gates, and cryptographic audit ledgers.',
  },
];

export function ComparisonSection() {
  return (
    <section id="comparison" className="py-28 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-brand-600/10 dark:bg-brand-600/15 blur-[160px] rounded-full pointer-events-none -z-10" />

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-600 dark:text-brand-400 text-xs font-mono font-semibold uppercase tracking-wider mb-4">
            <Layers className="w-3.5 h-3.5" />
            Competitive Benchmark
          </div>
          <h2 className="font-heading font-extrabold text-3xl sm:text-4xl md:text-5xl text-foreground tracking-tight text-balance">
            Traditional Commerce vs. AI Sales Assistant
          </h2>
          <p className="mt-4 text-base sm:text-lg text-muted-foreground text-balance">
            See why high-growth merchants are replacing static storefronts with our autonomous agentic commerce stack.
          </p>
        </div>

        {/* Side-by-Side Comparison Container */}
        <div className="mt-16 max-w-5xl mx-auto rounded-3xl bg-card dark:bg-obsidian-900 border border-border/80 shadow-2xl backdrop-blur-2xl overflow-hidden">
          {/* Header Row */}
          <div className="grid grid-cols-1 md:grid-cols-12 border-b border-border/70 bg-secondary/30 dark:bg-obsidian-950/60 font-heading">
            <div className="md:col-span-4 p-5 text-sm font-bold text-muted-foreground uppercase tracking-wider font-mono">
              Dimension / Capability
            </div>
            <div className="md:col-span-4 p-5 text-sm font-bold text-rose-500/90 border-t md:border-t-0 md:border-l border-border/60 flex items-center gap-2">
              <XCircle className="w-4 h-4 text-rose-500" />
              Traditional E-Commerce
            </div>
            <div className="md:col-span-4 p-5 text-sm font-bold text-emerald-500 border-t md:border-t-0 md:border-l border-border/60 bg-emerald-500/5 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              AI Sales Assistant
            </div>
          </div>

          {/* Rows */}
          <div className="divide-y divide-border/50">
            {comparisonRows.map((row, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: idx * 0.05 }}
                className="grid grid-cols-1 md:grid-cols-12 hover:bg-secondary/20 transition-colors"
              >
                {/* Dimension Column */}
                <div className="md:col-span-4 p-5 flex items-center">
                  <span className="font-heading font-semibold text-sm sm:text-base text-foreground">
                    {row.dimension}
                  </span>
                </div>

                {/* Traditional Column */}
                <div className="md:col-span-4 p-5 md:border-l border-border/50 bg-secondary/5 dark:bg-obsidian-950/20 text-xs sm:text-sm text-muted-foreground leading-relaxed flex items-start gap-2.5">
                  <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <span>{row.traditional}</span>
                </div>

                {/* AI Sales Assistant Column */}
                <div className="md:col-span-4 p-5 md:border-l border-border/50 bg-emerald-500/5 dark:bg-emerald-950/10 text-xs sm:text-sm text-foreground font-medium leading-relaxed flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{row.aiSales}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
