import Link from 'next/link';
import { Instagram } from 'lucide-react';

import { Container } from '@/components/site/Container';
import { waLink } from '@/lib/wa';

const services = ['Luxury Weddings', 'Fashion Direction', 'Corporate Galas', 'Private Styling'];
const shopCategories = ['Couture', 'Bridal', 'Menswear', 'Accessories'];

const whatsappMessage = 'Hello House of Wura! I would love to discuss a collaboration.';

export function Footer() {
  const instagramUrl = process.env.NEXT_PUBLIC_INSTAGRAM_URL || 'https://instagram.com';
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-wura-black/10 bg-wura-black text-wura-white">
      <Container className="grid gap-12 py-16 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-4">
          <Link href="/" className="font-display text-2xl tracking-widest text-wura-gold">
            House of Wura
          </Link>
          <p className="text-sm text-wura-white/70">
            Curating immersive celebrations and couture fashion with a signature African perspective.
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
          <h3 className="font-display text-lg text-wura-gold">Shop</h3>
          <ul className="space-y-2 text-sm text-wura-white/70">
            {shopCategories.map((category) => (
              <li key={category}>{category}</li>
            ))}
          </ul>
        </div>
        <div className="space-y-4">
          <h3 className="font-display text-lg text-wura-gold">Connect</h3>
          <ul className="space-y-2 text-sm text-wura-white/70">
            <li>
              <Link href={waLink(whatsappMessage)} target="_blank" rel="noopener noreferrer" className="hover:text-wura-gold">
                WhatsApp Concierge
              </Link>
            </li>
            <li>
              <Link href="mailto:hello@houseofwura.com" className="hover:text-wura-gold">
                hello@houseofwura.com
              </Link>
            </li>
          </ul>
          <div>
            <Link
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-wura-gold px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-wura-white transition hover:bg-wura-gold/10"
            >
              <Instagram className="h-4 w-4" aria-hidden />
              Instagram
            </Link>
          </div>
        </div>
      </Container>
      <div className="border-t border-white/10 bg-wura-black/80">
        <Container className="flex flex-col items-center justify-between gap-2 py-6 text-xs uppercase tracking-[0.35em] text-wura-white/60 sm:flex-row">
          <p>© {year} House of Wura. All rights reserved.</p>
          <p>Made with love.</p>
        </Container>
      </div>
    </footer>
  );
}
