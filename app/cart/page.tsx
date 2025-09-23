'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { Minus, Plus, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Container } from '@/components/site/Container';
import { Section } from '@/components/site/Section';
import { formatCurrency } from '@/lib/format';
import { countCartItems, sumDisplaySubtotal } from '@/lib/cart/utils';
import { normalizePhone } from '@/lib/wa';
import { buildWhatsAppDeeplink } from '@/lib/orders/message';
import type { OrderType } from '@/lib/orders/schema';
import { useCart } from '@/providers/CartProvider';

const CONTACT_STORAGE_KEY = 'wura_last_contact';
const LAST_ORDER_KEY = 'wura_last_order';

type FeedbackState =
  | { status: 'idle' }
  | { status: 'sent'; orderId: string }
  | { status: 'error'; message: string };

export default function CartPage() {
  const { state, dispatch } = useCart();
  const router = useRouter();
  const [prefer, setPrefer] = useState<'whatsapp' | 'email'>('whatsapp');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [email, setEmail] = useState('');
  const [notes, setNotes] = useState('');
  const [feedback, setFeedback] = useState<FeedbackState>({ status: 'idle' });
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const count = countCartItems(state.items);
  const subtotal = sumDisplaySubtotal(state.items);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const raw = localStorage.getItem(CONTACT_STORAGE_KEY);
      if (!raw) return;
      const stored = JSON.parse(raw) as {
        prefer?: 'whatsapp' | 'email';
        whatsappNumber?: string;
        email?: string;
      };
      if (stored.prefer) setPrefer(stored.prefer);
      if (stored.whatsappNumber) setWhatsappNumber(stored.whatsappNumber);
      if (stored.email) setEmail(stored.email);
    } catch {
      // ignore parse errors
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const payload = JSON.stringify({ prefer, whatsappNumber, email });
    localStorage.setItem(CONTACT_STORAGE_KEY, payload);
  }, [prefer, whatsappNumber, email]);

  const hasContact = useMemo(() => {
    const trimmedWhatsApp = normalizePhone(whatsappNumber);
    const trimmedEmail = email.trim();
    return Boolean(trimmedWhatsApp || trimmedEmail);
  }, [whatsappNumber, email]);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submitting) return;

    setError(null);

    if (state.items.length === 0) {
      setError('Your cart is currently empty. Explore the shop to add looks.');
      return;
    }

    const trimmedWhatsApp = normalizePhone(whatsappNumber);
    const trimmedEmail = email.trim();

    if (!trimmedWhatsApp && !trimmedEmail) {
      setError('Please provide either a WhatsApp number or an email so we can reply.');
      return;
    }

    if (prefer === 'whatsapp' && !trimmedWhatsApp) {
      setError('Please add your WhatsApp number or switch to email.');
      return;
    }

    if (prefer === 'email' && !trimmedEmail) {
      setError('Please add your email address or switch to WhatsApp.');
      return;
    }

    setSubmitting(true);

    const normalizedWhatsApp = trimmedWhatsApp ? `+${trimmedWhatsApp}` : undefined;
    const payload = {
      customer: {
        prefer,
        whatsappNumber: normalizedWhatsApp,
        email: trimmedEmail || undefined
      },
      notes: notes.trim() || undefined,
      items: state.items,
      displayedSubtotal: subtotal
    };

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await response.json();

      if (!response.ok || !data?.orderId) {
        throw new Error(data?.error || 'Unable to create order. Please try again.');
      }

      const order: OrderType = {
        orderId: data.orderId as string,
        createdAt: Date.now(),
        status: 'PENDING',
        customer: payload.customer as OrderType['customer'],
        notes: payload.notes,
        items: payload.items,
        displayedSubtotal: payload.displayedSubtotal ?? 0,
        proof: { urls: [] }
      };

      try {
        const waUrl = buildWhatsAppDeeplink(order);
        window.open(waUrl, '_blank', 'noopener');
      } catch (error) {
        console.error('Failed to open WhatsApp link', error);
      }

      if (typeof window !== 'undefined') {
        const record = JSON.stringify({ orderId: order.orderId, createdAt: Date.now() });
        localStorage.setItem(LAST_ORDER_KEY, record);
        window.dispatchEvent(new CustomEvent('wura:last-order', { detail: { orderId: order.orderId } }));
      }

      dispatch({ type: 'CLEAR' });
      setFeedback({ status: 'sent', orderId: order.orderId });
      router.push(`/order/${order.orderId}`);
    } catch (err) {
      console.error(err);
      const message = err instanceof Error ? err.message : 'Something went wrong. Please try again.';
      setError(message);
      setFeedback({ status: 'error', message });
    } finally {
      setSubmitting(false);
    }
  };

  const clearCart = () => dispatch({ type: 'CLEAR' });

  return (
    <Section className="bg-wura-black/5">
      <Container className="space-y-10 py-16">
        <div className="space-y-4 text-center md:text-left">
          <p className="text-xs uppercase tracking-[0.3em] text-wura-black/60">House of Wura Cart</p>
          <h1 className="font-display text-4xl text-wura-black md:text-5xl">Review &amp; Checkout</h1>
          <p className="max-w-2xl text-sm text-wura-black/70">
            We confirm bespoke pricing, fittings, and delivery timelines over WhatsApp once your order comes through. Share your
            preferred contact so our concierge team can respond quickly.
          </p>
          <p className="text-[0.65rem] uppercase tracking-[0.3em] text-wura-black/50" aria-live="polite">
            Cart ({count}) · Displayed subtotal: {formatCurrency(subtotal)}
          </p>
        </div>

        <div className="grid gap-10 lg:grid-cols-[2fr_1fr]">
          <div className="space-y-6">
            {state.items.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-wura-black/20 bg-white/70 p-10 text-center text-sm text-wura-black/70">
                Your cart is empty. Return to the{' '}
                <Link href="/shop" className="font-semibold text-wura-black underline-offset-4 hover:underline">
                  shop
                </Link>{' '}
                to curate your pieces.
              </div>
            ) : (
              <ul className="space-y-4">
                {state.items.map((item) => (
                  <li
                    key={[item.sku, item.color ?? '', item.size ?? ''].join('::')}
                    className="flex flex-col gap-4 rounded-3xl border border-wura-black/10 bg-white/80 p-5 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="space-y-2 text-sm text-wura-black/80">
                      <div>
                        <p className="font-semibold text-wura-black">{item.title}</p>
                        <p className="text-xs uppercase tracking-[0.3em] text-wura-black/50">SKU: {item.sku}</p>
                      </div>
                      <div className="flex flex-wrap gap-3 text-xs uppercase tracking-[0.3em] text-wura-black/60">
                        {item.color && <span>Color: {item.color}</span>}
                        {item.size && <span>Size: {item.size}</span>}
                      </div>
                      <p className="text-xs text-wura-black/60">
                        Display price: {item.priceFrom ? formatCurrency(item.priceFrom) : 'To be confirmed'}
                      </p>
                    </div>
                    <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end">
                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          aria-label={`Decrease quantity of ${item.title}`}
                          onClick={() => dispatch({ type: 'DECREMENT', payload: { sku: item.sku, color: item.color, size: item.size } })}
                          className="h-8 w-8 rounded-full border-wura-black/15"
                        >
                          <Minus className="h-3 w-3" aria-hidden />
                        </Button>
                        <span className="min-w-[2rem] text-center text-sm font-semibold">{item.qty}</span>
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          aria-label={`Increase quantity of ${item.title}`}
                          onClick={() => dispatch({ type: 'INCREMENT', payload: { sku: item.sku, color: item.color, size: item.size } })}
                          className="h-8 w-8 rounded-full border-wura-black/15"
                        >
                          <Plus className="h-3 w-3" aria-hidden />
                        </Button>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-wura-black/60 hover:text-wura-black"
                        onClick={() => dispatch({ type: 'REMOVE_ITEM', payload: { sku: item.sku, color: item.color, size: item.size } })}
                      >
                        <Trash2 className="h-3 w-3" aria-hidden /> Remove
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
            {state.items.length > 0 && (
              <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-wura-black/10 bg-white/80 p-5 text-sm text-wura-black">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-wura-black/50">Displayed subtotal</p>
                  <p className="text-xl font-semibold text-wura-black">{formatCurrency(subtotal)}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Button variant="ghost" className="text-xs uppercase tracking-[0.3em] text-wura-black/60 hover:text-wura-black" onClick={clearCart}>
                    Clear cart
                  </Button>
                  <Link href="/shop" className="text-xs uppercase tracking-[0.3em] text-wura-gold hover:text-wura-gold/80">
                    Continue shopping
                  </Link>
                </div>
              </div>
            )}
          </div>

          <form className="space-y-6 rounded-3xl border border-wura-black/10 bg-white/90 p-6" onSubmit={onSubmit}>
            <div className="space-y-2">
              <h2 className="font-display text-2xl text-wura-black">Your details</h2>
              <p className="text-xs uppercase tracking-[0.3em] text-wura-black/50">
                Provide at least one contact so Flora can confirm your order personally.
              </p>
            </div>

            <fieldset className="space-y-3">
              <legend className="text-xs font-semibold uppercase tracking-[0.3em] text-wura-black/60">Preferred channel</legend>
              <div className="flex flex-wrap gap-3" role="radiogroup" aria-label="Preferred contact method">
                <Button
                  type="button"
                  variant={prefer === 'whatsapp' ? 'default' : 'outline'}
                  className={`flex-1 rounded-full ${prefer === 'whatsapp' ? '' : 'border-wura-black/15 text-wura-black/70 hover:border-wura-gold/50'}`}
                  onClick={() => setPrefer('whatsapp')}
                  aria-pressed={prefer === 'whatsapp'}
                >
                  WhatsApp
                </Button>
                <Button
                  type="button"
                  variant={prefer === 'email' ? 'default' : 'outline'}
                  className={`flex-1 rounded-full ${prefer === 'email' ? '' : 'border-wura-black/15 text-wura-black/70 hover:border-wura-gold/50'}`}
                  onClick={() => setPrefer('email')}
                  aria-pressed={prefer === 'email'}
                >
                  Email
                </Button>
              </div>
            </fieldset>

            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="whatsapp" className="text-xs uppercase tracking-[0.3em] text-wura-black/60">
                  WhatsApp number
                </label>
                <Input
                  id="whatsapp"
                  type="tel"
                  inputMode="tel"
                  placeholder="234 906 029 4599"
                  value={whatsappNumber}
                  onChange={(event) => setWhatsappNumber(event.target.value)}
                  aria-describedby="whatsapp-helper"
                />
                <p id="whatsapp-helper" className="text-xs text-wura-black/50">
                  Include country code; we will format it for WhatsApp automatically.
                </p>
              </div>
              <div className="space-y-2">
                <label htmlFor="email" className="text-xs uppercase tracking-[0.3em] text-wura-black/60">
                  Email (optional)
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  autoComplete="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="notes" className="text-xs uppercase tracking-[0.3em] text-wura-black/60">
                  Notes for the concierge
                </label>
                <Textarea
                  id="notes"
                  rows={4}
                  placeholder="Share fit preferences, delivery windows, or inspiration references."
                  value={notes}
                  onChange={(event) => setNotes(event.target.value)}
                />
              </div>
            </div>

            {error && (
              <p className="rounded-3xl border border-wura-wine/40 bg-wura-wine/10 p-4 text-sm text-wura-wine" role="alert">
                {error}
              </p>
            )}

            {feedback.status === 'sent' && (
              <p className="rounded-3xl border border-wura-gold/40 bg-wura-gold/10 p-4 text-sm text-wura-black" role="status">
                WhatsApp opened in a new tab. You can manage proof uploads on the{' '}
                <Link href={`/order/${feedback.orderId}`} className="underline">
                  order page
                </Link>
                .
              </p>
            )}

            {feedback.status === 'error' && (
              <p className="rounded-3xl border border-wura-wine/40 bg-wura-wine/10 p-4 text-sm text-wura-wine" role="status">
                {feedback.message}
              </p>
            )}

            <div className="flex flex-col gap-3">
              <Button type="submit" className="w-full" disabled={state.items.length === 0 || submitting || !hasContact}>
                {submitting ? 'Preparing order…' : 'Checkout via WhatsApp'}
              </Button>
              <Button
                type="button"
                variant="ghost"
                className="w-full text-xs font-semibold uppercase tracking-[0.3em] text-wura-black/60 hover:text-wura-black"
                onClick={clearCart}
              >
                Clear cart
              </Button>
            </div>

            <p className="text-[0.65rem] leading-relaxed text-wura-black/50">
              Displayed totals are indicative. Flora will confirm bespoke pricing, fittings, and delivery timing with you on WhatsApp.
            </p>
          </form>
        </div>
      </Container>
    </Section>
  );
}
