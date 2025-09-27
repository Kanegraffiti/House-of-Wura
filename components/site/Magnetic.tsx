'use client';

import { useRef } from 'react';
import { animate, motion, useMotionValue, useReducedMotion } from 'framer-motion';

import { cn } from '@/lib/utils';

interface MagneticProps {
  children: React.ReactNode;
  className?: string;
  radius?: number;
}

export function Magnetic({ children, className, radius = 140 }: MagneticProps) {
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement | null>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const reset = () => {
    animate(x, 0, { duration: 0.2 });
    animate(y, 0, { duration: 0.2 });
  };

  const handleMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (reduceMotion) return;
    const element = ref.current;
    if (!element) return;
    const rect = element.getBoundingClientRect();
    const offsetX = event.clientX - (rect.left + rect.width / 2);
    const offsetY = event.clientY - (rect.top + rect.height / 2);
    const distance = Math.min(1, Math.hypot(offsetX, offsetY) / radius);
    x.set(offsetX * 0.18 * (1 - 0.2 * distance));
    y.set(offsetY * 0.18 * (1 - 0.2 * distance));
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      style={reduceMotion ? undefined : { x, y }}
      className={cn('inline-flex will-change-transform', className)}
    >
      {children}
    </motion.div>
  );
}
