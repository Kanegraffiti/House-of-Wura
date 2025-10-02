export const runtime = 'edge';

import { NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { ulid } from 'ulidx';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const orderId = `ow_${ulid()}`;
    const now = Date.now();
    const data = {
      orderId,
      createdAt: now,
      status: 'PENDING',
      proof: { urls: [] },
      ...body
    };
    await put(`orders/${orderId}.json`, JSON.stringify(data, null, 2), {
      access: 'public',
      contentType: 'application/json'
    });
    return NextResponse.json({ ok: true, orderId });
  } catch (e: any) {
    if (process.env.DEBUG_WURA === 'true') console.error('POST /api/orders', e);
    return NextResponse.json({ ok: false, error: 'ORDER_CREATE_FAILED' }, { status: 500 });
  }
}
