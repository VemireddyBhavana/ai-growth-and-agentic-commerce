'use client';

import * as React from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';
import { cn } from '@/lib/utils';

type AnimatedCounterProps = {
  value: number;
  duration?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
  format?: (n: number) => string;
};

export function AnimatedCounter({
  value,
  duration = 1.4,
  decimals = 0,
  prefix = '',
  suffix = '',
  className,
  format,
}: AnimatedCounterProps) {
  const spring = useSpring(0, {
    mass: 0.8,
    stiffness: 80,
    damping: 20,
    duration,
  });

  const display = useTransform(spring, (current) => {
    const rounded = Number(current.toFixed(decimals));
    if (format) return format(rounded);
    return rounded.toLocaleString('en-IN', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
  });

  const [text, setText] = React.useState(() => {
    const rounded = Number((0).toFixed(decimals));
    if (format) return format(rounded);
    return rounded.toLocaleString('en-IN', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
  });

  React.useEffect(() => {
    const unsubscribe = display.on('change', (latest) => setText(latest));
    spring.set(value);
    return () => unsubscribe();
  }, [spring, value, display]);

  return (
    <span className={cn('inline-flex tabular-nums', className)}>
      {prefix}
      <motion.span aria-live="polite">{text}</motion.span>
      {suffix}
    </span>
  );
}
