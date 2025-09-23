import Image from 'next/image';
import Link from 'next/link';
import Script from 'next/script';

import productsData from '@/data/products.json';

import ParallaxHeader from '@/components/motion/ParallaxHeader';
import Reveal from '@/components/motion/Reveal';
import { Button } from '@/components/ui/button';
import { Container } from '@/components/site/Container';
import { InstaGrid } from '@/components/site/InstaGrid';
import { Section } from '@/components/site/Section';
import { SectionHeader } from '@/components/site/SectionHeader';
import { ServiceCard } from '@/components/site/ServiceCard';
import { Testimonial } from '@/components/site/Testimonial';
import { ProductCard } from '@/app/(shop)/components/ProductCard';
import { waLink } from '@/lib/wa';

const heroMessage = "Hello House of Wura! I'm ready to craft a luxury celebration.";

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

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'House of Wura',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://houseofwura.vercel.app',
  logo: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://houseofwura.vercel.app'}/favicon.svg`,
  sameAs: [process.env.NEXT_PUBLIC_INSTAGRAM_URL || 'https://instagram.com'],
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: process.env.NEXT_PUBLIC_WA_NUMBER || '2340000000000',
    contactType: 'customer service',
    areaServed: 'NG'
  }
};

export default function HomePage() {
  const featuredProducts = productsData.slice(0, 3);
  return (
    <>
      <Script
        id="jsonld-organization"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <section className="relative overflow-hidden bg-wura-black text-wura-white">
        <div className="absolute inset-0 opacity-40">
          <Image
            src="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1600&q=80"
            alt="Editorial muse in couture gown"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/60 to-wura-wine/60" />
        </div>
        <Container className="relative flex min-h-[80vh] flex-col justify-center py-32">
          <ParallaxHeader>
            <div className="max-w-2xl space-y-6">
              <Reveal>
                <p className="text-sm uppercase tracking-[0.45em] text-wura-gold">
                  Luxury Event Planning & Fashion House
                </p>
              </Reveal>
              <Reveal delay={0.1}>
                <h1 className="font-display text-5xl leading-tight sm:text-6xl">
                  Crafted moments that feel like art.
                </h1>
              </Reveal>
              <Reveal delay={0.18}>
                <p className="text-lg text-wura-white/80">
                  House of Wura curates couture fashion, weddings, and experiential events that shimmer with cultural heritage and modern luxury.
                </p>
              </Reveal>
              <Reveal delay={0.22}>
                <div className="flex flex-col gap-4 sm:flex-row">
                  <Button className="w-full sm:w-auto" asChild>
                    <Link href={waLink(heroMessage)} target="_blank" rel="noopener noreferrer">
                      <span className="link-glint">Chat on WhatsApp</span>
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full border-wura-gold text-wura-white hover:text-wura-black sm:w-auto"
                    asChild
                  >
                    <Link href="/lookbook">
                      <span className="link-glint">View Lookbook</span>
                    </Link>
                  </Button>
                </div>
              </Reveal>
            </div>
          </ParallaxHeader>
        </Container>
      </section>

      <Section>
        <Container className="space-y-12">
          <Reveal>
            <SectionHeader
              eyebrow="Signature Services"
              title="Planning, styling, and storytelling for unforgettable celebrations"
              description="From multi-day weddings to red carpet wardrobes, each service is tailored to your personal mythology."
            />
          </Reveal>
          <div className="grid gap-8 md:grid-cols-3">
            {services.map((service, index) => (
              <Reveal key={service.title} delay={index * 0.08}>
                <ServiceCard {...service} />
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      <Section className="bg-wura-black/5">
        <Container className="space-y-12">
          <Reveal>
            <SectionHeader
              eyebrow="House of Wura Shop"
              title="Couture pieces ready for your next grand entrance"
              description="Explore signature looks crafted in limited runs. Each piece begins with a WhatsApp conversation."
            />
          </Reveal>
          <Reveal delay={0.05}>
            <div className="grid gap-8 md:grid-cols-3">
              {featuredProducts.map((product, index) => (
                <Reveal key={product.id} delay={index * 0.05}>
                  <ProductCard product={product} />
                </Reveal>
              ))}
            </div>
          </Reveal>
          <Reveal delay={0.12}>
            <div className="flex justify-center">
              <Button variant="outline" className="border-wura-gold" asChild>
                <Link href="/shop">
                  <span className="link-glint">View all creations</span>
                </Link>
              </Button>
            </div>
          </Reveal>
        </Container>
      </Section>

      <Section>
        <Container className="space-y-12">
          <Reveal>
            <SectionHeader
              eyebrow="Client Stories"
              title="Whispers from our muses"
              description="A glimpse into the celebrations and wardrobes we have the honour to create."
            />
          </Reveal>
          <div className="grid gap-8 md:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <Reveal key={testimonial.name} delay={index * 0.08}>
                <Testimonial {...testimonial} />
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      <Section className="bg-wura-black text-wura-white">
        <Container className="space-y-12">
          <Reveal>
            <SectionHeader
              eyebrow="Moments in Motion"
              title="Follow our atelier on Instagram"
              description="See behind-the-scenes glimpses, fittings, and wedding reveals as they happen."
            />
          </Reveal>
          <Reveal delay={0.08}>
            <InstaGrid />
          </Reveal>
        </Container>
      </Section>

      <Section>
        <Container className="flex flex-col gap-10 rounded-3xl bg-gradient-to-br from-wura-gold/20 via-white to-wura-wine/15 p-10 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left">
          <Reveal>
            <div className="space-y-4">
              <h2 className="font-display text-3xl text-wura-black">Ready to create your next legend?</h2>
              <p className="text-sm text-wura-black/70 sm:text-base">
                Tell us your vision and our concierge team will respond on WhatsApp with curated ideas.
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <Button className="w-full flex-shrink-0 sm:w-auto" asChild>
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
