'use client';

import * as React from 'react';
import Link from 'next/link';
import { NexusLogo } from './NexusLogo';
import { 
  Twitter, 
  Github, 
  Linkedin, 
  Disc as Discord, 
  Activity, 
  ShieldCheck,
  Heart
} from 'lucide-react';

const footerSections = [
  {
    title: 'Product',
    links: [
      { label: 'AI Shopping Concierge', href: '#features' },
      { label: 'Merchant Console', href: '#dashboard' },
      { label: 'Dynamic Bundling', href: '#features' },
      { label: 'Vector Catalog Search', href: '#architecture' },
      { label: 'Explainable AI Engine', href: '#features' },
      { label: 'Razorpay 1-Click Checkout', href: '#architecture' },
    ],
  },
  {
    title: 'Solutions',
    links: [
      { label: 'Fashion & Apparel D2C', href: '#features' },
      { label: 'Electronics & Audio', href: '#features' },
      { label: 'Health & Beauty Brands', href: '#features' },
      { label: 'Shopify Plus Integration', href: '#faq' },
      { label: 'WooCommerce Connector', href: '#faq' },
      { label: 'Headless API Suite', href: '#architecture' },
    ],
  },
  {
    title: 'Developers',
    links: [
      { label: 'Documentation', href: '#' },
      { label: 'API Reference', href: '#' },
      { label: 'SDK (Node.js / React)', href: '#' },
      { label: 'Webhooks & Telemetry', href: '#' },
      { label: 'Sandbox Environment', href: '#demo' },
      { label: 'GitHub Repository', href: 'https://github.com' },
    ],
  },
  {
    title: 'Company & Legal',
    links: [
      { label: 'About AI Sales Assistant', href: '#' },
      { label: 'Brand Guidelines', href: '#' },
      { label: 'Security & Compliance', href: '#trusted' },
      { label: 'Privacy Policy', href: '#' },
      { label: 'Terms of Service', href: '#' },
      { label: 'Contact Enterprise Team', href: '#cta' },
    ],
  },
];

export function FooterSection() {
  return (
    <footer className="border-t border-border/60 bg-secondary/20 dark:bg-obsidian-950 pt-16 pb-12 relative overflow-hidden">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10 pb-12 border-b border-border/50">
          {/* Brand Info (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-block">
              <NexusLogo size={36} />
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
              The autonomous agentic commerce platform empowering high-growth merchants with conversational shopping, margin-optimized dynamic bundling, and 1-click Razorpay checkout.
            </p>

            {/* Live System Status Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-xs font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>All Systems Operational (99.99%)</span>
            </div>
          </div>

          {/* Nav Links (4 cols) */}
          {footerSections.map((section, idx) => (
            <div key={idx} className="space-y-3">
              <h4 className="font-heading font-bold text-sm text-foreground tracking-wide">
                {section.title}
              </h4>
              <ul className="space-y-2">
                {section.links.map((link, lIdx) => {
                  const isExternal = link.href.startsWith('http');
                  const isHash = link.href.startsWith('#');

                  if (isExternal) {
                    return (
                      <li key={lIdx}>
                        <a
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {link.label}
                        </a>
                      </li>
                    );
                  }

                  if (isHash) {
                    return (
                      <li key={lIdx}>
                        <a
                          href={link.href}
                          onClick={(e) => {
                            if (link.href !== '#') {
                              e.preventDefault();
                              const targetEl = document.getElementById(link.href.replace('#', ''));
                              if (targetEl) targetEl.scrollIntoView({ behavior: 'smooth' });
                              window.history.pushState(null, '', link.href);
                            }
                          }}
                          className="text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                        >
                          {link.label}
                        </a>
                      </li>
                    );
                  }

                  return (
                    <li key={lIdx}>
                      <Link
                        href={link.href}
                        className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {link.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar: Copyright & Socials */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>
            &copy; {new Date().getFullYear()} AI Sales Assistant Inc. All rights reserved. Built for autonomous agentic commerce.
          </p>

          {/* Social Links */}
          <div className="flex items-center gap-4">
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter"
              className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
            >
              <Twitter className="w-4 h-4" />
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
            >
              <Github className="w-4 h-4" />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
            >
              <Linkedin className="w-4 h-4" />
            </a>
            <a
              href="https://discord.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Discord"
              className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
            >
              <Discord className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
