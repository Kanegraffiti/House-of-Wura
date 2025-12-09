import Link from 'next/link';
import Script from 'next/script';
import Image from 'next/image';
import { Sparkles } from 'lucide-react';

import Parallax from '@/components/site/Parallax';
import Reveal from '@/components/site/Reveal';
import { Button } from '@/components/ui/button';
import { Container } from '@/components/site/Container';
import { HeroBackgroundSlideshow } from '@/components/site/HeroBackgroundSlideshow';
import { Magnetic } from '@/components/site/Magnetic';
import { InstaGrid } from '@/components/site/InstaGrid';
import { Section } from '@/components/site/Section';
import { SectionHeader } from '@/components/site/SectionHeader';
import { ServiceCard } from '@/components/site/ServiceCard';
import { Testimonial } from '@/components/site/Testimonial';
import { LuxuryTicker } from '@/components/site/LuxuryTicker';
import { OpulentPanel } from '@/components/site/OpulentPanel';
import { formatWhatsappDisplay } from '@/lib/format';
import { normalizePhone, waLink } from '@/lib/wa';
import { getMedia, type MediaKey } from '@/lib/media';

const heroMessage = "Hello House of Wura! I'm planning a black-tie celebration and would love your expertise.";

const heroSlideKeys: MediaKey[] = ['hero', 'heroEditorial', 'heroCelebration', 'heroRunway'];
const heroSlides = heroSlideKeys.map((key) => {
  const media = getMedia(key);
  return { src: media.url, alt: media.alt };
});

const ribbonItems = [
  'Signature weddings and couture celebrations',
  'Fashion-forward styling for hosts and bridal parties',
  'Experiential production for brand launches and galas',
  'Concierge travel, hospitality, and guest management'
];

const experienceHighlights = [
  {
    value: '150+',
    label: 'events orchestrated',
    detail: 'Private weddings, society soirées, and brand moments across Africa and Europe.'
  },
  {
    value: '65',
    label: 'fashion editorials',
    detail: 'Directional looks styled for brides, celebrants, and campaigns with couture ateliers.'
  },
  {
    value: '24h',
    label: 'concierge replies',
    detail: 'Dedicated WhatsApp support with swift timelines, budgets, and vendor liaison.'
  },
  {
    value: 'A–Z',
    label: 'production care',
    detail: 'Creative, logistics, styling, and show-calling covered with discreet detail.'
  }
];

const services = [
  {
    title: 'Signature Wedding Planning',
    description: 'Full-service planning, design direction, and hospitality for destination and city weddings.',
    items: ['Story-led concepting', 'Guest logistics and travel', 'Couture fashion direction'],
    message: 'Hello House of Wura! Please guide us on a signature wedding experience.'
  },
  {
    title: 'Social & Private Celebrations',
    description: 'Milestone birthdays, anniversaries, and intimate dinners staged with artful precision.',
    items: ['Venue and culinary curation', 'Entertainment and ambience', 'White-glove hosting team'],
    message: 'Hello House of Wura! I would like an elevated celebration for my next milestone.'
  },
  {
    title: 'Brand & Cultural Experiences',
    description: 'Launches, trunk shows, and immersive showcases that blend culture, fashion, and storytelling.',
    items: ['Audience journey design', 'Set builds and installations', 'Show calling and run-of-show'],
    message: 'Hello House of Wura! Let’s design an unforgettable brand experience.'
  }
];

const caseStudies = [
  {
    title: 'Celestial Vows in Lagos',
    location: 'Eko Hotel • 450 guests',
    summary: 'A candlelit ceremony and reception layered with champagne drapery, mirrored aisles, and custom crystal florals.',
    testimonial: {
      quote: 'You translated our love story into a setting that felt like a dream. Every guest was dazzled and cared for.',
      name: 'Zainab & Ade',
      role: 'Bride & Groom'
    },
    gallery: ['bridalRadiance', 'eventDetail', 'bridalDetail']
  },
  {
    title: 'Midnight Fashion Salon',
    location: 'Private Residence • 120 guests',
    summary: 'An immersive trunk show with runway moments, bespoke cocktails, and live string performances under noir lighting.',
    testimonial: {
      quote: 'The production was seamless—the models, music, and pacing made our collection the star.',
      name: 'Kemi Adeyemi',
      role: 'Creative Director'
    },
    gallery: ['heroEditorial', 'capeStatement', 'cocktailSilhouette']
  },
  {
    title: 'Chateau Anniversary Weekend',
    location: 'Provence • 80 guests',
    summary: 'Three days of garden dinners, vineyard tours, and couture fittings, choreographed with European vendor partners.',
    testimonial: {
      quote: 'Your team anticipated every detail and made our guests feel utterly indulged.',
      name: 'The Martins Family',
      role: 'Hosts'
    },
    gallery: ['resortEase', 'robeSerenity', 'accessoryGlam']
  }
];

const testimonials = [
  {
    quote: 'House of Wura delivers poetry in motion—the timing, styling, and hospitality were faultless.',
    name: 'Anita Okonkwo',
    detail: 'Luxury wedding client'
  },
  {
    quote: 'They navigated complex travel, VIP security, and cultural protocols with elegance and calm.',
    name: 'Femi & Darasimi',
    detail: 'Destination celebration'
  },
  {
    quote: 'Our launch experience felt like art direction come alive. The press and guests were enthralled.',
    name: 'Adaeze Nwankwo',
    detail: 'Fashion house founder'
  }
];

const configuredWhatsApp = normalizePhone(process.env.NEXT_PUBLIC_WA_NUMBER || '2349060294599');
const whatsappDigits = configuredWhatsApp || '2349060294599';
const whatsappTelephone = formatWhatsappDisplay(whatsappDigits) || '+2349060294599';

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'House of Wura',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  logo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/Logo/tasty-vine-logo.svg`,
  sameAs: [process.env.NEXT_PUBLIC_INSTAGRAM_URL || 'https://instagram.com/tastyvinecakes'],
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: whatsappTelephone,
    contactType: 'customer service',
    areaServed: 'NG'
  }
};

export default function HomePage() {
  return (
    <>
      <Script
        id="jsonld-organization"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <section className="luxury-grain relative overflow-hidden bg-wura-black text-wura-white">
        <HeroBackgroundSlideshow slides={heroSlides} className="opacity-70" />
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,153,11,0.14),transparent_55%)]"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/80 via-black/40 to-transparent"
          aria-hidden
        />
        <Container className="cq relative flex min-h-[80vh] flex-col justify-center py-24 sm:py-32">
          <Parallax>
            <OpulentPanel tone="dark" className="max-w-2xl">
              <div className="space-y-6">
                <Reveal>
                  <div className="flex items-center gap-3 text-[0.65rem] uppercase tracking-[0.45em] text-wura-gold/80">
                    <span className="h-1 w-12 rounded-full bg-gradient-to-r from-wura-gold to-wura-wine" aria-hidden />
                    Event Planning • Fashion Direction • Production
                  </div>
                </Reveal>
                <Reveal delay={0.1}>
                  <h1 className="font-display leading-tight text-white">
                    High-touch celebrations for couples, creators, and brands.
                  </h1>
                </Reveal>
                <Reveal delay={0.18}>
                  <p className="lead text-wura-white/80">
                    House of Wura crafts couture weddings, intimate gatherings, and culture-rich experiences with a signature mix
                    of elegance, storytelling, and meticulous logistics.
                  </p>
                </Reveal>
                <Reveal delay={0.22}>
                  <div className="flex flex-col gap-4 sm:flex-row">
                    <Magnetic>
                      <Button className="min-h-[44px] w-full px-5 py-2.5 sm:w-auto" asChild>
                        <Link href={waLink(heroMessage)} target="_blank" rel="noopener noreferrer">
                          <span className="link-glint">Plan my event</span>
                        </Link>
                      </Button>
                    </Magnetic>
                    <Magnetic>
                      <Button
                        variant="outline"
                        className="min-h-[44px] w-full border-wura-gold px-5 py-2.5 text-wura-white hover:text-wura-black sm:w-auto"
                        asChild
                      >
                        <Link href="/services">
                          <span className="link-glint">View services</span>
                        </Link>
                      </Button>
                    </Magnetic>
                  </div>
                </Reveal>
                <Reveal delay={0.28}>
                  <div className="flex flex-wrap items-center gap-3 text-sm text-wura-white/70">
                    <span className="inline-flex h-8 items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4">
                      <Sparkles className="h-4 w-4 text-wura-gold" aria-hidden />
                      Couture planning, discreet production
                    </span>
                    <span className="text-xs uppercase tracking-[0.38em] text-wura-white/60">WhatsApp {whatsappTelephone}</span>
                  </div>
                </Reveal>
              </div>
            </OpulentPanel>
          </Parallax>
        </Container>
      </section>

      <LuxuryTicker items={ribbonItems} className="border-wura-black/25" />

      <Section className="relative overflow-hidden bg-[#120d0b] text-wura-white">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,153,11,0.12),transparent_65%)]"
          aria-hidden
        />
        <Container className="cq relative grid gap-12 lg:grid-cols-[1.1fr_minmax(0,1fr)]">
          <Reveal>
            <div className="space-y-6">
              <SectionHeader
                eyebrow="The House of Wura Signature"
                title="Story-led, fashion-forward, flawlessly produced"
                description="We steward every celebration with concept design, couture styling, and concierge logistics so you can savour the moment."
                align="left"
                tone="dark"
              />
              <div className="luxury-divider" aria-hidden />
              <p className="max-w-xl text-sm text-wura-white/70">
                Our Lagos and London teams design experiences that feel tailored and timeless. From wardrobe fittings to vendor
                orchestration, every touchpoint is handled with art direction and precision.
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <OpulentPanel tone="dark" className="space-y-8">
              <div className="grid gap-6 sm:grid-cols-2">
                {experienceHighlights.map((item) => (
                  <div key={item.label} className="space-y-2">
                    <p className="font-display text-4xl tracking-tight text-wura-gold">{item.value}</p>
                    <p className="text-sm uppercase tracking-[0.3em] text-wura-white/60">{item.label}</p>
                    <p className="text-sm text-wura-white/70">{item.detail}</p>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-3 rounded-full border border-white/15 bg-white/5 px-5 py-3 text-sm text-wura-white/70">
                <span className="h-1.5 w-1.5 rounded-full bg-gradient-to-br from-wura-gold to-wura-wine" aria-hidden />
                Dedicated planners, fashion directors, and production managers keep every timeline on track.
              </div>
            </OpulentPanel>
          </Reveal>
        </Container>
      </Section>

      <Section>
        <Container className="cq space-y-12">
          <Reveal>
            <SectionHeader
              eyebrow="Service Suite"
              title="Concierge planning tailored to your story"
              description="Choose the pathway that fits your celebration and we will customise every detail."
            />
          </Reveal>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 sm:gap-8">
            {services.map((service, index) => (
              <Reveal key={service.title} delay={index * 0.08}>
                <ServiceCard {...service} />
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      <Section className="bg-wura-black/5">
        <Container className="cq space-y-12">
          <Reveal>
            <SectionHeader
              eyebrow="Portfolio"
              title="Case studies that blend beauty and precision"
              description="Each celebration is treated as a bespoke production with couture styling, heartfelt hospitality, and layered storytelling."
            />
          </Reveal>
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {caseStudies.map((project, index) => (
              <Reveal key={project.title} delay={index * 0.08}>
                <OpulentPanel className="flex h-full flex-col gap-6">
                  <div className="space-y-2">
                    <p className="text-xs uppercase tracking-[0.35em] text-wura-wine">{project.location}</p>
                    <h3 className="font-display text-2xl text-wura-black">{project.title}</h3>
                    <p className="text-sm text-wura-black/70">{project.summary}</p>
                  </div>
                  <div className="space-y-3 rounded-2xl bg-wura-black/5 p-4">
                    <p className="text-sm italic text-wura-black/80">“{project.testimonial.quote}”</p>
                    <p className="text-xs uppercase tracking-[0.28em] text-wura-black/60">
                      {project.testimonial.name} • {project.testimonial.role}
                    </p>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {project.gallery.map((key) => {
                      const media = getMedia(key);
                      return (
                        <div key={key} className="relative aspect-square overflow-hidden rounded-2xl bg-wura-black/5">
                          <Image src={media.url} alt={media.alt} fill sizes="(min-width: 1024px) 120px, 33vw" className="object-cover" />
                        </div>
                      );
                    })}
                  </div>
                </OpulentPanel>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      <Section>
        <Container className="cq space-y-12">
          <Reveal>
            <SectionHeader
              eyebrow="Client Notes"
              title="Trusted by discerning hosts and brands"
              description="A few heartfelt words from couples, founders, and creative directors we have guided."
            />
          </Reveal>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 sm:gap-8">
            {testimonials.map((testimonial, index) => (
              <Reveal key={testimonial.name} delay={index * 0.08}>
                <Testimonial {...testimonial} />
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      <Section className="bg-wura-black text-wura-white">
        <Container className="cq space-y-12">
          <Reveal>
            <SectionHeader
              eyebrow="Behind the Scenes"
              title="Moments from our atelier and productions"
              description="Follow the fittings, floral mock-ups, and lighting tests as we build each experience."
              tone="dark"
            />
          </Reveal>
          <Reveal delay={0.08}>
            <InstaGrid />
          </Reveal>
        </Container>
      </Section>

      <Section>
        <Container className="cq flex flex-col gap-10 rounded-3xl bg-gradient-to-br from-wura-gold/18 via-white to-wura-wine/15 p-8 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left">
          <Reveal>
            <div className="space-y-4">
              <h2 className="font-display text-wura-black">Ready to curate your next celebration?</h2>
              <p className="lead text-wura-black/70">
                Share your vision and we will craft a tailored roadmap—concept design, fashion direction, and production in one concierge team.
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <Button className="min-h-[44px] w-full flex-shrink-0 px-5 py-2.5 sm:w-auto" asChild>
              <Link
                href={waLink('Hello House of Wura! I am ready to plan my celebration. Here are the details:')}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="link-glint">Start a WhatsApp chat</span>
              </Link>
            </Button>
          </Reveal>
        </Container>
      </Section>
    </>
  );
}
