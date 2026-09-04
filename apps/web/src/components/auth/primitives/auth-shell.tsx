'use client';

import * as React from 'react';
import { motion, type Variants } from 'framer-motion';
import { cn } from '@/lib/utils';
import { NexusLogo } from '../../landing/NexusLogo';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const pageShellVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.45,
      ease: [0.22, 1, 0.36, 1],
      staggerChildren: 0.06,
    },
  },
};

const childVariants: Variants = {
  hidden: { opacity: 0, y: 18, scale: 0.985 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

export interface AuthPageShellProps {
  children: React.ReactNode;
  className?: string;
}

export function AuthPageShell({ children, className }: AuthPageShellProps) {
  return (
    <div
      className={cn(
        'relative min-h-screen w-full overflow-hidden bg-background text-foreground',
        className,
      )}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      >
        <motion.div
          animate={{ x: [0, 18, -14, 0], y: [0, -12, 10, 0] }}
          transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-[8%] -left-24 w-[500px] h-[480px] rounded-full bg-ai-violet/14 dark:bg-ai-violet/20 blur-[150px] opacity-80"
        />
        <motion.div
          animate={{ x: [0, -16, 12, 0], y: [0, 10, -14, 0] }}
          transition={{ duration: 24, repeat: Infinity, ease: 'easeInOut', delay: 1.2 }}
          className="absolute top-[30%] -right-20 w-[520px] h-[460px] rounded-full bg-brand-600/12 dark:bg-brand-600/18 blur-[150px] opacity-75"
        />
        <motion.div
          animate={{ x: [0, 14, -10, 0], y: [0, -8, 12, 0] }}
          transition={{ duration: 26, repeat: Infinity, ease: 'easeInOut', delay: 2.4 }}
          className="absolute bottom-[10%] left-1/3 w-[400px] h-[380px] rounded-full bg-[#1366ef]/11 dark:bg-[#1366ef]/16 blur-[140px] opacity-65"
        />
        <motion.div
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut', delay: 0.6 }}
          className="absolute top-[48%] right-[22%] w-[260px] h-[260px] rounded-full bg-ai-emerald/10 dark:bg-ai-emerald/14 blur-[130px] opacity-55"
        />
        <div className="absolute inset-0 bg-grid-black dark:bg-grid-white opacity-[0.16] dark:opacity-[0.12] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_45%,#000_55%,transparent_100%)]" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-transparent to-background/70 pointer-events-none" />
      </div>

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 py-8 sm:py-10 lg:py-12">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={pageShellVariants}
          className="w-full max-w-6xl flex flex-col items-center gap-6"
        >
          {children}
        </motion.div>
      </div>
    </div>
  );
}

export const AuthShellChild = motion.div;
export const authShellChildVariants = childVariants;

export type AuthEyebrowTone = 'brand' | 'violet' | 'cyan' | 'emerald' | 'razorpay';

export interface AuthHeaderProps {
  title: string;
  subtitle?: string;
  eyebrow?: {
    label: string;
    tone?: AuthEyebrowTone;
  };
  className?: string;
}

const eyebrowToneMap: Record<AuthEyebrowTone, string> = {
  brand: 'bg-brand-500/12 text-brand-600 dark:text-brand-400 border-brand-500/30',
  violet: 'bg-ai-violet/12 text-ai-violet border-ai-violet/30',
  cyan: 'bg-ai-cyan/12 text-ai-cyan border-ai-cyan/30',
  emerald: 'bg-ai-emerald/12 text-ai-emerald border-ai-emerald/30',
  razorpay: 'bg-[#1366ef]/12 text-[#0f54c8] dark:text-[#60a5fa] border-[#1366ef]/30',
};

export function AuthHeader({
  title,
  subtitle,
  eyebrow = { label: 'AI Sales Assistant', tone: 'violet' },
  className,
}: AuthHeaderProps) {
  const eyebrowClass = eyebrowToneMap[eyebrow.tone ?? 'violet'];
  return (
    <motion.div
      variants={authShellChildVariants}
      className={cn('flex flex-col items-center text-center max-w-lg', className)}
    >
      <Link
        href="/"
        aria-label="Go to home"
        className="inline-flex items-center gap-2.5 mb-6 group"
      >
        <div className="relative">
          <div className="absolute inset-0 rounded-2xl bg-ai-violet/40 blur-md opacity-60 group-hover:opacity-90 transition-opacity animate-pulse" />
          <div className="relative w-11 h-11 rounded-2xl bg-ai-violet/15 dark:bg-ai-violet/25 border border-ai-violet/40 flex items-center justify-center shadow-inner">
            <NexusLogo className="w-6 h-6 text-ai-violet" />
          </div>
        </div>
        <div className="flex flex-col items-start text-left">
          <span className="font-heading font-extrabold text-lg sm:text-xl tracking-tight text-foreground leading-tight">
            AI Sales Assistant
          </span>
          <span className="text-[11px] font-mono text-muted-foreground tracking-wide">
            Autonomous Agentic Commerce
          </span>
        </div>
      </Link>
      <span
        className={cn(
          'inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[10.5px] font-mono font-bold uppercase tracking-[0.2em] mb-4 shadow-sm border',
          eyebrowClass,
        )}
      >
        {eyebrow.label}
      </span>
      <h1 className="font-heading font-extrabold text-2.5xl sm:text-3xl md:text-4xl text-foreground tracking-tight leading-[1.12] text-balance">
        {title}
      </h1>
      {subtitle ? (
        <p className="mt-3 text-sm sm:text-base text-muted-foreground leading-relaxed max-w-md text-balance">
          {subtitle}
        </p>
      ) : null}
    </motion.div>
  );
}

export interface AuthCardProps {
  children: React.ReactNode;
  className?: string;
  headerSlot?: React.ReactNode;
  footerSlot?: React.ReactNode;
}

export function AuthCard({ children, className, headerSlot, footerSlot }: AuthCardProps) {
  return (
    <motion.div
      variants={authShellChildVariants}
      className={cn(
        'group relative w-full max-w-md rounded-[28px] border border-border/70 dark:border-white/10 bg-card/70 dark:bg-obsidian-900/70 backdrop-blur-2xl shadow-[0_32px_80px_-32px_rgba(15,23,42,0.85)] overflow-hidden',
        className,
      )}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-br from-ai-violet/[0.05] via-transparent to-brand-500/[0.05] dark:from-ai-violet/[0.08] dark:to-brand-500/[0.07]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-px rounded-[28px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-white/12 via-transparent to-white/5 dark:from-white/[0.09]"
        style={{
          WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
          padding: '1px',
        }}
      />
      <div className="relative p-6 sm:p-8">
        {headerSlot ? <div className="mb-6">{headerSlot}</div> : null}
        {children}
      </div>
      {footerSlot ? (
        <div className="relative px-6 sm:px-8 py-5 border-t border-border/55 bg-secondary/25 dark:bg-obsidian-950/40">
          {footerSlot}
        </div>
      ) : null}
    </motion.div>
  );
}

export interface BackLinkProps {
  href: string;
  label: string;
  className?: string;
}

export function BackLink({ href, label, className }: BackLinkProps) {
  return (
    <motion.div variants={authShellChildVariants} className={cn('w-full max-w-md', className)}>
      <Link
        href={href}
        className="inline-flex items-center gap-2 text-[12px] font-medium text-muted-foreground/90 hover:text-foreground transition-colors group"
      >
        <span className="flex items-center justify-center w-7 h-7 rounded-xl border border-border/70 dark:border-white/10 bg-background/60 dark:bg-obsidian-900/60 group-hover:border-brand-500/50 group-hover:bg-brand-500/8 transition-all duration-200">
          <ArrowLeft className="w-3.5 h-3.5" strokeWidth={2.2} aria-hidden />
        </span>
        {label}
      </Link>
    </motion.div>
  );
}
