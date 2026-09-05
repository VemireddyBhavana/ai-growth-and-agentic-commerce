import React from 'react';
import type { AIRecommendation } from '@/types/orders';
import { Sparkles, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

export const AIRecommendationSummary: React.FC<{ ai: AIRecommendation }> = ({ ai }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-gradient-to-br from-violet-500/10 to-fuchsia-500/10 border border-violet-500/20 rounded-2xl p-6 backdrop-blur-sm"
    >
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-violet-500/20 flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-violet-400" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white">AI Explainability</h3>
          <p className="text-sm text-violet-300">Confidence Score: {ai.confidenceScore}%</p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <h4 className="text-sm font-medium text-white/80 mb-1">Reason for Recommendation</h4>
          <p className="text-sm text-white/60 bg-black/20 p-3 rounded-lg border border-white/5">
            {ai.reason}
          </p>
        </div>

        <div>
          <h4 className="text-sm font-medium text-white/80 mb-1">Explainability Summary</h4>
          <p className="text-sm text-white/60 bg-black/20 p-3 rounded-lg border border-white/5">
            {ai.explainabilitySummary}
          </p>
        </div>

        <div className="flex items-center justify-between bg-green-500/10 border border-green-500/20 rounded-lg p-3">
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-4 h-4 text-green-400" />
            <span className="text-sm font-medium text-green-400">Estimated Savings Generated</span>
          </div>
          <span className="font-bold text-green-400">₹{ai.estimatedSavings}</span>
        </div>
      </div>
    </motion.div>
  );
};
