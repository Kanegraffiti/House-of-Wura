export const runtime = 'edge';

import { NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { ulid } from 'ulidx';

import type { CartItem } from '@/lib/cart/types';

function normalizeItems(raw: unknown): CartItem[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((item) => {
      if (!item || typeof item !== 'object') return null;
      const value = item as Partial<CartItem>;
      if (!value.sku || !value.title) return null;
      return {
        id: String(value.id || `${value.sku}`),
        sku: String(value.sku),
        title: String(value.title),
        priceFrom: value.priceFrom ? Number(value.priceFrom) : undefined,
        image: value.image ? String(value.image) : undefined,
        color: value.color ? String(value.color) : undefined,
        size: value.size ? String(value.size) : undefined,
        qty: Math.max(1, Number.parseInt(String(value.qty ?? 1), 10) || 1)
      } satisfies CartItem;
    })
    .filter((item): item is CartItem => Boolean(item));
}

function sumSubtotal(items: CartItem[]) {
  return items.reduce((total, item) => total + (item.priceFrom || 0) * (item.qty || 1), 0);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const orderId = `ow_${ulid()}`;
    const createdAt = Date.now();
    const items = normalizeItems(body?.items);
    const email = typeof body?.email === 'string' && body.email.trim() ? body.email.trim() : null;
    const whatsapp = typeof body?.whatsapp === 'string' && body.whatsapp.trim() ? body.whatsapp.trim() : null;
    const note = typeof body?.note === 'string' && body.note.trim() ? body.note.trim() : null;

    const order = {
      orderId,
      createdAt,
      status: 'PENDING' as const,
      items,
      email,
      whatsapp,
      note,
      subtotal: sumSubtotal(items)
    };

    await put(`orders/${orderId}.json`, JSON.stringify(order), {
      access: 'private',
      contentType: 'application/json'
    });

    return NextResponse.json({ orderId });
  } catch (error) {
    if (process.env.DEBUG_WURA === 'true') console.error('POST /api/orders', error);
    return NextResponse.json({ error: 'ORDER_CREATE_FAILED' }, { status: 500 });
  }
}
