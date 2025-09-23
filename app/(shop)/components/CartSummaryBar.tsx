'use client';

import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/format';
import { countCartItems, sumDisplaySubtotal } from '@/lib/cart/utils';
import { useCart } from '@/providers/CartProvider';

export function CartSummaryBar() {
  const { state } = useCart();
  const count = countCartItems(state.items);
  const subtotal = sumDisplaySubtotal(state.items);

  return (
    <div
      className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-wura-black/10 bg-white/80 p-4 text-xs uppercase tracking-[0.3em] text-wura-black/70 shadow-sm"
      aria-live="polite"
    >
      <p>
        Cart ({count}) · Displayed subtotal: {formatCurrency(subtotal)}
      </p>
      <Button variant="outline" className="border-wura-gold px-4 py-2 text-[0.65rem]" asChild>
        <Link href="/cart">Review cart</Link>
      </Button>
    </div>
  );
}
