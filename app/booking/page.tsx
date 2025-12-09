import Link from 'next/link';
import { Metadata } from 'next';
import { Container } from '@/components/site/Container';
import { OpulentPanel } from '@/components/site/OpulentPanel';
import { Section } from '@/components/site/Section';
import { SectionHeader } from '@/components/site/SectionHeader';
import { Button } from '@/components/ui/button';
import { waLink } from '@/lib/wa';

export const metadata: Metadata = {
  title: 'Booking & Payment | House of Wura',
  description: 'Simple, concierge-led booking for House of Wura events with transparent payment milestones.'
};

const steps = [
  {
    title: 'Discovery call',
    detail: 'Share your date, location, guest count, and priorities on a 20-minute call or WhatsApp chat.'
  },
  {
    title: 'Design roadmap',
    detail: 'We create a Lagos-ready concept, budget, and vendor map so you see the journey end-to-end.'
  },
  {
    title: 'Secure your date',
    detail: 'A retainer reserves your dates, planning calendar, and dedicated concierge response window.'
  },
  {
    title: 'Production & hosting',
    detail: 'We stage rehearsals, arrivals, and show-calling while you and your guests enjoy the celebration.'
  }
];

const paymentOptions = [
  {
    title: 'Milestone billing',
    detail: '40% retainer to lock the date, 40% midway after design approvals, 20% post-event reconciliation.'
  },
  {
    title: 'Bank transfer & cards',
    detail: 'NGN and GBP bank details provided on invoice. Stripe card links available on request.'
  },
  {
    title: 'Vendor management',
    detail: 'We contract and pay vendors on your behalf where preferred, with transparent reconciliations.'
  }
];

export default function BookingPage() {
  return (
    <Section className="bg-gradient-to-b from-white via-wura-cream/50 to-white">
      <Container className="space-y-14">
        <SectionHeader
          eyebrow="Booking"
          title="Concierge booking that keeps things effortless"
          description="House of Wura makes planning graceful: clear steps, transparent payments, and a team that responds within Nigeria\'s timezone."
          align="left"
        />

        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
          <OpulentPanel tone="light" className="space-y-8 bg-gradient-to-br from-white to-wura-cream">
            <div className="inline-flex items-center gap-2 rounded-full bg-wura-wine/10 px-4 py-2 text-xs uppercase tracking-[0.3em] text-wura-wine">
              Lagos-led process
            </div>
            <div className="space-y-5">
              {steps.map((step, index) => (
                <div key={step.title} className="rounded-2xl border border-wura-black/8 bg-white/80 p-5 shadow-sm">
                  <p className="text-xs uppercase tracking-[0.3em] text-wura-wine">Step {index + 1}</p>
                  <h3 className="mt-2 font-display text-2xl text-wura-black">{step.title}</h3>
                  <p className="mt-2 text-sm text-wura-black/70">{step.detail}</p>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-3">
              <Button asChild>
                <Link href={waLink("Hello House of Wura! I\'d like to secure a date for my event.")} target="_blank" rel="noopener noreferrer">
                  Chat on WhatsApp
                </Link>
              </Button>
              <Button variant="outline" className="border-wura-gold" asChild>
                <Link href="/contact">Email the concierge</Link>
              </Button>
            </div>
          </OpulentPanel>

          <div className="space-y-6">
            <SectionHeader
              eyebrow="Payments"
              title="Clarity from invoice to after-party"
              description="We honour your budget, provide bank details securely, and share reconciliations that keep every naira and pound accountable."
              align="left"
            />
            <div className="grid gap-4 sm:grid-cols-2">
              {paymentOptions.map((option) => (
                <div
                  key={option.title}
                  className="rounded-2xl border border-wura-black/10 bg-white/90 p-5 shadow-[0_20px_40px_rgba(11,11,11,0.05)]"
                >
                  <h3 className="font-display text-xl text-wura-black">{option.title}</h3>
                  <p className="mt-2 text-sm text-wura-black/70">{option.detail}</p>
                </div>
              ))}
            </div>
            <OpulentPanel tone="dark" className="space-y-4">
              <h3 className="font-display text-2xl">Need an urgent date?</h3>
              <p className="text-sm text-wura-white/80">
                Our Lagos and London teams coordinate quickly for high-profile or short-notice celebrations. Share your preferred dates and location; we will respond within 24 hours.
              </p>
              <Button variant="outline" className="border-wura-gold text-wura-white" asChild>
                <Link href={waLink('Hello House of Wura! I have a short-notice event and need support.')}>Request availability</Link>
              </Button>
            </OpulentPanel>
          </div>
        </div>
      </Container>
    </Section>
  );
}
