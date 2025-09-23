'use client';

import { motion, useReducedMotion } from 'framer-motion';
import type { ComponentPropsWithoutRef } from 'react';

import { cn } from '@/lib/utils';

type SectionProps = ComponentPropsWithoutRef<typeof motion.section>;

export function Section({ className, children, ...props }: SectionProps) {
  const prefersReducedMotion = useReducedMotion();
  return (
    <motion.section
      className={cn('py-20 sm:py-24', className)}
      initial={prefersReducedMotion ? undefined : { opacity: 0, y: 40 }}
      whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.4, ease: [0.19, 1, 0.22, 1] }}
      {...props}
    >
      {children}
    </motion.section>
  );
}
