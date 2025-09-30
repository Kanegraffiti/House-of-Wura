import { Metadata } from 'next';

import Reveal from '@/components/site/Reveal';
import { Container } from '@/components/site/Container';
import { Section } from '@/components/site/Section';
import { SectionHeader } from '@/components/site/SectionHeader';
import { ProductCard, type Product } from '@/app/(shop)/components/ProductCard';
import { CartSummaryBar } from '@/app/(shop)/components/CartSummaryBar';
import productsData from '@/data/products.json';
import { type MediaKey } from '@/lib/media';

const products: Product[] = productsData.map((product) => ({
  ...product,
  images: Array.isArray(product.images)
    ? product.images.map((key) => key as MediaKey)
    : []
}));

export const metadata: Metadata = {
  title: 'Shop',
  description: 'Discover House of Wura couture, bridal, and accessories. Begin your purchase via WhatsApp.'
};

export default function ShopPage() {
  return (
    <Section className="bg-wura-black/5">
      <Container className="cq space-y-12">
        <Reveal>
          <SectionHeader
            eyebrow="House of Wura Shop"
            title="Begin every look with a conversation"
            description="Select a piece to enquire instantly on WhatsApp. We customise sizing, fabrics, and embellishments for you."
            align="left"
          />
        </Reveal>
        <Reveal delay={0.05}>
          <CartSummaryBar />
        </Reveal>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3 sm:gap-8">
          {products.map((product, index) => (
            <Reveal key={product.id} delay={index * 0.05}>
              <ProductCard product={product} />
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}
