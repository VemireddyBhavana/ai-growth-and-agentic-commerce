'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import {
  CreditCard,
  ShieldCheck,
  Webhook,
  Wallet,
  LayoutDashboard,
  Code2,
  ArrowUpRight,
  CheckCircle2,
  type LucideIcon,
} from 'lucide-react';

export interface RazorpayFeatureData {
  id: string;
  icon: LucideIcon;
  title: string;
  description: string;
  badge: string;
  tone: 'razorpay' | 'emerald' | 'cyan' | 'violet' | 'brand' | 'indigo';
}

export const RAZORPAY_FEATURES: RazorpayFeatureData[] = [
  {
    id: 'native-checkout',
    icon: CreditCard,
    title: 'Native Razorpay Checkout',
    description:
      'Customers complete purchases without leaving the AI conversation. Tokenized sessions launched directly within chat flows.',
    badge: '1-Click',
    tone: 'razorpay',
  },
  {
    id: 'secure-tokenization',
    icon: ShieldCheck,
    title: 'Secure Tokenization',
    description:
      'Sensitive payment information is securely tokenized for compliance and safety. Zero card data ever touches our servers.',
    badge: 'PCI-DSS',
    tone: 'emerald',
  },
  {
    id: 'webhook-automation',
    icon: Webhook,
    title: 'Webhook Automation',
    description:
      'Instant order confirmations, payment verification, inventory updates, and fulfillment triggers via signed HMAC webhooks.',
    badge: 'Realtime',
    tone: 'cyan',
  },
  {
    id: 'upi-cards',
    icon: Wallet,
    title: 'UPI & Cards',
    description:
      'Supports UPI, debit cards, credit cards, wallets, EMI, netbanking, and BNPL — every payment method Indian shoppers prefer.',
    badge: 'Universal',
    tone: 'violet',
  },
  {
    id: 'merchant-dashboard',
    icon: LayoutDashboard,
    title: 'Merchant Dashboard',
    description:
      'Monitor payments, refunds, customer behavior, and AI recommendation performance. Unified across Razorpay + agent telemetry.',
    badge: 'Analytics',
    tone: 'indigo',
  },
  {
    id: 'developer-apis',
    icon: Code2,
    title: 'Developer APIs',
    description:
      'Clean REST APIs and webhook signatures for checkout, orders, refunds, subscriptions, payment links, and settlement reporting.',
    badge: 'REST',
    tone: 'brand',
  },
];

const toneMap: Record<
  RazorpayFeatureData['tone'],
  { gradient: string; text: string; border: string; glow: string; ring: string; iconBg: string; badgeBg: string }
> = {
  razorpay: {
    gradient: 'from-[#1366ef]/16 via-[#1366ef]/[0.04] to-transparent',
    text: 'text-[#0f54c8] dark:text-[#60a5fa]',
    border: 'border-[#1366ef]/30 group-hover:border-[#1366ef]/60',
    glow: 'hover:shadow-[#1366ef]/25',
    ring: 'focus-visible:ring-[#1366ef]/40',
    iconBg: 'bg-[#1366ef]/12 dark:bg-[#1366ef]/20 border-[#1366ef]/30',
    badgeBg: 'bg-[#1366ef]/12 dark:bg-[#1366ef]/18 border-[#1366ef]/30 text-[#0f54c8] dark:text-[#60a5fa]',
  },
  emerald: {
    gradient: 'from-ai-emerald/16 via-ai-emerald/[0.04] to-transparent',
    text: 'text-ai-emerald',
    border: 'border-ai-emerald/30 group-hover:border-ai-emerald/60',
    glow: 'hover:shadow-ai-emerald/25',
    ring: 'focus-visible:ring-ai-emerald/40',
    iconBg: 'bg-ai-emerald/12 dark:bg-ai-emerald/20 border-ai-emerald/30',
    badgeBg: 'bg-ai-emerald/12 dark:bg-ai-emerald/18 border-ai-emerald/30 text-ai-emerald',
  },
  cyan: {
    gradient: 'from-ai-cyan/16 via-ai-cyan/[0.04] to-transparent',
    text: 'text-ai-cyan',
    border: 'border-ai-cyan/30 group-hover:border-ai-cyan/60',
    glow: 'hover:shadow-ai-cyan/25',
    ring: 'focus-visible:ring-ai-cyan/40',
    iconBg: 'bg-ai-cyan/12 dark:bg-ai-cyan/20 border-ai-cyan/30',
    badgeBg: 'bg-ai-cyan/12 dark:bg-ai-cyan/18 border-ai-cyan/30 text-ai-cyan',
  },
  violet: {
    gradient: 'from-ai-violet/16 via-ai-violet/[0.04] to-transparent',
    text: 'text-ai-violet',
    border: 'border-ai-violet/30 group-hover:border-ai-violet/60',
    glow: 'hover:shadow-ai-violet/25',
    ring: 'focus-visible:ring-ai-violet/40',
    iconBg: 'bg-ai-violet/12 dark:bg-ai-violet/20 border-ai-violet/30',
    badgeBg: 'bg-ai-violet/12 dark:bg-ai-violet/18 border-ai-violet/30 text-ai-violet',
  },
  brand: {
    gradient: 'from-brand-500/16 via-brand-500/[0.04] to-transparent',
    text: 'text-brand-600 dark:text-brand-400',
    border: 'border-brand-500/30 group-hover:border-brand-500/60',
    glow: 'hover:shadow-brand-500/25',
    ring: 'focus-visible:ring-brand-500/40',
    iconBg: 'bg-brand-500/12 dark:bg-brand-500/20 border-brand-500/30',
    badgeBg: 'bg-brand-500/12 dark:bg-brand-500/18 border-brand-500/30 text-brand-600 dark:text-brand-400',
  },
  indigo: {
    gradient: 'from-indigo-500/16 via-indigo-500/[0.04] to-transparent',
    text: 'text-indigo-600 dark:text-indigo-400',
    border: 'border-indigo-500/30 group-hover:border-indigo-500/60',
    glow: 'hover:shadow-indigo-500/25',
    ring: 'focus-visible:ring-indigo-500/40',
    iconBg: 'bg-indigo-500/12 dark:bg-indigo-500/20 border-indigo-500/30',
    badgeBg: 'bg-indigo-500/12 dark:bg-indigo-500/18 border-indigo-500/30 text-indigo-600 dark:text-indigo-400',
  },
};

export interface RazorpayFeatureCardProps {
  feature: RazorpayFeatureData;
  index?: number;
}

export function RazorpayFeatureCard({ feature, index = 0 }: RazorpayFeatureCardProps) {
  const Icon = feature.icon;
  const tone = toneMap[feature.tone];
  return (
    <motion.article
      role="article"
      initial={{ opacity: 0, y: 24, scale: 0.98 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{
        duration: 0.55,
        delay: index * 0.07,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{ y: -6 }}
      className={`group relative flex flex-col gap-4 p-5 sm:p-6 rounded-2xl border border-border/70 dark:border-white/10 bg-card/70 dark:bg-obsidian-900/70 backdrop-blur-xl bg-gradient-to-br ${tone.gradient} ${tone.border} shadow-[0_14px_40px_-28px_rgba(15,23,42,0.6)] hover:shadow-2xl ${tone.glow} transition-all duration-350 ease-out focus-within:outline-none focus-within:ring-2 ${tone.ring} focus-within:ring-offset-2 focus-within:ring-offset-background`}
      tabIndex={0}
      aria-label={`Razorpay capability: ${feature.title}`}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-t from-white/35 via-transparent to-transparent dark:from-white/[0.05] opacity-55 mix-blend-overlay"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-white/12 via-transparent to-white/5 dark:from-white/[0.09]"
        style={{ WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)', WebkitMaskComposite: 'xor', maskComposite: 'exclude', padding: '1px' }}
      />

      <header className="relative flex items-start justify-between gap-3">
        <div className={`relative w-11 h-11 sm:w-12 sm:h-12 rounded-2xl ${tone.iconBg} flex items-center justify-center shadow-inner transition-all duration-350 ease-out ${tone.text}`}>
          <motion.div
            animate={{ rotate: [0, 0] }}
            whileHover={{ rotate: [0, -6, 4, -2, 0], scale: [1, 1.12, 1.08, 1.1, 1] }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <Icon className="w-5.5 h-5.5 sm:w-6 sm:h-6" strokeWidth={2.2} aria-hidden="true" />
          </motion.div>
        </div>
        <span className={`shrink-0 px-2.5 py-1 rounded-xl text-[10px] font-mono font-bold uppercase tracking-wider border ${tone.badgeBg}`}>
          {feature.badge}
        </span>
      </header>

      <div className="relative space-y-2.5 flex-1">
        <h3 className="font-heading font-bold text-lg sm:text-xl leading-tight text-foreground transition-colors duration-300 group-hover:text-foreground">
          {feature.title}
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {feature.description}
        </p>
      </div>

      <footer className="relative flex items-center justify-between pt-2">
        <span className={`inline-flex items-center gap-1.5 text-[11px] sm:text-xs font-mono font-bold ${tone.text}`}>
          <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" aria-hidden="true" />
          Natively Integrated
        </span>
        <div className={`w-8 h-8 rounded-full bg-background/70 dark:bg-obsidian-850/70 border border-border/60 flex items-center justify-center text-muted-foreground transition-all duration-300 ${tone.text} group-hover:scale-110 group-hover:bg-background/90`}>
          <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
        </div>
      </footer>
    </motion.article>
  );
}
