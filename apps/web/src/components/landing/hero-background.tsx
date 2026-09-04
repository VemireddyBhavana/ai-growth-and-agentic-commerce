'use client';

import * as React from 'react';
import { motion } from 'framer-motion';

export function HeroBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
    >
      <motion.div
        animate={{ x: [0, 20, -15, 0], y: [0, -12, 8, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -top-40 left-1/2 -translate-x-1/2 w-[1100px] h-[620px] rounded-full bg-brand-600/18 dark:bg-brand-600/22 blur-[140px] opacity-80"
      />
      <motion.div
        animate={{ x: [0, -18, 12, 0], y: [0, 8, -14, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        className="absolute top-[12%] -right-24 w-[520px] h-[460px] rounded-full bg-ai-violet/18 dark:bg-ai-violet/22 blur-[130px] opacity-80"
      />
      <motion.div
        animate={{ x: [0, 14, -10, 0], y: [0, -10, 12, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        className="absolute top-[18%] -left-28 w-[480px] h-[400px] rounded-full bg-ai-cyan/16 dark:bg-ai-cyan/18 blur-[120px] opacity-80"
      />
      <motion.div
        animate={{ scale: [1, 1.06, 1] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-0 right-[22%] w-[300px] h-[300px] rounded-full bg-ai-emerald/10 blur-[120px] opacity-70"
      />

      <div className="absolute inset-0 bg-grid-black dark:bg-grid-white opacity-[0.35] dark:opacity-[0.28] [mask-image:radial-gradient(ellipse_65%_55%_at_50%_38%,#000_68%,transparent_100%)]" />

      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background pointer-events-none" />
    </div>
  );
}
