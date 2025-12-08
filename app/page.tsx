import Link from 'next/link';
import Script from 'next/script';
import { Sparkles } from 'lucide-react';

import productsData from '@/data/products.json';

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
import { ProductCard, type Product } from '@/app/(shop)/components/ProductCard';
import { formatWhatsappDisplay } from '@/lib/format';
import { normalizePhone, waLink } from '@/lib/wa';
import { getMedia, type MediaKey } from '@/lib/media';

const heroMessage = "Hello Tasty Vine! I'm ready to dream up a beautiful cake.";

const products: Product[] = productsData.map((product) => ({
  ...product,
  images: Array.isArray(product.images)
    ? product.images.map((key) => key as MediaKey)
    : []
}));
const heroSlideKeys: MediaKey[] = ['hero', 'heroEditorial', 'heroCelebration', 'heroRunway'];
const heroSlides = heroSlideKeys.map((key) => {
  const media = getMedia(key);
  return { src: media.url, alt: media.alt };
});

const ribbonItems = [
  'Hand-painted buttercream florals for intimate celebrations',
  'Dessert tables styled to match your colour story',
  'Tiered showpiece cakes with seasonal fruits and blooms',
  'White-glove delivery and onsite setup for every order'
];

const experienceHighlights = [
  {
    value: '850+',
    label: 'cakes baked',
    detail: 'Hand-finished tiers, cupcakes, and dessert spreads delivered with care.'
  },
  {
    value: '120',
    label: 'weddings served',
    detail: 'Romantic centrepieces designed to echo your florals, palette, and love story.'
  },
  {
    value: '24h',
    label: 'design sketches',
    detail: 'Initial sketches, flavours, and fillings shared within a day for custom requests.'
  },
  {
    value: '15',
    label: 'flavour pairings',
    detail: 'From zesty citrus curd to dark chocolate ganache, tailored to every guest list.'
  }
];

const services = [
  {
    title: 'Custom Celebration Cakes',
    description: 'Signature buttercream cakes with hand-crafted textures, sugar florals, and metallic accents.',
    items: ['Design consult & sketch', 'Flavour pairing guidance', 'Personalised toppers & keepsakes'],
    message: 'Hello Tasty Vine! I would love a custom celebration cake.'
  },
  {
    title: 'Wedding Cakes & Dessert Tables',
    description: 'Romantic tiers, macaron towers, mini tarts, and favours styled to your florals and venue.',
    items: ['Palette & floral matching', 'Dessert table styling', 'Onsite setup & staging'],
    message: 'Hello Tasty Vine! Please help me design our wedding cake and dessert table.'
  },
  {
    title: 'Corporate Gifting & Launches',
    description: 'Branded treats, edible logos, and gifting boxes that make your activations feel deliciously premium.',
    items: ['Logo cookies & cupcakes', 'Curated gift boxes', 'Nationwide delivery coordination'],
    message: 'Hello Tasty Vine! I need branded sweets for an upcoming launch.'
  }
];

const testimonials = [
  {
    quote: 'Our wedding cake tasted even better than it looked—guests kept coming back for another slice.',
    name: 'Amarachi & Dapo',
    detail: '5-tier vanilla bean & berries'
  },
  {
    quote: 'The dessert table was a work of art. Every tart, cupcake, and cookie matched our palette perfectly.',
    name: 'Lola Adeyemi',
    detail: 'Dessert table & favours'
  },
  {
    quote: 'The branded cupcakes for our launch were flawless and arrived fresh with zero stress on our side.',
    name: 'Olu Jacobs',
    detail: 'Corporate gifting'
  }
];

const configuredWhatsApp = normalizePhone(process.env.NEXT_PUBLIC_WA_NUMBER || '2349060294599');
const whatsappDigits = configuredWhatsApp || '2349060294599';
const whatsappTelephone = formatWhatsappDisplay(whatsappDigits) || '+2349060294599';

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Tasty Vine Cakes',
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
  const featuredProducts = products.slice(0, 3);
  return (
    <>
      <Script
        id="jsonld-organization"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <section className="luxury-grain relative overflow-hidden bg-wura-black text-wura-white">
        <HeroBackgroundSlideshow slides={heroSlides} className="opacity-70" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,153,11,0.14),transparent_55%)]" aria-hidden />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/80 via-black/40 to-transparent" aria-hidden />
        <Container className="cq relative flex min-h-[80vh] flex-col justify-center py-24 sm:py-32">
          <Parallax>
            <OpulentPanel tone="dark" className="max-w-2xl">
              <div className="space-y-6">
                <Reveal>
                  <div className="flex items-center gap-3 text-[0.65rem] uppercase tracking-[0.45em] text-wura-gold/80">
                    <span className="h-1 w-12 rounded-full bg-gradient-to-r from-wura-gold to-wura-wine" aria-hidden />
                    Artisanal Cake Studio &amp; Dessert Styling
                  </div>
                </Reveal>
                <Reveal delay={0.1}>
                  <h1 className="font-display leading-tight text-white">
                    Cakes that taste like home and look like art.
                  </h1>
                </Reveal>
                <Reveal delay={0.18}>
                  <p className="lead text-wura-white/80">
                    Tasty Vine handcrafts modern buttercream cakes, dessert tables, and edible art inspired by the colours of your celebration.
                  </p>
                </Reveal>
                <Reveal delay={0.22}>
                  <div className="flex flex-col gap-4 sm:flex-row">
                    <Magnetic>
                      <Button className="min-h-[44px] w-full px-5 py-2.5 sm:w-auto" asChild>
                        <Link href={waLink(heroMessage)} target="_blank" rel="noopener noreferrer">
                          <span className="link-glint">Design my cake</span>
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
                          <span className="link-glint">Explore flavours</span>
                        </Link>
                      </Button>
                    </Magnetic>
                  </div>
                </Reveal>
                <Reveal delay={0.28}>
                  <div className="flex flex-wrap items-center gap-3 text-sm text-wura-white/70">
                    <span className="inline-flex h-8 items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4">
                      <Sparkles className="h-4 w-4 text-wura-gold" aria-hidden />
                      Fresh bakes, concierge delivery
                    </span>
                    <span className="text-xs uppercase tracking-[0.38em] text-wura-white/60">
                      WhatsApp {whatsappTelephone}
                    </span>
                  </div>
                </Reveal>
              </div>
            </OpulentPanel>
          </Parallax>
        </Container>
      </section>

      <LuxuryTicker items={ribbonItems} className="border-wura-black/25" />

      <Section className="relative overflow-hidden bg-[#120d0b] text-wura-white">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,153,11,0.12),transparent_65%)]" aria-hidden />
        <Container className="cq relative grid gap-12 lg:grid-cols-[1.1fr_minmax(0,1fr)]">
          <Reveal>
            <div className="space-y-6">
              <SectionHeader
                eyebrow="The Tasty Vine Signature"
                title="Every crumb crafted with warmth"
                description="We guide you from flavour pairing to final flourish, baking showpiece cakes and desserts that feel personal, generous, and joyful."
                align="left"
                tone="dark"
              />
              <div className="luxury-divider" aria-hidden />
              <p className="max-w-xl text-sm text-wura-white/70">
                Our Lagos bake studio paints buttercream florals, pipes delicate textures, and pairs flavours that linger. From sketch to slice, every tier is wrapped with food-safe care and delivered with a smile.
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
                Tasting notes, design sketches, and delivery timelines are shared over WhatsApp so you always feel cared for.
              </div>
            </OpulentPanel>
          </Reveal>
        </Container>
      </Section>

      <Section>
        <Container className="cq space-y-12">
          <Reveal>
            <SectionHeader
              eyebrow="Sweet Services"
              title="Cakes, desserts, and gifting made deliciously personal"
              description="From intimate birthdays to grand weddings, every bake is tailored to your flavours, colours, and story."
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
              eyebrow="Tasty Vine Cakeshop"
              title="Ready-to-love cakes and treats for your next celebration"
              description="Explore seasonal flavours, cupcakes, and keepsake toppers. Every order begins with a quick WhatsApp chat."
            />
          </Reveal>
          <Reveal delay={0.05}>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3 sm:gap-8">
              {featuredProducts.map((product, index) => (
                <Reveal key={product.id} delay={index * 0.05}>
                  <ProductCard product={product} />
                </Reveal>
              ))}
            </div>
          </Reveal>
          <Reveal delay={0.12}>
            <div className="flex justify-center">
              <Magnetic>
                <Button variant="outline" className="min-h-[44px] border-wura-gold px-5 py-2.5" asChild>
                  <Link href="/shop">
                    <span className="link-glint">View all bakes</span>
                  </Link>
                </Button>
              </Magnetic>
            </div>
          </Reveal>
        </Container>
      </Section>

      <Section>
        <Container className="cq space-y-12">
          <Reveal>
            <SectionHeader
              eyebrow="Client Stories"
              title="Sweet words from our celebrants"
              description="A peek at the weddings, birthdays, and brand moments we were honoured to bake for."
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
              eyebrow="Fresh Out of the Oven"
              title="Follow our bake studio on Instagram"
              description="See piping videos, flavour drops, and sweet reveals as they happen."
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
              <h2 className="font-display text-wura-black">Ready to slice into something special?</h2>
              <p className="lead text-wura-black/70">
                Share your date, flavours, and colours—our cake concierge will sketch ideas and confirm delivery details.
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <Button className="min-h-[44px] w-full flex-shrink-0 px-5 py-2.5 sm:w-auto" asChild>
              <Link
                href={waLink('Hello Tasty Vine! I am ready to order a cake and desserts.')}
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
