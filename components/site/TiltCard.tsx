'use client';

import { useRef } from 'react';
import { animate, motion, useMotionValue, useReducedMotion } from 'framer-motion';

import { cn } from '@/lib/utils';

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
}

export function TiltCard({ children, className }: TiltCardProps) {
  const reduceMotion = useReducedMotion();
  const cardRef = useRef<HTMLDivElement | null>(null);
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);

  const reset = () => {
    animate(rotateX, 0, { duration: 0.3 });
    animate(rotateY, 0, { duration: 0.3 });
  };

  const handleMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (reduceMotion) return;
    const rect = (event.currentTarget as HTMLDivElement).getBoundingClientRect();
    const offsetX = event.clientX - (rect.left + rect.width / 2);
    const offsetY = event.clientY - (rect.top + rect.height / 2);
    const percentX = offsetX / rect.width;
    const percentY = offsetY / rect.height;

    rotateX.set(Math.max(-10, Math.min(10, -percentY * 16)));
    rotateY.set(Math.max(-10, Math.min(10, percentX * 16)));
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      onMouseEnter={reduceMotion ? undefined : handleMove}
      style={reduceMotion ? undefined : { rotateX, rotateY, transformStyle: 'preserve-3d' }}
      className={cn(
        'group rounded-3xl border border-transparent transition-shadow duration-200 ease-std will-change-transform hover:shadow-[0_18px_36px_rgba(11,11,11,0.18)]',
        className
      )}
    >
      {children}
    </motion.div>
  );
}
