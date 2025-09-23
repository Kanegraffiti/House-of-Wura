'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { Check, Minus, Plus } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';

import Skeleton from '@/components/ui/Skeleton';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { formatCurrency } from '@/lib/format';
import { countCartItems } from '@/lib/cart/utils';
import { useCart } from '@/providers/CartProvider';
import { cn } from '@/lib/utils';

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
  const colorOptions = product.colors || [];
  const sizeOptions = product.sizes || [];

  const [activeImage, setActiveImage] = useState(0);
  const [loadedImages, setLoadedImages] = useState<Record<number, boolean>>({});
  const [selectedColor, setSelectedColor] = useState<string | undefined>(
    colorOptions.length === 1 ? colorOptions[0] : undefined
  );
  const [selectedSize, setSelectedSize] = useState<string | undefined>(
    sizeOptions.length === 1 ? sizeOptions[0] : undefined
  );
  const [quantity, setQuantity] = useState(1);
  const [errors, setErrors] = useState<{ color?: string; size?: string }>({});
  const [status, setStatus] = useState<'idle' | 'added'>('idle');

  const reduceMotion = useReducedMotion();
  const { dispatch, state } = useCart();
  const cartCount = countCartItems(state.items);

  useEffect(() => {
    if (status === 'added') {
      const timeout = window.setTimeout(() => setStatus('idle'), 2400);
      return () => window.clearTimeout(timeout);
    }
    return undefined;
  }, [status]);

  const requiresColor = colorOptions.length > 0;
  const requiresSize = sizeOptions.length > 0;
  const canAdd = (!requiresColor || Boolean(selectedColor)) && (!requiresSize || Boolean(selectedSize));

  const handleAddToCart = () => {
    const nextErrors: { color?: string; size?: string } = {};

    if (requiresColor && !selectedColor) {
      nextErrors.color = 'Please choose a colour to continue.';
    }
    if (requiresSize && !selectedSize) {
      nextErrors.size = 'Please select a size to continue.';
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    dispatch({
      type: 'ADD_ITEM',
      payload: {
        id: product.id,
        sku: product.sku,
        title: product.title,
        priceFrom: product.priceFrom,
        image: product.images?.[0],
        color: selectedColor,
        size: selectedSize,
        qty: quantity
      }
    });
    setStatus('added');
  };

  const adjustQuantity = (delta: number) => {
    setQuantity((prev) => Math.max(1, prev + delta));
  };

  const handleImageLoad = (index: number) => {
    setLoadedImages((prev) => ({ ...prev, [index]: true }));
  };

  return (
    <Card className="group h-full overflow-hidden">
      <div className="relative aspect-[3/4] w-full overflow-hidden">
        {product.images.map((image, index) => (
          <div key={image} className="absolute inset-0">
            <motion.div
              initial={reduceMotion ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.995 }}
              animate={
                activeImage === index && (loadedImages[index] || reduceMotion)
                  ? { opacity: 1, scale: 1 }
                  : { opacity: 0, scale: 0.995 }
              }
              transition={reduceMotion ? { duration: 0 } : { duration: 0.25, ease: [0.2, 0.6, 0, 1] }}
              className="relative h-full w-full"
            >
              <Image
                src={`${image}?auto=format&fit=crop&w=900&q=80`}
                alt={`${product.title} look ${index + 1}`}
                width={600}
                height={800}
                loading={index === 0 ? 'eager' : 'lazy'}
                onLoadingComplete={() => handleImageLoad(index)}
                className="h-full w-full object-cover"
                priority={index === 0}
              />
            </motion.div>
            {!loadedImages[index] && <Skeleton className="absolute inset-0" />}
          </div>
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
          {requiresColor && (
            <div>
              <p className="mb-2 font-semibold uppercase tracking-[0.3em]">Color</p>
              <div className="flex flex-wrap gap-2">
                {colorOptions.map((color) => (
                  <button
                    key={color}
                    type="button"
                    aria-pressed={selectedColor === color}
                    onClick={() => {
                      setSelectedColor(color);
                      setErrors((prev) => ({ ...prev, color: undefined }));
                    }}
                    className={cn(
                      'rounded-full border px-3 py-1 text-xs uppercase tracking-[0.2em] transition-all duration-200 ease-std focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wura-gold',
                      selectedColor === color
                        ? 'border-wura-gold bg-wura-gold/20 text-wura-black'
                        : 'border-wura-black/15 text-wura-black/70 hover:border-wura-gold/50 hover:text-wura-black'
                    )}
                  >
                    {color}
                  </button>
                ))}
              </div>
              {errors.color && (
                <p className="mt-2 text-xs text-wura-wine" role="alert">
                  {errors.color}
                </p>
              )}
            </div>
          )}
          {requiresSize && (
            <div>
              <p className="mb-2 font-semibold uppercase tracking-[0.3em]">Size</p>
              <div className="flex flex-wrap gap-2">
                {sizeOptions.map((size) => (
                  <button
                    key={size}
                    type="button"
                    aria-pressed={selectedSize === size}
                    onClick={() => {
                      setSelectedSize(size);
                      setErrors((prev) => ({ ...prev, size: undefined }));
                    }}
                    className={cn(
                      'rounded-full border px-3 py-1 text-xs uppercase tracking-[0.2em] transition-all duration-200 ease-std focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wura-gold',
                      selectedSize === size
                        ? 'border-wura-gold bg-wura-gold/20 text-wura-black'
                        : 'border-wura-black/15 text-wura-black/70 hover:border-wura-gold/50 hover:text-wura-black'
                    )}
                  >
                    {size}
                  </button>
                ))}
              </div>
              {errors.size && (
                <p className="mt-2 text-xs text-wura-wine" role="alert">
                  {errors.size}
                </p>
              )}
            </div>
          )}
          <div>
            <p className="mb-2 font-semibold uppercase tracking-[0.3em]">Quantity</p>
            <div className="inline-flex items-center gap-2 rounded-full border border-wura-black/15 px-3 py-1">
              <button
                type="button"
                aria-label="Decrease quantity"
                onClick={() => adjustQuantity(-1)}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-transparent text-wura-black/70 transition-all duration-200 ease-std hover:border-wura-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wura-gold"
              >
                <Minus className="h-3 w-3" aria-hidden />
              </button>
              <span className="min-w-[2rem] text-center text-sm font-semibold">{quantity}</span>
              <button
                type="button"
                aria-label="Increase quantity"
                onClick={() => adjustQuantity(1)}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-transparent text-wura-black/70 transition-all duration-200 ease-std hover:border-wura-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wura-gold"
              >
                <Plus className="h-3 w-3" aria-hidden />
              </button>
            </div>
          </div>
        </div>
        <div className="mt-auto">
          <Button className="w-full" onClick={handleAddToCart} disabled={!canAdd}>
            <span className="link-glint">Add to Cart</span>
          </Button>
          <div className="mt-3 text-xs uppercase tracking-[0.25em] text-wura-black/60" aria-live="polite">
            {status === 'added' ? (
              <span className="inline-flex items-center gap-1 text-wura-gold">
                <Check className="h-3 w-3" aria-hidden /> Added. View cart ({cartCount})
              </span>
            ) : (
              <span>We finalise pricing and fittings with you on WhatsApp.</span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
