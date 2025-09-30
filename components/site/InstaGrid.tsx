import Link from 'next/link';

import ImageSmart from '@/components/site/ImageSmart';
import { getMedia, type MediaKey } from '@/lib/media';

const DEFAULT_MEDIA_KEYS: MediaKey[] = [
  'heroEditorial',
  'heroCelebration',
  'heroRunway',
  'lookbookPortrait'
];

interface InstaGridProps {
  mediaKeys?: MediaKey[];
}

export function InstaGrid({ mediaKeys = DEFAULT_MEDIA_KEYS }: InstaGridProps) {
  const instagramUrl = process.env.NEXT_PUBLIC_INSTAGRAM_URL || 'https://instagram.com/_houseofwurafashions';
  const items = mediaKeys.map((key) => ({ key, ...getMedia(key) }));

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4 lg:gap-6">
      {items.map((image) => (
        <Link
          key={image.key}
          href={instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="View on Instagram"
          className="group relative block overflow-hidden rounded-3xl"
        >
          <div className="relative aspect-square">
            <ImageSmart
              src={`${image.url}?auto=format&fit=crop&w=900&q=80`}
              alt={image.alt}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 260px"
              className="object-cover transition duration-200 ease-std group-hover:scale-[1.03]"
            />
          </div>
          <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-black/0 to-transparent opacity-0 transition-opacity duration-200 ease-std group-hover:opacity-100" />
          <span className="sr-only">{image.alt}</span>
        </Link>
      ))}
    </div>
  );
}
