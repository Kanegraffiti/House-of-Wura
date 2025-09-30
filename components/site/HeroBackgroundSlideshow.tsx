'use client';

import { useEffect, useMemo, useState } from 'react';

import { cn } from '@/lib/utils';

import ImageSmart from '@/components/site/ImageSmart';

export type HeroSlide = {
  src: string;
  alt: string;
};

interface HeroBackgroundSlideshowProps {
  slides: HeroSlide[];
  className?: string;
  intervalMs?: number;
}

const DEFAULT_INTERVAL = 8000;

export function HeroBackgroundSlideshow({
  slides,
  className,
  intervalMs = DEFAULT_INTERVAL
}: HeroBackgroundSlideshowProps) {
  const validSlides = useMemo(() => slides.filter((slide) => Boolean(slide?.src)), [slides]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (validSlides.length <= 1) {
      return;
    }

    const id = window.setInterval(() => {
      setActiveIndex((previous) => (previous + 1) % validSlides.length);
    }, Math.max(2000, intervalMs));

    return () => {
      window.clearInterval(id);
    };
  }, [intervalMs, validSlides.length]);

  if (validSlides.length === 0) {
    return null;
  }

  return (
    <div className={cn('absolute inset-0 overflow-hidden', className)} aria-hidden>
      {validSlides.map((slide, index) => {
        const withParams = slide.src.includes('?')
          ? `${slide.src}&auto=format&fit=crop&w=1600&q=80`
          : `${slide.src}?auto=format&fit=crop&w=1600&q=80`;

        return (
          <ImageSmart
            key={`${slide.src}-${index}`}
            src={withParams}
            alt={slide.alt}
            fill
            priority={index === 0}
            className={cn(
              'absolute inset-0 h-full w-full object-cover transition-opacity duration-[1200ms] ease-std',
              index === activeIndex ? 'opacity-100' : 'opacity-0'
            )}
            sizes="100vw"
            fade={false}
          />
        );
      })}
      <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/60 to-wura-wine/60" />
    </div>
  );
}
