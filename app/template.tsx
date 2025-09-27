'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { usePathname } from 'next/navigation';

import { fadeInUp, motionDur, motionEase, trans } from '@/lib/motion';

export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();

  const variants = reduceMotion
    ? { hidden: { opacity: 1 }, show: { opacity: 1 } }
    : fadeInUp;

  return (
    <AnimatePresence mode="wait">
      <motion.main
        key={pathname}
        variants={variants}
        initial="hidden"
        animate="show"
        exit={{
          opacity: reduceMotion ? 1 : 0,
          y: reduceMotion ? 0 : -8,
          transition: trans(motionDur.xs, motionEase.exit)
        }}
        className="min-h-screen"
      >
        {children}
      </motion.main>
    </AnimatePresence>
  );
}
