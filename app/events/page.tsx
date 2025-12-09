import Image from 'next/image';
import { Metadata } from 'next';

import { Container } from '@/components/site/Container';
import { OpulentPanel } from '@/components/site/OpulentPanel';
import { Section } from '@/components/site/Section';
import { SectionHeader } from '@/components/site/SectionHeader';
import { getMedia, type MediaKey } from '@/lib/media';

export const metadata: Metadata = {
  title: 'Events | House of Wura',
  description:
    'Signature Nigerian weddings, society soirées, and brand launches curated by House of Wura with couture-level polish.'
};

type EventFeature = {
  title: string;
  location: string;
  mood: string;
  testimonial: { quote: string; name: string; role: string };
  gallery: MediaKey[];
  video: { src: string; poster: MediaKey };
};

const events: EventFeature[] = [
  {
    title: 'Royal Yoruba Wedding Weekend',
    location: 'Ikeja GRA, Lagos',
    mood: 'Gilded tradition, drum-led entrances, champagne-lit ballroom, and precise guest logistics.',
    testimonial: {
      quote: 'You balanced culture with couture — our parents, friends, and every vendor felt guided and pampered.',
      name: 'Adanna & Damilola',
      role: 'Bride & Groom'
    },
    gallery: ['bridalRadiance', 'eventDetail', 'bridalDetail', 'heroCelebration', 'menswearRegal'],
    video: {
      src: 'https://videos.pexels.com/video-files/3195231/3195231-uhd_2560_1440_25fps.mp4',
      poster: 'eventDetail'
    }
  },
  {
    title: 'High Society Lagos Gala',
    location: 'Eko Convention Centre',
    mood: 'Midnight florals, mirrored stages, curated Afrobeats sets, and choreographed fashion reveals.',
    testimonial: {
      quote: 'Production was flawless — the transitions, lighting, and guest journey felt like a world-class show.',
      name: 'Adaeze Nwankwo',
      role: 'Host & Creative Director'
    },
    gallery: ['heroEditorial', 'capeStatement', 'cocktailSilhouette', 'menswearClassic', 'atelier'],
    video: {
      src: 'https://videos.pexels.com/video-files/6879039/6879039-uhd_2560_1440_25fps.mp4',
      poster: 'heroEditorial'
    }
  },
  {
    title: 'Coastal Vow Renewal',
    location: 'Obudu Mountain Resort',
    mood: 'Mist-filled mornings, calabash welcome cocktails, live talking drums, and starlit after-parties.',
    testimonial: {
      quote: 'House of Wura choreographed every transfer, every mood change, and every heartfelt surprise.',
      name: 'The Okafors',
      role: 'Hosts'
    },
    gallery: ['resortEase', 'robeSerenity', 'accessoryGlam', 'lookbookStudio', 'lookbookPortrait'],
    video: {
      src: 'https://videos.pexels.com/video-files/4964230/4964230-uhd_2560_1440_25fps.mp4',
      poster: 'resortEase'
    }
  }
];

export default function EventsPage() {
  return (
    <Section className="bg-gradient-to-b from-wura-cream to-white">
      <Container className="space-y-16">
        <SectionHeader
          eyebrow="Events"
          title="A curated portfolio for Lagos and destination celebrations"
          description="Each experience is bespoke, art-directed, and delivered with the quiet assurance Nigerian VIP guests expect."
          align="left"
        />
        <div className="space-y-14">
          {events.map((event) => {
            const galleryMedia = event.gallery.map((key) => getMedia(key));
            const videoPoster = getMedia(event.video.poster);
            return (
              <div
                key={event.title}
                className="grid gap-8 rounded-3xl bg-white/80 p-6 shadow-[0_30px_60px_rgba(11,11,11,0.06)] ring-1 ring-wura-black/5 lg:grid-cols-[1.05fr_0.95fr] lg:items-start"
              >
                <OpulentPanel tone="light" className="h-full bg-gradient-to-br from-white to-wura-cream">
                  <div className="space-y-6">
                    <p className="text-xs uppercase tracking-[0.35em] text-wura-wine">{event.location}</p>
                    <h2 className="font-display text-3xl text-wura-black sm:text-4xl">{event.title}</h2>
                    <p className="text-base text-wura-black/70">{event.mood}</p>
                    <div className="rounded-2xl border border-wura-gold/20 bg-wura-gold/5 p-4">
                      <p className="text-lg font-semibold text-wura-black">“{event.testimonial.quote}”</p>
                      <p className="mt-3 text-sm uppercase tracking-[0.25em] text-wura-black/70">
                        {event.testimonial.name} • {event.testimonial.role}
                      </p>
                    </div>
                  </div>
                </OpulentPanel>
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                    {galleryMedia.map((media) => (
                      <div
                        key={media.url}
                        className="group relative overflow-hidden rounded-2xl border border-wura-black/5 bg-white shadow-sm"
                      >
                        <div className="absolute inset-0 bg-gradient-to-br from-wura-wine/10 via-transparent to-wura-gold/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                        <Image
                          src={media.url}
                          alt={media.alt}
                          width={400}
                          height={300}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                  <div className="overflow-hidden rounded-3xl border border-wura-black/10 bg-wura-black/80 shadow-lg">
                    <video
                      className="aspect-video h-full w-full object-cover"
                      controls
                      poster={videoPoster.url}
                      preload="metadata"
                    >
                      <track kind="captions" />
                      <source src={event.video.src} type="video/mp4" />
                    </video>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}
