import Link from 'next/link';
import Script from 'next/script';

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
import { ProductCard, type Product } from '@/app/(shop)/components/ProductCard';
import { formatWhatsappDisplay } from '@/lib/format';
import { getConfiguredWhatsAppNumber, waLink } from '@/lib/wa';
import { getMedia, type MediaKey } from '@/lib/media';

const heroMessage = "Hello House of Wura! I'm ready to craft a luxury celebration.";

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

const services = [
  {
    title: 'Bespoke Weddings',
    description: 'Full planning for multi-day celebrations and destination weddings.',
    items: ['Concept & styling direction', 'Guest hospitality & concierge', 'Vendor curation & management'],
    message: 'Hello House of Wura! I would love to enquire about bespoke wedding planning.'
  },
  {
    title: 'Fashion Direction',
    description: 'Editorial styling and couture wardrobe direction for modern muses.',
    items: ['Look development & fittings', 'Production management', 'Runway & presentation direction'],
    message: 'Hello House of Wura! I would love styling direction for an editorial moment.'
  },
  {
    title: 'Immersive Events',
    description: 'Experiential design for brands, galas, and cultural activations.',
    items: ['Creative storytelling', 'Luxury guest experiences', 'Onsite show-calling & logistics'],
    message: 'Hello House of Wura! Please share details for immersive event design.'
  }
];

const testimonials = [
  {
    quote: 'House of Wura transformed our wedding into an intimate art piece—every detail glowed with meaning.',
    name: 'Amarachi & Dapo',
    detail: 'Destination Wedding'
  },
  {
    quote: 'From fittings to finale, the team delivered couture looks that told a powerful story.',
    name: 'Lola Adeyemi',
    detail: 'Fashion Editorial Client'
  },
  {
    quote: 'Our corporate gala felt like stepping into a dream. Guests are still talking about it months later.',
    name: 'Olu Jacobs',
    detail: 'Brand Experience'
  }
];

const whatsappDigits = getConfiguredWhatsAppNumber();
const whatsappTelephone = formatWhatsappDisplay(whatsappDigits) || '+2349060294599';

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'House of Wura',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://houseofwura.vercel.app',
  logo: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://houseofwura.vercel.app'}/favicon.svg`,
  sameAs: [process.env.NEXT_PUBLIC_INSTAGRAM_URL || 'https://instagram.com/_houseofwurafashions'],
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
      <section className="relative overflow-hidden bg-wura-black text-wura-white">
        <HeroBackgroundSlideshow slides={heroSlides} className="opacity-60" />
        <Container className="cq relative flex min-h-[80vh] flex-col justify-center py-24 sm:py-32">
          <Parallax>
            <div className="max-w-2xl space-y-6">
              <Reveal>
                <p className="text-sm uppercase tracking-[0.45em] text-wura-gold">
                  Luxury Event Planning & Fashion House
                </p>
              </Reveal>
              <Reveal delay={0.1}>
                <h1 className="font-display leading-tight">
                  Crafted moments that feel like art.
                </h1>
              </Reveal>
              <Reveal delay={0.18}>
                <p className="lead text-wura-white/80">
                  House of Wura curates couture fashion, weddings, and experiential events that shimmer with cultural heritage and modern luxury.
                </p>
              </Reveal>
              <Reveal delay={0.22}>
                <div className="flex flex-col gap-4 sm:flex-row">
                  <Magnetic>
                    <Button className="min-h-[44px] w-full px-5 py-2.5 sm:w-auto" asChild>
                      <Link href={waLink(heroMessage)} target="_blank" rel="noopener noreferrer">
                        <span className="link-glint">Chat on WhatsApp</span>
                      </Link>
                    </Button>
                  </Magnetic>
                  <Magnetic>
                    <Button
                      variant="outline"
                      className="min-h-[44px] w-full border-wura-gold px-5 py-2.5 text-wura-white hover:text-wura-black sm:w-auto"
                      asChild
                    >
                      <Link href="/lookbook">
                        <span className="link-glint">View Lookbook</span>
                      </Link>
                    </Button>
                  </Magnetic>
                </div>
              </Reveal>
            </div>
          </Parallax>
        </Container>
      </section>

      <Section>
        <Container className="cq space-y-12">
          <Reveal>
            <SectionHeader
              eyebrow="Signature Services"
              title="Planning, styling, and storytelling for unforgettable celebrations"
              description="From multi-day weddings to red carpet wardrobes, each service is tailored to your personal mythology."
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
              eyebrow="House of Wura Shop"
              title="Couture pieces ready for your next grand entrance"
              description="Explore signature looks crafted in limited runs. Each piece begins with a WhatsApp conversation."
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
                    <span className="link-glint">View all creations</span>
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
              title="Whispers from our muses"
              description="A glimpse into the celebrations and wardrobes we have the honour to create."
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
              eyebrow="Moments in Motion"
              title="Follow our atelier on Instagram"
              description="See behind-the-scenes glimpses, fittings, and wedding reveals as they happen."
              tone="dark"
            />
          </Reveal>
          <Reveal delay={0.08}>
            <InstaGrid />
          </Reveal>
        </Container>
      </Section>

      <Section>
        <Container className="cq flex flex-col gap-10 rounded-3xl bg-gradient-to-br from-wura-gold/20 via-white to-wura-wine/15 p-8 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left">
          <Reveal>
            <div className="space-y-4">
              <h2 className="font-display text-wura-black">Ready to create your next legend?</h2>
              <p className="lead text-wura-black/70">
                Tell us your vision and our concierge team will respond on WhatsApp with curated ideas.
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <Button className="min-h-[44px] w-full flex-shrink-0 px-5 py-2.5 sm:w-auto" asChild>
              <Link
                href={waLink('Hello House of Wura! I am ready to begin planning with you.')}
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
