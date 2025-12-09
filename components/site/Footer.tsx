import Link from 'next/link';
import { Instagram } from 'lucide-react';

import { Container } from '@/components/site/Container';
import { waLink } from '@/lib/wa';

const services = ['Wedding Planning & Production', 'Luxury Social Events', 'Destination Logistics', 'Brand Launches'];
const highlights = ['VIP guest hospitality', 'Fashion & styling direction', 'Concierge vendor management', 'Cultural protocol guidance'];

const whatsappMessage = 'Hello House of Wura! I would like to plan an event with you.';

export function Footer() {
  const instagramUrl = process.env.NEXT_PUBLIC_INSTAGRAM_URL || 'https://instagram.com/tastyvinecakes';
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-wura-black/10 bg-wura-black text-wura-white">
      <Container className="grid gap-12 py-16 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-4">
          <Link href="/" className="font-display text-2xl tracking-widest text-wura-gold">
            <span className="inline-block transition-shadow duration-200 [text-shadow:_0_0_0_rgba(255,153,11,0)] hover:[text-shadow:_0_0_18px_rgba(255,153,11,0.35)]">
              House of Wura
            </span>
          </Link>
          <p className="text-sm text-wura-white/70">
            Designing couture celebrations with Lagos precision, Nigerian warmth, and global standards.
          </p>
        </div>
        <div className="space-y-4">
          <h3 className="font-display text-lg text-wura-gold">Services</h3>
          <ul className="space-y-2 text-sm text-wura-white/70">
            {services.map((service) => (
              <li key={service}>{service}</li>
            ))}
          </ul>
        </div>
        <div className="space-y-4">
          <h3 className="font-display text-lg text-wura-gold">Highlights</h3>
          <ul className="space-y-2 text-sm text-wura-white/70">
            {highlights.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <div className="space-y-4">
          <h3 className="font-display text-lg text-wura-gold">Connect</h3>
          <ul className="space-y-2 text-sm text-wura-white/70">
            <li>
              <Link href={waLink(whatsappMessage)} target="_blank" rel="noopener noreferrer" className="transition-colors duration-200 ease-std hover:text-wura-gold">
                <span className="link-glint">Plan via WhatsApp</span>
              </Link>
            </li>
            <li>
              <Link href="mailto:hello@houseofwura.com" className="transition-colors duration-200 ease-std hover:text-wura-gold">
                <span className="link-glint">hello@houseofwura.com</span>
              </Link>
            </li>
          </ul>
          <div>
            <Link
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-wura-gold px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-wura-white transition-all duration-200 ease-std hover:bg-wura-gold/10"
            >
              <Instagram className="h-4 w-4" aria-hidden />
              <span className="link-glint">Instagram</span>
            </Link>
          </div>
        </div>
      </Container>
      <div className="border-t border-white/10 bg-wura-black/80">
        <Container className="flex flex-col items-center justify-between gap-2 py-6 text-xs uppercase tracking-[0.35em] text-wura-white/60 sm:flex-row">
          <p>© {year} House of Wura. All rights reserved.</p>
          <p>
            MADE WITH LOVE BY{' '}
            <Link
              href="https://kelechiannabellenwankwo.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-wura-white transition-colors duration-200 ease-std hover:text-wura-gold"
            >
              KC
            </Link>
          </p>
        </Container>
      </div>
    </footer>
  );
}
