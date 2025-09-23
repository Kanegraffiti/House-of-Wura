'use client';

import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import { useState } from 'react';

import Skeleton from '@/components/ui/Skeleton';

type LookbookFigureProps = {
  src: string;
  alt: string;
};

export function LookbookFigure({ src, alt }: LookbookFigureProps) {
  const [loaded, setLoaded] = useState(false);
  const reduceMotion = useReducedMotion();

  return (
    <figure className="group relative mb-4 overflow-hidden rounded-3xl">
      <div className="relative">
        <motion.div
          initial={reduceMotion ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.995 }}
          animate={loaded || reduceMotion ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.995 }}
          transition={reduceMotion ? { duration: 0 } : { duration: 0.2, ease: 'easeOut' }}
        >
          <Image
            src={`${src}?auto=format&fit=crop&w=1200&q=80`}
            alt={alt}
            width={800}
            height={1000}
            loading="lazy"
            onLoadingComplete={() => setLoaded(true)}
            className="w-full object-cover transition duration-300 ease-std group-hover:scale-[1.03]"
          />
        </motion.div>
        {!loaded && <Skeleton className="absolute inset-0 h-full w-full" />}
      </div>
      <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4 text-sm text-white opacity-0 transition-opacity duration-200 ease-std group-hover:opacity-100">
        {alt}
      </figcaption>
    </figure>
  );
}
