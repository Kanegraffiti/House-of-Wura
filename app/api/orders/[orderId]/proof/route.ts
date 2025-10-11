export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { get, put } from '@vercel/blob';

const MAX_FILE_SIZE = 5 * 1024 * 1024;

export async function POST(req: Request, { params }: { params: { orderId: string } }) {
  try {
    const form = await req.formData();
    const file = form.get('file') as File | null;
    if (!file) return NextResponse.json({ error: 'NO_FILE' }, { status: 400 });
    if (file.size > MAX_FILE_SIZE) return NextResponse.json({ error: 'FILE_TOO_LARGE' }, { status: 400 });

    const sanitizedName = (file.name || 'proof').replace(/\s+/g, '_');
    const key = `proofs/${params.orderId}/${Date.now()}_${sanitizedName}`;
    const upload = await put(key, file, { access: 'private' });

    let order: Record<string, any> | null = null;
    try {
      const current = await get(`orders/${params.orderId}.json`);
      const text = await current.blob().then((blob) => blob.text());
      order = JSON.parse(text);
    } catch {
      order = null;
    }

    if (!order) {
      return NextResponse.json({ error: 'ORDER_NOT_FOUND' }, { status: 404 });
    }

    const proofEntry = { url: upload.url, uploadedAt: Date.now() };
    const proofs = Array.isArray(order.proofs) ? [...order.proofs, proofEntry] : [proofEntry];

    const updated = {
      ...order,
      status: 'PROOF_SUBMITTED',
      proofs
    };

    await put(`orders/${params.orderId}.json`, JSON.stringify(updated), {
      access: 'private',
      contentType: 'application/json'
    });

    return NextResponse.json({ ok: true, url: upload.url });
  } catch (error) {
    if (process.env.DEBUG_WURA === 'true') console.error('POST /proof', error);
    return NextResponse.json({ error: 'PROOF_UPLOAD_FAILED' }, { status: 500 });
  }
}
