import React from 'react';
import { OrderTimelineEvent } from '@/types/orders';
import { Check, Circle } from 'lucide-react';
import { motion } from 'framer-motion';

export const OrderTimeline: React.FC<{ timeline: OrderTimelineEvent[] }> = ({ timeline }) => {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
      <h3 className="text-xl font-semibold text-white mb-6">Order Timeline</h3>
      
      <div className="relative border-l border-white/20 ml-3 space-y-6">
        {timeline.map((event, idx) => {
          const isCompleted = event.completed;
          return (
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              key={event.id} 
              className="relative pl-8"
            >
              <div className={`absolute -left-[11px] top-1 rounded-full bg-[#0a0a0a] flex items-center justify-center
                ${isCompleted ? 'text-green-400' : 'text-white/20'}`}
              >
                {isCompleted ? (
                  <Check className="w-5 h-5 bg-green-400/20 rounded-full" />
                ) : (
                  <Circle className="w-5 h-5" />
                )}
              </div>
              
              <div>
                <p className={`font-medium ${isCompleted ? 'text-white' : 'text-white/50'}`}>
                  {event.status}
                </p>
                <p className="text-sm text-white/60 mt-0.5">{event.description}</p>
                <p className="text-xs text-white/40 mt-1">
                  {new Date(event.timestamp).toLocaleString()}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
