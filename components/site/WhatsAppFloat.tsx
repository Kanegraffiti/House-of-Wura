'use client';

import { MessageCircle } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';

import { waLink } from '@/lib/wa';

const DEFAULT_MESSAGE = "Hello House of Wura! I'd love to plan something extraordinary.";

export function WhatsAppFloat() {
  const reduceMotion = useReducedMotion();

  const idleAnimation = reduceMotion ? {} : { y: [0, -3, 0] };
  const idleTransition = reduceMotion
    ? undefined
    : { duration: 1.8, ease: 'easeInOut', repeat: Infinity, repeatDelay: 6 };
  const hoverAnimation = reduceMotion ? {} : { rotate: -2, y: -4, transition: { duration: 0.2 } };

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3 sm:bottom-8 sm:right-8">
      <motion.a
        initial={{ y: 0, opacity: 1 }}
        animate={idleAnimation}
        transition={idleTransition}
        whileHover={hoverAnimation}
        className="focus-ring flex h-14 w-14 items-center justify-center rounded-full bg-wura-wine text-white shadow-[0_18px_36px_rgba(123,0,44,0.28)]"
        href={waLink(DEFAULT_MESSAGE)}
        target="_blank"
        rel="noopener noreferrer"
      >
        <MessageCircle className="h-6 w-6" aria-hidden />
        <span className="sr-only">Chat on WhatsApp</span>
      </motion.a>
    </div>
  );
}
