'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { usePathname } from 'next/navigation';

import { fadeIn, motionDur, motionEase, trans } from '@/lib/motion';

export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait">
      <motion.main
        key={pathname}
        variants={fadeIn}
        initial="hidden"
        animate="show"
        exit={{
          opacity: 0,
          transition: trans(motionDur.xs, motionEase.exit)
        }}
        className="min-h-screen"
      >
        {children}
      </motion.main>
    </AnimatePresence>
  );
}
