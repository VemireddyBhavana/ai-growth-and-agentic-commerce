'use client';

import * as React from 'react';
import { motion, type Variants } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Github, Mail } from 'lucide-react';

const providerButtonVariants: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.38, delay: 0.12 + i * 0.08, ease: [0.22, 1, 0.36, 1] },
  }),
};

interface SocialProviderButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  provider: 'google' | 'github' | 'email';
  label: string;
  loading?: boolean;
}

const providerStyles: Record<
  SocialProviderButtonProps['provider'],
  { bg: string; hover: string; iconWrap: string; border: string }
> = {
  google: {
    bg: 'bg-white dark:bg-obsidian-950/70',
    hover: 'hover:bg-gray-50 dark:hover:bg-obsidian-900',
    iconWrap: 'bg-white dark:bg-obsidian-950',
    border: 'border-border/80 dark:border-white/10',
  },
  github: {
    bg: 'bg-[#0f1117] dark:bg-obsidian-950/90 text-white',
    hover: 'hover:bg-black dark:hover:bg-black/90',
    iconWrap: 'bg-black/80 dark:bg-black',
    border: 'border-black/15 dark:border-white/10',
  },
  email: {
    bg: 'bg-background/80 dark:bg-obsidian-950/70',
    hover: 'hover:bg-secondary/70 dark:hover:bg-obsidian-900',
    iconWrap: 'bg-ai-violet/15 dark:bg-ai-violet/25',
    border: 'border-border/80 dark:border-white/10',
  },
};

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" width="20" height="20" className={className} aria-hidden>
      <path
        fill="#EA4335"
        d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
      />
      <path
        fill="#4285F4"
        d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
      />
      <path
        fill="#FBBC05"
        d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
      />
      <path
        fill="#34A853"
        d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
      />
    </svg>
  );
}

export function SocialProviderButton({
  provider,
  label,
  loading = false,
  disabled,
  className,
  ...props
}: SocialProviderButtonProps) {
  const styles = providerStyles[provider];
  const ProviderIcon =
    provider === 'google'
      ? (args: { className?: string }) => GoogleIcon(args)
      : provider === 'github'
        ? (args: { className?: string }) => (
            <Github className={args.className} strokeWidth={2.1} aria-hidden />
          )
        : (args: { className?: string }) => (
            <Mail className={args.className} strokeWidth={2.1} aria-hidden />
          );
  const iconTone =
    provider === 'github'
      ? 'text-white'
      : provider === 'email'
        ? 'text-ai-violet'
        : 'text-transparent';
  return (
    <button
      type="button"
      disabled={disabled || loading}
      className={cn(
        'group relative flex w-full items-center justify-center gap-2.5 h-11 px-4 rounded-xl border transition-all duration-250 font-medium text-sm shadow-sm',
        styles.border,
        styles.bg,
        styles.hover,
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background dark:focus-visible:ring-offset-obsidian-950',
        'disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100',
        'active:scale-[0.985]',
        className,
      )}
      {...props}
    >
      <span
        className={cn(
          'flex items-center justify-center w-[22px] h-[22px] rounded-lg shrink-0',
          provider !== 'google' ? styles.iconWrap : '',
        )}
      >
        <ProviderIcon className={cn('w-[18px] h-[18px]', iconTone)} />
      </span>
      {loading ? (
        <span className="inline-flex items-center gap-1.5">
          <span className="inline-flex gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70 animate-bounce [animation-delay:-0.3s]" />
            <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70 animate-bounce [animation-delay:-0.15s]" />
            <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70 animate-bounce" />
          </span>
          <span className="font-mono text-[11.5px] tracking-wide opacity-80">
            Connecting…
          </span>
        </span>
      ) : (
        <span className="leading-tight">{label}</span>
      )}
    </button>
  );
}

interface SocialDividerProps {
  label?: string;
  className?: string;
}

export function SocialDivider({ label = 'or continue with email', className }: SocialDividerProps) {
  return (
    <div className={cn('relative flex items-center w-full my-5 sm:my-6', className)}>
      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border/80 dark:via-white/15 to-transparent" />
      <span className="mx-4 text-[11px] font-mono font-semibold uppercase tracking-[0.18em] text-muted-foreground/80 whitespace-nowrap">
        {label}
      </span>
      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border/80 dark:via-white/15 to-transparent" />
    </div>
  );
}

interface SocialProviderButtonsProps {
  onGoogle?: () => Promise<void> | void;
  onGitHub?: () => Promise<void> | void;
  googleLabel?: string;
  githubLabel?: string;
  loadingProvider?: 'google' | 'github' | null;
  className?: string;
}

export function SocialProviderButtons({
  onGoogle,
  onGitHub,
  googleLabel = 'Continue with Google',
  githubLabel = 'Continue with GitHub',
  loadingProvider = null,
  className,
}: SocialProviderButtonsProps) {
  const items = React.useMemo(() => {
    const arr: Array<{
      provider: 'google' | 'github';
      label: string;
      handler?: SocialProviderButtonsProps['onGoogle'];
      loading: boolean;
    }> = [];
    if (typeof onGoogle === 'function') {
      arr.push({
        provider: 'google',
        label: googleLabel,
        handler: onGoogle,
        loading: loadingProvider === 'google',
      });
    }
    if (typeof onGitHub === 'function') {
      arr.push({
        provider: 'github',
        label: githubLabel,
        handler: onGitHub,
        loading: loadingProvider === 'github',
      });
    }
    return arr;
  }, [onGoogle, onGitHub, loadingProvider, googleLabel, githubLabel]);

  if (items.length === 0) return null;

  return (
    <div className={cn('flex flex-col sm:flex-row gap-3', className)}>
      {items.map((item, idx) => (
        <motion.div
          key={item.provider}
          custom={idx}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-40px' }}
          variants={providerButtonVariants}
          className="flex-1 min-w-0"
        >
          <SocialProviderButton
            provider={item.provider}
            label={item.label}
            loading={item.loading}
            onClick={() => void item.handler?.()}
          />
        </motion.div>
      ))}
    </div>
  );
}
