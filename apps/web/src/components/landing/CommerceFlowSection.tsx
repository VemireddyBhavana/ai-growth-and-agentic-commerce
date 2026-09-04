'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import {
  User,
  Bot,
  Search,
  Brain,
  ShieldCheck,
  Store,
  CreditCard,
  CheckCircle2,
  FileDigit,
  LayoutDashboard,
  Zap,
  Activity,
  type LucideIcon,
} from 'lucide-react';

export interface FlowStep {
  id: number;
  title: string;
  subtitle: string;
  role: string;
  icon: LucideIcon;
  tone:
    | 'brand'
    | 'violet'
    | 'cyan'
    | 'indigo'
    | 'amber'
    | 'teal'
    | 'razorpay'
    | 'emerald'
    | 'brand-2';
  badgeBg: string;
  details: {
    action: string;
    payload: string;
    latency: string;
    status: string;
  };
}

const toneBadgeMap: Record<FlowStep['tone'], { chip: string; icon: string }> = {
  brand: {
    chip: 'bg-brand-500/12 text-brand-600 dark:text-brand-400 border-brand-500/30',
    icon: 'bg-brand-500/15 text-brand-600 dark:text-brand-400 border-brand-500/30',
  },
  violet: {
    chip: 'bg-ai-violet/12 text-ai-violet border-ai-violet/30',
    icon: 'bg-ai-violet/15 text-ai-violet border-ai-violet/30',
  },
  cyan: {
    chip: 'bg-ai-cyan/12 text-ai-cyan border-ai-cyan/30',
    icon: 'bg-ai-cyan/15 text-ai-cyan border-ai-cyan/30',
  },
  indigo: {
    chip: 'bg-indigo-500/12 text-indigo-600 dark:text-indigo-400 border-indigo-500/30',
    icon: 'bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border-indigo-500/30',
  },
  amber: {
    chip: 'bg-amber-500/12 text-amber-600 dark:text-amber-400 border-amber-500/30',
    icon: 'bg-amber-500/15 text-amber-500 dark:text-amber-400 border-amber-500/30',
  },
  teal: {
    chip: 'bg-teal-500/12 text-teal-600 dark:text-teal-400 border-teal-500/30',
    icon: 'bg-teal-500/15 text-teal-600 dark:text-teal-400 border-teal-500/30',
  },
  razorpay: {
    chip: 'bg-[#1366ef]/12 text-[#0f54c8] dark:text-[#60a5fa] border-[#1366ef]/30',
    icon: 'bg-[#1366ef]/15 text-[#0f54c8] dark:text-[#60a5fa] border-[#1366ef]/30',
  },
  emerald: {
    chip: 'bg-ai-emerald/12 text-ai-emerald border-ai-emerald/30',
    icon: 'bg-ai-emerald/15 text-ai-emerald border-ai-emerald/30',
  },
  'brand-2': {
    chip: 'bg-sky-500/12 text-sky-600 dark:text-sky-400 border-sky-500/30',
    icon: 'bg-sky-500/15 text-sky-600 dark:text-sky-400 border-sky-500/30',
  },
};

export const flowSteps: FlowStep[] = [
  {
    id: 1,
    title: 'Customer',
    subtitle: 'Natural Language Query',
    role: 'Shopper',
    icon: User,
    tone: 'brand',
    badgeBg: toneBadgeMap.brand.chip,
    details: {
      action: 'Customer asks: "I need wireless earbuds under ₹3000 with good bass"',
      payload:
        '{"session_id": "sess_7kM2p", "channel": "web_chat", "locale": "en_IN", "user_prompt": "wireless earbuds under ₹3000"}',
      latency: '0ms (Origin)',
      status: 'Captured',
    },
  },
  {
    id: 2,
    title: 'AI Shopping Assistant',
    subtitle: 'Intent & Entity Parsing',
    role: 'Orchestrator Agent',
    icon: Bot,
    tone: 'violet',
    badgeBg: toneBadgeMap.violet.chip,
    details: {
      action: 'Orchestrator receives, classifies intent, extracts entities & budget guardrails',
      payload:
        '{"intent": "search_purchase", "category": "audio.earbuds.wireless", "budget_max": 3000, "guards_passed": true}',
      latency: '120ms',
      status: 'Routed',
    },
  },
  {
    id: 3,
    title: 'Vector Search',
    subtitle: 'Semantic Catalog Retrieval',
    role: 'Vector DB (pgvector)',
    icon: Search,
    tone: 'cyan',
    badgeBg: toneBadgeMap.cyan.chip,
    details: {
      action: 'Hybrid ANN search over embedded product catalog — top 12 candidates recalled',
      payload:
        '{"recall_k": 12, "index": "hnsw_cos_e5_v2", "top_score": 0.961, "query_embedding_ms": 58}',
      latency: '82ms',
      status: 'Recalled',
    },
  },
  {
    id: 4,
    title: 'OpenAI',
    subtitle: 'LLM Ranking & Rationale',
    role: 'gpt-5.1 · Reasoning',
    icon: Brain,
    tone: 'indigo',
    badgeBg: toneBadgeMap.indigo.chip,
    details: {
      action: 'LLM re-ranks candidates with structured reasoning and customer-fit criteria',
      payload:
        '{"model": "gpt-5.1-preview", "top_k_reranked": 5, "reasoning_tokens": 284, "temperature": 0.2}',
      latency: '260ms',
      status: 'Ranked',
    },
  },
  {
    id: 5,
    title: 'Business Rules',
    subtitle: 'Margin · Compliance · Promotions',
    role: 'Rule Engine',
    icon: ShieldCheck,
    tone: 'amber',
    badgeBg: toneBadgeMap.amber.chip,
    details: {
      action: 'Applies merchant margin floors, promo stacking rules, and compliance checks',
      payload:
        '{"margin_floor": 0.28, "promo_applied": "DIWALI10", "compliant": true, "gross_margin": 0.34}',
      latency: '18ms',
      status: 'Validated',
    },
  },
  {
    id: 6,
    title: 'Merchant Approval',
    subtitle: 'Inventory & Dynamic Rules',
    role: 'Merchant Hub',
    icon: Store,
    tone: 'teal',
    badgeBg: toneBadgeMap.teal.chip,
    details: {
      action: 'Merchant-specific rules: real-time inventory hold & dynamic pricing approved',
      payload:
        '{"merchant_id": "MID_2841", "sku": "SKU-BT-AIR141", "qty_held": 1, "ttl_lock_sec": 900}',
      latency: '25ms',
      status: 'Reserved',
    },
  },
  {
    id: 7,
    title: 'Razorpay Checkout',
    subtitle: 'Tokenized 1-Click',
    role: 'Razorpay Orders API',
    icon: CreditCard,
    tone: 'razorpay',
    badgeBg: toneBadgeMap.razorpay.chip,
    details: {
      action: 'Creates tokenized order session with prefilled customer & UPI-intent ready',
      payload:
        '{"order_id": "order_Na9f7Khs2xGz", "amount": 249900, "currency": "INR", "tokenized": true, "upi_intent": true}',
      latency: '112ms',
      status: 'Authorized',
    },
  },
  {
    id: 8,
    title: 'Payment Success',
    subtitle: 'Settlement Confirmed',
    role: 'Razorpay Webhook',
    icon: CheckCircle2,
    tone: 'emerald',
    badgeBg: toneBadgeMap.emerald.chip,
    details: {
      action: 'Payment captured via webhook, signature verified, funds hold confirmed',
      payload:
        '{"payment_id": "pay_Nb1qM3z8p9A", "method": "upi", "captured": true, "signature_verified": true}',
      latency: '4ms (webhook)',
      status: 'Settled',
    },
  },
  {
    id: 9,
    title: 'Audit Ledger',
    subtitle: 'Immutable Event Log',
    role: 'XAI Ledger',
    icon: FileDigit,
    tone: 'brand-2',
    badgeBg: toneBadgeMap['brand-2'].chip,
    details: {
      action: 'SHA-256 chained ledger entry written with full reasoning trace hash',
      payload:
        '{"ledger_id": "log_Xai_sha256_e89c3f…", "prev_hash": "a19…8cf", "reasoning_saved": true, "compliance": "PCI-DSS"}',
      latency: '14ms',
      status: 'Immutable',
    },
  },
  {
    id: 10,
    title: 'Merchant Dashboard',
    subtitle: 'Real-Time Telemetry',
    role: 'Analytics Hub',
    icon: LayoutDashboard,
    tone: 'brand',
    badgeBg: toneBadgeMap.brand.chip,
    details: {
      action: 'Order, revenue, AI attribution, and AI-lift metrics pushed live to merchant dashboard',
      payload:
        '{"order_attribution": "ai_assisted", "aov_lift_vs_baseline": 0.21, "conversion_rate": 0.187, "dashboard_synced": true}',
      latency: '9ms (WS)',
      status: 'Synced',
    },
  },
];

export function CommerceFlowSection() {
  const [activeStep, setActiveStep] = React.useState<number>(1);
  const [autoPlay, setAutoPlay] = React.useState<boolean>(true);

  React.useEffect(() => {
    if (!autoPlay) return;
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev % flowSteps.length) + 1);
    }, 2400);
    return () => clearInterval(timer);
  }, [autoPlay]);

  const currentStep = flowSteps.find((s) => s.id === activeStep) || flowSteps[0];

  return (
    <section
      id="architecture"
      className="relative py-16 sm:py-20 lg:py-28 overflow-hidden bg-secondary/8 dark:bg-obsidian-950/25 border-y border-border/40"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      >
        <motion.div
          animate={{ x: [0, 18, -14, 0], y: [0, -12, 10, 0] }}
          transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-[6%] -left-28 w-[520px] h-[460px] rounded-full bg-ai-cyan/12 dark:bg-ai-cyan/16 blur-[140px] opacity-75"
        />
        <motion.div
          animate={{ x: [0, -16, 12, 0], y: [0, 10, -14, 0] }}
          transition={{ duration: 24, repeat: Infinity, ease: 'easeInOut', delay: 1.4 }}
          className="absolute top-[36%] -right-24 w-[540px] h-[480px] rounded-full bg-brand-600/12 dark:bg-brand-600/16 blur-[140px] opacity-70"
        />
        <motion.div
          animate={{ x: [0, 14, -10, 0], y: [0, -8, 12, 0] }}
          transition={{ duration: 26, repeat: Infinity, ease: 'easeInOut', delay: 2.8 }}
          className="absolute bottom-[14%] left-1/3 w-[400px] h-[380px] rounded-full bg-[#1366ef]/11 dark:bg-[#1366ef]/15 blur-[130px] opacity-65"
        />
        <div className="absolute inset-0 bg-grid-black dark:bg-grid-white opacity-[0.18] dark:opacity-[0.14] [mask-image:radial-gradient(ellipse_65%_60%_at_50%_40%,#000_55%,transparent_100%)]" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/25 via-transparent to-background/55 pointer-events-none" />
      </div>

      <div className="relative z-10 container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="text-center max-w-3xl mx-auto"
        >
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-ai-cyan/12 dark:bg-ai-cyan/16 border border-ai-cyan/30 text-ai-cyan text-[11px] font-mono font-bold uppercase tracking-[0.2em] mb-5 shadow-[0_0_35px_-10px_rgba(6,182,212,0.45)]">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-ai-cyan/35 blur-sm animate-pulse" />
              <Activity className="relative w-4 h-4" strokeWidth={2.4} />
            </div>
            End-to-End Orchestration
          </div>
          <h2 className="font-heading font-extrabold text-3xl sm:text-4xl md:text-5xl text-foreground tracking-tight leading-[1.12] text-balance">
            The Autonomous Agentic Commerce Flow
          </h2>
          <p className="mt-5 text-base sm:text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto text-balance">
            Ten hops. Sub-second end-to-end. Watch a single natural query travel through vector search, LLM reasoning, business rules, and Razorpay settlement — fully logged, every step.
          </p>
        </motion.div>

        <div className="mt-14 sm:mt-16 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4 lg:gap-5">
          {flowSteps.map((step, idx) => {
            const Icon = step.icon;
            const isActive = activeStep === step.id;
            const stepNum = String(step.id).padStart(2, '0');
            const tone = toneBadgeMap[step.tone];
            return (
              <motion.button
                key={step.id}
                initial={{ opacity: 0, y: 18, scale: 0.97 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5, delay: idx * 0.05, ease: [0.22, 1, 0.36, 1] }}
                onClick={() => {
                  setAutoPlay(false);
                  setActiveStep(step.id);
                }}
                whileHover={{ y: -4 }}
                className={`group relative flex flex-col items-center text-center p-4 sm:p-5 rounded-2xl border backdrop-blur-xl transition-all duration-300 ${
                  isActive
                    ? 'bg-white/65 dark:bg-obsidian-850/85 border-border/90 ring-2 ring-brand-500/40 shadow-[0_22px_55px_-25px_rgba(79,70,229,0.55)] scale-[1.04] z-10'
                    : 'bg-card/45 dark:bg-obsidian-900/50 border-border/60 hover:border-border/90 hover:bg-white/60 dark:hover:bg-obsidian-850/50 opacity-90'
                }`}
                aria-pressed={isActive}
                aria-label={`Pipeline ${stepNum}: ${step.title} — ${step.subtitle}`}
              >
                <span className="absolute top-2.5 right-2.5 text-[10px] font-mono font-bold text-muted-foreground/80">
                  {stepNum}
                </span>

                <div
                  className={`w-11 h-11 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center mb-3 transition-all duration-300 shadow-inner border ${
                    isActive ? 'scale-110' : ''
                  } ${tone.icon}`}
                >
                  <Icon className="w-5 h-5 sm:w-5.5 sm:h-5.5" strokeWidth={2.2} aria-hidden="true" />
                </div>

                <span className="text-xs sm:text-[13px] font-heading font-semibold text-foreground leading-tight">
                  {step.title}
                </span>
                <span className="text-[10.5px] sm:text-[11px] text-muted-foreground mt-1 font-mono leading-snug">
                  {step.subtitle}
                </span>

                {isActive && (
                  <motion.div
                    layoutId="flow-pipeline-indicator"
                    className="absolute -bottom-1.5 w-7 h-1 rounded-full bg-gradient-to-r from-ai-violet via-brand-500 to-ai-cyan"
                    transition={{ type: 'spring', stiffness: 320, damping: 24 }}
                  />
                )}
              </motion.button>
            );
          })}
        </div>

        <motion.div
          key={currentStep.id}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
          className="mt-10 sm:mt-12 max-w-5xl mx-auto group relative rounded-3xl border border-border/70 dark:border-white/10 bg-card/70 dark:bg-obsidian-900/70 backdrop-blur-2xl shadow-[0_28px_75px_-35px_rgba(15,23,42,0.8)] overflow-hidden"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-gradient-to-br from-ai-cyan/[0.04] via-transparent to-brand-500/[0.04] dark:from-ai-cyan/[0.07] dark:to-brand-500/[0.06]"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-white/12 via-transparent to-white/5 dark:from-white/[0.09]"
            style={{
              WebkitMask:
                'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
              WebkitMaskComposite: 'xor',
              maskComposite: 'exclude',
              padding: '1px',
            }}
          />

          <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 sm:p-8 pb-5 sm:pb-6 border-b border-border/60 bg-secondary/25 dark:bg-obsidian-950/40">
            <div className="flex items-center gap-3 sm:gap-4">
              <div
                className={`relative p-2.5 sm:p-3 rounded-2xl border shadow-inner ${
                  toneBadgeMap[currentStep.tone].icon
                }`}
              >
                <currentStep.icon className="w-6 h-6 sm:w-7 sm:h-7" strokeWidth={2.2} />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[10.5px] font-mono uppercase font-bold tracking-[0.16em] text-muted-foreground">
                    Step {String(currentStep.id).padStart(2, '0')} &bull;{' '}
                    {currentStep.role}
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded-lg text-[9.5px] font-mono font-bold uppercase tracking-[0.16em] border ${toneBadgeMap[currentStep.tone].chip}`}
                  >
                    {currentStep.details.status}
                  </span>
                </div>
                <h3 className="font-heading font-bold text-lg sm:text-xl md:text-2xl text-foreground mt-1 leading-tight tracking-tight">
                  {currentStep.title}
                  <span className="text-muted-foreground/80 font-semibold">
                    {' '}
                    · {currentStep.subtitle}
                  </span>
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-2.5 self-start sm:self-center font-mono text-[11px] text-muted-foreground bg-secondary/70 dark:bg-obsidian-850/90 px-3.5 py-2 rounded-2xl border border-border/70">
              <Zap className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
              <span>
                Hop latency:{' '}
                <strong className="text-foreground">{currentStep.details.latency}</strong>
              </span>
            </div>
          </div>

          <div className="relative p-6 sm:p-8 space-y-5 sm:space-y-6">
            <div>
              <span className="text-[10.5px] font-mono uppercase text-muted-foreground tracking-[0.18em]">
                Action Description
              </span>
              <p className="text-sm sm:text-[15px] font-medium text-foreground mt-1.5 leading-relaxed">
                {currentStep.details.action}
              </p>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10.5px] font-mono uppercase text-muted-foreground tracking-[0.18em]">
                  Event Payload Telemetry (JSON)
                </span>
                <span className="text-[10px] font-mono text-ai-emerald/90 flex items-center gap-1.5">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-ai-emerald animate-pulse" />
                  Live Trace
                </span>
              </div>
              <pre className="mt-2.5 p-4 sm:p-5 rounded-2xl bg-obsidian-950/95 text-emerald-400 text-[11.5px] sm:text-xs font-mono overflow-x-auto border border-white/6 selection:bg-brand-600 shadow-inner">
                <code>{currentStep.details.payload}</code>
              </pre>
            </div>
          </div>

          <div className="relative px-6 sm:px-8 pb-6 sm:pb-8 pt-4 mt-2 border-t border-border/55 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <span className="text-xs sm:text-[13px] text-muted-foreground flex items-center gap-2">
              <span
                className={`inline-block h-2 w-2 rounded-full ${
                  autoPlay ? 'bg-emerald-500 animate-pulse' : 'bg-muted-foreground/60'
                }`}
              />
              {autoPlay
                ? 'Auto-cycling pipeline · 10 hops…'
                : 'Click any pipeline step above to inspect'}
            </span>
            <button
              type="button"
              onClick={() => setAutoPlay(!autoPlay)}
              aria-pressed={autoPlay}
              className="px-3.5 py-1.5 rounded-xl text-[11px] font-mono font-bold uppercase tracking-wider border transition-all duration-300 hover:scale-[1.02] active:scale-[0.99] bg-brand-500/12 border-brand-500/30 text-brand-600 dark:text-brand-400 hover:bg-brand-500/18"
            >
              {autoPlay ? '⏸ Pause Auto-Play' : '▶ Resume Auto-Play'}
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
