'use client';

import * as React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, Sun, Moon } from 'lucide-react';
import { useTheme } from 'next-themes';
import { NavbarBrand } from './navbar-brand';
import { NavLinks, DEFAULT_NAV_LINKS, NavLinkItem } from './nav-links';
import { NavActions } from './nav-actions';

interface MobileNavProps {
  open: boolean;
  onClose: () => void;
  links?: NavLinkItem[];
}

export function MobileNav({ open, onClose, links = DEFAULT_NAV_LINKS }: MobileNavProps) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);
  const effectiveTheme = mounted ? (resolvedTheme ?? theme) : 'dark';
  const isDark = effectiveTheme === 'dark';

  React.useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleKey);
    return () => {
      document.body.style.overflow = originalOverflow;
      document.removeEventListener('keydown', handleKey);
    };
  }, [open, onClose]);

  const sheetRef = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    if (open) {
      const firstFocusable = sheetRef.current?.querySelector<HTMLElement>(
        'a, button, [tabindex]:not([tabindex="-1"])'
      );
      firstFocusable?.focus({ preventScroll: true });
    }
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[60] lg:hidden" aria-hidden={!open}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            onClick={onClose}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            aria-hidden="true"
          />

          <motion.aside
            ref={sheetRef}
            role="dialog"
            aria-modal="true"
            aria-label="Mobile Navigation"
            aria-labelledby="mobile-nav-title"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 280, mass: 0.7 }}
            className="absolute inset-y-0 right-0 w-[88%] max-w-sm h-full bg-background dark:bg-obsidian-950 shadow-2xl border-l border-border flex flex-col"
          >
            <header className="flex items-center justify-between px-5 py-4 border-b border-border">
              <h2 id="mobile-nav-title" className="sr-only">
                Main Menu
              </h2>
              <NavbarBrand onNavigate={onClose} />

              <div className="flex items-center gap-2">
                {mounted && (
                  <button
                    onClick={() => setTheme(isDark ? 'light' : 'dark')}
                    aria-label={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                    className="p-2.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/60 active:scale-[0.95]"
                  >
                    {isDark ? (
                      <Sun className="w-5 h-5 text-amber-400" />
                    ) : (
                      <Moon className="w-5 h-5 text-slate-700" />
                    )}
                  </button>
                )}
                <button
                  onClick={onClose}
                  aria-label="Close Navigation Menu"
                  className="p-2.5 rounded-xl text-foreground hover:bg-secondary transition-colors border border-border focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/60 active:scale-[0.95]"
                >
                  <X className="w-5 h-5" aria-hidden="true" />
                </button>
              </div>
            </header>

            <nav
              role="menu"
              aria-label="Mobile Primary"
              className="flex-1 overflow-y-auto px-4 py-5"
            >
              <NavLinks
                links={links}
                orientation="vertical"
                onNavigate={() => onClose()}
                className="pb-6"
              />
            </nav>

            <footer className="border-t border-border px-5 py-5">
              <NavActions orientation="vertical" onNavigate={onClose} />
              <p className="mt-5 text-center text-[11px] font-mono tracking-widest uppercase text-muted-foreground/70">
                © {new Date().getFullYear()} AI Sales Assistant
              </p>
            </footer>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}
