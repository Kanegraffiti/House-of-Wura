'use client';

import Link from 'next/link';
import { Minus, Plus, Trash2, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { AnimatePresence, motion } from 'framer-motion';

import ImageSmart from '@/components/site/ImageSmart';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/format';
import { countCartItems, sumDisplaySubtotal } from '@/lib/cart/utils';
import type { CartItem } from '@/lib/cart/types';
import { fadeInUp, motionDur, trans } from '@/lib/motion';
import { useCart } from '@/providers/CartProvider';

interface CartDrawerProps {
  trigger?: React.ReactNode;
}

const LAST_ORDER_KEY = 'wura_last_order';

const listVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08 }
  }
};

function CartLine({ item }: { item: CartItem }) {
  const { dispatch } = useCart();

  return (
    <motion.li
      variants={fadeInUp}
      className="flex gap-4 rounded-2xl border border-wura-black/10 p-4 transition-shadow duration-200 ease-std hover:shadow-md hover:shadow-black/5"
    >
      {item.image ? (
        <div className="relative aspect-[3/4] w-16 overflow-hidden rounded-lg bg-wura-black/5">
          <ImageSmart
            src={`${item.image}?auto=format&fit=crop&w=320&q=70`}
            alt={`${item.title} preview`}
            fill
            sizes="64px"
            className="object-cover"
          />
        </div>
      ) : (
        <div className="flex h-20 w-16 items-center justify-center rounded-lg bg-wura-black/5 text-xs uppercase tracking-[0.2em]">
          HW
        </div>
      )}
      <div className="flex flex-1 flex-col gap-3 text-sm">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="font-semibold text-wura-black">{item.title}</p>
            <p className="text-xs uppercase tracking-[0.3em] text-wura-black/60">SKU: {item.sku}</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            aria-label={`Remove ${item.title} from cart`}
            onClick={() => dispatch({ type: 'DEL', id: item.id })}
            className="h-11 w-11 rounded-full border border-transparent text-wura-black/60 hover:border-wura-gold hover:text-wura-gold"
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
            <motion.button
              type="button"
              whileTap={{ scale: 0.92 }}
              aria-label={`Decrease quantity of ${item.title}`}
              onClick={() => dispatch({ type: 'DEC', id: item.id })}
              className="focus-ring flex h-11 w-11 items-center justify-center rounded-full border border-transparent text-wura-black/70 transition-colors duration-200 ease-std hover:border-wura-gold"
            >
              <Minus className="h-3 w-3" aria-hidden />
            </motion.button>
            <span className="min-w-[1.5rem] text-center text-sm font-semibold">{item.qty}</span>
            <motion.button
              type="button"
              whileTap={{ scale: 0.92 }}
              aria-label={`Increase quantity of ${item.title}`}
              onClick={() => dispatch({ type: 'INC', id: item.id })}
              className="focus-ring flex h-11 w-11 items-center justify-center rounded-full border border-transparent text-wura-black/70 transition-colors duration-200 ease-std hover:border-wura-gold"
            >
              <Plus className="h-3 w-3" aria-hidden />
            </motion.button>
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
    if (typeof window === 'undefined') return;
    const handleOpen = () => setOpen(true);
    window.addEventListener('wura:cart-open', handleOpen);
    return () => {
      window.removeEventListener('wura:cart-open', handleOpen);
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

  const defaultTrigger = (
    <Button
      type="button"
      variant="ghost"
      className="relative flex h-12 items-center gap-2 border border-wura-black/10 px-4 text-sm font-semibold uppercase tracking-[0.3em] text-wura-black"
    >
      Cart
      <span className="flex h-5 min-w-[1.5rem] items-center justify-center rounded-full bg-wura-black text-xs font-semibold text-white">
        {count}
      </span>
    </Button>
  );

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>{trigger ?? defaultTrigger}</Dialog.Trigger>
      <AnimatePresence>
        {open && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild>
              <motion.div
                className="fixed inset-0 z-40 bg-black/55 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: trans(motionDur.sm) }}
                exit={{ opacity: 0, transition: { duration: motionDur.xs } }}
              />
            </Dialog.Overlay>
            <Dialog.Content asChild>
              <motion.aside
                key="cart"
                initial={{ x: 320, opacity: 0 }}
                animate={{ x: 0, opacity: 1, transition: { type: 'spring', stiffness: 340, damping: 34 } }}
                exit={{ x: 320, opacity: 0, transition: { duration: motionDur.sm } }}
                className="fixed right-0 top-0 z-50 flex h-full w-[92%] flex-col bg-white shadow-2xl sm:w-[420px]"
                role="dialog"
                aria-modal="true"
                aria-label="Cart"
              >
                <div className="flex items-center justify-between border-b border-wura-black/10 p-6">
                  <div>
                    <h2 className="font-display text-2xl text-wura-black">Your Cart</h2>
                    <p className="text-xs uppercase tracking-[0.3em] text-wura-black/60">{count} item{count === 1 ? '' : 's'}</p>
                  </div>
                  <Dialog.Close asChild>
                    <button
                      type="button"
                      aria-label="Close cart"
                      className="focus-ring rounded-full border border-transparent p-2 text-wura-black transition hover:border-wura-gold"
                    >
                      <X className="h-4 w-4" aria-hidden />
                    </button>
                  </Dialog.Close>
                </div>
                <div className="flex-1 overflow-y-auto p-6">
                  {isEmpty ? (
                    <div className="flex h-full items-center justify-center text-sm text-wura-black/70">
                      Your cart is empty. Explore the shop to curate your looks.
                    </div>
                  ) : (
                    <motion.div initial="hidden" animate="show" variants={listVariants} className="space-y-4">
                      <motion.ul className="space-y-4">
                        {state.items.map((item) => (
                          <CartLine key={keyForItem(item)} item={item} />
                        ))}
                      </motion.ul>
                    </motion.div>
                  )}
                </div>
                <div className="space-y-3 border-t border-wura-black/10 p-6">
                  <div className="flex items-center justify-between text-sm font-medium uppercase tracking-[0.3em] text-wura-black">
                    <span>Subtotal</span>
                    <span>{formatCurrency(subtotal)}</span>
                  </div>
                  <Button asChild disabled={isEmpty} className="w-full" onClick={() => setOpen(false)}>
                    <Link href="/cart">Review & Checkout</Link>
                  </Button>
                  {lastOrderId && (
                    <Button
                      variant="outline"
                      className="w-full border-wura-gold text-xs font-semibold uppercase tracking-[0.3em] text-wura-black"
                      asChild
                      onClick={() => setOpen(false)}
                    >
                      <Link href={`/order/${lastOrderId}`}>View latest order</Link>
                    </Button>
                  )}
                  {!isEmpty && (
                    <Button
                      variant="ghost"
                      className="w-full text-xs font-semibold uppercase tracking-[0.3em] text-wura-black/60 hover:text-wura-black"
                      onClick={() => dispatch({ type: 'CLR' })}
                    >
                      Clear cart
                    </Button>
                  )}
                </div>
              </motion.aside>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}

function keyForItem(item: CartItem) {
  return [item.sku, item.color ?? '', item.size ?? ''].join('::');
}
