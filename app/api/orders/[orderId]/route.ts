import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

import { getJson, putJson } from '@/lib/blob';
import type { OrderType } from '@/lib/orders/schema';
import { getAdminFromCookie } from '@/lib/auth';

const PatchSchema = z.object({
  status: z.enum(['PENDING', 'PROOF_SUBMITTED', 'CONFIRMED', 'REJECTED']).optional(),
  notes: z.string().optional(),
  rejectReason: z.string().optional(),
  proof: z
    .object({
      reference: z.string().optional()
    })
    .optional()
});

export async function GET(_req: NextRequest, { params }: { params: { orderId: string } }) {
  const order = await getJson<OrderType>(`orders/${params.orderId}.json`);
  if (!order) {
    return NextResponse.json({ ok: false, error: 'Not found' }, { status: 404 });
  }
  return NextResponse.json({ ok: true, order });
}

export async function PATCH(req: NextRequest, { params }: { params: { orderId: string } }) {
  const cookies = req.headers.get('cookie');
  const admin = await getAdminFromCookie(cookies);
  if (!admin) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  }

  let existing = await getJson<OrderType>(`orders/${params.orderId}.json`);
  if (!existing) {
    return NextResponse.json({ ok: false, error: 'Not found' }, { status: 404 });
  }

  let patch: z.infer<typeof PatchSchema>;
  try {
    const raw = await req.json();
    patch = PatchSchema.parse(raw);
  } catch (error) {
    return NextResponse.json({ ok: false, error: 'Invalid payload' }, { status: 400 });
  }

  if (patch.notes !== undefined) {
    existing.notes = patch.notes.trim() || undefined;
  }

  if (patch.proof?.reference !== undefined) {
    existing.proof = existing.proof || { urls: [] };
    existing.proof.reference = patch.proof.reference.trim() || undefined;
  }

  if (patch.rejectReason !== undefined) {
    existing.rejectReason = patch.rejectReason.trim() || undefined;
  }

  if (patch.status && patch.status !== existing.status) {
    existing.status = patch.status;
    if (patch.status === 'CONFIRMED') {
      existing.confirmedAt = Date.now();
      existing.rejectedAt = undefined;
      existing.rejectReason = undefined;
    } else if (patch.status === 'REJECTED') {
      existing.rejectedAt = Date.now();
      if (!existing.rejectReason) {
        existing.rejectReason = 'No reason provided';
      }
    } else {
      existing.confirmedAt = undefined;
      existing.rejectedAt = undefined;
      existing.rejectReason = patch.rejectReason?.trim() || undefined;
    }
  }

  await putJson(`orders/${params.orderId}.json`, existing);
  return NextResponse.json({ ok: true, order: existing });
}
