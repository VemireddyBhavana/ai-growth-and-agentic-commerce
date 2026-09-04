'use client';
import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Sparkles, TrendingDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const AIExplainabilityPanel: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-gradient-to-r from-violet-500/10 to-fuchsia-500/10 border border-violet-500/20 rounded-2xl overflow-hidden backdrop-blur-xl">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 focus:outline-none"
      >
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full bg-violet-500/20 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-violet-400" />
          </div>
          <span className="font-medium text-white">AI Deal Insights</span>
        </div>
        {isOpen ? <ChevronUp className="w-5 h-5 text-white/50" /> : <ChevronDown className="w-5 h-5 text-white/50" />}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="px-4 pb-4"
          >
            <div className="pt-2 space-y-4">
              <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                <p className="text-sm text-white/70">
                  <strong className="text-violet-400">Why this recommendation?</strong> Based on your browsing history and preference for ergonomic tech, these items frequently bundle together for a complete workstation upgrade.
                </p>
              </div>

              <div className="flex items-center space-x-3 bg-green-500/10 p-3 rounded-xl border border-green-500/20">
                <TrendingDown className="w-5 h-5 text-green-400" />
                <p className="text-sm text-green-400 font-medium">
                  AI Applied Discount: You saved ₹50.00 today!
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
