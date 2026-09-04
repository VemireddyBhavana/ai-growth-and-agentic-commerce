'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { 
  Bot, 
  LayoutDashboard, 
  Sparkles, 
  TrendingUp, 
  ShieldCheck, 
  FileText, 
  BarChart3, 
  CreditCard,
  Zap,
  Cpu,
  Layers,
  ArrowRight
} from 'lucide-react';

const features = [
  {
    icon: Bot,
    title: 'AI Shopping Concierge',
    subtitle: 'Conversational Sub-Second Search',
    description:
      'Replaces sterile dropdown filters with an intelligent shopping agent. Handles multi-attribute queries, aesthetic nuance, and budget constraints in under 450ms.',
    badge: 'Core Engine',
    colSpan: 'lg:col-span-8',
    gradient: 'from-brand-600/10 via-brand-600/5 to-transparent',
    borderColor: 'hover:border-brand-500/50',
  },
  {
    icon: LayoutDashboard,
    title: 'Merchant Command Center',
    subtitle: 'Real-Time Telemetry & Insights',
    description:
      'Comprehensive console to monitor autonomous GMV expansion, live conversation streams, and agent confidence metrics.',
    badge: 'Live Console',
    colSpan: 'lg:col-span-4',
    gradient: 'from-ai-violet/10 via-ai-violet/5 to-transparent',
    borderColor: 'hover:border-ai-violet/50',
  },
  {
    icon: Sparkles,
    title: 'Smart Vector Recommendations',
    subtitle: 'Dynamic Semantic Embeddings',
    description:
      'High-dimensional vector indexing ensures matching based on true buyer affinity, occasion, and style, not just crude keyword strings.',
    badge: 'Vector Search',
    colSpan: 'lg:col-span-4',
    gradient: 'from-ai-cyan/10 via-ai-cyan/5 to-transparent',
    borderColor: 'hover:border-ai-cyan/50',
  },
  {
    icon: TrendingUp,
    title: 'Margin-Aware Cross-Selling & Upselling',
    subtitle: 'Dynamic Bundle Constructor',
    description:
      'Autonomous reinforcement algorithms package complementary items in real-time while strictly guarding merchant profit margins.',
    badge: '+38.4% GMV',
    colSpan: 'lg:col-span-8',
    gradient: 'from-ai-emerald/10 via-ai-emerald/5 to-transparent',
    borderColor: 'hover:border-ai-emerald/50',
  },
  {
    icon: ShieldCheck,
    title: 'Explainable AI & Confidence Engine',
    subtitle: 'Zero Hallucination Guardrails',
    description:
      'Every product suggestion details the exact rationale and confidence score. Zero ungrounded answers; strict catalog catalog fidelity.',
    badge: 'Audit Grade',
    colSpan: 'lg:col-span-6',
    gradient: 'from-amber-500/10 via-amber-500/5 to-transparent',
    borderColor: 'hover:border-amber-500/50',
  },
  {
    icon: FileText,
    title: 'Cryptographic Audit Trail',
    subtitle: 'Immutable Event Ledger',
    description:
      'Every conversation, inventory hold, discount grant, and payment transaction is logged into an immutable cryptographic event journal.',
    badge: 'Compliance',
    colSpan: 'lg:col-span-6',
    gradient: 'from-blue-500/10 via-blue-500/5 to-transparent',
    borderColor: 'hover:border-blue-500/50',
  },
  {
    icon: BarChart3,
    title: 'Real-Time Cohort & Funnel Analytics',
    subtitle: 'Sub-Second Revenue Curves',
    description:
      'Track cohort retention, conversational drop-off points, and dynamic discount ROI with millisecond telemetry updates.',
    badge: 'Analytics',
    colSpan: 'lg:col-span-6',
    gradient: 'from-purple-500/10 via-purple-500/5 to-transparent',
    borderColor: 'hover:border-purple-500/50',
  },
  {
    icon: CreditCard,
    title: '1-Click Razorpay Payments',
    subtitle: 'Tokenized In-Chat Checkout',
    description:
      'Native Razorpay checkout seamlessly integrated into the shopping dialogue. Customers pay with UPI, cards, or EMI in 1 click.',
    badge: 'Razorpay Partner',
    colSpan: 'lg:col-span-6',
    gradient: 'from-brand-500/10 via-brand-500/5 to-transparent',
    borderColor: 'hover:border-brand-500/50',
  },
];

export function FeaturesGridSection() {
  return (
    <section id="features" className="py-28 relative overflow-hidden bg-secondary/15 dark:bg-obsidian-950/40 border-t border-border/40">
      {/* Ambient background glow */}
      <div className="absolute top-1/4 left-1/3 w-[700px] h-[500px] bg-ai-violet/10 dark:bg-ai-violet/15 blur-[160px] rounded-full pointer-events-none -z-10" />

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-600 dark:text-brand-400 text-xs font-mono font-semibold uppercase tracking-wider mb-4">
            <Zap className="w-3.5 h-3.5" />
            Enterprise Feature Suite
          </div>
          <h2 className="font-heading font-extrabold text-3xl sm:text-4xl md:text-5xl text-foreground tracking-tight text-balance">
            Everything you need to run an autonomous commerce machine.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-muted-foreground text-balance">
            Engineered with the precision of Stripe, the intelligence of Gemini 3.7, and the design velocity of Linear.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="mt-16 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.06 }}
                className={`group relative p-8 rounded-3xl bg-card dark:bg-obsidian-900/80 border border-border/80 ${feat.borderColor} transition-all duration-300 shadow-lg hover:shadow-2xl backdrop-blur-xl flex flex-col justify-between ${feat.colSpan} overflow-hidden`}
              >
                {/* Background Corner Glow */}
                <div className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl ${feat.gradient} rounded-full blur-3xl pointer-events-none -z-10 transition-opacity duration-300 opacity-60 group-hover:opacity-100`} />

                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-secondary/80 dark:bg-obsidian-800 border border-border flex items-center justify-center text-foreground group-hover:scale-110 transition-transform duration-300">
                      <Icon className="w-6 h-6 text-brand-500" />
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-mono font-semibold bg-secondary/80 dark:bg-obsidian-800 text-muted-foreground border border-border">
                      {feat.badge}
                    </span>
                  </div>

                  <h3 className="font-heading font-bold text-xl sm:text-2xl text-foreground">
                    {feat.title}
                  </h3>
                  <div className="text-xs font-mono text-brand-600 dark:text-brand-400 mt-1 font-semibold">
                    {feat.subtitle}
                  </div>

                  <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
                    {feat.description}
                  </p>
                </div>

                <div className="mt-8 pt-4 border-t border-border/40 flex items-center justify-between">
                  <span className="text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors flex items-center gap-1">
                    Explore Architecture
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
