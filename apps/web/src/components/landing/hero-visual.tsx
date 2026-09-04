'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import {
  Bot,
  ShoppingBag,
  ShieldCheck,
  CreditCard,
  Sparkles,
  CheckCircle2,
  TrendingUp,
  Users,
  Cpu,
  MessageCircle,
  DollarSign,
} from 'lucide-react';

export interface HeroVisualProps {
  className?: string;
}

export function HeroVisual({ className = '' }: HeroVisualProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.7, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className={`relative w-full max-w-xl lg:max-w-none mx-auto ${className}`}
    >
      <div className="relative z-10 aspect-[4/5] lg:aspect-[5/6]">
        <ChatWindow className="absolute inset-0 animate-float-slow" />

        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.6, type: 'spring' }}
          className="absolute -left-4 sm:-left-10 top-[62%] w-[56%] sm:w-[54%] max-w-[260px] animate-float z-20"
          style={{ animationDelay: '-1.5s' }}
        >
          <ProductCard />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.75, type: 'spring' }}
          className="absolute -right-3 sm:-right-8 top-[8%] w-[56%] sm:w-[54%] max-w-[260px] z-20"
        >
          <MerchantAnalyticsCard />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.9, type: 'spring' }}
          className="absolute right-[10%] bottom-[2%] w-[60%] sm:w-[58%] max-w-[280px] animate-float z-20"
          style={{ animationDelay: '-3s' }}
        >
          <PaymentSuccessCard />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 1.05, type: 'spring' }}
          className="absolute left-0 top-[14%] w-[46%] sm:w-[40%] max-w-[200px] hidden sm:block z-20 animate-float-slow"
          style={{ animationDelay: '-4s' }}
        >
          <WidgetCustomers />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 1.15, type: 'spring' }}
          className="absolute right-[2%] top-[50%] w-[40%] sm:w-[38%] max-w-[190px] hidden md:block z-20 animate-float"
          style={{ animationDelay: '-2.2s' }}
        >
          <WidgetAIConfidence />
        </motion.div>
      </div>
    </motion.div>
  );
}

/* ---------------------------- Sub components ---------------------------- */

function ChatWindow({ className = '' }: { className?: string }) {
  return (
    <div
      className={`relative h-full rounded-[28px] border border-border/70 dark:border-white/10 bg-card/60 dark:bg-obsidian-900/60 backdrop-blur-2xl shadow-2xl shadow-brand-600/10 overflow-hidden ${className}`}
      role="img"
      aria-label="AI assistant chat window with product recommendations"
    >
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-border/50 dark:border-white/5 bg-background/30">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-rose-500/80" />
          <span className="w-3 h-3 rounded-full bg-amber-500/80" />
          <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
        </div>
        <div className="flex items-center gap-2 px-2.5 py-1 rounded-full text-[11px] font-mono font-medium bg-secondary/70 dark:bg-obsidian-850 text-muted-foreground border border-border/60">
          <Cpu className="w-3.5 h-3.5 text-ai-cyan" />
          agent.live-chat.app
        </div>
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75 animate-ping" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
          </span>
          Live
        </span>
      </div>

      <div className="p-4 sm:p-5 space-y-4">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 shrink-0 rounded-full bg-brand-600/15 border border-brand-600/30 flex items-center justify-center text-[11px] font-bold text-brand-600 dark:text-brand-300">
            RC
          </div>
          <div className="px-3.5 py-2.5 rounded-2xl rounded-tl-sm bg-secondary/70 dark:bg-obsidian-850 border border-border/70 text-sm text-foreground max-w-[88%]">
            Hey! I want wireless earbuds with good bass and under ₹3500 for the gym 💪
          </div>
        </div>

        <div className="ml-11 flex items-center gap-2 text-[11px] font-mono text-ai-violet-light bg-ai-violet/10 dark:bg-ai-violet/15 border border-ai-violet/30 px-2.5 py-1 rounded-lg w-fit">
          <Sparkles className="w-3.5 h-3.5 animate-spin" />
          Reasoning • Vector match 0.98 • Margin +21%
        </div>

        <div className="flex items-start gap-3">
          <div className="w-8 h-8 shrink-0 rounded-full bg-gradient-to-br from-brand-600 to-ai-violet flex items-center justify-center text-white shadow-md shadow-brand-600/30">
            <Bot className="w-4 h-4" />
          </div>
          <div className="flex-1 space-y-3">
            <div className="px-3.5 py-2.5 rounded-2xl rounded-tl-sm bg-background/85 dark:bg-obsidian-850/85 border border-border/80 text-sm text-foreground max-w-[95%] shadow-sm">
              Perfect! I found a gym-ready pair with deep bass and 30h battery. Here are my top 2
              recommendations — both eligible for 1-click checkout:
            </div>

            <div className="flex flex-col gap-2">
              <MiniProductRow
                icon={<ShoppingBag className="w-5 h-5 text-brand-400" />}
                name="BassPro X3 Wireless"
                meta="IP67 • 30h Battery"
                price="₹3,299"
                badge="BEST MATCH"
                badgeColor="violet"
                gradient="from-slate-800 to-slate-900"
              />
              <MiniProductRow
                icon={<ShoppingBag className="w-5 h-5 text-ai-cyan" />}
                name="AeroFit Sport Buds"
                meta="Dual-Driver • 36h Playtime"
                price="₹2,999"
                badge="POPULAR"
                badgeColor="cyan"
                gradient="from-sky-800 to-cyan-900"
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono text-muted-foreground">
              <span className="inline-flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                <ShieldCheck className="w-3.5 h-3.5" />
                Match Confidence 98%
              </span>
              <span className="inline-flex items-center gap-1.5">
                <MessageCircle className="w-3.5 h-3.5 text-ai-violet" />
                Ask why I recommended these →
              </span>
            </div>
          </div>
        </div>

        <div className="pt-3 mt-1 border-t border-border/50 dark:border-white/5">
          <div className="flex items-center gap-2 rounded-2xl bg-secondary/50 dark:bg-obsidian-850/60 border border-border/70 px-3.5 py-2.5 text-sm text-muted-foreground">
            <div className="h-2 w-2 rounded-full bg-ai-cyan animate-pulse" />
            Ask anything… or say &quot;buy the BassPro X3&quot;
            <span className="ml-auto text-[11px] font-mono text-muted-foreground/70">↵ send</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function MiniProductRow({
  icon,
  name,
  meta,
  price,
  badge,
  badgeColor,
  gradient,
}: {
  icon: React.ReactNode;
  name: string;
  meta: string;
  price: string;
  badge: string;
  badgeColor: 'violet' | 'cyan';
  gradient: string;
}) {
  const badgeClass =
    badgeColor === 'violet'
      ? 'bg-ai-violet/12 text-ai-violet border-ai-violet/30'
      : 'bg-ai-cyan/12 text-ai-cyan border-ai-cyan/30';
  return (
    <div className="flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl bg-secondary/40 dark:bg-obsidian-900/70 border border-border/70">
      <div className="flex items-center gap-3 min-w-0">
        <div
          className={`w-11 h-11 shrink-0 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center border border-white/10`}
        >
          {icon}
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <div className="text-sm font-semibold text-foreground truncate">{name}</div>
            <span
              className={`hidden sm:inline-block px-1.5 py-0.5 rounded text-[9px] font-mono font-bold uppercase border ${badgeClass}`}
            >
              {badge}
            </span>
          </div>
          <div className="text-[11px] text-muted-foreground truncate">{meta}</div>
        </div>
      </div>
      <div className="text-right shrink-0">
        <div className="text-sm font-bold font-mono text-foreground">{price}</div>
        <div className="text-[10px] text-ai-emerald font-medium">Free shipping</div>
      </div>
    </div>
  );
}

function GlassCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`relative rounded-2xl border border-border/70 dark:border-white/10 bg-card/80 dark:bg-obsidian-900/85 backdrop-blur-2xl shadow-[0_18px_40px_-18px_rgba(15,23,42,0.45)] ${className}`}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-white/40 via-transparent to-transparent dark:from-white/[0.06] opacity-60"
      />
      <div className="relative">{children}</div>
    </div>
  );
}

function ProductCard() {
  return (
    <GlassCard className="p-3.5 sm:p-4">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 sm:w-14 sm:h-14 shrink-0 rounded-2xl bg-gradient-to-br from-brand-600 via-ai-violet to-ai-cyan p-0.5 shadow-lg shadow-brand-600/25">
          <div className="w-full h-full rounded-[14px] bg-white dark:bg-obsidian-950 flex items-center justify-center">
            <ShoppingBag className="w-6 h-6 sm:w-7 sm:h-7 text-brand-600 dark:text-brand-400" />
          </div>
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-[11px] font-mono uppercase tracking-widest text-ai-violet">
            Top Recommendation
          </div>
          <div className="text-sm sm:text-[15px] font-semibold text-foreground truncate">
            BassPro X3 Wireless
          </div>
          <div className="text-[11px] text-muted-foreground flex items-center gap-1.5 mt-0.5">
            <span className="text-amber-500">★★★★★</span>
            <span>4.8 (1,247 reviews)</span>
          </div>
        </div>
      </div>
      <div className="mt-3 flex items-end justify-between">
        <div>
          <div className="text-lg sm:text-xl font-heading font-extrabold font-mono text-foreground leading-none">
            ₹3,299
          </div>
          <div className="text-[10px] text-ai-emerald font-semibold mt-1">
            ⚡ 1 in stock • Ships today
          </div>
        </div>
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-[11px] font-bold text-white bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-md shadow-emerald-500/30">
          <DollarSign className="w-3.5 h-3.5" />
          +₹620 margin
        </div>
      </div>
    </GlassCard>
  );
}

function MerchantAnalyticsCard() {
  return (
    <GlassCard className="p-4">
      <div className="flex items-center justify-between">
        <div className="inline-flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-brand-500/15 border border-brand-500/30 flex items-center justify-center text-brand-500">
            <TrendingUp className="w-4.5 h-4.5" />
          </div>
          <div>
            <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
              Today
            </div>
            <div className="text-sm font-bold text-foreground">Merchant Overview</div>
          </div>
        </div>
        <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/12 border border-emerald-500/30">
          +24.7%
        </span>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <Stat label="GMV" value="₹1.84L" tone="brand" />
        <Stat label="Orders" value="238" tone="violet" />
        <Stat label="AOV" value="₹7,740" tone="cyan" />
        <Stat label="Conv." value="8.4%" tone="emerald" />
      </div>

      <div className="mt-4 h-14 rounded-xl bg-secondary/40 dark:bg-obsidian-850/70 border border-border/60 overflow-hidden p-2 flex items-end gap-[3px]">
        {[26, 42, 34, 58, 46, 72, 54, 80, 66, 92, 74, 58, 84, 70].map((h, i) => (
          <div
            key={i}
            className="flex-1 rounded-sm bg-gradient-to-t from-brand-600/70 to-ai-violet/80"
            style={{ height: `${h}%`, opacity: 0.55 + (h / 250) }}
          />
        ))}
      </div>
    </GlassCard>
  );
}

function Stat({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: 'brand' | 'violet' | 'cyan' | 'emerald';
}) {
  const toneClass: Record<string, string> = {
    brand: 'from-brand-500/20 to-brand-500/0 text-brand-600 dark:text-brand-400',
    violet: 'from-ai-violet/20 to-ai-violet/0 text-ai-violet',
    cyan: 'from-ai-cyan/20 to-ai-cyan/0 text-ai-cyan',
    emerald: 'from-ai-emerald/20 to-ai-emerald/0 text-ai-emerald',
  };
  return (
    <div
      className={`relative overflow-hidden rounded-xl border border-border/70 bg-gradient-to-br ${toneClass[tone]} px-2.5 py-2`}
    >
      <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
        {label}
      </div>
      <div className="text-sm font-bold font-mono text-foreground mt-0.5">{value}</div>
    </div>
  );
}

function PaymentSuccessCard() {
  return (
    <GlassCard className="p-4">
      <div className="flex items-start gap-3">
        <div className="relative shrink-0">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-500 to-ai-emerald flex items-center justify-center text-white shadow-lg shadow-emerald-500/30">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <span className="absolute -top-1 -right-1 inline-flex h-3.5 w-3.5 rounded-full bg-ai-emerald ring-4 ring-card dark:ring-obsidian-900 animate-pulse" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <div className="text-sm font-bold text-foreground">Payment Successful</div>
            <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold uppercase border border-ai-cyan/30 text-ai-cyan bg-ai-cyan/10">
              Razorpay
            </span>
          </div>
          <div className="text-[11px] text-muted-foreground mt-0.5 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-ai-emerald" />
            PCI-DSS Tokenized • UPI
          </div>
        </div>
      </div>

      <div className="mt-3 rounded-xl bg-secondary/40 dark:bg-obsidian-850/60 border border-border/70 px-3 py-2.5 space-y-1.5">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Order #AS-20483</span>
          <span className="font-mono text-[11px] text-ai-cyan">paid • 1-click</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-foreground">
            <CreditCard className="w-4 h-4 text-ai-violet" />
            <span className="font-medium truncate">BassPro X3 • 1 item</span>
          </div>
          <div className="text-sm font-bold font-mono text-foreground">₹3,299</div>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between text-[11px]">
        <span className="inline-flex items-center gap-1 text-ai-emerald">
          <span className="h-1.5 w-1.5 rounded-full bg-ai-emerald animate-pulse" />
          Settlement • Instant ⚡
        </span>
        <span className="text-muted-foreground font-mono">2s ago</span>
      </div>
    </GlassCard>
  );
}

function WidgetCustomers() {
  return (
    <GlassCard className="p-3">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-ai-cyan/15 border border-ai-cyan/30 flex items-center justify-center text-ai-cyan">
          <Users className="w-4 h-4" />
        </div>
        <div>
          <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
            Active shoppers
          </div>
          <div className="text-base font-heading font-extrabold text-foreground leading-none">
            1,284
          </div>
        </div>
      </div>
      <div className="mt-2 flex -space-x-2">
        {[
          'bg-gradient-to-br from-rose-400 to-pink-600',
          'bg-gradient-to-br from-amber-400 to-orange-600',
          'bg-gradient-to-br from-emerald-400 to-teal-600',
          'bg-gradient-to-br from-sky-400 to-indigo-600',
        ].map((cls, i) => (
          <div
            key={i}
            className={`w-6 h-6 rounded-full ring-2 ring-card dark:ring-obsidian-900 ${cls}`}
          />
        ))}
        <div className="w-6 h-6 rounded-full ring-2 ring-card dark:ring-obsidian-900 bg-secondary text-[10px] font-bold flex items-center justify-center text-muted-foreground border border-border">
          +84
        </div>
      </div>
    </GlassCard>
  );
}

function WidgetAIConfidence() {
  return (
    <GlassCard className="p-3">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-ai-violet/15 border border-ai-violet/30 flex items-center justify-center text-ai-violet">
          <Sparkles className="w-4 h-4" />
        </div>
        <div>
          <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
            AI Confidence
          </div>
          <div className="text-base font-heading font-extrabold font-mono text-foreground leading-none">
            99.4%
          </div>
        </div>
      </div>
      <div className="mt-2">
        <div className="h-1.5 w-full rounded-full bg-border/70 overflow-hidden">
          <div className="h-full rounded-full bg-gradient-to-r from-brand-500 via-ai-violet to-ai-cyan w-[99%]" />
        </div>
        <div className="mt-1.5 text-[10px] text-muted-foreground flex items-center gap-1">
          <ShieldCheck className="w-3 h-3 text-ai-emerald" />
          Zero hallucinations today
        </div>
      </div>
    </GlassCard>
  );
}
