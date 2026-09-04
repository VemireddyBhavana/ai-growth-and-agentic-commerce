'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bot, 
  User, 
  Send, 
  Sparkles, 
  CreditCard, 
  CheckCircle2, 
  ShoppingBag, 
  ShieldCheck, 
  Zap, 
  RefreshCw,
  Tag,
  Star,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { toast } from 'sonner';

interface ProductMock {
  id: string;
  name: string;
  category: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviewsCount: number;
  badge: string;
  specs: string[];
  reasoning: string;
  confidence: number;
  iconBg: string;
}

interface DemoScenario {
  id: string;
  prompt: string;
  aiResponse: string;
  reasoningSteps: string[];
  products: ProductMock[];
}

const scenarios: Record<string, DemoScenario> = {
  running_shoes: {
    id: 'running_shoes',
    prompt: 'I need durable running shoes under ₹3000 for marathon training.',
    aiResponse:
      'I found the top 2 marathon-grade running shoes in your catalog matching your ₹3,000 budget. Both feature high-rebound cushioning and breathable dual-layer mesh.',
    reasoningSteps: [
      'Parsed user intent: Category = Footwear, UseCase = Marathon, Max Budget = ₹3,000',
      'Vector semantic search matched 14 SKUs (Top similarity: 0.984)',
      'Filtered for in-stock inventory & merchant margin optimization (+24% gross profit)',
    ],
    products: [
      {
        id: 'PROD_001',
        name: 'AeroStride Pro Runner 2.0',
        category: 'Long-Distance Running',
        price: 2799,
        originalPrice: 3999,
        rating: 4.9,
        reviewsCount: 428,
        badge: 'Top Recommendation',
        specs: ['Dual-Density Nitrogen Foam', 'Breathable Jacquard Mesh', 'Weight: 230g'],
        reasoning: '98% match for marathon training + exactly within ₹3000 budget.',
        confidence: 98.4,
        iconBg: 'from-brand-600 to-ai-violet',
      },
      {
        id: 'PROD_002',
        name: 'Velocity Surge Carbon',
        category: 'Speed & Tempo Runs',
        price: 2949,
        originalPrice: 4499,
        rating: 4.8,
        reviewsCount: 310,
        badge: 'Merchant Pick',
        specs: ['Embedded Carbon Plate', 'Anti-Abrasion Grip', 'Reflective Night Trim'],
        reasoning: '95% match for high-mileage road training.',
        confidence: 95.1,
        iconBg: 'from-ai-violet to-ai-cyan',
      },
    ],
  },
  headphones: {
    id: 'headphones',
    prompt: 'Looking for wireless ANC headphones for gym under ₹5000.',
    aiResponse:
      'Here are the highest-rated sweatproof noise-cancelling headphones under ₹5,000 with secure ergonomic earhook design and 40-hour battery life.',
    reasoningSteps: [
      'Parsed user intent: Category = Audio, Feature = Active Noise Cancellation, Sweatproof = IPX5+, Budget = ₹5,000',
      'Catalog query executed against 28 audio items',
      'Selected SKU with highest customer retention & Razorpay 1-click bundle discount',
    ],
    products: [
      {
        id: 'PROD_003',
        name: 'SonicPulse Apex ANC',
        category: 'Wireless Audio',
        price: 4499,
        originalPrice: 6999,
        rating: 4.9,
        reviewsCount: 890,
        badge: 'Bestseller',
        specs: ['42dB Hybrid Active Noise Cancellation', 'IPX7 Waterproof', '48-Hour Battery'],
        reasoning: '99% match for sweatproof gym use and deep bass profile.',
        confidence: 99.1,
        iconBg: 'from-ai-cyan to-brand-600',
      },
    ],
  },
  keyboard: {
    id: 'keyboard',
    prompt: 'Recommend a minimalist mechanical keyboard with hot-swappable switches.',
    aiResponse:
      'I found the ideal compact 75% hot-swappable mechanical keyboard with pre-lubed linear switches and wireless tri-mode connectivity.',
    reasoningSteps: [
      'Parsed user intent: Category = Peripherals, FormFactor = 75% Compact, Feature = Hot-Swappable',
      'Checked real-time warehouse inventory and merchant warranty add-on',
      'Bundling with custom coiled cable at 20% bundle discount',
    ],
    products: [
      {
        id: 'PROD_004',
        name: 'KeyCraft Prime 75 Gasket',
        category: 'Mechanical Peripherals',
        price: 4899,
        originalPrice: 6499,
        rating: 4.9,
        reviewsCount: 512,
        badge: 'Top Rated',
        specs: ['Hot-Swappable 5-Pin PCB', 'Gasket-Mounted Sound Dampening', 'Tri-Mode Wireless'],
        reasoning: '97% match for minimalist desk setup and custom key modding.',
        confidence: 97.8,
        iconBg: 'from-amber-500 to-rose-500',
      },
    ],
  },
};

export function InteractiveDemoSection() {
  const [selectedScenarioKey, setSelectedScenarioKey] = React.useState<string>('running_shoes');
  const [messages, setMessages] = React.useState<Array<{ sender: 'user' | 'ai'; text: string; data?: DemoScenario }>>([
    {
      sender: 'user',
      text: scenarios.running_shoes.prompt,
    },
    {
      sender: 'ai',
      text: scenarios.running_shoes.aiResponse,
      data: scenarios.running_shoes,
    },
  ]);
  const [isTyping, setIsTyping] = React.useState<boolean>(false);
  const [customInput, setCustomInput] = React.useState<string>('');
  const [showCheckoutSuccess, setShowCheckoutSuccess] = React.useState<boolean>(false);

  const loadScenario = (key: string) => {
    setSelectedScenarioKey(key);
    setIsTyping(true);
    const scen = scenarios[key];

    setMessages([
      {
        sender: 'user',
        text: scen.prompt,
      },
    ]);

    setTimeout(() => {
      setMessages([
        {
          sender: 'user',
          text: scen.prompt,
        },
        {
          sender: 'ai',
          text: scen.aiResponse,
          data: scen,
        },
      ]);
      setIsTyping(false);
    }, 600);
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customInput.trim()) return;

    const userInput = customInput;
    setCustomInput('');
    setIsTyping(true);

    // Fallback to closest match scenario
    const activeScen = scenarios.running_shoes;

    setMessages((prev) => [
      ...prev,
      { sender: 'user', text: userInput },
    ]);

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: `Found the top match for "${userInput}". I've verified catalog stock, applied current promotional discounts, and verified 1-click Razorpay checkout availability.`,
          data: activeScen,
        },
      ]);
      setIsTyping(false);
    }, 700);
  };

  const handleRazorpayBuy = (productName: string, price: number) => {
    toast.success(`Razorpay Payment Link Generated for ${productName} (₹${price.toLocaleString('en-IN')})`, {
      description: 'Order #ORD-7829 created in Razorpay sandbox. 1-Click native token validated.',
      duration: 4000,
    });
  };

  return (
    <section id="demo" className="py-28 relative overflow-hidden">
      {/* Background Radial Spotlights */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[600px] bg-brand-600/10 dark:bg-brand-600/15 blur-[180px] rounded-full pointer-events-none -z-10" />

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-ai-violet/10 border border-ai-violet/20 text-ai-violet text-xs font-mono font-semibold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            Live Interactive Playground
          </div>
          <h2 className="font-heading font-extrabold text-3xl sm:text-4xl md:text-5xl text-foreground tracking-tight text-balance">
            Experience the AI Sales Assistant in Action
          </h2>
          <p className="mt-4 text-base sm:text-lg text-muted-foreground text-balance">
            Try natural shopping prompts below. Watch our agent reason, construct dynamic bundles, display confidence scores, and generate 1-click Razorpay payment links.
          </p>
        </div>

        {/* Quick Prompt Scenario Selectors */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => loadScenario('running_shoes')}
            className={`px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all flex items-center gap-2 border ${
              selectedScenarioKey === 'running_shoes'
                ? 'bg-brand-600 text-white border-brand-500 shadow-md shadow-brand-600/30'
                : 'bg-secondary/70 dark:bg-obsidian-850 text-foreground border-border hover:bg-secondary'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            Running Shoes under ₹3000
          </button>

          <button
            onClick={() => loadScenario('headphones')}
            className={`px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all flex items-center gap-2 border ${
              selectedScenarioKey === 'headphones'
                ? 'bg-brand-600 text-white border-brand-500 shadow-md shadow-brand-600/30'
                : 'bg-secondary/70 dark:bg-obsidian-850 text-foreground border-border hover:bg-secondary'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            ANC Earbuds for Gym under ₹5000
          </button>

          <button
            onClick={() => loadScenario('keyboard')}
            className={`px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all flex items-center gap-2 border ${
              selectedScenarioKey === 'keyboard'
                ? 'bg-brand-600 text-white border-brand-500 shadow-md shadow-brand-600/30'
                : 'bg-secondary/70 dark:bg-obsidian-850 text-foreground border-border hover:bg-secondary'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            Hot-Swap Mechanical Keyboard
          </button>
        </div>

        {/* Interactive Chat Console Window */}
        <div className="mt-10 max-w-4xl mx-auto rounded-3xl bg-card dark:bg-obsidian-900 border border-border/80 shadow-2xl backdrop-blur-2xl overflow-hidden flex flex-col h-[680px]">
          {/* Console Header Bar */}
          <div className="p-4 sm:px-6 bg-secondary/40 dark:bg-obsidian-950/80 border-b border-border/70 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-600 to-ai-violet flex items-center justify-center text-white shadow-md shadow-brand-600/30">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold font-heading text-foreground">
                    AI Sales Concierge
                  </span>
                  <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                </div>
                <span className="text-[11px] font-mono text-muted-foreground">
                  Model: Gemini 3.7 Agentic Flash &bull; Guardrails Active
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => loadScenario(selectedScenarioKey)}
                title="Reset Conversation"
                className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Chat Messages Container */}
          <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-6">
            {messages.map((msg, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex items-start gap-3.5 ${
                  msg.sender === 'user' ? 'flex-row-reverse' : ''
                }`}
              >
                {/* Avatar */}
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                    msg.sender === 'user'
                      ? 'bg-brand-600 text-white shadow-md'
                      : 'bg-secondary dark:bg-obsidian-800 text-ai-violet border border-border'
                  }`}
                >
                  {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                {/* Message Body */}
                <div className={`space-y-3 max-w-xl ${msg.sender === 'user' ? 'items-end text-right' : ''}`}>
                  <div
                    className={`p-4 rounded-2xl text-sm leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-brand-600 text-white rounded-tr-sm shadow-md'
                        : 'bg-secondary/60 dark:bg-obsidian-850/90 text-foreground border border-border/80 rounded-tl-sm shadow-sm'
                    }`}
                  >
                    {msg.text}
                  </div>

                  {/* AI Reasoning Pill */}
                  {msg.sender === 'ai' && msg.data?.reasoningSteps && (
                    <div className="p-3 rounded-xl bg-ai-violet/5 dark:bg-ai-violet/10 border border-ai-violet/20 space-y-1.5 text-left">
                      <div className="flex items-center gap-1.5 text-[11px] font-mono font-bold text-ai-violet uppercase tracking-wider">
                        <Sparkles className="w-3 h-3" />
                        Autonomous Chain of Reasoning:
                      </div>
                      {msg.data.reasoningSteps.map((step, sIdx) => (
                        <div key={sIdx} className="text-xs font-mono text-muted-foreground flex items-center gap-1.5">
                          <span className="w-1 h-1 rounded-full bg-ai-violet shrink-0" />
                          {step}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Product Recommendation Cards */}
                  {msg.sender === 'ai' && msg.data?.products && (
                    <div className="space-y-3 pt-1 text-left">
                      {msg.data.products.map((prod) => (
                        <div
                          key={prod.id}
                          className="p-4 rounded-2xl bg-card dark:bg-obsidian-800 border border-border hover:border-brand-500/40 transition-all shadow-md space-y-3"
                        >
                          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-brand-500/15 text-brand-600 dark:text-brand-400 border border-brand-500/30">
                                {prod.badge}
                              </span>
                              <span className="text-xs text-muted-foreground font-mono">
                                {prod.category}
                              </span>
                            </div>
                            <div className="flex items-center gap-1 text-amber-400 text-xs font-semibold">
                              <Star className="w-3.5 h-3.5 fill-amber-400" />
                              <span>{prod.rating}</span>
                              <span className="text-muted-foreground font-normal">({prod.reviewsCount})</span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between gap-4">
                            <div>
                              <h4 className="font-heading font-bold text-base text-foreground">
                                {prod.name}
                              </h4>
                              <div className="flex flex-wrap gap-1.5 mt-1.5">
                                {prod.specs.map((sp, spIdx) => (
                                  <span
                                    key={spIdx}
                                    className="px-2 py-0.5 text-[10px] rounded-md bg-secondary/80 dark:bg-obsidian-900 text-muted-foreground font-mono"
                                  >
                                    {sp}
                                  </span>
                                ))}
                              </div>
                            </div>
                            <div className="text-right shrink-0">
                              <div className="text-lg font-bold font-mono text-foreground">
                                ₹{prod.price.toLocaleString('en-IN')}
                              </div>
                              <div className="text-xs text-muted-foreground line-through font-mono">
                                ₹{prod.originalPrice.toLocaleString('en-IN')}
                              </div>
                            </div>
                          </div>

                          {/* Explainability & Razorpay 1-Click Buy */}
                          <div className="pt-3 border-t border-border/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                            <div className="text-[11px] text-muted-foreground font-mono flex items-center gap-1.5">
                              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                              <span>Confidence Score: <strong className="text-foreground">{prod.confidence}%</strong></span>
                            </div>

                            <button
                              onClick={() => handleRazorpayBuy(prod.name, prod.price)}
                              className="w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95"
                            >
                              <CreditCard className="w-3.5 h-3.5" />
                              <span>1-Click Buy via Razorpay</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}

            {/* AI Typing Indicator */}
            {isTyping && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-3"
              >
                <div className="w-8 h-8 rounded-full bg-secondary dark:bg-obsidian-800 flex items-center justify-center text-ai-violet border border-border">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="px-4 py-3 rounded-2xl bg-secondary/60 dark:bg-obsidian-850 text-xs font-mono text-muted-foreground flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-ai-violet animate-spin" />
                  <span>Agent reasoning &amp; verifying catalog stock...</span>
                </div>
              </motion.div>
            )}
          </div>

          {/* Interactive Chat Input Form */}
          <form
            onSubmit={handleCustomSubmit}
            className="p-4 bg-secondary/30 dark:bg-obsidian-950 border-t border-border/70 flex items-center gap-3"
          >
            <input
              type="text"
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              placeholder="Ask anything (e.g., 'Find running shoes under ₹3000' or 'Best waterproof smartwatch')..."
              className="flex-1 px-4 py-3 rounded-xl bg-background dark:bg-obsidian-900 border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand-500/50"
            />
            <button
              type="submit"
              disabled={!customInput.trim()}
              className="p-3 rounded-xl bg-brand-600 text-white hover:bg-brand-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md shadow-brand-600/20"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
