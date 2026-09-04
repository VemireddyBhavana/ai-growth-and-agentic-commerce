'use client';

import * as React from 'react';
import {
  Menu,
  Search,
  Moon,
  Sun,
  ChevronDown,
  User,
  CreditCard,
  HelpCircle,
  LogOut,
  Sparkles,
  Globe,
} from 'lucide-react';
import { NotificationBell } from './notifications';
import { useTheme } from 'next-themes';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useAuthActions } from '@/lib/auth/hooks/use-auth-actions';
import { useSupabase } from '@/lib/auth/supabase/client';

type DashboardNavbarProps = {
  onMenuClick: () => void;
  onSearchClick?: () => void;
  merchantName?: string;
};

export function DashboardNavbar({
  onMenuClick,
  onSearchClick,
  merchantName = 'Acme Retail',
}: DashboardNavbarProps) {
  const { theme, setTheme } = useTheme();
  const { signOut, submitting } = useAuthActions();
  const { session } = useSupabase();
  const user = session?.user;
  const [profileOpen, setProfileOpen] = React.useState(false);
  const [searchFocused, setSearchFocused] = React.useState(false);
  const profileRef = React.useRef<HTMLDivElement>(null);

  const initials = React.useMemo(() => {
    const name = user?.user_metadata?.name ?? user?.email ?? 'A';
    return (name as string)
      .split(/[\s.@-]/)
      .filter(Boolean)
      .slice(0, 2)
      .map((s: string) => s[0]?.toUpperCase() ?? '')
      .join('') || 'A';
  }, [user]);

  const displayName = React.useMemo(() => {
    return (user?.user_metadata?.name as string) || merchantName;
  }, [user, merchantName]);

  const displayEmail = React.useMemo(() => {
    return user?.email ?? 'merchant@store.com';
  }, [user]);

  React.useEffect(() => {
    function onClick(e: MouseEvent) {
      if (!profileRef.current) return;
      if (!profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  return (
    <header className="sticky top-0 z-20 backdrop-blur-2xl bg-background/70 dark:bg-obsidian-950/70 border-b border-border/60 dark:border-white/10">
      <div className="h-16 flex items-center gap-3 px-4 sm:px-6 lg:px-8">
        {/* Mobile Menu Button */}
        <motion.button
          type="button"
          onClick={onMenuClick}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="md:hidden inline-flex h-9 w-9 items-center justify-center rounded-xl border border-border/70 dark:border-white/10 bg-background/60 dark:bg-obsidian-900/60 text-muted-foreground hover:text-foreground hover:border-brand-500/40 transition-all shadow-lg hover:shadow-brand-500/10"
          aria-label="Open menu"
        >
          <Menu className="w-4.5 h-4.5" strokeWidth={2} />
        </motion.button>

        {/* Merchant Selector */}
        <div className="hidden md:flex items-center gap-2">
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-[11px] font-mono font-bold uppercase tracking-[0.14em] text-muted-foreground flex items-center gap-1.5"
          >
            <Globe className="w-3 h-3" strokeWidth={2} />
            Store
          </motion.span>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 px-2.5 py-1 rounded-lg border border-border/60 dark:border-white/10 bg-background/50 dark:bg-obsidian-900/50 hover:border-brand-500/30 cursor-pointer transition-all hover:shadow-lg hover:shadow-brand-500/10 group"
          >
            <span className="font-semibold text-[13px] text-foreground group-hover:text-brand-500 transition-colors">{merchantName}</span>
            <motion.div
              animate={{ rotate: profileOpen ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown className="w-3.5 h-3.5 text-muted-foreground group-hover:text-brand-500 transition-colors" strokeWidth={2} />
            </motion.div>
          </motion.button>
        </div>

        {/* Global Search */}
        <div className="flex-1 flex justify-center md:ml-6">
          <motion.div
            className={cn(
              'relative w-full max-w-md transition-all duration-300',
              searchFocused && 'max-w-lg scale-[1.02]'
            )}
          >
            <motion.div
              animate={{
                boxShadow: searchFocused
                  ? '0 0 0 3px rgba(99,102,241,0.3), 0 0 20px rgba(99,102,241,0.2)'
                  : 'none'
              }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 rounded-xl -z-10"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/70" strokeWidth={2} />
            <kbd className="hidden sm:inline-flex absolute right-3 top-1/2 -translate-y-1/2 items-center gap-0.5 px-1.5 py-0.5 rounded-md border border-border/50 dark:border-white/10 bg-background/60 dark:bg-obsidian-900/60 text-[10px] font-mono text-muted-foreground">
              ⌘K
            </kbd>
            <input
              type="search"
              readOnly
              placeholder="Search customers, orders, products, AI sessions…"
              onFocus={() => {
                setSearchFocused(true);
                onSearchClick?.();
              }}
              onBlur={() => setSearchFocused(false)}
              onClick={() => onSearchClick?.()}
              className="w-full h-9 rounded-xl border border-border/70 dark:border-white/10 bg-background/60 dark:bg-obsidian-900/60 pl-9 pr-16 sm:pr-20 text-[13px] text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500/50 transition-all cursor-pointer"
            />
          </motion.div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {/* Theme Toggle */}
          <motion.button
            type="button"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            whileHover={{ scale: 1.05, rotate: 15 }}
            whileTap={{ scale: 0.95 }}
            className="relative inline-flex h-9 w-9 items-center justify-center rounded-xl border border-border/70 dark:border-white/10 bg-background/60 dark:bg-obsidian-900/60 text-muted-foreground hover:text-foreground hover:border-brand-500/40 transition-all shadow-lg hover:shadow-brand-500/10"
            aria-label="Toggle theme"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={theme}
                initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                exit={{ opacity: 0, rotate: 90, scale: 0.5 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="absolute"
              >
                {theme === 'dark' ? (
                  <Sun className="w-4.5 h-4.5" strokeWidth={2} />
                ) : (
                  <Moon className="w-4.5 h-4.5" strokeWidth={2} />
                )}
              </motion.span>
            </AnimatePresence>
          </motion.button>

          {/* Notifications */}
          <NotificationBell />

          {/* Profile Menu */}
          <div ref={profileRef} className="relative">
            <motion.button
              type="button"
              onClick={() => setProfileOpen((v) => !v)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2.5 pl-1 pr-1.5 py-1 rounded-xl border border-border/70 dark:border-white/10 bg-background/60 dark:bg-obsidian-900/60 hover:border-brand-500/40 transition-all hover:shadow-lg hover:shadow-brand-500/10 group"
            >
              <div className="relative h-8 w-8 rounded-lg bg-gradient-to-br from-brand-500 to-ai-violet grid place-items-center text-white text-[12px] font-bold font-heading shadow-inner">
                {initials}
                <motion.span
                  className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-ai-emerald border-2 border-background dark:border-obsidian-950"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-[12.5px] font-semibold text-foreground leading-none group-hover:text-brand-500 transition-colors">
                  {displayName}
                </p>
                <p className="text-[11px] text-muted-foreground truncate max-w-[150px]">
                  {displayEmail}
                </p>
              </div>
              <motion.div
                animate={{ rotate: profileOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown className="w-3.5 h-3.5 text-muted-foreground group-hover:text-brand-500 transition-colors" strokeWidth={2} />
              </motion.div>
            </motion.button>

            <AnimatePresence>
              {profileOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.95 }}
                  transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute right-0 top-full mt-2 w-72 rounded-2xl border border-border/70 dark:border-white/10 bg-card/95 dark:bg-obsidian-900/95 backdrop-blur-2xl shadow-2xl overflow-hidden z-50"
                >
                  {/* Profile Header */}
                  <div className="px-4 py-3.5 border-b border-border/60 dark:border-white/10 bg-gradient-to-b from-white/5 to-transparent">
                    <div className="flex items-center gap-3">
                      <motion.div
                        className="relative h-11 w-11 rounded-xl bg-gradient-to-br from-brand-500 to-ai-violet grid place-items-center text-white text-[14px] font-bold font-heading shadow-inner"
                        whileHover={{ scale: 1.05, rotate: 5 }}
                        transition={{ duration: 0.2 }}
                      >
                        {initials}
                        <motion.div
                          className="absolute inset-0 rounded-xl bg-white/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity"
                        />
                      </motion.div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[13.5px] font-semibold text-foreground truncate">{displayName}</p>
                        <p className="text-[12px] text-muted-foreground truncate">{displayEmail}</p>
                      </div>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="p-1.5 space-y-0.5">
                    {[
                      { label: 'Profile', icon: User, description: 'View your profile settings' },
                      { label: 'Billing & Payments', icon: CreditCard, description: 'Manage payment methods' },
                      { label: 'Help & Support', icon: HelpCircle, description: 'Get help and support' },
                    ].map((item, idx) => {
                      const Icon = item.icon;
                      return (
                        <motion.button
                          key={item.label}
                          type="button"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.05 }}
                          onClick={() => setProfileOpen(false)}
                          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium text-muted-foreground hover:text-foreground hover:bg-white/5 dark:hover:bg-white/5 transition-all group"
                        >
                          <motion.div
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            transition={{ duration: 0.2 }}
                            className="relative"
                          >
                            <Icon className="w-4 h-4" strokeWidth={2} />
                          </motion.div>
                          <div className="flex-1 text-left">
                            <span>{item.label}</span>
                            <p className="text-[10px] text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                              {item.description}
                            </p>
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>

                  {/* Pro Plan Banner */}
                  <div className="mx-2 mb-2 p-3 rounded-xl bg-gradient-to-r from-brand-600/10 via-ai-violet/10 to-ai-cyan/10 border border-white/10">
                    <div className="flex items-center gap-2 mb-1">
                      <Sparkles className="w-3.5 h-3.5 text-ai-violet" strokeWidth={2} />
                      <span className="text-[11px] font-bold text-foreground">Pro Plan Active</span>
                    </div>
                    <p className="text-[10px] text-muted-foreground">Unlimited AI sessions & premium features</p>
                  </div>

                  {/* Sign Out */}
                  <div className="p-1.5 border-t border-border/60 dark:border-white/10">
                    <motion.button
                      type="button"
                      onClick={() => {
                        setProfileOpen(false);
                        void signOut();
                      }}
                      disabled={submitting !== false}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium text-red-500 hover:bg-red-500/5 dark:hover:bg-red-500/10 transition-all group"
                    >
                      <motion.div
                        whileHover={{ rotate: -10, scale: 1.1 }}
                        transition={{ duration: 0.2 }}
                      >
                        <LogOut className="w-4 h-4" strokeWidth={2} />
                      </motion.div>
                      <span className="flex-1 text-left">Sign out</span>
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
}
