'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  User,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  Package,
  Layers,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Cpu,
} from 'lucide-react';
import { toast } from 'sonner';
import type { ChatMessage } from '@ai-sales-assistant/types';
import { useAssistantStore } from '@/stores/use-assistant-store';
import { RecommendationCard } from './recommendation-card';

interface ChatMessageItemProps {
  message: ChatMessage;
}

export const ChatMessageItem: React.FC<ChatMessageItemProps> = ({ message }) => {
  const isUser = message.role === 'user';
  const [copied, setCopied] = useState(false);
  const [showThinking, setShowThinking] = useState(false);
  const { sendUserMessage, addBundleToCart, openCheckoutModal } = useAssistantStore();

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    toast.success('Copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className={`flex gap-3 sm:gap-4 ${isUser ? 'justify-end' : 'justify-start'} w-full group`}
    >
      {/* AI Avatar */}
      {!isUser && (
        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-violet-600 via-indigo-600 to-cyan-500 p-0.5 shadow-md shadow-violet-500/20 shrink-0 mt-0.5">
          <div className="w-full h-full bg-zinc-950 rounded-[10px] flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-violet-300" />
          </div>
        </div>
      )}

      {/* Message Content Container */}
      <div className={`flex flex-col space-y-3 max-w-[92%] sm:max-w-[85%] ${isUser ? 'items-end' : 'items-start'}`}>
        {/* Chat Bubble */}
        <div
          className={`rounded-2xl p-4 sm:p-5 relative ${
            isUser
              ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-600/20 rounded-tr-sm'
              : 'border border-white/10 bg-zinc-900/80 backdrop-blur-xl text-zinc-100 shadow-xl rounded-tl-sm'
          }`}
        >
          {/* Thinking Steps Accordion (for AI messages) */}
          {!isUser && message.thinkingSteps && message.thinkingSteps.length > 0 && (
            <div className="mb-3.5 pb-3 border-b border-white/10">
              <button
                type="button"
                onClick={() => setShowThinking(!showThinking)}
                className="w-full flex items-center justify-between text-left text-xs text-violet-300 hover:text-violet-200 transition-colors py-1 group/think"
              >
                <div className="flex items-center gap-1.5 font-mono">
                  <Cpu className="w-3.5 h-3.5 text-violet-400 animate-spin" style={{ animationDuration: '4s' }} />
                  <span>Agentic Commerce Reasoning Engine</span>
                  <span className="text-[10px] px-1.5 py-0.2 bg-violet-500/20 text-violet-300 rounded border border-violet-500/30">
                    {message.thinkingSteps.length} steps
                  </span>
                </div>
                {showThinking ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>

              <AnimatePresence>
                {showThinking && (
                  <motion.ul
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="mt-2 space-y-1.5 text-[11px] font-mono text-zinc-400 bg-black/40 p-2.5 rounded-lg border border-white/5"
                  >
                    {message.thinkingSteps.map((step, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-violet-400 font-bold">•</span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </motion.ul>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* Main Message Text (Markdown formatting) */}
          <div className="text-sm sm:text-base leading-relaxed space-y-2.5">
            {message.content.split('\n\n').map((paragraph, pIdx) => {
              // Handle bullet list
              if (paragraph.startsWith('- ') || paragraph.startsWith('* ')) {
                const items = paragraph.split('\n').map((line) => line.replace(/^[-*]\s*/, ''));
                return (
                  <ul key={pIdx} className="space-y-1 my-2 pl-4 list-disc marker:text-violet-400 text-sm">
                    {items.map((item, iIdx) => (
                      <li key={iIdx} dangerouslySetInnerHTML={{ __html: formatMarkdownBold(item) }} />
                    ))}
                  </ul>
                );
              }

              return (
                <p
                  key={pIdx}
                  className="whitespace-pre-line text-sm sm:text-base"
                  dangerouslySetInnerHTML={{ __html: formatMarkdownBold(paragraph) }}
                />
              );
            })}
          </div>

          {/* Streaming Indicator */}
          {message.status === 'streaming' && (
            <div className="flex items-center gap-1.5 pt-2 text-violet-400 text-xs font-mono">
              <span className="inline-block w-2 h-2 rounded-full bg-violet-400 animate-pulse" />
              <span>Analyzing product catalog & neural embeddings...</span>
            </div>
          )}

          {/* Copy and Timestamp Action */}
          <div className="flex items-center justify-between gap-4 pt-2 mt-1 border-t border-white/5 text-[10px] text-zinc-400">
            <span>{new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            {!isUser && (
              <button
                type="button"
                onClick={handleCopy}
                className="opacity-0 group-hover:opacity-100 transition-opacity hover:text-zinc-200 flex items-center gap-1"
                aria-label="Copy message"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Inline Comparison Table (if comparison exists) */}
        {!isUser && message.comparison && (
          <div className="w-full rounded-2xl border border-white/10 bg-zinc-900/90 backdrop-blur-xl overflow-hidden shadow-xl my-2">
            <div className="px-4 py-3 bg-white/[0.03] border-b border-white/10 flex items-center justify-between">
              <span className="font-heading font-semibold text-sm text-zinc-100 flex items-center gap-2">
                <Layers className="w-4 h-4 text-violet-400" />
                {message.comparison.title}
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-black/30 text-zinc-400 font-mono text-[11px]">
                  <tr>
                    {message.comparison.columns.map((col, idx) => (
                      <th key={idx} className="px-3.5 py-2.5 font-semibold">
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {message.comparison.rows.map((row, rIdx) => (
                    <tr key={rIdx} className="hover:bg-white/[0.02]">
                      <td className="px-3.5 py-2.5 font-mono text-zinc-400 font-medium">
                        {row.label}
                      </td>
                      {row.values.map((val, vIdx) => (
                        <td key={vIdx} className="px-3.5 py-2.5 text-zinc-200 font-medium">
                          {val}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {message.comparison.recommendationNote && (
              <div className="p-3 bg-violet-500/10 border-t border-violet-500/20 text-xs text-violet-300">
                <span className="font-semibold text-violet-200">💡 AI Verdict: </span>
                {message.comparison.recommendationNote}
              </div>
            )}
          </div>
        )}

        {/* Dynamic Bundle Offer Banner */}
        {!isUser && message.bundleOffer && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full rounded-2xl border border-emerald-500/30 bg-gradient-to-r from-emerald-950/40 via-zinc-900/90 to-teal-950/30 p-4 shadow-xl backdrop-blur-xl space-y-3"
          >
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  <Package className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-heading font-bold text-sm text-zinc-100">
                    {message.bundleOffer.name}
                  </h4>
                  <span className="text-[11px] font-mono text-emerald-400 font-semibold">
                    {message.bundleOffer.tag}
                  </span>
                </div>
              </div>

              <div className="text-right">
                <div className="text-base font-bold font-heading text-white">
                  ₹{message.bundleOffer.bundlePrice.toLocaleString('en-IN')}
                </div>
                <div className="text-xs text-zinc-400 line-through">
                  ₹{message.bundleOffer.originalTotal.toLocaleString('en-IN')}
                </div>
              </div>
            </div>

            <p className="text-xs text-zinc-300 leading-relaxed">
              {message.bundleOffer.description}
            </p>

            <div className="flex items-center justify-between pt-1 gap-2">
              <span className="text-[11px] text-emerald-400/90 font-mono">
                Instant Savings: ₹{message.bundleOffer.savings.toLocaleString('en-IN')}
              </span>

              <button
                type="button"
                onClick={() => {
                  addBundleToCart(message.bundleOffer!);
                  toast.success(`Added ${message.bundleOffer!.name} to cart!`, {
                    description: `Saved ₹${message.bundleOffer!.savings.toLocaleString('en-IN')}`,
                  });
                }}
                className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-emerald-500 hover:bg-emerald-400 text-zinc-950 shadow-md shadow-emerald-500/20 flex items-center gap-1.5 transition-all active:scale-95"
              >
                <Package className="w-3.5 h-3.5" />
                Add Bundle to Cart
              </button>
            </div>
          </motion.div>
        )}

        {/* Inline Recommendation Cards Grid */}
        {!isUser && message.recommendations && message.recommendations.length > 0 && (
          <div className="w-full space-y-2 pt-1">
            <div className="text-xs font-mono text-zinc-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-violet-400" />
              <span>Recommended Products ({message.recommendations.length})</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 w-full">
              {message.recommendations.map((rec) => (
                <RecommendationCard key={rec.product.id} data={rec} />
              ))}
            </div>
          </div>
        )}

        {/* Suggested Action Buttons (e.g. Continue Shopping & Proceed to Checkout) */}
        {!isUser && message.followUpSuggestions && message.followUpSuggestions.length > 0 && (
          <div className="w-full pt-2">
            <div className="flex flex-wrap items-center gap-2.5">
              {message.followUpSuggestions.map((suggestion, idx) => {
                const isCheckout = suggestion.toLowerCase().includes('proceed to checkout');
                const isContinue = suggestion.toLowerCase().includes('continue shopping');

                if (isCheckout) {
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        const firstProduct = useAssistantStore.getState().cart[0]?.product;
                        openCheckoutModal(firstProduct);
                      }}
                      className="px-5 py-2.5 rounded-xl text-xs font-bold bg-[#635BFF] hover:bg-[#5245eb] text-white shadow-md shadow-violet-600/30 transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>Proceed to Checkout</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  );
                }

                if (isContinue) {
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => sendUserMessage('Show me other categories')}
                      className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-white dark:bg-zinc-800 text-violet-700 dark:text-violet-300 border border-violet-200 dark:border-violet-700/60 hover:bg-violet-50 dark:hover:bg-zinc-700 transition-all active:scale-95 cursor-pointer shadow-2xs"
                    >
                      <span>Continue Shopping</span>
                    </button>
                  );
                }

                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => sendUserMessage(suggestion)}
                    className="px-3 py-1.5 rounded-xl text-xs bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer"
                  >
                    <span>{suggestion}</span>
                    <ArrowRight className="w-3 h-3 text-zinc-400" />
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* User Avatar */}
      {isUser && (
        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-zinc-700 to-zinc-900 p-0.5 border border-white/10 shrink-0 mt-0.5 flex items-center justify-center shadow-md">
          <User className="w-4 h-4 text-zinc-300" />
        </div>
      )}
    </motion.div>
  );
};

function formatMarkdownBold(text: string): string {
  // Convert **bold** to <strong>bold</strong>
  return text.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>');
}
