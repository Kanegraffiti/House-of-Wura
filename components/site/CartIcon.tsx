'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ShoppingBag } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

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
  const hasItems = count > 0;
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
              'relative inline-flex h-11 w-11 items-center justify-center rounded-full border border-wura-black/15 bg-white text-wura-wine focus-ring transition-transform duration-200 ease-std will-change-transform hover:-translate-y-0.5 hover:border-wura-gold hover:bg-wura-wine/10 hover:text-wura-wine active:translate-y-0',
              className
            )}
          >
            <ShoppingBag className="h-5 w-5" aria-hidden />
            <span className="sr-only">Cart</span>
            <AnimatePresence>
              {hasItems && (
                <motion.span
                  key={count}
                  initial={{ scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1, transition: { duration: 0.18, ease: [0.3, 0, 0.2, 1] } }}
                  exit={{ scale: 0.6, opacity: 0, transition: { duration: 0.14, ease: [0.4, 0, 0.6, 1] } }}
                  className="absolute -right-1 -top-1 inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-wura-wine text-[0.625rem] font-semibold leading-none text-white shadow-sm"
                  aria-live="polite"
                >
                  {count}
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        }
      />
      {lastOrderId && (
        <Link
          href={`/order/${lastOrderId}`}
          className="text-xs font-semibold uppercase tracking-[0.3em] text-wura-black/70 transition-colors duration-200 ease-std hover:text-wura-black"
        >
          <span className="link-glint">Latest order</span>
        </Link>
      )}
    </div>
  );
}
