'use client';

import * as React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export interface NavLinkItem {
  label: string;
  href: string;
  badge?: string;
}

export const DEFAULT_NAV_LINKS: NavLinkItem[] = [
  { label: 'Home', href: '#home' },
  { label: 'Features', href: '#features' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'FAQ', href: '#faq' },
  { label: 'Contact', href: '#contact' },
];

interface NavLinksProps {
  links?: NavLinkItem[];
  activeHref?: string;
  onNavigate?: (href: string) => void;
  className?: string;
  orientation?: 'horizontal' | 'vertical';
}

export function NavLinks({
  links = DEFAULT_NAV_LINKS,
  onNavigate,
  className = '',
  orientation = 'horizontal',
}: NavLinksProps) {
  const [activeHref, setActiveHref] = React.useState<string>('#home');
  const [hoveredIndex, setHoveredIndex] = React.useState<number | null>(null);

  React.useEffect(() => {
    const handleScroll = () => {
      const sections = links
        .map((link) => {
          const id = link.href.replace('#', '');
          const el = document.getElementById(id) ?? document.querySelector(link.href);
          if (!el) return null;
          const rect = el.getBoundingClientRect();
          return { href: link.href, top: rect.top, bottom: rect.bottom };
        })
        .filter(Boolean) as { href: string; top: number; bottom: number }[];

      const scrollPos = window.scrollY + window.innerHeight * 0.35;
      const current = sections.find(
        (s) => scrollPos >= s.top && scrollPos <= s.bottom + window.innerHeight * 0.1
      );
      if (current) setActiveHref(current.href);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [links]);

  const handleClick = (href: string) => {
    setActiveHref(href);
    onNavigate?.(href);
  };

  if (orientation === 'vertical') {
    return (
      <ul className={`flex flex-col gap-1 ${className}`} role="list">
        {links.map((link) => {
          const isActive = activeHref === link.href;
          return (
            <li key={link.label} role="none">
              <Link
                role="menuitem"
                href={link.href}
                onClick={() => handleClick(link.href)}
                aria-current={isActive ? 'page' : undefined}
                className={`group relative flex items-center justify-between px-4 py-3 rounded-xl text-base font-medium transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/60 ${
                  isActive
                    ? 'text-brand-700 dark:text-brand-300 bg-brand-50 dark:bg-brand-500/10'
                    : 'text-foreground hover:bg-secondary'
                }`}
              >
                <span className="flex items-center gap-2">
                  <span
                    className={`inline-block h-1.5 w-1.5 rounded-full transition-colors duration-200 ${
                      isActive ? 'bg-brand-500 scale-110' : 'bg-transparent group-hover:bg-muted-foreground/50'
                    }`}
                  />
                  {link.label}
                  {link.badge && (
                    <span className="px-2 py-0.5 text-[10px] font-mono font-semibold uppercase rounded-full bg-ai-violet/15 text-ai-violet border border-ai-violet/30">
                      {link.badge}
                    </span>
                  )}
                </span>
                <svg
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className={`w-4 h-4 text-muted-foreground transition-transform duration-200 group-hover:translate-x-0.5 ${
                    isActive ? 'text-brand-500 translate-x-0.5' : ''
                  }`}
                >
                  <path
                    fillRule="evenodd"
                    d="M7.21 14.77a.75.75 0 0 1 .02-1.06L11.168 10 7.23 6.29a.75.75 0 1 1 1.04-1.08l4.5 4.25a.75.75 0 0 1 0 1.08l-4.5 4.25a.75.75 0 0 1-1.06-.02Z"
                    clipRule="evenodd"
                  />
                </svg>
              </Link>
            </li>
          );
        })}
      </ul>
    );
  }

  return (
    <nav
      role="menubar"
      aria-label="Primary"
      className={`hidden lg:flex items-center gap-1 bg-secondary/40 dark:bg-obsidian-900/60 p-1.5 rounded-full border border-border/50 backdrop-blur-md ${className}`}
    >
      {links.map((link, index) => {
        const isActive = activeHref === link.href;
        const isHovered = hoveredIndex === index;
        return (
          <div key={link.label} className="relative" role="none">
            {(isActive || isHovered) && (
              <motion.span
                layoutId="nav-active-pill"
                className="absolute inset-0 rounded-full bg-background dark:bg-obsidian-850/80 border border-border/80 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_1px_3px_rgba(0,0,0,0.06)] dark:shadow-[0_1px_2px_rgba(0,0,0,0.3)]"
                transition={{ type: 'spring', stiffness: 500, damping: 40, mass: 0.8 }}
                aria-hidden="true"
              />
            )}
            <Link
              role="menuitem"
              href={link.href}
              onClick={() => handleClick(link.href)}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              onFocus={() => setHoveredIndex(index)}
              onBlur={() => setHoveredIndex(null)}
              aria-current={isActive ? 'page' : undefined}
              className={`relative z-10 inline-flex items-center gap-1.5 px-3.5 py-1.5 text-sm font-medium rounded-full transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/60 ${
                isActive
                  ? 'text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {link.label}
              {isActive && (
                <motion.span
                  layoutId="nav-active-dot"
                  className="ml-1 inline-block h-1.5 w-1.5 rounded-full bg-gradient-to-br from-brand-500 via-ai-violet to-ai-cyan shadow-[0_0_0_2px_rgba(255,255,255,0.9)] dark:shadow-[0_0_0_2px_rgba(15,23,42,0.9)]"
                  transition={{ type: 'spring', stiffness: 500, damping: 40 }}
                  aria-hidden="true"
                />
              )}
              {link.badge && !isActive && (
                <span className="px-1.5 py-0.5 text-[10px] font-mono font-semibold uppercase tracking-wider rounded-full bg-ai-violet/15 text-ai-violet border border-ai-violet/30">
                  {link.badge}
                </span>
              )}
            </Link>
          </div>
        );
      })}
    </nav>
  );
}
