'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, ChevronDown, Sparkles } from 'lucide-react';

interface FaqItem {
  question: string;
  answer: string;
}

const faqs: FaqItem[] = [
  {
    question: 'How fast can I integrate AI Sales Assistant into my existing storefront?',
    answer:
      'Integration takes under 5 minutes. We provide 1-click native connectors for Shopify, WooCommerce, Magento, and custom headless stacks via our REST & GraphQL SDKs. Your product catalog, inventory levels, and pricing tiers sync automatically in real-time.',
  },
  {
    question: 'How does the Razorpay 1-Click native in-chat checkout work?',
    answer:
      'When a customer agrees to purchase an item or dynamic bundle, the agent generates a secure, tokenized Razorpay payment link or modal directly within the dialogue. Customers complete payments via UPI, Credit/Debit cards, Net Banking, or EMI without redirecting through clunky multi-step carts.',
  },
  {
    question: 'What prevents the AI agent from hallucinating or granting unauthorized discounts?',
    answer:
      'We implement strict enterprise-grade guardrails and deterministic confidence score validation. The agent cannot manufacture product attributes or price drops that are not explicitly authorized in your merchant catalog and margin configuration policies.',
  },
  {
    question: 'Can I customize the agent’s personality, brand voice, and bundling thresholds?',
    answer:
      'Yes. Through the Merchant Console, you have full control over tone of voice (e.g., luxury, witty, technical, concise), minimum gross margin rules, default upselling aggressiveness, and category-specific exclusion lists.',
  },
  {
    question: 'How does real-time vector embedding and catalog sync function?',
    answer:
      'Every time you update products, prices, or inventory levels, webhooks instantly trigger incremental embedding generation. Multi-attribute queries (color, size, fit, occasion, price) are matched in high-dimensional vector space with sub-450ms query latency.',
  },
  {
    question: 'Is there a free trial available for new merchants?',
    answer:
      'Yes! We offer a full-featured 14-day free trial with sandbox Razorpay simulation and up to 5,000 autonomous customer sessions. No credit card is required to get started.',
  },
];

export function FaqSection() {
  const [openIndex, setOpenIndex] = React.useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-28 relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[450px] bg-ai-violet/10 dark:bg-ai-violet/15 blur-[160px] rounded-full pointer-events-none -z-10" />

      <div className="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-ai-violet/10 border border-ai-violet/20 text-ai-violet text-xs font-mono font-semibold uppercase tracking-wider mb-4">
            <HelpCircle className="w-3.5 h-3.5" />
            Frequently Asked Questions
          </div>
          <h2 className="font-heading font-extrabold text-3xl sm:text-4xl md:text-5xl text-foreground tracking-tight text-balance">
            Got questions? We have answers.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-muted-foreground text-balance">
            Everything you need to know about autonomous commerce, safety guardrails, and Razorpay setup.
          </p>
        </div>

        {/* Accordion List */}
        <div className="mt-16 space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                  isOpen
                    ? 'bg-card dark:bg-obsidian-900 border-brand-500/50 shadow-lg shadow-brand-500/10'
                    : 'bg-card/60 dark:bg-obsidian-900/40 border-border/70 hover:border-border hover:bg-card/80'
                }`}
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-6 text-left flex items-center justify-between gap-4 focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <span className="font-heading font-bold text-base sm:text-lg text-foreground">
                    {faq.question}
                  </span>
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300 ${
                      isOpen
                        ? 'bg-brand-600 text-white rotate-180'
                        : 'bg-secondary dark:bg-obsidian-800 text-muted-foreground'
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                    >
                      <div className="px-6 pb-6 pt-1 text-sm sm:text-base text-muted-foreground leading-relaxed border-t border-border/30">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
