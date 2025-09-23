import { Metadata } from 'next';

import { Container } from '@/components/site/Container';
import { Section } from '@/components/site/Section';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'House of Wura privacy practices and data usage policy.'
};

const sections = [
  {
    title: 'Overview',
    body: 'House of Wura respects your privacy. We collect only the information necessary to deliver bespoke services and we store it securely.'
  },
  {
    title: 'Information we collect',
    body: 'When you message us on WhatsApp or submit a form, we receive your name, contact details, and project brief. We do not sell or share this information with third parties.'
  },
  {
    title: 'Local storage notes',
    body: 'If you opt-in, enquiry details may be stored in your own browser to help you keep track of conversations. This data never leaves your device and can be cleared anytime by deleting local storage.'
  },
  {
    title: 'Contact',
    body: 'To request updates or deletion of your information, please email hello@houseofwura.com or message our WhatsApp concierge.'
  }
];

export default function PrivacyPage() {
  return (
    <Section>
      <Container className="mx-auto max-w-3xl space-y-8">
        <header className="space-y-2">
          <p className="text-xs uppercase tracking-[0.4em] text-wura-wine">Legal</p>
          <h1 className="font-display text-4xl text-wura-black">Privacy Policy</h1>
          <p className="text-sm text-wura-black/70">
            Updated {new Date().getFullYear()} — We protect your information across all House of Wura touchpoints.
          </p>
        </header>
        <div className="space-y-6">
          {sections.map((section) => (
            <section key={section.title} className="space-y-3">
              <h2 className="font-display text-2xl text-wura-black">{section.title}</h2>
              <p className="text-sm leading-relaxed text-wura-black/70">{section.body}</p>
            </section>
          ))}
        </div>
      </Container>
    </Section>
  );
}
