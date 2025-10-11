'use client';

import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Container } from '@/components/site/Container';
import { Section } from '@/components/site/Section';
import { countCartItems, describeCartLines, sumDisplaySubtotal } from '@/lib/cart/utils';
import { formatCurrency } from '@/lib/format';
import { normalizePhone, waLink } from '@/lib/wa';
import { useCart } from '@/providers/CartProvider';

const CONTACT_STORAGE_KEY = 'wura_checkout_contact';
const LAST_ORDER_KEY = 'wura_last_order';

export default function CartPage() {
  const { state, dispatch } = useCart();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [note, setNote] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const count = useMemo(() => countCartItems(state.items), [state.items]);
  const subtotal = useMemo(() => sumDisplaySubtotal(state.items), [state.items]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const raw = localStorage.getItem(CONTACT_STORAGE_KEY);
      if (!raw) return;
      const stored = JSON.parse(raw) as { email?: string; whatsapp?: string; note?: string };
      if (stored.email) setEmail(stored.email);
      if (stored.whatsapp) setWhatsapp(stored.whatsapp);
      if (stored.note) setNote(stored.note);
    } catch {
      // ignore parse errors
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const payload = JSON.stringify({ email, whatsapp, note });
    try {
      localStorage.setItem(CONTACT_STORAGE_KEY, payload);
    } catch {
      // ignore write failures
    }
  }, [email, whatsapp, note]);

  const handleQuantity = (id: string, mode: 'INC' | 'DEC') => {
    dispatch({ type: mode, id });
  };

  const removeItem = (id: string) => {
    dispatch({ type: 'DEL', id });
  };

  async function checkout() {
    if (submitting) return;
    setError(null);

    if (!state.items.length) {
      setError('Your cart is empty. Browse the collection to add looks.');
      return;
    }

    const trimmedEmail = email.trim();
    const cleanedWhatsapp = normalizePhone(whatsapp);
    const noteText = note.trim();
    const displayWhatsapp = cleanedWhatsapp ? `+${cleanedWhatsapp}` : '-';
    const payload = {
      items: state.items,
      email: trimmedEmail || null,
      whatsapp: cleanedWhatsapp || null,
      note: noteText || null
    };

    setSubmitting(true);
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

      const orderId = data.orderId as string;
      const lines = describeCartLines(state.items);
      const message = `New Order #${orderId}\n\nItems:\n${lines}\n\nNote: ${noteText || '-'}\nEmail: ${trimmedEmail || '-'}\nWhatsApp: ${displayWhatsapp}`;

      try {
        window.open(waLink(message), '_blank', 'noopener');
      } catch (err) {
        if (process.env.NODE_ENV !== 'production') {
          console.error('Failed to open WhatsApp', err);
        }
      }

      try {
        localStorage.setItem(LAST_ORDER_KEY, JSON.stringify({ orderId, createdAt: Date.now() }));
        window.dispatchEvent(new CustomEvent('wura:last-order', { detail: { orderId } }));
      } catch {
        // ignore storage errors
      }

      dispatch({ type: 'CLR' });
      router.push(`/order/${orderId}`);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Section className="bg-wura-black/5">
      <Container className="space-y-10 py-16">
        <header className="space-y-4 text-center md:text-left">
          <p className="text-xs uppercase tracking-[0.3em] text-wura-black/60">House of Wura Cart</p>
          <h1 className="font-display text-4xl text-wura-black md:text-5xl">Review &amp; Checkout</h1>
          <p className="max-w-2xl text-sm text-wura-black/70">
            Share your preferred contact details and complete checkout on WhatsApp with Flora.
          </p>
          <p className="text-[0.65rem] uppercase tracking-[0.3em] text-wura-black/50" aria-live="polite">
            Cart ({count}) · Displayed subtotal: {formatCurrency(subtotal)}
          </p>
        </header>

        {error && (
          <div className="rounded-3xl border border-wura-wine/40 bg-wura-wine/10 p-4 text-sm text-wura-wine" role="alert">
            {error}
          </div>
        )}

        <div className="grid gap-10 lg:grid-cols-[2fr_1fr]">
          <div className="space-y-4">
            {state.items.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-wura-black/20 bg-white/70 p-10 text-center text-sm text-wura-black/70">
                Your cart is empty. Explore the shop to curate your looks.
              </div>
            ) : (
              <ul className="space-y-4">
                {state.items.map((item) => (
                  <li
                    key={item.id}
                    className="flex flex-col gap-4 rounded-3xl border border-wura-black/10 bg-white/80 p-5 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="space-y-2 text-sm text-wura-black/80">
                      <p className="font-semibold text-wura-black">{item.title}</p>
                      <p className="text-xs uppercase tracking-[0.3em] text-wura-black/60">SKU: {item.sku}</p>
                      <div className="flex flex-wrap gap-2 text-[0.65rem] uppercase tracking-[0.3em] text-wura-black/60">
                        {item.color && <span>Colour: {item.color}</span>}
                        {item.size && <span>Size: {item.size}</span>}
                      </div>
                      <p className="text-sm font-medium text-wura-black/70">
                        From {item.priceFrom ? formatCurrency(item.priceFrom) : 'To be confirmed'}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <div className="flex items-center gap-2" aria-label={`Quantity for ${item.title}`}>
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          className="h-9 w-9 rounded-full border-wura-black/20"
                          onClick={() => handleQuantity(item.id, 'DEC')}
                        >
                          -
                        </Button>
                        <span className="min-w-[1.5rem] text-center font-semibold">{item.qty}</span>
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          className="h-9 w-9 rounded-full border-wura-black/20"
                          onClick={() => handleQuantity(item.id, 'INC')}
                        >
                          +
                        </Button>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        className="text-xs uppercase tracking-[0.3em] text-wura-wine"
                        onClick={() => removeItem(item.id)}
                      >
                        Remove
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <aside className="space-y-6 rounded-3xl border border-wura-black/10 bg-white/90 p-6 shadow-sm">
            <div className="space-y-2">
              <h2 className="text-lg font-semibold text-wura-black">Contact details</h2>
              <p className="text-sm text-wura-black/70">
                Flora will reach out via WhatsApp at +234 906 029 4599 or email {process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'floraadebisi1999@gmail.com'} to confirm your order.
              </p>
            </div>
            <Input
              type="email"
              placeholder="Email (optional)"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
            <Input
              type="tel"
              placeholder="WhatsApp number (optional)"
              value={whatsapp}
              onChange={(event) => setWhatsapp(event.target.value)}
            />
            <Textarea
              placeholder="Notes for Flora (measurements, delivery timing, etc.)"
              value={note}
              onChange={(event) => setNote(event.target.value)}
              className="min-h-[120px]"
            />
            <Button
              type="button"
              onClick={checkout}
              disabled={submitting || state.items.length === 0}
              className="w-full rounded-full bg-wura-black px-6 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-white hover:bg-wura-black/90"
            >
              {submitting ? 'Processing…' : 'Checkout via WhatsApp'}
            </Button>
            <p className="text-xs text-wura-black/60">
              We’ll save your cart and contact details on this device for a smoother next visit.
            </p>
          </aside>
        </div>
      </Container>
    </Section>
  );
}
