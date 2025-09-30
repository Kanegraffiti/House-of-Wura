import { Metadata } from 'next';
import Link from 'next/link';

import Reveal from '@/components/site/Reveal';
import { LookbookFigure } from '@/components/lookbook/LookbookFigure';
import { Button } from '@/components/ui/button';
import { Container } from '@/components/site/Container';
import { Section } from '@/components/site/Section';
import { SectionHeader } from '@/components/site/SectionHeader';
import { waLink } from '@/lib/wa';
import type { MediaKey } from '@/lib/media';

export const metadata: Metadata = {
  title: 'Lookbook',
  description: 'Editorial highlights and wedding moments curated by House of Wura.'
};

const lookbookImages: MediaKey[] = [
  'heroEditorial',
  'heroCelebration',
  'heroRunway',
  'lookbookPortrait',
  'accessoryGlam',
  'resortEase'
];

export default function LookbookPage() {
  return (
    <Section>
      <Container className="cq space-y-12">
        <Reveal>
          <SectionHeader
            eyebrow="Lookbook"
            title="Stories woven in silk, gold, and light"
            description="A curation of couture pieces, wedding reveals, and immersive installations."
            align="left"
          />
        </Reveal>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {lookbookImages.map((mediaKey, index) => (
            <Reveal key={mediaKey} delay={index * 0.05}>
              <LookbookFigure mediaKey={mediaKey} />
            </Reveal>
          ))}
        </div>
        <Reveal delay={0.12}>
          <div className="flex flex-col gap-4 rounded-3xl bg-wura-black/95 p-8 text-wura-white sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-2">
              <h2 className="font-display">Ready for your own editorial moment?</h2>
              <p className="lead text-wura-white/80">
                Share your inspiration on WhatsApp and we will design the next chapter.
              </p>
            </div>
            <Button asChild className="min-h-[44px] w-full px-5 py-2.5 sm:w-auto">
              <Link href={waLink('Hello House of Wura! I would love to create an editorial look with you.')} target="_blank" rel="noopener noreferrer">
                <span className="link-glint">Enquire on WhatsApp</span>
              </Link>
            </Button>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
