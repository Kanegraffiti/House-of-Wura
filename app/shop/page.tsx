import { Metadata } from 'next';

import products from '@/data/products.json';

import { Container } from '@/components/site/Container';
import { Section } from '@/components/site/Section';
import { SectionHeader } from '@/components/site/SectionHeader';
import { ProductCard } from '@/app/(shop)/components/ProductCard';
import { CartSummaryBar } from '@/app/(shop)/components/CartSummaryBar';

export const metadata: Metadata = {
  title: 'Shop',
  description: 'Discover House of Wura couture, bridal, and accessories. Begin your purchase via WhatsApp.'
};

export default function ShopPage() {
  return (
    <Section className="bg-wura-black/5">
      <Container className="space-y-12">
        <SectionHeader
          eyebrow="House of Wura Shop"
          title="Begin every look with a conversation"
          description="Select a piece to enquire instantly on WhatsApp. We customise sizing, fabrics, and embellishments for you."
          align="left"
        />
        <CartSummaryBar />
        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </Container>
    </Section>
  );
}
