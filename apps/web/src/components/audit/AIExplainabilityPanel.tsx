import React from 'react';
import { AIReasoning } from '@/types/audit';
import { Sparkles, BrainCircuit, Target, Lightbulb, Ban } from 'lucide-react';

export const AIExplainabilityPanel: React.FC<{ reasoning: AIReasoning }> = ({ reasoning }) => {
  return (
    <div className="bg-gradient-to-br from-violet-500/10 to-fuchsia-500/10 border border-violet-500/20 rounded-2xl p-6 backdrop-blur-sm">
      <div className="flex items-center space-x-3 mb-6 pb-4 border-b border-white/10">
        <div className="w-10 h-10 rounded-full bg-violet-500/20 flex items-center justify-center">
          <BrainCircuit className="w-5 h-5 text-violet-400" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white">AI Reason Trace</h3>
          <p className="text-sm text-violet-300">Confidence Score: {reasoning.confidenceScore}%</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <h4 className="text-xs font-bold text-white/40 uppercase tracking-wider mb-2 flex items-center">
            <Target className="w-3 h-3 mr-1" /> Original Intent
          </h4>
          <p className="text-sm text-white/80 bg-black/20 p-3 rounded-lg border border-white/5">
            &quot;{reasoning.customerIntent}&quot;
          </p>
        </div>
        <div>
          <h4 className="text-xs font-bold text-white/40 uppercase tracking-wider mb-2">Extracted Keywords</h4>
          <div className="flex flex-wrap gap-2">
            {reasoning.extractedKeywords.map(kw => (
              <span key={kw} className="bg-violet-500/20 text-violet-300 text-xs px-2 py-1 rounded">
                {kw}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <h4 className="text-xs font-bold text-white/40 uppercase tracking-wider mb-2 flex items-center">
            <Lightbulb className="w-3 h-3 mr-1" /> Selection Logic
          </h4>
          <div className="bg-green-500/10 border border-green-500/20 p-4 rounded-xl">
            <p className="text-sm font-medium text-green-400 mb-1">Final Recommendation: {reasoning.finalRecommendation}</p>
            <p className="text-sm text-green-400/70">{reasoning.selectionReason}</p>
          </div>
        </div>

        <div>
          <h4 className="text-xs font-bold text-white/40 uppercase tracking-wider mb-2 flex items-center">
            <Ban className="w-3 h-3 mr-1" /> Rejection Logic
          </h4>
          <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl">
            <p className="text-sm font-medium text-red-400 mb-1">Rejected: {reasoning.alternativeProductsConsidered.join(', ')}</p>
            <p className="text-sm text-red-400/70">{reasoning.rejectionReason}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
