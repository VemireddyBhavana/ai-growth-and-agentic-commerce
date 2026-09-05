'use client';

import * as React from 'react';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { motion } from 'framer-motion';
import { Sun, Moon, Sparkles, ArrowRight } from 'lucide-react';
import { fadeInVariants, springTransition } from '@/lib/animations';

interface NavActionsProps {
  className?: string;
  orientation?: 'horizontal' | 'vertical';
  onNavigate?: () => void;
}

export function NavActions({ className = '', orientation = 'horizontal', onNavigate }: NavActionsProps) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => setMounted(true), []);

  const effectiveTheme = mounted ? (resolvedTheme ?? theme) : 'dark';
  const isDark = effectiveTheme === 'dark';

  const toggleTheme = () => {
    setTheme(isDark ? 'light' : 'dark');
  };

  if (orientation === 'vertical') {
    return (
      <div className={`flex flex-col gap-3 ${className}`}>
        <Link
          href="/login"
          onClick={onNavigate}
          className="w-full py-2.5 text-center text-sm font-medium text-foreground bg-secondary/80 rounded-xl hover:bg-secondary transition-all duration-200 active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/60"
        >
          Sign In
        </Link>
        <Link
          href="/register"
          onClick={onNavigate}
          className="group relative w-full py-3 text-center text-sm font-semibold text-white rounded-xl overflow-hidden shadow-lg shadow-brand-600/30 transition-all duration-200 active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/60"
        >
          <span
            className="absolute inset-0 bg-gradient-to-r from-brand-600 via-ai-violet to-brand-600 bg-[length:200%_auto] transition-all duration-500 ease-out group-hover:bg-[position:100%_center]"
            aria-hidden="true"
          />
          <span className="relative z-10 inline-flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-200" aria-hidden="true" />
            Get Started Free
          </span>
        </Link>
      </div>
    );
  }

  return (
    <div className={`hidden lg:flex items-center gap-3 ${className}`}>
      {mounted && (
        <motion.button
          variants={fadeInVariants}
          initial="hidden"
          animate="visible"
          onClick={toggleTheme}
          aria-label={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          aria-pressed={isDark}
          className="relative p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-secondary/80 dark:hover:bg-obsidian-850 transition-colors border border-transparent hover:border-border focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/60 active:scale-[0.95]"
          whileTap={{ scale: 0.92 }}
          transition={springTransition}
        >
          <AnimatedThemeIcon isDark={isDark} />
        </motion.button>
      )}

      <Link
        href="/login"
        className="relative inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground px-3.5 py-2 rounded-full transition-all duration-200 hover:bg-secondary/70 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/60 active:scale-[0.98]"
      >
        Sign In
      </Link>

      <Link
        href="/register"
        className="group relative inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold text-white overflow-hidden shadow-md shadow-brand-600/25 transition-all duration-300 hover:shadow-xl hover:shadow-brand-600/40 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-brand-500 focus-visible:ring-offset-background"
      >
        <span
          className="absolute inset-0 bg-gradient-to-r from-brand-600 via-ai-violet to-brand-600 bg-[length:200%_auto] transition-all duration-500 ease-out group-hover:bg-[position:100%_center]"
          aria-hidden="true"
        />
        <motion.span
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15, type: 'spring' }}
          className="relative z-10 inline-flex items-center gap-2"
        >
          <Sparkles className="w-3.5 h-3.5 text-cyan-200 animate-pulse" aria-hidden="true" />
          <span>Get Started</span>
          <ArrowRight
            className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1"
            aria-hidden="true"
          />
        </motion.span>
      </Link>
    </div>
  );
}

function AnimatedThemeIcon({ isDark }: { isDark: boolean }) {
  return (
    <div className="relative w-4 h-4">
      <motion.div
        key="sun"
        initial={false}
        animate={{
          opacity: isDark ? 1 : 0,
          scale: isDark ? 1 : 0.5,
          rotate: isDark ? 0 : -45,
        }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className="absolute inset-0"
      >
        <Sun className="w-4 h-4 text-amber-400" />
      </motion.div>
      <motion.div
        key="moon"
        initial={false}
        animate={{
          opacity: isDark ? 0 : 1,
          scale: isDark ? 0.5 : 1,
          rotate: isDark ? 45 : 0,
        }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className="absolute inset-0"
      >
        <Moon className="w-4 h-4 text-slate-700" />
      </motion.div>
    </div>
  );
}
