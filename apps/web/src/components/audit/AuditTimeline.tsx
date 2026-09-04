import React from 'react';
import { TimelineStep } from '@/types/audit';
import { Check, X, Clock, TerminalSquare } from 'lucide-react';
import { motion } from 'framer-motion';

export const AuditTimeline: React.FC<{ timeline: TimelineStep[] }> = ({ timeline }) => {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
      <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
        <TerminalSquare className="w-5 h-5 mr-2 text-violet-400" />
        Event Trace Timeline
      </h3>
      
      <div className="relative border-l border-white/20 ml-3 space-y-6">
        {timeline.map((step, idx) => {
          const isSuccess = step.status === 'success';
          const isFailed = step.status === 'failed';

          return (
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              key={step.id} 
              className="relative pl-8"
            >
              <div className={`absolute -left-[11px] top-1 rounded-full bg-[#0a0a0a] flex items-center justify-center
                ${isSuccess ? 'text-green-400' : isFailed ? 'text-red-400' : 'text-white/20'}`}
              >
                {isSuccess ? (
                  <Check className="w-5 h-5 bg-green-400/20 rounded-full" />
                ) : isFailed ? (
                  <X className="w-5 h-5 bg-red-400/20 rounded-full" />
                ) : (
                  <Clock className="w-5 h-5 bg-white/10 rounded-full text-white/50" />
                )}
              </div>
              
              <div className="bg-white/5 border border-white/5 p-4 rounded-xl">
                <div className="flex justify-between items-start mb-1">
                  <p className={`font-medium ${isSuccess ? 'text-green-400' : isFailed ? 'text-red-400' : 'text-white'}`}>
                    {step.name}
                  </p>
                  {step.duration && (
                    <span className="text-xs font-mono text-white/40 bg-black/30 px-2 py-0.5 rounded">
                      {step.duration}
                    </span>
                  )}
                </div>
                <p className="text-sm text-white/70 mb-2">{step.description}</p>
                <p className="text-xs text-white/40">
                  {new Date(step.timestamp).toLocaleString()}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
