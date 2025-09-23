'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { usePathname } from 'next/navigation';

import { cn } from '@/lib/utils';

type RouteFadeProps = {
  children: React.ReactNode;
  className?: string;
};

export default function RouteFade({ children, className }: RouteFadeProps) {
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return <main key={pathname} className={cn(className)}>{children}</main>;
  }

  return (
    <AnimatePresence mode="wait">
      <motion.main
        key={pathname}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -6 }}
        transition={{ duration: 0.2, ease: [0.2, 0.6, 0, 1] }}
        className={className}
      >
        {children}
      </motion.main>
    </AnimatePresence>
  );
}
