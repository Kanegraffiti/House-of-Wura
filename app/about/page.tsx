import Link from 'next/link';
import { Metadata } from 'next';

import Reveal from '@/components/site/Reveal';
import { Button } from '@/components/ui/button';
import { Container } from '@/components/site/Container';
import { Section } from '@/components/site/Section';
import { SectionHeader } from '@/components/site/SectionHeader';
import { waLink } from '@/lib/wa';
import { FadeImage } from '@/components/site/FadeImage';

export const metadata: Metadata = {
  title: 'About',
  description: 'Discover the House of Wura story—craftsmanship, couture, and legendary celebrations.'
};

const highlights = [
  {
    title: 'Craftsmanship',
    description: 'Our atelier collaborates with master artisans across Lagos, Accra, and Paris to produce custom textiles and embellishments.'
  },
  {
    title: 'Cultural Narrative',
    description: 'We weave West African heritage with modern sensibilities to create experiences that feel both timeless and avant-garde.'
  },
  {
    title: 'Holistic Planning',
    description: 'From wardrobe to guest flow, culinary journeys to sound design—we choreograph every touchpoint as part of one story.'
  }
];

export default function AboutPage() {
  return (
    <div className="bg-white">
      <Section className="pt-24">
        <Container className="grid items-center gap-12 lg:grid-cols-2">
          <div className="space-y-6">
            <Reveal>
              <p className="text-xs uppercase tracking-[0.4em] text-wura-wine">About House of Wura</p>
            </Reveal>
            <Reveal delay={0.08}>
              <h1 className="font-display text-4xl text-wura-black sm:text-5xl">
                Modern luxury rooted in African brilliance.
              </h1>
            </Reveal>
            <Reveal delay={0.12}>
              <p className="text-base text-wura-black/70 sm:text-lg">
                Founded by Wuraola Ade, House of Wura is an event planning and fashion collective delivering immersive weddings, couture wardrobes, and cultural experiences.
              </p>
            </Reveal>
            <Reveal delay={0.18}>
              <Button asChild>
                <Link href={waLink('Hello House of Wura! I would love to learn more about your atelier.')} target="_blank" rel="noopener noreferrer">
                  <span className="link-glint">Chat with the founder</span>
                </Link>
              </Button>
            </Reveal>
          </div>
          <Reveal delay={0.2}>
            <div className="relative aspect-[4/5] overflow-hidden rounded-3xl shadow-[0_30px_80px_rgba(11,11,11,0.15)]">
              <FadeImage
                src="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1200&q=80"
                alt="Creative director fitting a couture gown"
                fill
                className="img-fade object-cover transition duration-300 ease-std"
                loading="lazy"
              />
            </div>
          </Reveal>
        </Container>
      </Section>

      <Section className="bg-wura-black text-wura-white">
        <Container className="space-y-12">
          <Reveal>
            <SectionHeader
              eyebrow="Philosophy"
              title="Excellence in every layer"
              description="Every project is an anthology of craftsmanship, technology, and heart."
              align="left"
            />
          </Reveal>
          <div className="grid gap-8 md:grid-cols-3">
            {highlights.map((highlight, index) => (
              <Reveal key={highlight.title} delay={index * 0.08}>
                <div className="rounded-3xl bg-white/10 p-8">
                  <h3 className="font-display text-2xl text-wura-gold">{highlight.title}</h3>
                  <p className="mt-4 text-sm leading-relaxed text-wura-white/80">{highlight.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      <Section>
        <Container className="grid gap-12 lg:grid-cols-2">
          <div className="space-y-6">
            <Reveal>
              <SectionHeader
                eyebrow="Wedding Mastery"
                title="We orchestrate weddings like theatre"
                description="Our production team crafts moodboards, timeline films, and virtual walkthroughs so you can feel every moment before it happens."
                align="left"
              />
            </Reveal>
            <Reveal delay={0.1}>
              <ul className="space-y-3 text-sm text-wura-black/70">
                <li>Concierge for guests arriving internationally</li>
                <li>Wardrobe coordination from traditional attire to after-party looks</li>
                <li>Art direction for photography and cinematography teams</li>
              </ul>
            </Reveal>
          </div>
          <Reveal delay={0.15}>
            <div className="relative aspect-square overflow-hidden rounded-3xl bg-gradient-to-br from-wura-gold/40 to-wura-wine/40 p-1">
              <div className="relative h-full w-full overflow-hidden rounded-[32px]">
                <FadeImage
                  src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1200&q=80"
                  alt="Wedding aisle designed by House of Wura"
                  fill
                  className="img-fade object-cover transition duration-300 ease-std"
                  loading="lazy"
                />
              </div>
            </div>
          </Reveal>
        </Container>
      </Section>

      <Section className="bg-wura-black text-wura-white">
        <Container className="space-y-6 text-center">
          <Reveal>
            <h2 className="font-display text-3xl">Join our private client list</h2>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="mx-auto max-w-2xl text-sm text-wura-white/80">
              Receive atelier updates, capsule launches, and invitation-only showcases. We respect your inbox and privacy.
            </p>
          </Reveal>
          <Reveal delay={0.12}>
            <Button variant="outline" className="mx-auto border-wura-gold text-wura-white hover:text-wura-black" asChild>
              <Link href={waLink('Hello House of Wura! Please add me to your private client list.')} target="_blank" rel="noopener noreferrer">
                <span className="link-glint">Request access via WhatsApp</span>
              </Link>
            </Button>
          </Reveal>
        </Container>
      </Section>
    </div>
  );
}
