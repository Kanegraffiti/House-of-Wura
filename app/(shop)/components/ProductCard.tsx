'use client';

import { useEffect, useState } from 'react';
import { Check, Minus, Plus } from 'lucide-react';
import { motion } from 'framer-motion';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { formatCurrency } from '@/lib/format';
import { countCartItems } from '@/lib/cart/utils';
import { cn } from '@/lib/utils';
import { Magnetic } from '@/components/site/Magnetic';
import { TiltCard } from '@/components/site/TiltCard';
import { scaleIn } from '@/lib/motion';
import { useToast } from '@/providers/ToastProvider';
import { useCart } from '@/providers/CartProvider';
import ImageSmart from '@/components/site/ImageSmart';
import { getMedia, type MediaKey } from '@/lib/media';

export interface Product {
  id: string;
  title: string;
  slug: string;
  priceFrom: number;
  category: string;
  colors: string[];
  sizes: string[];
  images: MediaKey[];
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

  const [selectedColor, setSelectedColor] = useState<string | undefined>(
    colorOptions.length === 1 ? colorOptions[0] : undefined
  );
  const [selectedSize, setSelectedSize] = useState<string | undefined>(
    sizeOptions.length === 1 ? sizeOptions[0] : undefined
  );
  const [quantity, setQuantity] = useState(1);
  const [errors, setErrors] = useState<{ color?: string; size?: string }>({});
  const [status, setStatus] = useState<'idle' | 'added'>('idle');

  const { dispatch, state } = useCart();
  const toast = useToast();
  const cartCount = countCartItems(state.items);

  const primaryImageKey = product.images?.[0];
  const secondaryImageKey = product.images?.[1];
  const primaryMedia = primaryImageKey ? getMedia(primaryImageKey) : null;
  const secondaryMedia = secondaryImageKey ? getMedia(secondaryImageKey) : null;

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
        image: primaryMedia?.url,
        color: selectedColor,
        size: selectedSize,
        qty: quantity
      }
    });
    setStatus('added');
    toast.push('Added to cart. View cart for a tailored follow-up.');
  };

  useEffect(() => {
    if (status === 'added') {
      const timeout = window.setTimeout(() => setStatus('idle'), 2400);
      return () => window.clearTimeout(timeout);
    }
    return undefined;
  }, [status]);

  const adjustQuantity = (delta: number) => {
    setQuantity((prev) => Math.max(1, prev + delta));
  };

  return (
    <motion.div
      variants={scaleIn}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-10% 0px -10% 0px' }}
      className="rounded-2xl border border-transparent"
    >
        <TiltCard className="h-full overflow-hidden">
          <Card className="h-full overflow-hidden">
            <div className="relative aspect-[4/5] w-full overflow-hidden">
              {primaryMedia && (
                <ImageSmart
                  src={`${primaryMedia.url}?auto=format&fit=crop&w=900&q=80`}
                  alt={`${product.title} on a Nigerian muse in couture styling`}
                  fill
                  sizes="(max-width: 640px) 92vw, (max-width: 1024px) 45vw, 360px"
                  className="object-cover transition-transform duration-300 ease-std group-hover:scale-[1.03]"
                />
              )}
              {secondaryMedia && (
                <ImageSmart
                  src={`${secondaryMedia.url}?auto=format&fit=crop&w=900&q=80`}
                  alt=""
                  aria-hidden
                  fill
                  sizes="(max-width: 640px) 92vw, (max-width: 1024px) 45vw, 360px"
                  className="object-cover opacity-0 transition duration-300 ease-std group-hover:scale-[1.03] group-hover:opacity-100"
                  fade={false}
                />
              )}
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
              <p className="text-sm leading-relaxed text-wura-black/70 line-clamp-3">{product.description}</p>
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
                            'focus-ring rounded-full border px-4 py-2 text-xs uppercase tracking-[0.2em] transition-colors duration-200 ease-std min-h-[44px] min-w-[44px]',
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
                            'focus-ring rounded-full border px-4 py-2 text-xs uppercase tracking-[0.2em] transition-colors duration-200 ease-std min-h-[44px] min-w-[44px]',
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
                  <div className="inline-flex items-center gap-3 rounded-full border border-wura-black/15 px-3 py-2">
                    <motion.button
                      type="button"
                      aria-label="Decrease quantity"
                      whileTap={{ scale: 0.92 }}
                      onClick={() => adjustQuantity(-1)}
                      className="focus-ring flex h-11 w-11 items-center justify-center rounded-full border border-transparent text-wura-black/70 transition-colors duration-200 ease-std hover:border-wura-gold"
                    >
                      <Minus className="h-3 w-3" aria-hidden />
                    </motion.button>
                    <span className="min-w-[2rem] text-center text-sm font-semibold">{quantity}</span>
                    <motion.button
                      type="button"
                      aria-label="Increase quantity"
                      whileTap={{ scale: 0.92 }}
                      onClick={() => adjustQuantity(1)}
                      className="focus-ring flex h-11 w-11 items-center justify-center rounded-full border border-transparent text-wura-black/70 transition-colors duration-200 ease-std hover:border-wura-gold"
                    >
                      <Plus className="h-3 w-3" aria-hidden />
                    </motion.button>
                  </div>
                </div>
              </div>
              <div className="mt-auto">
                <Magnetic className="w-full">
                  <Button type="button" className="min-h-[44px] w-full px-5 py-2.5" onClick={handleAddToCart} disabled={!canAdd}>
                    <span className="link-glint">Add to Cart</span>
                  </Button>
                </Magnetic>
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
        </TiltCard>
      </motion.div>
  );
}
