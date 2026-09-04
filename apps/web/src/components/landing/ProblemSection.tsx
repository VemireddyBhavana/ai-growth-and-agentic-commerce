'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { 
  AlertTriangle, 
  SearchX, 
  Layers, 
  Headphones, 
  TrendingDown, 
  XCircle
} from 'lucide-react';

const problems = [
  {
    icon: TrendingDown,
    badge: '70.8% Drop-Off',
    title: 'Severe Cart Abandonment',
    description:
      'Shoppers bounce because traditional storefronts force them through rigid category filters, endless pagination, and complex forms without guidance.',
    stat: '₹18 Lakhs+',
    statLabel: 'Average monthly revenue lost to friction',
    accentColor: 'text-rose-500',
    borderColor: 'group-hover:border-rose-500/40',
    bgGlow: 'group-hover:shadow-rose-500/10',
  },
  {
    icon: SearchX,
    badge: 'Zero Semantic Understanding',
    title: 'Dumb Keyword Search Bars',
    description:
      'Exact-match keyword search fails when shoppers search for natural desires like "running shoes under ₹3000 for flat feet", yielding zero results or irrelevant items.',
    stat: '42% of queries',
    statLabel: 'End with zero relevant recommendations',
    accentColor: 'text-amber-500',
    borderColor: 'group-hover:border-amber-500/40',
    bgGlow: 'group-hover:shadow-amber-500/10',
  },
  {
    icon: Layers,
    badge: 'Static Cross-Selling',
    title: 'Inflexible Rule-Based Bundles',
    description:
      'Hardcoded recommendation widgets suggest the same generic products to every customer, missing high-margin personalized cross-sell and upsell opportunities.',
    stat: '-65% missed',
    statLabel: 'Potential Average Order Value expansion',
    accentColor: 'text-orange-500',
    borderColor: 'group-hover:border-orange-500/40',
    bgGlow: 'group-hover:shadow-orange-500/10',
  },
  {
    icon: Headphones,
    badge: 'High Operational Burn',
    title: '24/7 Human Support Ceiling',
    description:
      'Human agents cannot scale during midnight traffic surges, flash sales, or global time zones, leading to frustrated buyers and delayed purchases.',
    stat: '8.4 hrs',
    statLabel: 'Average response time during peak hours',
    accentColor: 'text-red-500',
    borderColor: 'group-hover:border-red-500/40',
    bgGlow: 'group-hover:shadow-red-500/10',
  },
];

export function ProblemSection() {
  return (
    <section className="py-28 relative overflow-hidden">
      {/* Background Accent */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-rose-500/5 dark:bg-rose-500/10 blur-[160px] rounded-full pointer-events-none -z-10" />

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-mono font-semibold uppercase tracking-wider mb-4">
            <AlertTriangle className="w-3.5 h-3.5" />
            The Merchant Dilemma
          </div>
          <h2 className="font-heading font-extrabold text-3xl sm:text-4xl md:text-5xl text-foreground tracking-tight text-balance">
            Traditional E-Commerce is leaking revenue at every single step.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-muted-foreground text-balance">
            Static catalogs and rigid web forms are built for the 2010s. Modern buyers demand instant conversational discovery, tailored bundles, and frictionless checkout.
          </p>
        </div>

        {/* Problems 4-Grid */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
          {problems.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className={`group relative p-8 rounded-3xl bg-card/60 dark:bg-obsidian-900/60 border border-border/80 hover:border-border transition-all duration-300 shadow-lg hover:shadow-xl backdrop-blur-xl ${item.borderColor} ${item.bgGlow}`}
              >
                <div className="flex items-center justify-between mb-6">
                  <div className={`w-12 h-12 rounded-2xl bg-secondary/80 dark:bg-obsidian-800 flex items-center justify-center ${item.accentColor} border border-border group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-mono font-medium bg-secondary/80 dark:bg-obsidian-800 text-muted-foreground border border-border">
                    {item.badge}
                  </span>
                </div>

                <h3 className="font-heading font-bold text-xl sm:text-2xl text-foreground">
                  {item.title}
                </h3>
                
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                  {item.description}
                </p>

                <div className="mt-6 pt-5 border-t border-border/50 flex items-baseline justify-between">
                  <div>
                    <span className="text-xs text-muted-foreground uppercase font-mono tracking-wider block">
                      {item.statLabel}
                    </span>
                    <span className={`text-xl font-bold font-mono ${item.accentColor}`}>
                      {item.stat}
                    </span>
                  </div>
                  <XCircle className="w-5 h-5 text-muted-foreground/40 group-hover:text-rose-500 transition-colors" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
