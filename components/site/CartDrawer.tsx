'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet';
import { formatCurrency } from '@/lib/format';
import { countCartItems, sumDisplaySubtotal } from '@/lib/cart/utils';
import type { CartItem } from '@/lib/cart/types';
import { useCart } from '@/providers/CartProvider';

interface CartDrawerProps {
  trigger?: React.ReactNode;
}

const LAST_ORDER_KEY = 'wura_last_order';

const lineVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0 }
};

function CartLine({ item, index }: { item: CartItem; index: number }) {
  const { dispatch } = useCart();
  const reduceMotion = useReducedMotion();
  const target = { sku: item.sku, color: item.color, size: item.size };

  return (
    <motion.li
      variants={lineVariants}
      transition={
        reduceMotion
          ? { duration: 0 }
          : { duration: 0.2, ease: [0.2, 0.6, 0, 1], delay: index * 0.05 }
      }
      className="flex gap-4 rounded-2xl border border-wura-black/10 p-4 transition-colors duration-200 ease-std hover:border-wura-gold/50"
    >
      {item.image ? (
        <div className="relative h-20 w-16 overflow-hidden rounded-lg bg-wura-black/5">
          <Image
            src={`${item.image}?auto=format&fit=crop&w=300&q=70`}
            alt={`${item.title} preview`}
            fill
            className="object-cover"
            sizes="64px"
          />
        </div>
      ) : (
        <div className="flex h-20 w-16 items-center justify-center rounded-lg bg-wura-black/5 text-xs uppercase tracking-[0.2em]">
          HW
        </div>
      )}
      <div className="flex flex-1 flex-col gap-2 text-sm">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="font-semibold text-wura-black">{item.title}</p>
            <p className="text-xs uppercase tracking-[0.3em] text-wura-black/60">SKU: {item.sku}</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            aria-label={`Remove ${item.title} from cart`}
            onClick={() => dispatch({ type: 'REMOVE_ITEM', payload: target })}
            className="h-8 w-8 rounded-full border border-transparent text-wura-black/60 hover:border-wura-gold hover:text-wura-gold"
          >
            <Trash2 className="h-4 w-4" aria-hidden />
          </Button>
        </div>
        <div className="flex flex-wrap gap-3 text-xs uppercase tracking-[0.3em] text-wura-black/70">
          {item.color && <span>Color: {item.color}</span>}
          {item.size && <span>Size: {item.size}</span>}
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-wura-black/80">
            From {item.priceFrom ? formatCurrency(item.priceFrom) : '—'}
          </span>
          <div className="flex items-center gap-2" aria-label={`Quantity for ${item.title}`}>
            <Button
              type="button"
              variant="outline"
              size="icon"
              aria-label={`Decrease quantity of ${item.title}`}
              onClick={() => dispatch({ type: 'DECREMENT', payload: target })}
              className="h-8 w-8 rounded-full border-wura-black/15"
            >
              <Minus className="h-3 w-3" aria-hidden />
            </Button>
            <span className="min-w-[1.5rem] text-center text-sm font-semibold">{item.qty}</span>
            <Button
              type="button"
              variant="outline"
              size="icon"
              aria-label={`Increase quantity of ${item.title}`}
              onClick={() => dispatch({ type: 'INCREMENT', payload: target })}
              className="h-8 w-8 rounded-full border-wura-black/15"
            >
              <Plus className="h-3 w-3" aria-hidden />
            </Button>
          </div>
        </div>
      </div>
    </motion.li>
  );
}

export function CartDrawer({ trigger }: CartDrawerProps) {
  const { state, dispatch } = useCart();
  const [open, setOpen] = useState(false);
  const [lastOrderId, setLastOrderId] = useState<string | null>(null);
  const reduceMotion = useReducedMotion();
  const count = countCartItems(state.items);
  const subtotal = sumDisplaySubtotal(state.items);
  const isEmpty = state.items.length === 0;

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

  useEffect(() => {
    if (!open) return;
    if (typeof window === 'undefined') return;
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
  }, [open]);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        {trigger ?? (
          <Button
            type="button"
            variant="ghost"
            className="relative flex h-12 items-center gap-2 rounded-full border border-wura-black/10 px-4 text-sm font-semibold uppercase tracking-[0.3em] text-wura-black hover:border-wura-gold"
          >
            Cart
            <span className="flex h-5 min-w-[1.5rem] items-center justify-center rounded-full bg-wura-black text-xs font-semibold text-white">
              {count}
            </span>
          </Button>
        )}
      </SheetTrigger>
      <SheetContent side="right" className="sm:max-w-md">
        <motion.aside
          initial={reduceMotion ? false : { x: 24, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={reduceMotion ? { duration: 0 } : { duration: 0.2, ease: [0.2, 0.7, 0.2, 1] }}
          className="flex h-full flex-col"
        >
          <SheetHeader>
            <SheetTitle className="flex items-center justify-between text-2xl">
              Your Cart
              <span className="text-sm font-normal uppercase tracking-[0.3em] text-wura-black/60">{count} item{count === 1 ? '' : 's'}</span>
            </SheetTitle>
          </SheetHeader>
          <div className="mt-6 flex h-full flex-col gap-6">
            {isEmpty ? (
              <p className="text-sm text-wura-black/70">
                Your cart is empty. Explore the shop to curate your looks.
              </p>
            ) : (
              <motion.div
                initial={reduceMotion ? false : 'hidden'}
                animate="visible"
                variants={{
                  hidden: {},
                  visible: {
                    transition: { staggerChildren: reduceMotion ? 0 : 0.05 }
                  }
                }}
                className="flex-1 space-y-4 overflow-y-auto pr-2"
                aria-live="polite"
              >
                <motion.ul className="space-y-4">
                  {state.items.map((item, index) => (
                    <CartLine key={keyForItem(item)} item={item} index={index} />
                  ))}
                </motion.ul>
              </motion.div>
            )}
          </div>
          <SheetFooter>
            <div className="flex items-center justify-between text-sm font-medium uppercase tracking-[0.3em] text-wura-black">
              <span>Subtotal</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            <Button asChild disabled={isEmpty} className="w-full">
              <Link href="/cart" onClick={() => setOpen(false)}>
                Review & Checkout
              </Link>
            </Button>
            {lastOrderId && (
              <Button
                variant="outline"
                className="w-full border-wura-gold text-xs font-semibold uppercase tracking-[0.3em] text-wura-black"
                asChild
              >
                <Link href={`/order/${lastOrderId}`} onClick={() => setOpen(false)}>
                  View latest order
                </Link>
              </Button>
            )}
            {!isEmpty && (
              <Button
                variant="ghost"
                className="w-full text-xs font-semibold uppercase tracking-[0.3em] text-wura-black/60 hover:text-wura-black"
                onClick={() => dispatch({ type: 'CLEAR' })}
              >
                Clear cart
              </Button>
            )}
          </SheetFooter>
        </motion.aside>
      </SheetContent>
    </Sheet>
  );
}

function keyForItem(item: CartItem) {
  return [item.sku, item.color ?? '', item.size ?? ''].join('::');
}
