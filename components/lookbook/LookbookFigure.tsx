'use client';

import Image from 'next/image';
import { useState } from 'react';

import Skeleton from '@/components/ui/Skeleton';
import { cn } from '@/lib/utils';

type LookbookFigureProps = {
  src: string;
  alt: string;
};

export function LookbookFigure({ src, alt }: LookbookFigureProps) {
  const [loaded, setLoaded] = useState(false);

  return (
    <figure className="group relative mb-4 overflow-hidden rounded-3xl">
      <div className="relative">
        <Image
          src={`${src}?auto=format&fit=crop&w=1200&q=80`}
          alt={alt}
          width={800}
          height={1000}
          loading="lazy"
          onLoadingComplete={() => setLoaded(true)}
          className={cn(
            'img-fade w-full object-cover transition-transform duration-300 ease-std group-hover:scale-[1.03]',
            loaded && 'loaded'
          )}
        />
        {!loaded && <Skeleton className="absolute inset-0" />}
      </div>
      <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4 text-sm text-white opacity-0 transition-opacity duration-200 ease-std group-hover:opacity-100">
        {alt}
      </figcaption>
    </figure>
  );
}
