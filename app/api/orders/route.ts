import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

import { getJson, listByPrefix, putJson } from '@/lib/blob';
import { newOrderId } from '@/lib/ids';
import { Order, type OrderType } from '@/lib/orders/schema';
import { getAdminFromCookie } from '@/lib/auth';
import { normalizePhone } from '@/lib/wa';

const CreateOrderSchema = z.object({
  customer: z.object({
    prefer: z.enum(['whatsapp', 'email']),
    whatsappNumber: z.string().optional(),
    email: z.string().email().optional()
  }),
  notes: z.string().optional(),
  items: Order.shape.items,
  displayedSubtotal: z.number().nonnegative().optional()
});

const ListQuerySchema = z.object({
  status: z.enum(['PENDING', 'PROOF_SUBMITTED', 'CONFIRMED', 'REJECTED']).optional(),
  q: z.string().optional(),
  from: z.coerce.number().optional(),
  to: z.coerce.number().optional()
});

function sanitiseContact(input: { prefer: 'whatsapp' | 'email'; whatsappNumber?: string; email?: string }) {
  const phoneDigits = input.whatsappNumber ? normalizePhone(input.whatsappNumber) : '';
  const whatsappNumber = phoneDigits ? `+${phoneDigits}` : undefined;
  const email = input.email?.trim();
  return {
    prefer: input.prefer,
    whatsappNumber,
    email: email || undefined
  } satisfies OrderType['customer'];
}

export async function POST(req: NextRequest) {
  try {
    const raw = await req.json();
    const parsed = CreateOrderSchema.parse(raw);

    if (!parsed.items.length) {
      return NextResponse.json({ ok: false, error: 'Cannot create an empty order.' }, { status: 400 });
    }

    const orderId = newOrderId();
    const createdAt = Date.now();
    const order: OrderType = {
      orderId,
      createdAt,
      status: 'PENDING',
      customer: sanitiseContact(parsed.customer),
      notes: parsed.notes?.trim() || undefined,
      items: parsed.items,
      displayedSubtotal: parsed.displayedSubtotal ?? 0,
      proof: { urls: [] }
    };

    await putJson(`orders/${orderId}.json`, order);
    return NextResponse.json({ ok: true, orderId, order }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ ok: false, error: 'Invalid order payload', details: error.flatten() }, { status: 400 });
    }
    console.error('Failed to create order', error);
    return NextResponse.json({ ok: false, error: 'Unable to create order' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const cookies = req.headers.get('cookie');
  const admin = await getAdminFromCookie(cookies);
  if (!admin) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  }

  const url = new URL(req.url);
  const rawQuery = Object.fromEntries(url.searchParams.entries());
  let filters: z.infer<typeof ListQuerySchema>;
  try {
    filters = ListQuerySchema.parse(rawQuery);
  } catch (error) {
    return NextResponse.json({ ok: false, error: 'Invalid filters' }, { status: 400 });
  }

  const files = await listByPrefix('orders/');
  const items: OrderType[] = [];
  for (const file of files.blobs) {
    const order = await getJson<OrderType>(file.pathname);
    if (!order) continue;
    if (filters.status && order.status !== filters.status) continue;
    if (filters.from && order.createdAt < filters.from) continue;
    if (filters.to && order.createdAt > filters.to) continue;

    if (filters.q) {
      const needle = filters.q.toLowerCase();
      const haystack = [
        order.orderId,
        order.customer.whatsappNumber || '',
        order.customer.email || '',
        order.items.map((item) => `${item.sku} ${item.title}`).join(' ')
      ]
        .join(' ')
        .toLowerCase();
      if (!haystack.includes(needle)) continue;
    }

    items.push(order);
  }

  items.sort((a, b) => b.createdAt - a.createdAt);

  const summary = items.map((order) => ({
    orderId: order.orderId,
    status: order.status,
    createdAt: order.createdAt,
    customer: order.customer,
    displayedSubtotal: order.displayedSubtotal,
    proof: order.proof,
    notes: order.notes
  }));

  return NextResponse.json({ ok: true, items: summary });
}
