'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu } from 'lucide-react';
import { NavbarBrand } from './navbar-brand';
import { NavLinks, DEFAULT_NAV_LINKS, NavLinkItem } from './nav-links';
import { NavActions } from './nav-actions';
import { MobileNav } from './mobile-nav';

export interface NavbarProps {
  links?: NavLinkItem[];
  className?: string;
}

export function Navbar({ links = DEFAULT_NAV_LINKS, className = '' }: NavbarProps) {
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  React.useEffect(() => {
    const handler = () => {
      if (window.innerWidth >= 1024) setMobileMenuOpen(false);
    };
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  return (
    <>
      <motion.header
        role="banner"
        initial={{ opacity: 0, y: -18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: 0.05 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-background/80 dark:bg-obsidian-950/80 [backdrop-filter:saturate(180%)_blur(16px)] border-b border-border/60 shadow-[0_1px_0_rgba(255,255,255,0.03),0_10px_30px_-12px_rgba(0,0,0,0.25)] py-3'
            : 'bg-transparent py-5'
        } ${className}`}
      >
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <NavbarBrand />
          <NavLinks links={links} />
          <NavActions />

          <div className="flex items-center gap-2 lg:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open Navigation Menu"
              aria-haspopup="dialog"
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-navigation"
              className="relative inline-flex items-center justify-center p-2.5 rounded-xl text-foreground hover:bg-secondary transition-all duration-200 border border-border focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/60 active:scale-[0.96]"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key="burger"
                  initial={{ opacity: 0, scale: 0.8, rotate: -30 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  exit={{ opacity: 0, scale: 0.8, rotate: 30 }}
                  transition={{ duration: 0.18, ease: 'easeOut' }}
                >
                  <Menu className="w-5 h-5" aria-hidden="true" />
                </motion.span>
              </AnimatePresence>
            </button>
          </div>
        </div>

        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[70] focus:px-4 focus:py-2 focus:rounded-lg focus:bg-brand-600 focus:text-white focus:font-semibold focus:shadow-lg"
        >
          Skip to content
        </a>
      </motion.header>

      <div id="mobile-navigation">
        <MobileNav
          open={mobileMenuOpen}
          onClose={() => setMobileMenuOpen(false)}
          links={links}
        />
      </div>
    </>
  );
}

export { NavbarBrand, NavLinks, NavActions, MobileNav, DEFAULT_NAV_LINKS };
export type { NavLinkItem } from './nav-links';
