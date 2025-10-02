export const runtime = 'edge';
import { NextResponse } from 'next/server';
import { put } from '@vercel/blob';

import { fetchOrder } from '@/lib/orders/storage';

export async function GET(_: Request, { params }: { params: { orderId: string } }) {
  try {
    const order = await fetchOrder(params.orderId);
    return NextResponse.json({ ok: true, order });
  } catch {
    return NextResponse.json({ ok: false, error: 'NOT_FOUND' }, { status: 404 });
  }
}

export async function PATCH(req: Request, { params }: { params: { orderId: string } }) {
  try {
    const existing = await fetchOrder(params.orderId);
    const patch = await req.json();

    if (patch.status === 'CONFIRMED') existing.confirmedAt = Date.now();
    if (patch.status === 'REJECTED') {
      existing.rejectedAt = Date.now();
      existing.rejectReason = patch.rejectReason || '';
    }
    if (patch.status) existing.status = patch.status;
    if (patch.notes !== undefined) existing.notes = patch.notes;

    await put(`orders/${params.orderId}.json`, JSON.stringify(existing, null, 2), {
      access: 'private',
      contentType: 'application/json'
    });
    return NextResponse.json({ ok: true, order: existing });
  } catch (e: any) {
    if (process.env.DEBUG_WURA === 'true') console.error('PATCH /api/orders', e);
    return NextResponse.json({ ok: false, error: 'PATCH_FAILED' }, { status: 500 });
  }
}
