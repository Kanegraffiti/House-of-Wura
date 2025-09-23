'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useMemo, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { formatCurrency } from '@/lib/format';
import { waLink } from '@/lib/wa';

export interface Product {
  id: string;
  title: string;
  slug: string;
  priceFrom: number;
  category: string;
  colors: string[];
  sizes: string[];
  images: string[];
  description: string;
  tags: string[];
  sku: string;
}

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const [activeImage, setActiveImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);

  const enquiryMessage = useMemo(() => {
    return `Hello House of Wura! I'm interested in: ${product.title} (SKU: ${product.sku}) — Color: ${selectedColor}; Size: ${selectedSize}. Please share price & availability.`;
  }, [product, selectedColor, selectedSize]);

  return (
    <Card className="group h-full overflow-hidden">
      <div className="relative aspect-[3/4] w-full overflow-hidden">
        {product.images.map((image, index) => (
          <Image
            key={image}
            src={`${image}?auto=format&fit=crop&w=900&q=80`}
            alt={`${product.title} look ${index + 1}`}
            width={600}
            height={800}
            className={`absolute inset-0 h-full w-full object-cover transition duration-500 ease-luxurious ${activeImage === index ? 'opacity-100' : 'opacity-0'}`}
            onMouseEnter={() => setActiveImage(index)}
            onFocus={() => setActiveImage(index)}
            priority={index === 0}
          />
        ))}
        <div className="absolute left-5 top-5 flex gap-2">
          <Badge variant="subtle" className="bg-wura-black/80 text-[0.6rem] text-white">
            {product.category}
          </Badge>
        </div>
      </div>
      <CardContent className="flex h-full flex-col gap-5 p-6">
        <div className="space-y-1">
          <h3 className="font-display text-2xl text-wura-black">{product.title}</h3>
          <p className="text-sm uppercase tracking-[0.3em] text-wura-black/60">
            From {formatCurrency(product.priceFrom)}
          </p>
        </div>
        <p className="text-sm leading-relaxed text-wura-black/70 line-clamp-3">
          {product.description}
        </p>
        <div className="flex flex-col gap-4 text-sm text-wura-black/80">
          <div>
            <p className="mb-2 font-semibold uppercase tracking-[0.3em]">Color</p>
            <div className="flex flex-wrap gap-2">
              {product.colors.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setSelectedColor(color)}
                  className={`rounded-full border px-3 py-1 text-xs uppercase tracking-[0.2em] transition ${selectedColor === color ? 'border-wura-gold bg-wura-gold/20 text-wura-black' : 'border-wura-black/15 text-wura-black/70 hover:border-wura-gold/50'}`}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="mb-2 font-semibold uppercase tracking-[0.3em]">Size</p>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => setSelectedSize(size)}
                  className={`rounded-full border px-3 py-1 text-xs uppercase tracking-[0.2em] transition ${selectedSize === size ? 'border-wura-gold bg-wura-gold/20 text-wura-black' : 'border-wura-black/15 text-wura-black/70 hover:border-wura-gold/50'}`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-auto">
          <Button className="w-full" asChild>
            <Link href={waLink(enquiryMessage)} target="_blank" rel="noopener noreferrer">
              Enquire on WhatsApp
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
