'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Settings,
  Sliders,
  Volume2,
  VolumeX,
  ShieldCheck,
  Trash2,
  Sparkles,
  Zap,
  DollarSign,
  Percent,
} from 'lucide-react';
import { toast } from 'sonner';
import { useAssistantStore } from '@/stores/use-assistant-store';

export const AssistantSettingsModal: React.FC = () => {
  const {
    isSettingsModalOpen,
    setSettingsModalOpen,
    settings,
    updateSettings,
    clearAllSessions,
  } = useAssistantStore();

  if (!isSettingsModalOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setSettingsModalOpen(false)}
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-xl max-h-[85vh] overflow-y-auto rounded-3xl border border-white/15 bg-zinc-950/95 text-zinc-100 shadow-2xl z-10 flex flex-col"
        >
          {/* Header */}
          <div className="sticky top-0 z-20 px-6 py-4 bg-zinc-950/90 backdrop-blur-md border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Settings className="w-5 h-5 text-violet-400" />
              <h3 className="font-heading font-bold text-base text-white">
                AI Shopping Assistant Settings
              </h3>
            </div>

            <button
              type="button"
              onClick={() => setSettingsModalOpen(false)}
              className="p-2 rounded-xl border border-white/10 hover:bg-white/10 text-zinc-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Settings Options */}
          <div className="p-6 space-y-6 text-xs">
            {/* AI Engine Model */}
            <div className="space-y-2">
              <label className="font-semibold text-zinc-200 block">AI Reasoning Engine</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => updateSettings({ aiModel: 'agentic-4o' })}
                  className={`p-3 rounded-xl border text-left space-y-1 transition-all ${
                    settings.aiModel === 'agentic-4o'
                      ? 'border-violet-500 bg-violet-500/20 text-white shadow-md'
                      : 'border-white/10 bg-zinc-900 text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  <div className="font-semibold flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-violet-400" />
                    GPT-4o Autonomous Pro
                  </div>
                  <div className="text-[11px] text-zinc-400">
                    Deep explainability, margin optimization & dynamic bundles
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => updateSettings({ aiModel: 'speed-turbo' })}
                  className={`p-3 rounded-xl border text-left space-y-1 transition-all ${
                    settings.aiModel === 'speed-turbo'
                      ? 'border-violet-500 bg-violet-500/20 text-white shadow-md'
                      : 'border-white/10 bg-zinc-900 text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  <div className="font-semibold flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-cyan-400" />
                    Speed Turbo (Sub-50ms)
                  </div>
                  <div className="text-[11px] text-zinc-400">
                    Ultra-low latency sub-second direct catalog lookup
                  </div>
                </button>
              </div>
            </div>

            {/* Currency Preference */}
            <div className="space-y-2">
              <label className="font-semibold text-zinc-200 block">Currency Display</label>
              <div className="grid grid-cols-3 gap-2 font-mono">
                {(['INR', 'USD', 'EUR'] as const).map((curr) => (
                  <button
                    key={curr}
                    type="button"
                    onClick={() => updateSettings({ currency: curr })}
                    className={`py-2 rounded-xl border text-center font-bold ${
                      settings.currency === curr
                        ? 'border-violet-500 bg-violet-500/20 text-white'
                        : 'border-white/10 bg-zinc-900 text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    {curr === 'INR' ? '₹ INR (India)' : curr === 'USD' ? '$ USD' : '€ EUR'}
                  </button>
                ))}
              </div>
            </div>

            {/* AI Creativity Slider */}
            <div className="space-y-2">
              <div className="flex justify-between font-mono">
                <label className="font-semibold text-zinc-200">AI Creativity (Temperature)</label>
                <span className="text-violet-400 font-bold">{settings.creativity}</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="1.0"
                step="0.1"
                value={settings.creativity}
                onChange={(e) => updateSettings({ creativity: parseFloat(e.target.value) })}
                className="w-full accent-violet-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-zinc-400 font-mono">
                <span>Deterministic / Precise</span>
                <span>Explorative / Creative</span>
              </div>
            </div>

            {/* Toggles */}
            <div className="space-y-3 pt-2 border-t border-white/5">
              {/* Auto apply bundles */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-900 border border-white/10">
                <div className="space-y-0.5">
                  <span className="font-semibold text-zinc-200 block">
                    Auto-Apply Bundle Discounts
                  </span>
                  <span className="text-[11px] text-zinc-400 block">
                    Automatically calculate multi-product package savings
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={settings.autoApplyBundles}
                  onChange={(e) => updateSettings({ autoApplyBundles: e.target.checked })}
                  className="w-4 h-4 accent-violet-500 rounded cursor-pointer"
                />
              </div>

              {/* Show Margin & Stock metrics */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-900 border border-white/10">
                <div className="space-y-0.5">
                  <span className="font-semibold text-zinc-200 block">
                    Show Explainable Margin Metrics
                  </span>
                  <span className="text-[11px] text-zinc-400 block">
                    Display transparency scores & inventory velocity
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={settings.showMarginMetrics}
                  onChange={(e) => updateSettings({ showMarginMetrics: e.target.checked })}
                  className="w-4 h-4 accent-violet-500 rounded cursor-pointer"
                />
              </div>

              {/* Sound Effects */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-900 border border-white/10">
                <div className="space-y-0.5">
                  <span className="font-semibold text-zinc-200 block">Audio Feedback</span>
                  <span className="text-[11px] text-zinc-400 block">
                    Play subtle sound effects on cart actions and message delivery
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={settings.soundEnabled}
                  onChange={(e) => updateSettings({ soundEnabled: e.target.checked })}
                  className="w-4 h-4 accent-violet-500 rounded cursor-pointer"
                />
              </div>
            </div>

            {/* Clear History */}
            <div className="pt-2 border-t border-white/10">
              <button
                type="button"
                onClick={() => {
                  clearAllSessions();
                  toast.success('Conversation history cleared');
                  setSettingsModalOpen(false);
                }}
                className="w-full py-2.5 px-4 rounded-xl text-rose-400 hover:text-white bg-rose-500/10 hover:bg-rose-500 border border-rose-500/20 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear All Chat History</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
