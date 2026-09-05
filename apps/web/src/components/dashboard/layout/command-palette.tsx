'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { Search, Package, ShoppingCart, Users, Sparkles } from 'lucide-react';
import { useDashboardSnapshot } from '@/lib/dashboard/hooks';
import { cn } from '@/lib/utils';

type CommandPaletteProps = {
  open: boolean;
  onClose: () => void;
};

export function CommandPalette({ open, onClose }: CommandPaletteProps) {
  const router = useRouter();
  const [query, setQuery] = React.useState('');
  const { data } = useDashboardSnapshot();
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (open) {
      setQuery('');
      const t = window.setTimeout(() => inputRef.current?.focus(), 30);
      return () => window.clearTimeout(t);
    }
  }, [open]);

  React.useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    if (open) window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  const q = query.trim().toLowerCase();
  const products = (data?.topProducts ?? []).filter(
    (p) => !q || p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q),
  );
  const orders = (data?.recentOrders ?? []).filter(
    (o) =>
      !q ||
      o.customer.toLowerCase().includes(q) ||
      o.product.toLowerCase().includes(q) ||
      o.id.toLowerCase().includes(q),
  );

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-obsidian-950/70 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden
          />
          <motion.div
            role="dialog"
            aria-label="Global search"
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="fixed left-1/2 top-[12vh] z-50 w-[min(40rem,calc(100vw-1.5rem))] -translate-x-1/2 rounded-2xl border border-white/10 bg-obsidian-900/95 backdrop-blur-2xl shadow-2xl overflow-hidden"
          >
            <div className="relative border-b border-white/10">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" strokeWidth={2} />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search customers, orders, products, AI sessions…"
                className="w-full h-14 bg-transparent pl-11 pr-16 text-[14px] text-foreground placeholder:text-muted-foreground/60 focus:outline-none"
              />
              <kbd className="absolute right-4 top-1/2 -translate-y-1/2 px-1.5 py-0.5 rounded-md border border-white/10 text-[10px] font-mono text-muted-foreground">
                ESC
              </kbd>
            </div>
            <div className="max-h-[min(28rem,60vh)] overflow-y-auto p-2">
              <Section icon={Package} label="Products">
                {products.slice(0, 4).map((p) => (
                  <Row key={p.id} title={p.name} meta={p.sku} onClick={() => { onClose(); router.push('/assistant'); }} />
                ))}
              </Section>
              <Section icon={ShoppingCart} label="Orders">
                {orders.slice(0, 4).map((o) => (
                  <Row key={o.id} title={o.customer} meta={`${o.id} · ₹ ${o.amount.toLocaleString('en-IN')}`} onClick={() => { onClose(); router.push('/orders'); }} />
                ))}
              </Section>
              <Section icon={Users} label="Live visitors">
                {(data?.visitors ?? [])
                  .filter((v) => !q || v.location.toLowerCase().includes(q) || v.page.toLowerCase().includes(q))
                  .slice(0, 3)
                  .map((v) => (
                    <Row key={v.id} title={`${v.location} · ${v.activity}`} meta={v.page} onClick={() => { onClose(); router.push('/analytics'); }} />
                  ))}
              </Section>
              <Section icon={Sparkles} label="AI insights">
                {(data?.insights ?? [])
                  .filter((i) => !q || i.title.toLowerCase().includes(q))
                  .map((i) => (
                    <Row key={i.id} title={i.title} meta={i.impact} onClick={() => { onClose(); router.push('/analytics'); }} />
                  ))}
              </Section>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function Section({
  icon: Icon,
  label,
  children,
}: {
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  label: string;
  children: React.ReactNode;
}) {
  const items = React.Children.toArray(children).filter(Boolean);
  if (!items.length) return null;
  return (
    <div className="mb-2">
      <p className="flex items-center gap-2 px-2 py-1.5 text-[10px] font-mono font-bold uppercase tracking-[0.16em] text-muted-foreground">
        <Icon className="w-3 h-3" strokeWidth={2.2} />
        {label}
      </p>
      {children}
    </div>
  );
}

function Row({ title, meta, onClick }: { title: string; meta: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'w-full text-left rounded-xl px-3 py-2.5 hover:bg-white/5 border border-transparent hover:border-white/10 transition-colors',
      )}
    >
      <p className="text-[13px] font-semibold text-foreground truncate">{title}</p>
      <p className="text-[11px] font-mono text-muted-foreground truncate">{meta}</p>
    </button>
  );
}
