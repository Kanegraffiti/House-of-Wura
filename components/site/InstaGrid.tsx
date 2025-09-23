import Image from 'next/image';
import Link from 'next/link';

const DEFAULT_IMAGES = [
  {
    src: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab',
    alt: 'House of Wura couture gown fitting'
  },
  {
    src: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1',
    alt: 'Wedding celebration styled by House of Wura'
  },
  {
    src: 'https://images.unsplash.com/photo-1525182008055-f88b95ff7980',
    alt: 'Editorial photoshoot in wine red gown'
  },
  {
    src: 'https://images.unsplash.com/photo-1462396881884-de2c07cb95ed',
    alt: 'Luxury table setting with gold details'
  }
];

interface InstaGridProps {
  images?: typeof DEFAULT_IMAGES;
}

export function InstaGrid({ images = DEFAULT_IMAGES }: InstaGridProps) {
  const instagramUrl = process.env.NEXT_PUBLIC_INSTAGRAM_URL || 'https://instagram.com';
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      {images.map((image, index) => (
        <Link
          key={index}
          href={instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="View on Instagram"
          className="group relative block overflow-hidden rounded-3xl"
        >
          <Image
            src={`${image.src}?auto=format&fit=crop&w=800&q=80`}
            alt={image.alt}
            width={400}
            height={400}
            loading="lazy"
            onLoadingComplete={(img) => img.classList.add('loaded')}
            className="img-fade h-full w-full object-cover transition duration-200 ease-std group-hover:scale-[1.03]"
          />
          <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-black/0 to-transparent opacity-0 transition-opacity duration-200 ease-std group-hover:opacity-100" />
        </Link>
      ))}
    </div>
  );
}
