'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  PackagePlus,
  Megaphone,
  Bot,
  FileText,
  Ticket,
  Sparkles,
  ArrowUpRight,
  Flame,
} from 'lucide-react';
import { GlassCard } from '../shared';
import { cn } from '@/lib/utils';

type QuickAction = {
  key: string;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  tone: string;
  hotkey?: string;
  popular?: boolean;
  href: string;
};

const quickActions: QuickAction[] = [
  {
    key: 'add-product',
    label: 'Add Product',
    description: 'Upload a new SKU to your catalog',
    icon: PackagePlus,
    tone: 'from-brand-600 via-brand-500 to-ai-violet',
    hotkey: '⌘P',
    href: '/assistant',
  },
  {
    key: 'launch-campaign',
    label: 'Launch Campaign',
    description: 'AI-powered campaign builder',
    icon: Megaphone,
    tone: 'from-ai-violet via-purple-500 to-fuchsia-500',
    hotkey: '⌘M',
    popular: true,
    href: '/analytics',
  },
  {
    key: 'open-ai',
    label: 'Open AI Assistant',
    description: 'Start a concierge session',
    icon: Bot,
    tone: 'from-ai-cyan via-cyan-500 to-sky-500',
    hotkey: '⌘K',
    popular: true,
    href: '/assistant',
  },
  {
    key: 'generate-report',
    label: 'Generate Report',
    description: 'Weekly performance insights PDF',
    icon: FileText,
    tone: 'from-ai-emerald via-emerald-500 to-teal-500',
    hotkey: '⌘R',
    href: '/analytics',
  },
  {
    key: 'create-coupon',
    label: 'Create Coupon',
    description: 'Discount / BOGO / free shipping',
    icon: Ticket,
    tone: 'from-amber-500 via-orange-500 to-rose-500',
    hotkey: '⌘C',
    href: '/checkout',
  },
];

function PremiumActionButton({ action, idx }: { action: QuickAction; idx: number }) {
  const router = useRouter();
  const Icon = action.icon;
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <motion.button
      key={action.key}
      type="button"
      onClick={() => router.push(action.href)}
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.18 + idx * 0.08, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ y: -5, scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      className="group relative aspect-square min-h-[124px] rounded-2xl border border-white/10 dark:border-white/10 bg-background/50 dark:bg-obsidian-950/50 p-4 flex flex-col items-start justify-between overflow-hidden hover:border-brand-500/30 transition-all duration-300"
    >
      {/* Animated background gradient */}
      <motion.div
        aria-hidden
        className={cn(
          'absolute -right-10 -bottom-12 w-36 h-36 rounded-full blur-2xl opacity-40 transition-opacity duration-300 bg-gradient-to-br',
          action.tone,
        )}
        animate={{
          opacity: isHovered ? 0.75 : 0.4,
          scale: isHovered ? 1.2 : 1,
        }}
        transition={{ duration: 0.3 }}
      />

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-grid-white opacity-[0.02] pointer-events-none" />

      {/* Popular badge */}
      {action.popular && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 + idx * 0.1 }}
          className="absolute top-3 right-3 inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-ai-emerald/10 text-ai-emerald border border-ai-emerald/20 text-[8px] font-mono font-bold uppercase"
        >
          <motion.div
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Flame className="w-2.5 h-2.5" strokeWidth={2.5} />
          </motion.div>
          Hot
        </motion.div>
      )}

      <div className="relative w-full flex items-start justify-between gap-2">
        <motion.div
          className={cn(
            'relative p-2.5 rounded-xl text-white shadow-[0_0_20px_-4px_rgba(0,0,0,0.4)] bg-gradient-to-br',
            action.tone,
          )}
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="absolute inset-0 rounded-xl bg-white/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity"
          />
          <Icon className="w-4.5 h-4.5 relative z-10" strokeWidth={2.1} />
        </motion.div>
        {action.hotkey && (
          <motion.kbd
            initial={{ opacity: 0, x: 5 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 + idx * 0.05 }}
            className="shrink-0 inline-flex items-center px-1.5 py-0.5 rounded-md border border-white/10 bg-obsidian-900/60 backdrop-blur text-[9.5px] font-mono font-semibold text-muted-foreground/80"
          >
            {action.hotkey}
          </motion.kbd>
        )}
      </div>

      <div className="relative text-left w-full">
        <div className="flex items-center justify-between gap-2">
          <div>
            <motion.p
              className="font-heading font-bold text-[13.5px] leading-snug text-foreground"
              animate={{ x: isHovered ? 2 : 0 }}
              transition={{ duration: 0.2 }}
            >
              {action.label}
            </motion.p>
            <p className="text-[11px] text-muted-foreground mt-0.5 leading-snug">
              {action.description}
            </p>
          </div>
          <motion.div
            initial={{ opacity: 0, x: -5 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 + idx * 0.05 }}
          >
            <ArrowUpRight
              className="w-4 h-4 text-muted-foreground/50 group-hover:text-brand-500 transition-all duration-200"
              strokeWidth={2}
            />
          </motion.div>
        </div>
      </div>
    </motion.button>
  );
}

export function QuickActions() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="lg:col-span-3 2xl:col-span-2"
    >
      <GlassCard padded={false} className="relative overflow-hidden">
        {/* Animated background gradient */}
        <motion.div
          className="absolute -top-28 -right-20 w-[420px] h-[340px] rounded-full bg-gradient-to-br from-brand-500/20 via-ai-violet/15 to-ai-cyan/10 blur-3xl opacity-70 pointer-events-none"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.7, 0.85, 0.7],
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />

        <div className="relative p-5 sm:p-6">
          <div className="flex items-start justify-between gap-4 mb-5">
            <div>
              <motion.p
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-[10.5px] font-mono font-bold uppercase tracking-[0.18em] text-muted-foreground mb-1"
              >
                Fast Access
              </motion.p>
              <motion.h3
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="font-heading font-bold text-[15px] sm:text-base text-foreground"
              >
                Quick Actions
              </motion.h3>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.15 }}
                className="text-[12px] text-muted-foreground mt-0.5"
              >
                Jump directly into your most common merchant workflows
              </motion.p>
            </div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10.5px] font-mono font-bold uppercase tracking-[0.14em] bg-white/5 dark:bg-white/5 border border-white/10 dark:border-white/10 text-muted-foreground shrink-0"
            >
              <motion.div
                animate={{ rotate: [0, 15, -15, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <Sparkles className="w-3 h-3 text-ai-violet" strokeWidth={2.2} />
              </motion.div>
              Smart
            </motion.div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mt-1">
            {quickActions.map((action, idx) => (
              <PremiumActionButton key={action.key} action={action} idx={idx} />
            ))}
          </div>
        </div>
      </GlassCard>
    </motion.section>
  );
}
