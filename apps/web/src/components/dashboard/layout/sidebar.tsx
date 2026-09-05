'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Sparkles,
  Package,
  ShoppingCart,
  Users,
  BarChart3,
  FileCheck,
  CreditCard,
  Settings,
  LogOut,
  X,
  ChevronRight,
  ChevronLeft,
  Bot,
  Zap,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthActions } from '@/lib/auth/hooks/use-auth-actions';

export type NavItem = {
  key: string;
  label: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  badge?: string;
  description?: string;
};

export const navItems: NavItem[] = [
  { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, description: 'Overview and analytics' },
  { key: 'ai-assistant', label: 'AI Assistant', icon: Sparkles, badge: 'LIVE', description: 'AI-powered sales concierge' },
  { key: 'products', label: 'Products', icon: Package, description: 'Product catalog management' },
  { key: 'orders', label: 'Orders', icon: ShoppingCart, description: 'Order processing and tracking' },
  { key: 'customers', label: 'Customers', icon: Users, description: 'Customer relationship management' },
  { key: 'analytics', label: 'Analytics', icon: BarChart3, description: 'Performance metrics and insights' },
  { key: 'audit-trail', label: 'Audit Trail', icon: FileCheck, description: 'System activity logs' },
  { key: 'payments', label: 'Payments', icon: CreditCard, description: 'Payment processing and settlements' },
  { key: 'settings', label: 'Settings', icon: Settings, description: 'Account and store configuration' },
];

type DashboardSidebarProps = {
  open: boolean;
  onClose: () => void;
  activeKey: string;
  onSelect: (key: string) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
};

function PremiumNavItem({
  item,
  isActive,
  collapsed,
  onSelect
}: {
  item: NavItem;
  isActive: boolean;
  collapsed: boolean;
  onSelect: () => void;
}) {
  const Icon = item.icon;
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <motion.button
      type="button"
      title={collapsed ? item.label : undefined}
      onClick={onSelect}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        'group relative w-full flex items-center rounded-xl text-[13px] font-medium transition-all duration-300',
        collapsed ? 'justify-center px-0 py-2.5' : 'gap-3 px-3 py-2.5',
        isActive
          ? 'bg-gradient-to-r from-brand-600/20 via-ai-violet/15 to-transparent text-foreground border border-brand-500/20 shadow-[0_0_20px_-4px_rgba(99,102,241,0.3)]'
          : 'text-muted-foreground hover:text-foreground hover:bg-white/5 border border-transparent hover:border-white/10',
      )}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Active indicator */}
      {isActive && !collapsed && (
        <motion.span
          layoutId="activeNavIndicator"
          className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full bg-gradient-to-b from-brand-500 to-ai-violet shadow-[0_0_12px_rgba(99,102,241,0.6)]"
        />
      )}

      {/* Icon with glow effect */}
      <motion.div
        className={cn('relative', isHovered && !collapsed && 'scale-110')}
        transition={{ duration: 0.2 }}
      >
        <motion.div
          className={cn(
            'absolute inset-0 rounded-lg blur-md opacity-0 transition-opacity duration-300',
            isActive ? 'bg-brand-500/30 opacity-100' : 'bg-white/10 opacity-0 group-hover:opacity-100'
          )}
        />
        <Icon
          className={cn(
            'w-[18px] h-[18px] shrink-0 transition-colors relative z-10',
            isActive ? 'text-brand-500 dark:text-brand-400' : 'text-muted-foreground group-hover:text-foreground',
          )}
          strokeWidth={2}
        />
      </motion.div>

      {!collapsed && (
        <>
          <span className="flex-1 text-left">{item.label}</span>

          {/* Badge with pulse animation */}
          {item.badge && (
            <motion.span
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase bg-ai-emerald/15 text-ai-emerald border border-ai-emerald/30 shadow-[0_0_12px_rgba(16,185,129,0.4)]"
            >
              <motion.span
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-1.5 h-1.5 rounded-full bg-ai-emerald"
              />
              {item.badge}
            </motion.span>
          )}

          {/* Chevron on active */}
          {isActive && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
            >
              <ChevronRight className="w-3.5 h-3.5 text-brand-500 dark:text-brand-400" strokeWidth={2.2} />
            </motion.div>
          )}
        </>
      )}
    </motion.button>
  );
}

function SidebarBody({
  collapsed,
  onClose,
  activeKey,
  onSelect,
  onToggleCollapse,
  showClose,
}: {
  collapsed: boolean;
  onClose: () => void;
  activeKey: string;
  onSelect: (key: string) => void;
  onToggleCollapse: () => void;
  showClose: boolean;
}) {
  const { signOut, submitting } = useAuthActions();

  return (
    <div className="flex h-full w-full flex-col gap-1">
      {/* Premium Logo Section */}
      <div
        className={cn(
          'flex items-center h-16 border-b border-white/10 bg-gradient-to-b from-white/5 to-transparent',
          collapsed ? 'justify-center px-2' : 'justify-between px-5',
        )}
      >
        <motion.div
          className={cn('flex items-center gap-2.5', collapsed && 'justify-center')}
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <div className="relative">
            <motion.div
              className="absolute inset-0 rounded-xl bg-ai-violet/40 blur-[8px] opacity-60"
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.6, 0.8, 0.6]
              }}
              transition={{ duration: 3, repeat: Infinity }}
            />
            <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-ai-violet/20 to-brand-500/20 border border-ai-violet/40 flex items-center justify-center shadow-inner backdrop-blur-sm">
              <motion.div
                className="absolute inset-0 rounded-xl bg-gradient-to-br from-ai-violet/30 to-brand-500/30 opacity-0 group-hover:opacity-100 transition-opacity"
              />
              <Bot className="w-5 h-5 text-ai-violet relative z-10" strokeWidth={2.1} />
            </div>
          </div>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <p className="font-heading font-extrabold text-[14px] leading-tight text-foreground">Nexus</p>
              <p className="text-[10px] font-mono text-muted-foreground tracking-wide flex items-center gap-1">
                <Zap className="w-2.5 h-2.5 text-ai-emerald" strokeWidth={2.5} />
                AI SALES · v1.0
              </p>
            </motion.div>
          )}
        </motion.div>
        {showClose && (
          <motion.button
            type="button"
            onClick={onClose}
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            className="md:hidden inline-flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 text-muted-foreground hover:text-foreground hover:border-brand-500/40 transition-all"
            aria-label="Close sidebar"
          >
            <X className="w-4 h-4" strokeWidth={2} />
          </motion.button>
        )}
      </div>

      {/* Navigation Items */}
      <nav className={cn('flex-1 overflow-y-auto py-4 space-y-0.5', collapsed ? 'px-2' : 'px-3')}>
        {!collapsed && (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="px-3 pb-2 pt-1 text-[10px] font-mono font-bold uppercase tracking-[0.18em] text-muted-foreground"
          >
            Workspace
          </motion.p>
        )}
        {navItems.map((item, idx) => (
          <motion.div
            key={item.key}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 + idx * 0.05 }}
          >
            <PremiumNavItem
              item={item}
              isActive={item.key === activeKey}
              collapsed={collapsed}
              onSelect={() => {
                onSelect(item.key);
                onClose();
              }}
            />
          </motion.div>
        ))}
      </nav>

      {/* Bottom Actions */}
      <div className={cn('pt-3 pb-8 border-t border-white/10 space-y-2', collapsed ? 'px-2' : 'px-3')}>
        <motion.button
          type="button"
          onClick={onToggleCollapse}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="hidden md:flex w-full items-center justify-center gap-2 px-3 py-2 rounded-xl text-[12px] font-medium text-muted-foreground hover:text-foreground hover:bg-white/5 border border-transparent hover:border-white/10 transition-all"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4" strokeWidth={2} />
          ) : (
            <>
              <ChevronLeft className="w-4 h-4" strokeWidth={2} />
              <span className="flex-1 text-left">Collapse</span>
            </>
          )}
        </motion.button>

        <motion.button
          type="button"
          onClick={() => void signOut()}
          disabled={submitting !== false}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          title={collapsed ? 'Logout' : undefined}
          className={cn(
            'w-full flex items-center rounded-xl text-[13px] font-medium text-muted-foreground hover:text-red-500 hover:bg-red-500/5 border border-transparent hover:border-red-500/20 transition-all duration-200',
            collapsed ? 'justify-center px-0 py-2.5' : 'gap-3 px-3 py-2.5',
          )}
        >
          <LogOut className="w-[18px] h-[18px] shrink-0" strokeWidth={2} />
          {!collapsed && <span className="flex-1 text-left">Logout</span>}
        </motion.button>

        {!collapsed && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="px-3 py-2 rounded-xl bg-gradient-to-br from-brand-600/10 via-ai-violet/10 to-ai-cyan/10 border border-white/10 backdrop-blur-sm"
          >
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-ai-emerald shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
              <p className="text-[11px] font-semibold text-foreground leading-snug">Pro Plan · Active</p>
            </div>
            <p className="text-[10px] font-mono text-muted-foreground mt-0.5 pl-4">Unlimited AI sessions</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export function DashboardSidebar({
  open,
  onClose,
  activeKey,
  onSelect,
  collapsed,
  onToggleCollapse,
}: DashboardSidebarProps) {
  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          'hidden md:flex fixed inset-y-0 left-0 z-30 flex-col border-r border-white/10 bg-obsidian-950/80 backdrop-blur-2xl transition-[width] duration-300 ease-out',
          collapsed ? 'w-[4.5rem]' : 'w-64',
        )}
      >
        <SidebarBody
          collapsed={collapsed}
          onClose={onClose}
          activeKey={activeKey}
          onSelect={onSelect}
          onToggleCollapse={onToggleCollapse}
          showClose={false}
        />
      </aside>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden fixed inset-0 z-40 bg-obsidian-950/70 backdrop-blur-sm"
              onClick={onClose}
              aria-hidden
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="md:hidden fixed inset-y-0 left-0 z-50 w-72 flex-col border-r border-white/10 bg-obsidian-950 shadow-2xl flex"
            >
              <SidebarBody
                collapsed={false}
                onClose={onClose}
                activeKey={activeKey}
                onSelect={onSelect}
                onToggleCollapse={onToggleCollapse}
                showClose
              />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
