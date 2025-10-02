import { head } from '@vercel/blob';

import type { OrderType } from './schema';

const token = process.env.BLOB_READ_WRITE_TOKEN;

export async function fetchOrder(orderId: string): Promise<OrderType> {
  const meta = await head(`orders/${orderId}.json`, token ? { token } : undefined);
  const response = await fetch(meta.downloadUrl);
  if (!response.ok) {
    throw new Error(`Failed to fetch order ${orderId}: ${response.status} ${response.statusText}`);
  }
  return (await response.json()) as OrderType;
}
