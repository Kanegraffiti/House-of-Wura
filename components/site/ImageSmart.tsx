'use client';

import Image, { type ImageProps } from 'next/image';
import { useState } from 'react';

export default function ImageSmart(
  props: Omit<ImageProps, 'placeholder'> & { shimmer?: boolean; fade?: boolean }
) {
  const { className = '', shimmer = true, fade = true, alt, ...rest } = props;
  const [loaded, setLoaded] = useState(false);
  const blur = shimmer
    ? 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="700" height="475"><rect width="100%" height="100%" fill="%23f3f3f3"/><animate attributeName="opacity" values="0.6;1;0.6" dur="1.2s" repeatCount="indefinite"/></svg>'
    : undefined;

  return (
    <Image
      onLoad={() => setLoaded(true)}
      placeholder={blur ? 'blur' : undefined}
      blurDataURL={blur}
      alt={alt}
      className={
        fade
          ? `${className} ${loaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`
          : className
      }
      {...rest}
    />
  );
}
