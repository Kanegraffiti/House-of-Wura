export const runtime = 'nodejs';
import { NextResponse } from 'next/server';
import { put } from '@vercel/blob';

import { fetchOrder } from '@/lib/orders/storage';

export async function POST(req: Request, { params }: { params: { orderId: string } }) {
  try {
    const form = await req.formData();
    const file = form.get('file') as File | null;
    const reference = (form.get('reference') as string) || '';
    if (!file) return NextResponse.json({ ok: false, error: 'NO_FILE' }, { status: 400 });
    if (file.size > 5 * 1024 * 1024) return NextResponse.json({ ok: false, error: 'TOO_LARGE' }, { status: 400 });

    const key = `proofs/${params.orderId}/${Date.now()}_${(file.name || 'proof').replace(/\s+/g, '_')}`;
    const up = await put(key, file, { access: 'public' });

    const o = await fetchOrder(params.orderId);
    o.status = 'PROOF_SUBMITTED';
    o.proof = o.proof || { urls: [] };
    o.proof.urls.push(up.url);
    if (reference) o.proof.reference = reference;
    o.proof.submittedAt = Date.now();

    await put(`orders/${params.orderId}.json`, JSON.stringify(o, null, 2), {
      access: 'public',
      contentType: 'application/json'
    });
    return NextResponse.json({ ok: true, url: up.url });
  } catch (e: any) {
    if (process.env.DEBUG_WURA === 'true') console.error('POST /proof', e);
    return NextResponse.json({ ok: false, error: 'PROOF_UPLOAD_FAILED' }, { status: 500 });
  }
}
