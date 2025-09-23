'use client';

import { ShoppingBag } from 'lucide-react';

import { countCartItems } from '@/lib/cart/utils';
import { useCart } from '@/providers/CartProvider';

import { CartDrawer } from './CartDrawer';
import { cn } from '@/lib/utils';

interface CartIconProps {
  className?: string;
}

export function CartIcon({ className }: CartIconProps) {
  const { state } = useCart();
  const count = countCartItems(state.items);

  return (
    <CartDrawer
      trigger={
        <button
          type="button"
          aria-label={`Open cart. ${count} item${count === 1 ? '' : 's'} in cart.`}
          className={cn(
            'relative flex h-11 items-center gap-2 rounded-full border border-wura-black/15 px-4 text-sm font-semibold uppercase tracking-[0.3em] text-wura-black transition hover:border-wura-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wura-gold focus-visible:ring-offset-2 focus-visible:ring-offset-white',
            className
          )}
        >
          <ShoppingBag className="h-4 w-4" aria-hidden />
          <span className="hidden sm:inline">Cart</span>
          <span className="ml-1 flex h-5 min-w-[1.5rem] items-center justify-center rounded-full bg-wura-black text-xs font-semibold text-white">
            {count}
          </span>
        </button>
      }
    />
  );
}
