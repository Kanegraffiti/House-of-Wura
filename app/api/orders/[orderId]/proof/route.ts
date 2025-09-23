import { NextRequest, NextResponse } from 'next/server';

import { appendProofFile, getJson, putJson } from '@/lib/blob';
import type { OrderType } from '@/lib/orders/schema';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['application/pdf'];

function isAllowedType(type: string) {
  return type.startsWith('image/') || ALLOWED_TYPES.includes(type);
}

export async function POST(req: NextRequest, { params }: { params: { orderId: string } }) {
  const form = await req.formData();
  const file = form.get('file');
  const reference = (form.get('reference') as string | null) || '';

  if (!(file instanceof File)) {
    return NextResponse.json({ ok: false, error: 'No file attached' }, { status: 400 });
  }

  if (!isAllowedType(file.type)) {
    return NextResponse.json({ ok: false, error: 'Unsupported file type' }, { status: 400 });
  }

  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json({ ok: false, error: 'File must be under 5MB' }, { status: 400 });
  }

  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
  const key = `proofs/${params.orderId}/${Date.now()}_${safeName}`;

  try {
    const uploadResult = await appendProofFile(key, file);
    const order = await getJson<OrderType>(`orders/${params.orderId}.json`);

    if (!order) {
      return NextResponse.json({ ok: false, error: 'Order not found' }, { status: 404 });
    }

    order.proof = order.proof || { urls: [] };
    order.proof.urls = [...(order.proof.urls || []), uploadResult.url];
    if (reference.trim()) {
      order.proof.reference = reference.trim();
    }
    order.proof.submittedAt = Date.now();
    if (order.status !== 'CONFIRMED') {
      order.status = 'PROOF_SUBMITTED';
    }

    await putJson(`orders/${params.orderId}.json`, order);

    return NextResponse.json({ ok: true, url: uploadResult.url });
  } catch (error) {
    console.error('Failed to store proof', error);
    return NextResponse.json({ ok: false, error: 'Unable to upload proof at this time' }, { status: 500 });
  }
}
