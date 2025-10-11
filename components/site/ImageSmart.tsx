'use client';

import Image, { type ImageProps } from 'next/image';
import { useEffect, useState } from 'react';

import { cn } from '@/lib/utils';

const DEFAULT_FALLBACK = 'https://images.unsplash.com/photo-1583394838336-acd977736f90';
const DEFAULT_SIZES = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw';

type ImageSmartProps = Omit<ImageProps, 'src'> & {
  src: string;
  fallbackSrc?: string;
};

export default function ImageSmart({
  src,
  fallbackSrc,
  alt,
  className,
  sizes,
  ...rest
}: ImageSmartProps) {
  const [errored, setErrored] = useState(false);

  useEffect(() => {
    setErrored(false);
  }, [src]);

  return (
    <Image
      {...rest}
      src={errored ? fallbackSrc ?? DEFAULT_FALLBACK : src}
      alt={alt}
      onError={() => setErrored(true)}
      sizes={sizes ?? DEFAULT_SIZES}
      className={cn('transition-opacity duration-300', className)}
    />
  );
}
