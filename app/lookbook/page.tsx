import Image from 'next/image';
import Link from 'next/link';
import { Metadata } from 'next';

import { Button } from '@/components/ui/button';
import { Container } from '@/components/site/Container';
import { Section } from '@/components/site/Section';
import { SectionHeader } from '@/components/site/SectionHeader';
import { waLink } from '@/lib/wa';

export const metadata: Metadata = {
  title: 'Lookbook',
  description: 'Editorial highlights and wedding moments curated by House of Wura.'
};

const lookbookImages = [
  {
    src: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab',
    alt: 'Hand-beaded gown styled in studio'
  },
  {
    src: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1',
    alt: 'Golden hour wedding portrait'
  },
  {
    src: 'https://images.unsplash.com/photo-1525182008055-f88b95ff7980',
    alt: 'Editorial shot in wine red couture dress'
  },
  {
    src: 'https://images.unsplash.com/photo-1462396881884-de2c07cb95ed',
    alt: 'Luxury event table setting'
  },
  {
    src: 'https://images.unsplash.com/photo-1514996937319-344454492b37',
    alt: 'Crystal embellished heels on marble'
  },
  {
    src: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2',
    alt: 'Resort fashion silhouette in motion'
  }
];

export default function LookbookPage() {
  return (
    <Section>
      <Container className="space-y-12">
        <SectionHeader
          eyebrow="Lookbook"
          title="Stories woven in silk, gold, and light"
          description="A curation of couture pieces, wedding reveals, and immersive installations."
          align="left"
        />
        <div className="columns-1 gap-4 md:columns-2 lg:columns-3">
          {lookbookImages.map((image) => (
            <figure key={image.src} className="group relative mb-4 overflow-hidden rounded-3xl">
              <Image
                src={`${image.src}?auto=format&fit=crop&w=1200&q=80`}
                alt={image.alt}
                width={800}
                height={1000}
                className="w-full object-cover transition duration-500 ease-luxurious group-hover:scale-105"
              />
              <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4 text-sm text-white opacity-0 transition-opacity duration-300 ease-luxurious group-hover:opacity-100">
                {image.alt}
              </figcaption>
            </figure>
          ))}
        </div>
        <div className="flex flex-col gap-4 rounded-3xl bg-wura-black text-wura-white p-10 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <h2 className="font-display text-3xl">Ready for your own editorial moment?</h2>
            <p className="text-sm text-wura-white/80">
              Share your inspiration on WhatsApp and we will design the next chapter.
            </p>
          </div>
          <Button asChild className="w-full sm:w-auto">
            <Link href={waLink('Hello House of Wura! I would love to create an editorial look with you.')} target="_blank" rel="noopener noreferrer">
              Enquire on WhatsApp
            </Link>
          </Button>
        </div>
      </Container>
    </Section>
  );
}
