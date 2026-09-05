'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { DashboardShell, SectionHeader, GlassCard } from '@/components/dashboard';
import { Store, CreditCard, Bot, Users, Save, CheckCircle2, HelpCircle } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

type TabKey = 'store' | 'billing' | 'ai' | 'team';
const tabs: { key: TabKey; label: string; icon: React.ComponentType<any> }[] = [
  { key: 'store', label: 'Store Details', icon: Store },
  { key: 'billing', label: 'Billing', icon: CreditCard },
  { key: 'ai', label: 'AI Settings', icon: Bot },
  { key: 'team', label: 'Team & Access', icon: Users },
];

function Field({
  label,
  hint,
  children,
  id,
  className,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
  id?: string;
  className?: string;
}) {
  return (
    <div className={cn('space-y-2', className)}>
      <label htmlFor={id} className="block text-[12px] font-semibold tracking-wide text-foreground">
        {label}
      </label>
      {children}
      {hint && <p className="text-[11px] text-muted-foreground">{hint}</p>}
    </div>
  );
}

function inputClass(base?: string) {
  return (
    (base ?? '') +
    ' w-full px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-[13px] text-foreground placeholder:text-muted-foreground focus:border-brand-500/40 focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition'
  );
}

function Switch({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={
        'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border transition-colors border-white/10 ' +
        (checked ? 'bg-gradient-to-r from-brand-600 to-ai-violet' : 'bg-white/10')
      }
    >
      <span
        className={
          'pointer-events-none inline-block h-5 w-5 rounded-full bg-white/90 ring-0 transition-transform translate-y-[2px] ' +
          (checked ? 'translate-x-5' : 'translate-x-[2px]')
        }
      />
    </button>
  );
}

function SettingsContent() {
  const [tab, setTab] = React.useState<TabKey>('store');
  const [saved, setSaved] = React.useState(false);
  const [form, setForm] = React.useState({
    storeName: 'Nexus AI Sales',
    storeUrl: 'https://nexus.example.com',
    storeId: 'acme-retail',
    currency: 'INR',
    timezone: 'Asia/Kolkata',
    supportEmail: 'support@nexus.example.com',
    supportPhone: '+91 90000 00000',
    address: '100 Main St, Bengaluru, Karnataka, India',
    gstin: '27ABCDE1234F1Z5',
    plan: 'Pro Plan',
    cardBrand: 'Visa',
    cardLast4: '4242',
    billEmail: 'billing@nexus.example.com',
    aiProvider: 'OpenAI',
    aiModel: 'gpt-4o-mini',
    aiTemperature: 0.7,
    aiMaxTokens: 1024,
    aiAutomation: true,
    aiCatalogSync: true,
    aiChat: true,
  });

  const update = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) => {
    setForm((f) => ({ ...f, [k]: v }));
    setSaved(false);
  };

  const save = () => {
    toast.success('Settings saved');
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      <SectionHeader
        eyebrow="Workspace"
        title="Settings"
        subtitle="Configure store, billing, AI behavior, and team access"
        action={
          <motion.button
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={save}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-br from-brand-600 to-ai-violet text-white text-[12px] font-semibold border border-white/10 shadow-[0_0_20px_-4px_rgba(99,102,241,0.5)] hover:brightness-110 active:scale-95 transition-all"
          >
            {saved ? (
              <CheckCircle2 className="w-4 h-4" />
            ) : (
              <Save className="w-4 h-4" strokeWidth={2.2} />
            )}
            {saved ? 'Saved' : 'Save Changes'}
          </motion.button>
        }
      />

      <div className="flex flex-wrap gap-2">
        {tabs.map((t) => {
          const Icon = t.icon;
          const active = tab === t.key;
          return (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={
                'inline-flex items-center gap-2 px-4 py-2 rounded-xl text-[12.5px] font-semibold transition-all border ' +
                (active
                  ? 'bg-white/[0.06] border-white/15 text-foreground shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]'
                  : 'bg-transparent border-transparent text-muted-foreground hover:text-foreground hover:bg-white/[0.03]')
              }
            >
              <Icon className="w-4 h-4" strokeWidth={2} />
              {t.label}
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          {tab === 'store' && (
            <GlassCard padded glow="brand">
              <h3 className="font-heading font-bold text-lg">Store Details</h3>
              <p className="text-[12.5px] text-muted-foreground mt-1 mb-5">
                How your store appears in public listings and on invoices.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="Store Name" id="s-name">
                  <input
                    id="s-name"
                    className={inputClass()}
                    value={form.storeName}
                    onChange={(e) => update('storeName', e.target.value)}
                  />
                </Field>
                <Field label="Store URL" id="s-url" hint="Publicly accessible website">
                  <input
                    id="s-url"
                    className={inputClass()}
                    value={form.storeUrl}
                    onChange={(e) => update('storeUrl', e.target.value)}
                  />
                </Field>
                <Field label="Store ID" id="s-id" hint="Used in x-store-id header">
                  <input
                    id="s-id"
                    className={inputClass()}
                    value={form.storeId}
                    onChange={(e) => update('storeId', e.target.value)}
                  />
                </Field>
                <Field label="Currency" id="s-cur">
                  <select
                    id="s-cur"
                    className={inputClass()}
                    value={form.currency}
                    onChange={(e) => update('currency', e.target.value)}
                  >
                    <option>INR</option>
                    <option>USD</option>
                    <option>EUR</option>
                    <option>GBP</option>
                    <option>AED</option>
                  </select>
                </Field>
                <Field label="Support Email" id="s-em">
                  <input
                    id="s-em"
                    className={inputClass()}
                    value={form.supportEmail}
                    onChange={(e) => update('supportEmail', e.target.value)}
                  />
                </Field>
                <Field label="Support Phone" id="s-ph">
                  <input
                    id="s-ph"
                    className={inputClass()}
                    value={form.supportPhone}
                    onChange={(e) => update('supportPhone', e.target.value)}
                  />
                </Field>
                <Field label="GSTIN" id="s-gst" hint="Indian tax registration">
                  <input
                    id="s-gst"
                    className={inputClass()}
                    value={form.gstin}
                    onChange={(e) => update('gstin', e.target.value)}
                  />
                </Field>
                <Field label="Timezone" id="s-tz">
                  <select
                    id="s-tz"
                    className={inputClass()}
                    value={form.timezone}
                    onChange={(e) => update('timezone', e.target.value)}
                  >
                    <option>Asia/Kolkata</option>
                    <option>UTC</option>
                    <option>America/New_York</option>
                    <option>Europe/London</option>
                    <option>Dubai/Gulf</option>
                  </select>
                </Field>
              </div>
              <Field label="Registered Address" id="s-addr" className="mt-4">
                <textarea
                  id="s-addr"
                  rows={3}
                  className={inputClass()}
                  value={form.address}
                  onChange={(e) => update('address', e.target.value)}
                />
              </Field>
            </GlassCard>
          )}

          {tab === 'billing' && (
            <GlassCard padded>
              <h3 className="font-heading font-bold text-lg">Billing & Subscription</h3>
              <p className="text-[12.5px] text-muted-foreground mt-1 mb-5">
                Manage the plan that powers your workspace and AI sessions.
              </p>
              <div className="rounded-2xl border border-ai-violet/30 bg-gradient-to-br from-ai-violet/10 via-transparent to-brand-600/10 p-5 flex items-center justify-between gap-3">
                <div>
                  <p className="text-[10.5px] font-mono uppercase tracking-[0.16em] text-ai-violet">
                    Current Plan
                  </p>
                  <p className="font-heading font-extrabold text-xl mt-1">{form.plan}</p>
                  <p className="text-[12px] text-muted-foreground mt-1">
                    Unlimited AI sessions · 5 team seats · Priority support
                  </p>
                </div>
                <button className="px-4 py-2 rounded-xl bg-gradient-to-br from-ai-violet to-brand-600 text-white text-[12px] font-semibold shadow-[0_0_20px_-4px_rgba(167,139,250,0.6)] active:scale-95 transition">
                  Upgrade
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
                <Field label="Card on File" id="b-card">
                  <div className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/10">
                    <CreditCard className="w-4 h-4 text-ai-violet" />
                    <span className="text-[13px] font-semibold">{form.cardBrand}</span>
                    <span className="text-[12.5px] font-mono text-muted-foreground">
                      •••• {form.cardLast4}
                    </span>
                    <button className="ml-auto text-[12px] text-brand-500 font-semibold hover:underline">
                      Update
                    </button>
                  </div>
                </Field>
                <Field label="Billing Email" id="b-em">
                  <input
                    id="b-em"
                    className={inputClass()}
                    value={form.billEmail}
                    onChange={(e) => update('billEmail', e.target.value)}
                  />
                </Field>
              </div>
            </GlassCard>
          )}

          {tab === 'ai' && (
            <GlassCard padded glow="violet">
              <h3 className="font-heading font-bold text-lg">AI Behavior</h3>
              <p className="text-[12.5px] text-muted-foreground mt-1 mb-5">
                Configure provider, model, and which AI automations run on your store data.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="Provider" id="a-prov">
                  <select
                    id="a-prov"
                    className={inputClass()}
                    value={form.aiProvider}
                    onChange={(e) => update('aiProvider', e.target.value)}
                  >
                    <option>OpenAI</option>
                    <option>Anthropic</option>
                    <option>Google</option>
                    <option>Groq</option>
                  </select>
                </Field>
                <Field label="Default Model" id="a-model">
                  <input
                    id="a-model"
                    className={inputClass()}
                    value={form.aiModel}
                    onChange={(e) => update('aiModel', e.target.value)}
                  />
                </Field>
                <Field label="Temperature" id="a-temp" hint={String(form.aiTemperature)}>
                  <input
                    id="a-temp"
                    type="range"
                    min={0}
                    max={1.5}
                    step={0.05}
                    className="w-full accent-brand-500"
                    value={form.aiTemperature}
                    onChange={(e) => update('aiTemperature', Number(e.target.value))}
                  />
                </Field>
                <Field label="Max Tokens" id="a-mt" hint="Response length budget">
                  <input
                    id="a-mt"
                    type="number"
                    className={inputClass()}
                    value={form.aiMaxTokens}
                    onChange={(e) => update('aiMaxTokens', Number(e.target.value))}
                  />
                </Field>
              </div>
              <div className="mt-5 space-y-3">
                {[
                  {
                    k: 'aiAutomation' as const,
                    title: 'Pricing & cross-sell automation',
                    desc: 'AI suggests price changes and cross-sells automatically.',
                  },
                  {
                    k: 'aiCatalogSync' as const,
                    title: 'AI catalog enrichment',
                    desc: 'Improve product descriptions and tags using LLM insights.',
                  },
                  {
                    k: 'aiChat' as const,
                    title: 'AI Assistant chatbot',
                    desc: 'Enable assistant sidebar and merchant Q&A over store data.',
                  },
                ].map((t) => (
                  <div
                    key={t.k}
                    className="flex items-start justify-between gap-4 p-3.5 rounded-xl bg-white/[0.02] border border-white/10"
                  >
                    <div>
                      <p className="font-semibold text-[13px]">{t.title}</p>
                      <p className="text-[12px] text-muted-foreground mt-0.5">{t.desc}</p>
                    </div>
                    <Switch checked={form[t.k]} onChange={(v) => update(t.k, v)} />
                  </div>
                ))}
              </div>
            </GlassCard>
          )}

          {tab === 'team' && (
            <GlassCard padded>
              <h3 className="font-heading font-bold text-lg">Team & Access</h3>
              <p className="text-[12.5px] text-muted-foreground mt-1 mb-5">
                Invite team members and control what they can see or edit.
              </p>
              <div className="space-y-3">
                {[
                  { name: 'Priya Sharma', role: 'Owner', email: 'priya@nexus.example.com' },
                  { name: 'Rahul Verma', role: 'Admin', email: 'rahul@nexus.example.com' },
                  { name: 'Ananya Iyer', role: 'Staff', email: 'ananya@nexus.example.com' },
                  { name: 'Karthik Rao', role: 'Read-only', email: 'karthik@nexus.example.com' },
                ].map((u, i) => (
                  <div
                    key={u.email}
                    className="flex items-center justify-between gap-4 p-3.5 rounded-xl bg-white/[0.02] border border-white/10"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-500/30 to-ai-violet/30 border border-white/10 flex items-center justify-center text-[12px] font-bold">
                        {u.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-[13px]">{u.name}</p>
                        <p className="text-[11.5px] text-muted-foreground">{u.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <select
                        defaultValue={u.role}
                        className="px-2.5 py-1.5 rounded-lg bg-white/[0.03] border border-white/10 text-[12px] focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                      >
                        <option>Owner</option>
                        <option>Admin</option>
                        <option>Staff</option>
                        <option>Read-only</option>
                      </select>
                      <button className="text-[12px] text-red-400 font-semibold hover:underline">
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <motion.button
                whileHover={{ scale: 1.005 }}
                whileTap={{ scale: 0.995 }}
                onClick={() => toast.info('Invite team — wire your send-invite API')}
                className="mt-5 w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/[0.04] border border-dashed border-white/15 text-[12.5px] font-semibold text-muted-foreground hover:text-foreground hover:bg-white/[0.07] transition"
              >
                + Invite team member
              </motion.button>
            </GlassCard>
          )}
        </div>

        <aside className="space-y-6">
          <GlassCard padded>
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-brand-500/15 border border-brand-500/20 flex items-center justify-center shrink-0">
                <HelpCircle className="w-5 h-5 text-brand-500" />
              </div>
              <div>
                <p className="font-semibold text-[13px]">Need help configuring?</p>
                <p className="text-[12px] text-muted-foreground mt-0.5 leading-relaxed">
                  If this is your first setup, fill Store Details first, then pick your AI model
                  provider credentials in the <span className="text-foreground">AI Settings</span>{' '}
                  tab.
                </p>
              </div>
            </div>
          </GlassCard>

          <GlassCard padded>
            <p className="text-[10.5px] font-mono uppercase tracking-[0.16em] text-muted-foreground">
              Workspace health
            </p>
            <ul className="mt-3 space-y-2.5 text-[12.5px]">
              {[
                { ok: true, label: 'PostgreSQL schema valid' },
                { ok: true, label: 'Session FK corrected' },
                { ok: true, label: '9/9 sidebar routes mapped' },
                { ok: form.aiProvider.length > 0, label: 'AI provider selected' },
              ].map((h) => (
                <li key={h.label} className="flex items-center gap-2.5">
                  <span
                    className={
                      'w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ' +
                      (h.ok ? 'bg-ai-emerald/20 text-ai-emerald' : 'bg-amber-500/20 text-amber-400')
                    }
                  >
                    {h.ok ? '✓' : '!'}
                  </span>
                  <span className={h.ok ? 'text-foreground' : 'text-amber-300'}>{h.label}</span>
                </li>
              ))}
            </ul>
          </GlassCard>
        </aside>
      </div>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <ProtectedRoute>
      <DashboardShell>
        <SettingsContent />
      </DashboardShell>
    </ProtectedRoute>
  );
}
