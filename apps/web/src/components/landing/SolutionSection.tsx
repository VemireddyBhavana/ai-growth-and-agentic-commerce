'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { 
  Sparkles, 
  Bot, 
  Boxes, 
  ShieldCheck, 
  CreditCard, 
  CheckCircle2, 
  ArrowUpRight
} from 'lucide-react';

const solutions = [
  {
    icon: Bot,
    tag: 'Autonomous Concierge',
    title: 'Sub-Second Natural Language Discovery',
    description:
      'Replaces dumb keyword queries with deep neural vector search. Shoppers speak naturally, and our agent finds exact matching SKUs with real-time stock verification in under 450ms.',
    highlight: '4.2x Cart Conversion Lift',
    badgeColor: 'bg-brand-500/10 text-brand-600 dark:text-brand-400 border-brand-500/20',
  },
  {
    icon: Boxes,
    tag: 'Dynamic Bundling Engine',
    title: 'Margin-Aware Autonomous Upselling',
    description:
      'Our reinforcement agent constructs hyper-relevant cross-sell bundles in real-time based on buyer persona, cart affinity, and merchant gross margins, maximizing average order value.',
    highlight: '+38.4% GMV Expansion',
    badgeColor: 'bg-ai-violet/10 text-ai-violet border-ai-violet/20',
  },
  {
    icon: ShieldCheck,
    tag: 'Explainable AI Core',
    title: 'Transparent Rationale & Confidence Guardrails',
    description:
      'Every product suggestion includes an explainable confidence breakdown. Merchants retain total governance with immutable audit logs and zero hallucination policies.',
    highlight: '99.8% Algorithmic Accuracy',
    badgeColor: 'bg-ai-emerald/10 text-ai-emerald border-ai-emerald/20',
  },
  {
    icon: CreditCard,
    tag: 'Frictionless Razorpay',
    title: '1-Click In-Chat Native Checkout',
    description:
      'Buyers complete transactions directly within the conversational interface via tokenized Razorpay payment links, eliminating multi-page checkout drop-offs.',
    highlight: '85% Faster Checkout Velocity',
    badgeColor: 'bg-ai-cyan/10 text-ai-cyan border-ai-cyan/20',
  },
];

export function SolutionSection() {
  return (
    <section className="py-28 relative overflow-hidden bg-secondary/20 dark:bg-obsidian-950/60 border-t border-border/40">
      {/* Background Glow */}
      <div className="absolute top-1/3 right-1/4 w-[600px] h-[400px] bg-ai-emerald/10 dark:bg-ai-emerald/15 blur-[150px] rounded-full pointer-events-none -z-10" />
      <div className="absolute bottom-10 left-1/4 w-[500px] h-[350px] bg-brand-600/10 dark:bg-brand-600/15 blur-[140px] rounded-full pointer-events-none -z-10" />

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-mono font-semibold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            The Autonomous Solution
          </div>
          <h2 className="font-heading font-extrabold text-3xl sm:text-4xl md:text-5xl text-foreground tracking-tight text-balance">
            Reinventing commerce with ambient agentic intelligence.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-muted-foreground text-balance">
            AI Sales Assistant replaces clunky multi-step shopping funnels with an intelligent, autonomous sales partner that drives conversion, preserves margins, and delights shoppers.
          </p>
        </div>

        {/* Solutions Grid */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
          {solutions.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="group relative p-8 rounded-3xl bg-card/80 dark:bg-obsidian-900/80 border border-border/80 hover:border-brand-500/40 transition-all duration-300 shadow-xl hover:shadow-brand-500/10 backdrop-blur-xl flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-brand-500/10 dark:bg-brand-500/15 border border-brand-500/20 flex items-center justify-center text-brand-600 dark:text-brand-400 group-hover:scale-110 transition-transform duration-300">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-mono font-semibold border ${item.badgeColor}`}>
                      {item.tag}
                    </span>
                  </div>

                  <h3 className="font-heading font-bold text-xl sm:text-2xl text-foreground group-hover:text-brand-500 transition-colors">
                    {item.title}
                  </h3>

                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="mt-8 pt-5 border-t border-border/50 flex items-center justify-between">
                  <span className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400 font-mono">
                    <CheckCircle2 className="w-4 h-4" />
                    {item.highlight}
                  </span>
                  <div className="w-8 h-8 rounded-full bg-secondary/80 dark:bg-obsidian-800 flex items-center justify-center text-muted-foreground group-hover:text-foreground group-hover:bg-brand-500/20 transition-all">
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
