'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Star, CheckCircle2, TrendingUp, Sparkles } from 'lucide-react';

const testimonials = [
  {
    name: 'Aarav Sharma',
    role: 'Founder & CEO',
    company: 'HyperScale Apparel',
    metric: '+44.2% GMV Expansion',
    quote:
      'AI Sales Assistant completely changed our customer acquisition economics. Instead of dropping off at the search bar, shoppers have a natural dialogue, get personalized bundle recommendations, and buy via Razorpay in seconds.',
    avatarBg: 'from-brand-600 to-ai-violet',
    initials: 'AS',
    verified: true,
  },
  {
    name: 'Meera Patel',
    role: 'Head of E-Commerce & Growth',
    company: 'Velox Athletics',
    metric: '4.8x Cart Conversion',
    quote:
      'The explainable AI confidence scores gave our executive team complete peace of mind. Zero hallucinations, perfect margin guardrails, and our average order value jumped by ₹620 per checkout.',
    avatarBg: 'from-ai-violet to-ai-cyan',
    initials: 'MP',
    verified: true,
  },
  {
    name: 'Rohan Deshmukh',
    role: 'VP of Digital Commerce',
    company: 'Nova Lifestyle Brands',
    metric: 'Sub-450ms Latency & 24/7 Coverage',
    quote:
      'During our Black Friday midnight surge, the agent handled 12,000+ concurrent shopping sessions without breaking a sweat. It felt like having 100 elite sales associates on the floor simultaneously.',
    avatarBg: 'from-ai-cyan to-emerald-600',
    initials: 'RD',
    verified: true,
  },
];

export function TestimonialsSection() {
  return (
    <section className="py-28 relative overflow-hidden bg-secondary/15 dark:bg-obsidian-950/40 border-t border-border/40">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/4 w-[600px] h-[400px] bg-brand-600/10 dark:bg-brand-600/15 blur-[150px] rounded-full pointer-events-none -z-10" />

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-ai-emerald/10 border border-ai-emerald/20 text-ai-emerald text-xs font-mono font-semibold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            Merchant Proof &amp; Impact
          </div>
          <h2 className="font-heading font-extrabold text-3xl sm:text-4xl md:text-5xl text-foreground tracking-tight text-balance">
            Loved by top merchants scaling millions in GMV.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-muted-foreground text-balance">
            Discover how visionary commerce brands use our autonomous sales intelligence to multiply conversions and protect margins.
          </p>
        </div>

        {/* 3 Testimonials Grid */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testi, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="p-8 rounded-3xl bg-card dark:bg-obsidian-900/90 border border-border/80 hover:border-brand-500/40 transition-all duration-300 shadow-xl hover:shadow-2xl backdrop-blur-xl flex flex-col justify-between"
            >
              <div>
                {/* Top Row: Stars + Metric Badge */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(5)].map((_, sIdx) => (
                      <Star key={sIdx} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                    <TrendingUp className="w-3 h-3" />
                    {testi.metric}
                  </span>
                </div>

                {/* Quote Text */}
                <p className="text-sm sm:text-base text-foreground leading-relaxed italic">
                  &ldquo;{testi.quote}&rdquo;
                </p>
              </div>

              {/* Author Info */}
              <div className="mt-8 pt-6 border-t border-border/50 flex items-center gap-3.5">
                <div
                  className={`w-11 h-11 rounded-full bg-gradient-to-br ${testi.avatarBg} flex items-center justify-center text-white font-bold text-sm shadow-md`}
                >
                  {testi.initials}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-foreground flex items-center gap-1.5">
                    {testi.name}
                    {testi.verified && (
                      <CheckCircle2 className="w-4 h-4 text-brand-500" />
                    )}
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    {testi.role}, <span className="font-semibold text-foreground">{testi.company}</span>
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
