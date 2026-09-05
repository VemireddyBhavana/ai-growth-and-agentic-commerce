'use client';

import * as React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { DashboardSidebar } from './sidebar';
import { DashboardNavbar } from './navbar';
import { CommandPalette } from './command-palette';
import { useDashboardSnapshot } from '@/lib/dashboard/hooks';
import { cn } from '@/lib/utils';

type DashboardShellProps = {
  children: React.ReactNode;
  merchantName?: string;
};

export function DashboardShell({ children, merchantName }: DashboardShellProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const [activeNav, setActiveNav] = React.useState('dashboard');
  const [collapsed, setCollapsed] = React.useState(false);
  const [searchOpen, setSearchOpen] = React.useState(false);
  const { data } = useDashboardSnapshot();
  const resolvedMerchant = merchantName ?? data?.merchantName ?? 'Acme Retail';

  React.useEffect(() => {
    if (pathname.includes('/assistant')) setActiveNav('ai-assistant');
    else if (pathname.includes('/products')) setActiveNav('products');
    else if (pathname.includes('/orders')) setActiveNav('orders');
    else if (pathname.includes('/customers')) setActiveNav('customers');
    else if (pathname.includes('/analytics')) setActiveNav('analytics');
    else if (pathname.includes('/audit')) setActiveNav('audit-trail');
    else if (pathname.includes('/payments') || pathname.includes('/checkout'))
      setActiveNav('payments');
    else if (pathname.includes('/settings')) setActiveNav('settings');
    else setActiveNav('dashboard');
  }, [pathname]);

  const handleNavSelect = (key: string) => {
    setActiveNav(key);
    setSidebarOpen(false);
    switch (key) {
      case 'dashboard':
        router.push('/dashboard');
        break;
      case 'ai-assistant':
        router.push('/assistant');
        break;
      case 'products':
        router.push('/products');
        break;
      case 'orders':
        router.push('/orders');
        break;
      case 'customers':
        router.push('/customers');
        break;
      case 'analytics':
        router.push('/analytics');
        break;
      case 'audit-trail':
        router.push('/audit');
        break;
      case 'payments':
        router.push('/payments');
        break;
      case 'settings':
        router.push('/settings');
        break;
      default:
        router.push('/dashboard');
        break;
    }
  };

  React.useEffect(() => {
    const tablet = window.matchMedia('(min-width: 768px) and (max-width: 1023px)');
    const apply = () => setCollapsed(tablet.matches);
    apply();
    tablet.addEventListener('change', apply);
    return () => tablet.removeEventListener('change', apply);
  }, []);

  React.useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <div className="min-h-screen w-full bg-background text-foreground relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden bg-radial-hero-dark"
      >
        <div className="absolute -top-32 -left-28 w-[520px] h-[460px] rounded-full bg-brand-500/10 blur-[160px] opacity-80" />
        <div className="absolute top-40 -right-24 w-[480px] h-[440px] rounded-full bg-ai-violet/12 blur-[160px] opacity-70" />
        <div className="absolute bottom-0 left-1/3 w-[400px] h-[400px] rounded-full bg-ai-cyan/10 blur-[150px] opacity-60" />
        <div className="absolute inset-0 bg-grid-white opacity-[0.15]" />
      </div>

      <DashboardSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        activeKey={activeNav}
        onSelect={handleNavSelect}
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed((v) => !v)}
      />

      <div
        className={cn(
          'transition-[padding] duration-300 ease-out',
          collapsed ? 'md:pl-[4.5rem]' : 'md:pl-64'
        )}
      >
        <DashboardNavbar
          onMenuClick={() => setSidebarOpen(true)}
          onSearchClick={() => setSearchOpen(true)}
          merchantName={resolvedMerchant}
        />

        <CommandPalette open={searchOpen} onClose={() => setSearchOpen(false)} />

        <motion.main
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="min-h-[calc(100vh-4rem)] px-4 sm:px-6 lg:px-8 py-6 sm:py-8"
        >
          {children}
        </motion.main>
      </div>
    </div>
  );
}
