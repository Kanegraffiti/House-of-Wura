'use client';

import { useMemo, useRef } from 'react';
import { motion, useInView, type UseInViewOptions } from 'framer-motion';

import { delayVariant, fadeInUp } from '@/lib/motion';
import { cn } from '@/lib/utils';

interface RevealProps {
  children: React.ReactNode;
  once?: boolean;
  margin?: UseInViewOptions['margin'];
  className?: string;
  delay?: number;
}

export default function Reveal({
  children,
  once = true,
  margin = '0px 0px -10% 0px',
  className = '',
  delay = 0
}: RevealProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once, margin });
  const variants = useMemo(() => delayVariant(fadeInUp, delay), [delay]);

  return (
    <motion.div
      ref={ref}
      variants={variants}
      initial="hidden"
      animate={inView ? 'show' : 'hidden'}
      className={cn('will-change-transform', className)}
    >
      {children}
    </motion.div>
  );
}
