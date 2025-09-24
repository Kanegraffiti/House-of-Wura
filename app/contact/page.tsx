import Link from 'next/link';
import { Metadata } from 'next';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Container } from '@/components/site/Container';
import { Section } from '@/components/site/Section';
import { SectionHeader } from '@/components/site/SectionHeader';
import { ContactForm } from '@/components/site/ContactForm';
import { waLink } from '@/lib/wa';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Connect with House of Wura via WhatsApp for bespoke event planning and fashion services.'
};

const quickContacts = [
  {
    title: 'WhatsApp Concierge',
    description: 'Instant replies from our planning desk.',
    action: 'Chat now',
    href: waLink('Hello House of Wura! I would like to speak with the concierge team.'),
    accent: 'WhatsApp'
  },
  {
    title: 'Email Atelier',
    description: 'Share moodboards, schedules, or proposals.',
    action: 'Send an email',
    href: 'mailto:hello@houseofwura.com',
    accent: 'Email'
  },
  {
    title: 'Instagram',
    description: 'Follow our atelier diaries and launch announcements.',
    action: 'View Instagram',
    href: process.env.NEXT_PUBLIC_INSTAGRAM_URL || 'https://instagram.com/_houseofwurafashions',
    accent: 'Social'
  }
];

export default function ContactPage() {
  return (
    <Section>
      <Container className="space-y-12">
        <SectionHeader
          eyebrow="Contact"
          title="Let us design your next unforgettable moment"
          description="Fill out the form or tap a quick link to continue on WhatsApp."
          align="left"
        />
        <ContactForm />
        <div className="grid gap-6 md:grid-cols-3">
          {quickContacts.map((contact) => (
            <Card key={contact.title} className="bg-white/80">
              <CardHeader>
                <CardTitle>{contact.title}</CardTitle>
                <CardDescription>{contact.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="border-wura-gold" asChild>
                  <Link href={contact.href} target="_blank" rel="noopener noreferrer">
                    {contact.action}
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="rounded-3xl bg-wura-black text-wura-white p-10 text-center sm:text-left">
          <h2 className="font-display text-3xl">Appointments by invitation</h2>
          <p className="mt-4 text-sm text-wura-white/80">
            Studio visits in Lagos and London are available by appointment only. Message us on WhatsApp for availability.
          </p>
          <Button variant="outline" className="mt-6 border-wura-gold text-wura-white hover:text-wura-black" asChild>
            <Link href={waLink('Hello House of Wura! I would like to book a studio appointment.')} target="_blank" rel="noopener noreferrer">
              Request appointment
            </Link>
          </Button>
        </div>
      </Container>
    </Section>
  );
}
