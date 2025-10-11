import { head } from '@vercel/blob';

import ProofForm from '@/components/site/ProofForm';
import { formatCurrency, formatDateTime } from '@/lib/format';
import { waLink } from '@/lib/wa';

export const revalidate = 0;

async function fetchOrder(orderId: string) {
  try {
    const token = process.env.BLOB_READ_WRITE_TOKEN;
    const { downloadUrl } = await head(`orders/${orderId}.json`, token ? { token } : undefined);
    const response = await fetch(downloadUrl);
    if (!response.ok) throw new Error('Failed to download order payload');
    const text = await response.text();
    return JSON.parse(text) as Record<string, any>;
  } catch {
    return null;
  }
}

export default async function OrderPage({ params }: { params: { orderId: string } }) {
  const order = await fetchOrder(params.orderId);

  if (!order) {
    const supportNumber = '+234 906 029 4599';
    return (
      <div className="container mx-auto max-w-3xl space-y-4 py-16 text-center">
        <h1 className="font-display text-3xl text-wura-black">Order not found</h1>
        <p className="text-sm text-wura-black/70">
          We couldn’t locate that order. Double-check your link or contact us on WhatsApp so we can assist you quickly.
        </p>
        <p className="rounded-2xl border border-wura-black/10 bg-wura-black/5 p-4 text-sm text-wura-black/80">
          Order ID: <span className="font-semibold">{params.orderId}</span>
        </p>
        <a
          href={waLink(`Hello! I need help locating order ${params.orderId}.`)}
          className="inline-flex items-center justify-center rounded-full bg-wura-black px-6 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-white hover:bg-wura-black/90"
          target="_blank"
          rel="noopener noreferrer"
        >
          Chat on WhatsApp ({supportNumber})
        </a>
      </div>
    );
  }

  const createdAt = typeof order.createdAt === 'number' ? formatDateTime(order.createdAt) : '';
  const subtotal = typeof order.subtotal === 'number' ? order.subtotal : 0;
  const whatsappDigits = order.whatsapp ? `+${order.whatsapp}` : 'Not provided';
  const email = order.email || 'Not provided';
  const proofs = Array.isArray(order.proofs) ? order.proofs : [];

  return (
    <div className="container mx-auto max-w-4xl space-y-8 py-16">
      <header className="space-y-3">
        <p className="text-xs uppercase tracking-[0.3em] text-wura-black/60">House of Wura order</p>
        <h1 className="font-display text-3xl text-wura-black md:text-4xl">Order {order.orderId}</h1>
        <p className="text-sm text-wura-black/70">Placed {createdAt || '—'} · Status: {order.status}</p>
        <p className="text-sm text-wura-black/60">WhatsApp: {whatsappDigits} · Email: {email}</p>
        {order.note && (
          <p className="rounded-2xl border border-wura-black/10 bg-wura-black/5 p-4 text-sm text-wura-black/80">
            <span className="font-semibold">Notes:</span> {order.note}
          </p>
        )}
      </header>

      <ProofForm orderId={params.orderId} />

      <section className="space-y-3 rounded-3xl border border-wura-black/10 bg-white/90 p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-wura-black">Order summary</h2>
        <ul className="space-y-2 text-sm text-wura-black/80">
          {order.items?.map((item: any, index: number) => (
            <li key={`${item.id}-${index}`}>
              <span className="font-semibold text-wura-black">{item.title}</span> · Qty {item.qty}
              {item.color ? ` · Colour: ${item.color}` : ''}
              {item.size ? ` · Size: ${item.size}` : ''}
              {item.priceFrom ? ` · From ${formatCurrency(item.priceFrom)}` : ''}
            </li>
          ))}
        </ul>
        <p className="text-sm text-wura-black/60">Displayed subtotal: {formatCurrency(subtotal)}</p>
      </section>

      <section className="space-y-3 rounded-3xl border border-wura-black/10 bg-white/90 p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-wura-black">Submitted proofs</h2>
        {proofs.length ? (
          <ul className="grid gap-3 sm:grid-cols-2">
            {proofs.map((proof) => (
              <li key={proof.url} className="flex items-center justify-between rounded-2xl border border-wura-black/10 bg-white/80 p-4">
                <div className="text-sm text-wura-black/70">
                  <p className="font-medium text-wura-black">Proof file</p>
                  <p className="text-xs text-wura-black/50">{new URL(proof.url).pathname.split('/').pop()}</p>
                </div>
                <a
                  href={proof.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-semibold uppercase tracking-[0.3em] text-wura-gold hover:text-wura-gold/80"
                >
                  View
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-wura-black/60">No proof uploaded yet.</p>
        )}
      </section>

      <section className="space-y-3 rounded-3xl border border-wura-black/10 bg-white/90 p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-wura-black">Need assistance?</h2>
        <p className="text-sm text-wura-black/70">
          Tap below to open WhatsApp with your order ID ready for Flora. Email support is also available at
          {' '}
          {process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'floraadebisi1999@gmail.com'}.
        </p>
        <a
          href={waLink(`Order ${order.orderId}: I just uploaded payment proof.`)}
          className="inline-flex w-full items-center justify-center rounded-full bg-wura-black px-6 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-white hover:bg-wura-black/90"
          target="_blank"
          rel="noopener noreferrer"
        >
          Message Flora on WhatsApp
        </a>
      </section>
    </div>
  );
}
