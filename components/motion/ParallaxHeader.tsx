'use client';

import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';

export default function ParallaxHeader({ children }: { children: React.ReactNode }) {
  const reduceMotion = useReducedMotion();
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 300], [0, -40]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0.85]);

  if (reduceMotion) {
    return <div>{children}</div>;
  }

  return (
    <motion.div style={{ y, opacity }} transition={{ duration: 0 }}>
      {children}
    </motion.div>
  );
}
