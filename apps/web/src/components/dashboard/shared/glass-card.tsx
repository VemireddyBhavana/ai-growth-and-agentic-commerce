'use client';

import * as React from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';

type GlassCardProps = HTMLMotionProps<'div'> & {
  glow?: 'brand' | 'violet' | 'cyan' | 'emerald' | 'none';
  padded?: boolean;
  interactive?: boolean;
};

export function GlassCard({
  className,
  glow = 'none',
  padded = true,
  interactive = false,
  children,
  ...props
}: GlassCardProps) {
  return (
    <motion.div
      whileHover={
        interactive
          ? { y: -4, scale: 1.008, transition: { duration: 0.25, ease: 'easeOut' } }
          : undefined
      }
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className={cn(
        'relative overflow-hidden rounded-3xl border border-border/70 dark:border-white/10',
        'bg-card/70 dark:bg-obsidian-900/70 backdrop-blur-2xl',
        'shadow-[0_24px_64px_-32px_rgba(15,23,42,0.8)]',
        padded && 'p-5 sm:p-6',
        interactive && 'hover:border-brand-500/30 cursor-pointer transition-colors duration-300',
        glow === 'brand' && 'before:pointer-events-none before:absolute before:-top-24 before:-right-24 before:w-[260px] before:h-[260px] before:rounded-full before:bg-brand-500/15 before:blur-3xl before:opacity-60',
        glow === 'violet' && 'before:pointer-events-none before:absolute before:-top-24 before:-right-24 before:w-[260px] before:h-[260px] before:rounded-full before:bg-ai-violet/18 before:blur-3xl before:opacity-60',
        glow === 'cyan' && 'before:pointer-events-none before:absolute before:-top-24 before:-right-24 before:w-[260px] before:h-[260px] before:rounded-full before:bg-ai-cyan/15 before:blur-3xl before:opacity-60',
        glow === 'emerald' && 'before:pointer-events-none before:absolute before:-top-24 before:-right-24 before:w-[260px] before:h-[260px] before:rounded-full before:bg-ai-emerald/15 before:blur-3xl before:opacity-60',
        className,
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
}

type CardHeaderProps = {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  className?: string;
};

export function CardHeader({ title, subtitle, action, className }: CardHeaderProps) {
  return (
    <div className={cn('flex items-start justify-between gap-4 mb-5', className)}>
      <div>
        <h3 className="font-heading font-bold text-[15px] sm:text-base text-foreground">{title}</h3>
        {subtitle && (
          <p className="text-[12px] text-muted-foreground mt-0.5">{subtitle}</p>
        )}
      </div>
      {action}
    </div>
  );
}
