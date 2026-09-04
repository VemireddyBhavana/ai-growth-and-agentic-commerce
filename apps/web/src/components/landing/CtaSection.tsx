'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, CheckCircle2, ShieldCheck, Zap, Bot } from 'lucide-react';
import { toast } from 'sonner';

export function CtaSection() {
  const [email, setEmail] = React.useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }
    toast.success('Your 14-day free trial access key has been sent!', {
      description: `Check ${email} for your onboarding credentials and API token.`,
    });
    setEmail('');
  };

  return (
    <section id="cta" className="py-28 relative overflow-hidden">
      {/* Aurora Gradient Glows */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-brand-600/5 to-ai-violet/10 pointer-events-none -z-10" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[450px] bg-brand-600/20 dark:bg-brand-600/25 blur-[160px] rounded-full pointer-events-none -z-10" />

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative rounded-3xl bg-gradient-to-b from-card/90 to-card/50 dark:from-obsidian-900/90 dark:to-obsidian-950/80 border border-brand-500/30 p-8 sm:p-14 lg:p-20 text-center shadow-2xl backdrop-blur-2xl overflow-hidden"
        >
          {/* Subtle Grid in Background */}
          <div className="absolute inset-0 bg-grid-black dark:bg-grid-white opacity-20 [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

          {/* Top Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/25 text-brand-600 dark:text-brand-400 text-xs font-mono font-semibold uppercase tracking-wider mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            Ready for Agentic Growth?
          </div>

          {/* Headline */}
          <h2 className="font-heading font-extrabold text-3xl sm:text-5xl lg:text-6xl text-foreground tracking-tight max-w-4xl mx-auto text-balance">
            Deploy your autonomous sales assistant today.
          </h2>

          <p className="mt-6 max-w-2xl mx-auto text-base sm:text-xl text-muted-foreground leading-relaxed text-balance">
            Join visionary merchants multiplying their conversion rates, average order values, and gross revenue with AI-powered conversational commerce.
          </p>

          {/* Email Invite Form */}
          <form
            onSubmit={handleSubscribe}
            className="mt-10 max-w-md mx-auto flex flex-col sm:flex-row items-center gap-3"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your work email..."
              className="w-full px-5 py-3.5 rounded-2xl bg-background dark:bg-obsidian-850 border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand-500/50 shadow-inner"
            />
            <button
              type="submit"
              className="w-full sm:w-auto shrink-0 px-7 py-3.5 rounded-2xl text-sm font-semibold text-white bg-gradient-to-r from-brand-600 via-ai-violet to-brand-600 hover:from-brand-500 hover:to-ai-violet shadow-xl shadow-brand-600/30 flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Trust Guarantees */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs font-medium text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              14-Day Free Trial
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              5-Minute Shopify &amp; API Integration
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              No Credit Card Required
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              SOC-2 &amp; PCI-DSS Level 1
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
