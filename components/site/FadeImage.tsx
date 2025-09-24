'use client';

import Image, { type ImageProps } from 'next/image';

type FadeImageProps = Omit<ImageProps, 'onLoadingComplete'> & {
  onLoaded?: (image: HTMLImageElement) => void;
};

export function FadeImage({ onLoaded, alt, ...props }: FadeImageProps) {
  return (
    <Image
      {...props}
      alt={alt}
      onLoadingComplete={(image) => {
        image.classList.add('loaded');
        onLoaded?.(image);
      }}
    />
  );
}
