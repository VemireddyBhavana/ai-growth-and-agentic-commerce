'use client';

import * as React from 'react';
import { motion } from 'framer-motion';

export function TrustedBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
    >
      <motion.div
        animate={{ x: [0, 16, -12, 0], y: [0, -10, 8, 0] }}
        transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[420px] rounded-full bg-brand-600/14 dark:bg-brand-600/18 blur-[150px] opacity-75"
      />
      <motion.div
        animate={{ x: [0, -14, 10, 0], y: [0, 10, -12, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
        className="absolute bottom-0 right-0 w-[460px] h-[400px] rounded-full bg-ai-violet/14 dark:bg-ai-violet/18 blur-[130px] opacity-75"
      />
      <motion.div
        animate={{ x: [0, 12, -8, 0], y: [0, -8, 10, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
        className="absolute bottom-0 left-0 w-[420px] h-[360px] rounded-full bg-ai-cyan/12 dark:bg-ai-cyan/16 blur-[120px] opacity-65"
      />
      <motion.div
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
        className="absolute top-[28%] right-[18%] w-[260px] h-[260px] rounded-full bg-ai-emerald/10 dark:bg-ai-emerald/12 blur-[110px] opacity-60"
      />

      <div className="absolute inset-0 bg-grid-black dark:bg-grid-white opacity-[0.28] dark:opacity-[0.22] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_45%,#000_60%,transparent_100%)]" />

      <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-transparent to-background/60 pointer-events-none" />
    </div>
  );
}
