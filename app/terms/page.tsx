import { Metadata } from 'next';

import { Container } from '@/components/site/Container';
import { Section } from '@/components/site/Section';

export const metadata: Metadata = {
  title: 'Terms & Conditions',
  description: 'House of Wura service terms and conditions.'
};

const clauses = [
  {
    title: 'Services',
    body: 'House of Wura provides event planning, fashion direction, and creative consulting. Scope is confirmed in writing via WhatsApp or email before production begins.'
  },
  {
    title: 'Payments',
    body: 'Deposits are required to secure dates and talent. Balance payments are due prior to the event or delivery of garments unless otherwise agreed.'
  },
  {
    title: 'Changes & Cancellations',
    body: 'Requests for changes must be submitted in writing. Additional costs may apply for re-scheduling or scope adjustments. Cancellations within 30 days of an event may forfeit deposits.'
  },
  {
    title: 'Intellectual Property',
    body: 'Design concepts, lookbooks, and creative assets remain the property of House of Wura unless transferred by contract. Clients receive usage rights for approved deliverables.'
  },
  {
    title: 'Liability',
    body: 'We coordinate vetted partners but are not liable for circumstances beyond our control, including force majeure or vendor failure. We maintain professional indemnity coverage.'
  }
];

export default function TermsPage() {
  return (
    <Section>
      <Container className="mx-auto max-w-3xl space-y-8">
        <header className="space-y-2">
          <p className="text-xs uppercase tracking-[0.4em] text-wura-wine">Legal</p>
          <h1 className="font-display text-4xl text-wura-black">Terms &amp; Conditions</h1>
          <p className="text-sm text-wura-black/70">Updated {new Date().getFullYear()} — Please review before engaging our services.</p>
        </header>
        <div className="space-y-6">
          {clauses.map((clause) => (
            <section key={clause.title} className="space-y-3">
              <h2 className="font-display text-2xl text-wura-black">{clause.title}</h2>
              <p className="text-sm leading-relaxed text-wura-black/70">{clause.body}</p>
            </section>
          ))}
        </div>
      </Container>
    </Section>
  );
}
