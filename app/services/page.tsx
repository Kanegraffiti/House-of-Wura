import { Metadata } from 'next';

import Reveal from '@/components/site/Reveal';
import { Button } from '@/components/ui/button';
import { Container } from '@/components/site/Container';
import { Section } from '@/components/site/Section';
import { SectionHeader } from '@/components/site/SectionHeader';
import { ServiceCard } from '@/components/site/ServiceCard';
import { waLink } from '@/lib/wa';

export const metadata: Metadata = {
  title: 'Services',
  description:
    'Luxury weddings, fashion direction, and immersive events by House of Wura. Each experience is custom-tailored.'
};

const services = [
  {
    title: 'Signature Wedding Planning',
    description: 'Full-service planning and design for ceremonies, receptions, and destination experiences.',
    items: [
      'Story-led concept and style direction',
      'Guest logistics, travel, and hospitality',
      'Vendor negotiation, orchestration, and timelines',
      'Onsite styling, production, and concierge'
    ],
    message:
      'Hello House of Wura! I would like a quote for Signature Wedding Planning. My ideal date is [insert date] with [approx guest count].'
  },
  {
    title: 'Couture Fashion Direction',
    description: 'Wardrobe planning and creative direction for brides, celebrants, and editorial talents.',
    items: [
      'Mood direction and fashion storyboard',
      'Designer sourcing and atelier liaison',
      'Fittings, alterations, and accessory curation',
      'Runway/show styling and shoot supervision'
    ],
    message:
      'Hello House of Wura! I need Couture Fashion Direction for [event/editorial]. Desired delivery timeline is [insert date].'
  },
  {
    title: 'Experiential Event Design',
    description: 'Immersive environments for corporate galas, product launches, and cultural showcases.',
    items: [
      'Audience journey mapping',
      'Custom installations and scenic design',
      'Entertainment and culinary choreography',
      'Onsite production, show-calling, and debrief'
    ],
    message:
      'Hello House of Wura! Please share a proposal for Experiential Event Design for [brand/event] with an estimated budget of [amount].'
  }
];

export default function ServicesPage() {
  return (
    <div className="bg-gradient-to-b from-white via-wura-gold/8 to-white">
      <section className="border-b border-wura-black/10 bg-white">
        <Container className="flex flex-col gap-6 py-24 text-center sm:text-left">
          <Reveal>
            <p className="text-xs uppercase tracking-[0.4em] text-wura-wine">Our Craft</p>
          </Reveal>
          <Reveal delay={0.08}>
            <h1 className="font-display text-4xl text-wura-black sm:text-5xl">Services</h1>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="text-base text-wura-black/70 sm:text-lg">
              We design celebrations and wardrobes that move with grace. Share your vision and our concierge will reply instantly on WhatsApp.
            </p>
          </Reveal>
          <Reveal delay={0.18}>
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-start">
              <Button asChild>
                <a href={waLink('Hello House of Wura! I want to start a bespoke planning experience.')} target="_blank" rel="noopener noreferrer">
                  <span className="link-glint">Start consultation</span>
                </a>
              </Button>
              <Button variant="outline" className="border-wura-gold" asChild>
                <a href="#packages">
                  <span className="link-glint">View packages</span>
                </a>
              </Button>
            </div>
          </Reveal>
        </Container>
      </section>

      <Section id="packages">
        <Container className="space-y-12">
          <Reveal>
            <SectionHeader
              eyebrow="Service Menu"
              title="Choose the pathway that suits your celebration"
              description="Every engagement begins with a conversation—we customise deliverables and timelines for you."
              align="left"
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

      <Section className="bg-wura-black text-wura-white">
        <Container className="grid gap-8 md:grid-cols-2">
          <Reveal>
            <div className="space-y-4">
              <h2 className="font-display text-3xl">Included with every project</h2>
              <ul className="space-y-3 text-sm leading-relaxed text-wura-white/80">
                <li>Dedicated WhatsApp concierge for rapid updates</li>
                <li>Access to vetted vendors and ateliers across Africa and Europe</li>
                <li>Detailed production timelines and transparent budgeting</li>
              </ul>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="space-y-4 rounded-3xl bg-white/10 p-8">
              <h3 className="font-display text-2xl text-wura-gold">Need something custom?</h3>
              <p className="text-sm text-wura-white/80">
                Share your dream briefly and we will respond within 24 hours.
              </p>
              <Button variant="outline" className="border-wura-gold text-wura-white hover:text-wura-black" asChild>
                <a href={waLink('Hello House of Wura! I have a unique celebration in mind. Here are the details:')} target="_blank" rel="noopener noreferrer">
                  <span className="link-glint">Message the atelier</span>
                </a>
              </Button>
            </div>
          </Reveal>
        </Container>
      </Section>
    </div>
  );
}
