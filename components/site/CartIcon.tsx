'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ShoppingBag } from 'lucide-react';

import { countCartItems } from '@/lib/cart/utils';
import { useCart } from '@/providers/CartProvider';

import { CartDrawer } from './CartDrawer';
import { cn } from '@/lib/utils';

interface CartIconProps {
  className?: string;
}

const LAST_ORDER_KEY = 'wura_last_order';

export function CartIcon({ className }: CartIconProps) {
  const { state } = useCart();
  const count = countCartItems(state.items);
  const [lastOrderId, setLastOrderId] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const readLatest = () => {
      try {
        const raw = localStorage.getItem(LAST_ORDER_KEY);
        if (!raw) {
          setLastOrderId(null);
          return;
        }
        const parsed = JSON.parse(raw) as { orderId?: string } | null;
        setLastOrderId(parsed?.orderId ?? null);
      } catch {
        setLastOrderId(null);
      }
    };

    const handleStorage = (event: StorageEvent) => {
      if (event.key && event.key !== LAST_ORDER_KEY) return;
      readLatest();
    };

    const handleCustom = (event: Event) => {
      const detail = (event as CustomEvent<{ orderId?: string }>).detail;
      setLastOrderId(detail?.orderId ?? null);
    };

    readLatest();
    window.addEventListener('storage', handleStorage);
    window.addEventListener('wura:last-order', handleCustom);
    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('wura:last-order', handleCustom);
    };
  }, []);

  return (
    <div className="flex items-center gap-2">
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
      {lastOrderId && (
        <Link
          href={`/order/${lastOrderId}`}
          className="text-xs font-semibold uppercase tracking-[0.3em] text-wura-black/70 underline-offset-4 hover:text-wura-black hover:underline"
        >
          Latest order
        </Link>
      )}
    </div>
  );
}
