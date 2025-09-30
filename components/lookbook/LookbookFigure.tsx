'use client';

import ImageSmart from '@/components/site/ImageSmart';
import { getMedia, type MediaKey } from '@/lib/media';

type LookbookFigureProps = {
  mediaKey: MediaKey;
};

export function LookbookFigure({ mediaKey }: LookbookFigureProps) {
  const media = getMedia(mediaKey);

  return (
    <figure className="group relative mb-6 overflow-hidden rounded-3xl">
      <div className="relative aspect-[4/5]">
        <ImageSmart
          src={`${media.url}?auto=format&fit=crop&w=1400&q=80`}
          alt={media.alt}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 45vw, 30vw"
          className="object-cover transition-transform duration-300 ease-std group-hover:scale-[1.03]"
        />
      </div>
      <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4 text-sm text-white opacity-0 transition-opacity duration-200 ease-std group-hover:opacity-100">
        {media.alt}
      </figcaption>
    </figure>
  );
}
