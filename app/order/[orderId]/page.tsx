import Link from 'next/link';

import ProofUploader from '@/components/site/ProofUploader';
import { getJson } from '@/lib/blob';
import { formatCurrency, formatDateTime, formatWhatsappDisplay } from '@/lib/format';
import { waLink } from '@/lib/wa';
import type { OrderType } from '@/lib/orders/schema';

export const revalidate = 0;

async function fetchOrder(orderId: string) {
  const data = await getJson<OrderType>(`orders/${orderId}.json`);
  return data;
}

function statusLabel(status: OrderType['status']) {
  switch (status) {
    case 'PENDING':
      return 'Awaiting proof';
    case 'PROOF_SUBMITTED':
      return 'Proof submitted';
    case 'CONFIRMED':
      return 'Payment confirmed';
    case 'REJECTED':
      return 'Additional action needed';
    default:
      return status;
  }
}

export default async function OrderProofPage({ params }: { params: { orderId: string } }) {
  const order = await fetchOrder(params.orderId);
  if (!order) {
    return (
      <div className="container mx-auto max-w-3xl space-y-4 py-16">
        <h1 className="font-display text-3xl text-wura-black">Order not found</h1>
        <p className="text-sm text-wura-black/70">
          We could not locate that order. Double-check the link from checkout or contact Flora directly on WhatsApp with your
          receipt and Order ID.
        </p>
        <Link
          href={waLink('Hello Flora, I need help locating my House of Wura order.')}
          className="inline-flex w-full items-center justify-center rounded-full bg-wura-black px-6 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-white hover:bg-wura-black/90 md:w-auto"
        >
          Chat with Flora on WhatsApp
        </Link>
      </div>
    );
  }

  const whatsappHint = order.customer.whatsappNumber
    ? formatWhatsappDisplay(order.customer.whatsappNumber)
    : null;
  const contactSummary = [
    whatsappHint ? `WhatsApp: ${whatsappHint}` : null,
    order.customer.email ? `Email: ${order.customer.email}` : null
  ]
    .filter(Boolean)
    .join(' · ');
  const chatMessage = `Hello Flora! This is regarding order ${order.orderId}.`;

  return (
    <div className="container mx-auto max-w-4xl space-y-8 py-16">
      <div className="space-y-3">
        <p className="text-xs uppercase tracking-[0.3em] text-wura-black/60">House of Wura order</p>
        <h1 className="font-display text-3xl text-wura-black md:text-4xl">Order {order.orderId}</h1>
        <p className="text-sm text-wura-black/70">
          Placed {formatDateTime(order.createdAt)} · {statusLabel(order.status)}
        </p>
        {contactSummary && <p className="text-sm text-wura-black/60">Preferred contact: {contactSummary}</p>}
        {order.notes && (
          <p className="rounded-2xl border border-wura-black/10 bg-wura-black/5 p-4 text-sm text-wura-black/80">
            <span className="font-semibold">Notes:</span> {order.notes}
          </p>
        )}
      </div>

      <div className="rounded-3xl border border-wura-black/15 bg-white/90 p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-wura-black">Step 1 — Upload payment proof</h2>
        <p className="mt-2 text-sm text-wura-black/70">
          Share a clear screenshot, bank transfer receipt, or PDF below. Mention your Order ID if you speak with our concierge so
          we can match the payment quickly.
        </p>
        <div className="mt-6">
          <ProofUploader orderId={order.orderId} reference={order.proof?.reference} />
        </div>
      </div>

      <div className="rounded-3xl border border-wura-black/15 bg-white/90 p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-wura-black">Step 2 — Let Flora know</h2>
        <p className="mt-2 text-sm text-wura-black/70">
          Tap below to open WhatsApp with your Order ID ready to go. Share any extra details about your transfer so we can confirm
          your look without delay.
        </p>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <Link
            href={waLink(`Order ${order.orderId}: I just uploaded payment proof.`)}
            className="inline-flex w-full items-center justify-center rounded-full bg-wura-black px-6 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-white hover:bg-wura-black/90"
            target="_blank"
            rel="noopener noreferrer"
          >
            Chat on WhatsApp about Order {order.orderId}
          </Link>
          <Link
            href={waLink(chatMessage)}
            className="inline-flex w-full items-center justify-center rounded-full border border-wura-gold px-6 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-wura-black hover:border-wura-black"
            target="_blank"
            rel="noopener noreferrer"
          >
            Ask a question
          </Link>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-wura-black">Order summary</h2>
        <ul className="grid gap-3 rounded-3xl border border-wura-black/10 bg-white/80 p-4">
          {order.items.map((item, index) => (
            <li key={`${item.sku}-${index}`} className="text-sm text-wura-black/80">
              <span className="font-semibold text-wura-black">{item.title}</span> · SKU {item.sku} · Qty {item.qty}
              {item.color ? ` · ${item.color}` : ''}
              {item.size ? ` · ${item.size}` : ''}
              {item.priceFrom ? ` · ${formatCurrency(item.priceFrom)}` : ''}
            </li>
          ))}
        </ul>
        <p className="text-sm text-wura-black/70">
          Displayed subtotal: {formatCurrency(order.displayedSubtotal || 0)} (final pricing confirmed privately with Flora).
        </p>
      </div>

      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-wura-black">Submitted proofs</h2>
        {order.proof?.urls?.length ? (
          <ul className="grid gap-4 sm:grid-cols-2">
            {order.proof.urls.map((url) => (
              <li key={url} className="flex items-center justify-between rounded-2xl border border-wura-black/10 bg-white/90 p-4">
                <div className="flex flex-col text-sm text-wura-black/70">
                  <span className="font-medium text-wura-black">Uploaded file</span>
                  <span>{new URL(url).pathname.split('/').pop()}</span>
                  {order.proof?.submittedAt && (
                    <span className="text-xs text-wura-black/50">Submitted {formatDateTime(order.proof.submittedAt)}</span>
                  )}
                </div>
                <Link
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-semibold uppercase tracking-[0.3em] text-wura-gold hover:text-wura-gold/80"
                >
                  View
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-wura-black/60">No proof uploaded yet. Once you submit, the concierge team will review it promptly.</p>
        )}
        {order.proof?.reference && (
          <p className="text-xs text-wura-black/60">Bank reference noted: {order.proof.reference}</p>
        )}
      </div>
    </div>
  );
}
