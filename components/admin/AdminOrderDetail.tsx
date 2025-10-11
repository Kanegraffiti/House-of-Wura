'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { AlertTriangle, CheckCircle2, Loader2, RefreshCcw } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { formatCurrency, formatDateTime } from '@/lib/format';
import { normalizePhone } from '@/lib/wa';
import type { OrderType } from '@/lib/orders/schema';

type FetchState = 'idle' | 'loading' | 'error' | 'ready';

function buildWhatsAppUrl(number?: string | null, message?: string) {
  if (!number) return null;
  const digits = normalizePhone(number);
  if (!digits) return null;
  const text = encodeURIComponent(message || 'Hello Flora!');
  return `https://wa.me/${digits}?text=${text}`;
}

interface AdminOrderDetailProps {
  orderId: string;
}

export function AdminOrderDetail({ orderId }: AdminOrderDetailProps) {
  const router = useRouter();
  const [order, setOrder] = useState<OrderType | null>(null);
  const [state, setState] = useState<FetchState>('loading');
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);

  const fetchOrder = async () => {
    setState('loading');
    setError(null);
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'GET',
        credentials: 'include',
        cache: 'no-store'
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error || 'Unable to load order');
      }
      setOrder(data.order);
      setState('ready');
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'Failed to load order');
      setState('error');
    }
  };

  useEffect(() => {
    fetchOrder();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId]);

  const updateOrder = async (payload: Partial<OrderType>) => {
    setUpdating(true);
    setError(null);
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error || 'Failed to update order');
      }
      setOrder(data.order);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to update order');
    } finally {
      setUpdating(false);
    }
  };

  if (state === 'loading') {
    return (
      <div className="flex items-center gap-2 rounded-3xl border border-dashed border-wura-black/20 bg-white/80 p-6 text-sm text-wura-black/70">
        <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> Loading order…
      </div>
    );
  }

  if (state === 'error' || !order) {
    return (
      <div className="space-y-4 rounded-3xl border border-wura-wine/40 bg-wura-wine/10 p-6">
        <p className="text-sm text-wura-wine">{error || 'Order not found.'}</p>
        <Button type="button" variant="outline" onClick={fetchOrder} className="gap-2 border-wura-gold">
          <RefreshCcw className="h-4 w-4" aria-hidden /> Retry
        </Button>
      </div>
    );
  }

  const confirmMessage = `Hello! Your House of Wura order (${order.orderId}) is confirmed. We will share pricing and delivery details shortly.`;
  const rejectMessage = `Hello! We could not verify payment for House of Wura order ${order.orderId}. ${order.rejectReason ? `Reason: ${order.rejectReason}.` : ''} Please resend proof or contact us.`;
  const reminderMessage = `Hello! Could you resend the payment proof for House of Wura order ${order.orderId}?`;
  const confirmLink = buildWhatsAppUrl(order.whatsapp, confirmMessage);
  const rejectLink = buildWhatsAppUrl(order.whatsapp, rejectMessage);
  const reminderLink = buildWhatsAppUrl(order.whatsapp, reminderMessage);

  const handleConfirm = () => updateOrder({ status: 'CONFIRMED' });
  const handleProofReceived = () => updateOrder({ status: 'PROOF_SUBMITTED' });
  const handleRequestProof = () => updateOrder({ status: 'PENDING', rejectReason: '' });
  const handleReject = () => {
    const reason = window.prompt('Share a quick reason to include in the rejection message:', order.rejectReason || '');
    if (reason === null) return;
    updateOrder({ status: 'REJECTED', rejectReason: reason });
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-2 border-b border-wura-black/10 pb-4">
        <h1 className="font-display text-3xl text-wura-black">Order {order.orderId}</h1>
        <p className="text-sm text-wura-black/60">
          Status: <span className="font-semibold text-wura-black">{order.status.replace('_', ' ')}</span>
        </p>
        <p className="text-xs uppercase tracking-[0.3em] text-wura-black/50">Created {formatDateTime(order.createdAt)}</p>
        {error && <p className="text-sm text-wura-wine">{error}</p>}
      </header>

      <section className="grid gap-3 rounded-3xl border border-wura-black/10 bg-white/90 p-6 shadow-sm md:grid-cols-2">
        <div className="space-y-2">
          <h2 className="text-sm font-semibold uppercase tracking-[0.3em] text-wura-black">Customer</h2>
          <p className="text-sm text-wura-black/70">WhatsApp: {order.whatsapp ? `+${order.whatsapp}` : 'Not provided'}</p>
          <p className="text-sm text-wura-black/70">Email: {order.email || 'Not provided'}</p>
        </div>
        <div className="space-y-2">
          <h2 className="text-sm font-semibold uppercase tracking-[0.3em] text-wura-black">Timeline</h2>
          {Array.isArray(order.proofs) && order.proofs.length > 0 && (
            <p className="text-sm text-wura-black/70">
              Proof submitted: {formatDateTime(order.proofs[order.proofs.length - 1].uploadedAt)}
            </p>
          )}
          {order.confirmedAt && <p className="text-sm text-green-700">Confirmed: {formatDateTime(order.confirmedAt)}</p>}
          {order.rejectedAt && <p className="text-sm text-wura-wine">Rejected: {formatDateTime(order.rejectedAt)}</p>}
          {!order.proofs?.length && <p className="text-sm text-wura-black/50">Awaiting proof upload</p>}
        </div>
      </section>

      <section className="space-y-3 rounded-3xl border border-wura-black/10 bg-white/90 p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-wura-black">Items</h2>
        <ul className="space-y-2 text-sm text-wura-black/80">
          {order.items.map((item, index) => (
            <li key={`${item.sku}-${index}`}>
              <span className="font-semibold text-wura-black">{item.title}</span> · SKU {item.sku} · Qty {item.qty}
              {item.color ? ` · ${item.color}` : ''}
              {item.size ? ` · ${item.size}` : ''}
              {item.priceFrom ? ` · ${formatCurrency(item.priceFrom)}` : ''}
            </li>
          ))}
        </ul>
        <p className="text-sm text-wura-black/60">Displayed subtotal: {formatCurrency(order.subtotal || 0)}</p>
        {order.note && (
          <p className="rounded-2xl bg-wura-black/5 p-3 text-sm text-wura-black/80">Customer notes: {order.note}</p>
        )}
      </section>

      <section className="space-y-3 rounded-3xl border border-wura-black/10 bg-white/90 p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-wura-black">Payment proof</h2>
        {order.proofs?.length ? (
          <ul className="grid gap-3 sm:grid-cols-2">
            {order.proofs.map((proof) => (
              <li key={proof.url} className="flex items-center justify-between rounded-2xl border border-wura-black/10 bg-white/80 p-4">
                <div className="text-sm text-wura-black/70">
                  <p className="font-medium text-wura-black">Proof file</p>
                  <p className="text-xs text-wura-black/50">{new URL(proof.url).pathname.split('/').pop()}</p>
                  <p className="text-xs text-wura-black/50">Uploaded {formatDateTime(proof.uploadedAt)}</p>
                </div>
                <Link
                  href={proof.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-semibold uppercase tracking-[0.3em] text-wura-gold hover:text-wura-gold/80"
                >
                  View
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="flex items-center gap-2 text-sm text-wura-black/60">
            <AlertTriangle className="h-4 w-4 text-wura-wine" aria-hidden /> No proof uploaded yet.
          </p>
        )}
      </section>

      <section className="space-y-3 rounded-3xl border border-wura-black/10 bg-white/90 p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-wura-black">Actions</h2>
        <div className="flex flex-wrap gap-3">
          <Button type="button" onClick={handleConfirm} disabled={updating} className="gap-2 bg-wura-black text-white hover:bg-wura-black/90">
            <CheckCircle2 className="h-4 w-4" aria-hidden /> Confirm payment
          </Button>
          <Button type="button" variant="outline" onClick={handleProofReceived} disabled={updating} className="gap-2 border-wura-gold">
            Mark proof received
          </Button>
          <Button type="button" variant="outline" onClick={handleRequestProof} disabled={updating} className="gap-2 border-wura-black/20 text-wura-black/70">
            Request new proof
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={handleReject}
            disabled={updating}
            className="gap-2 bg-wura-wine text-white hover:bg-wura-wine/90"
          >
            Reject order
          </Button>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          {confirmLink && (
            <Link
              href={confirmLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-full border border-wura-gold px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-wura-black hover:border-wura-black"
            >
              WhatsApp confirmation
            </Link>
          )}
          {reminderLink && (
            <Link
              href={reminderLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-full border border-wura-black/20 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-wura-black/70 hover:border-wura-black/40"
            >
              Request proof on WhatsApp
            </Link>
          )}
          {rejectLink && (
            <Link
              href={rejectLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-full border border-wura-wine px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-wura-wine hover:border-wura-wine/80"
            >
              Send rejection note
            </Link>
          )}
        </div>
      </section>
    </div>
  );
}
