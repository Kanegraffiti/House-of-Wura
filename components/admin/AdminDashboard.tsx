'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { Loader2, RefreshCcw } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { formatCurrency, formatDateTime } from '@/lib/format';

type OrderSummary = {
  orderId: string;
  status: 'PENDING' | 'PROOF_SUBMITTED' | 'CONFIRMED' | 'REJECTED';
  createdAt: number;
  customer: {
    prefer: 'whatsapp' | 'email';
    whatsappNumber?: string;
    email?: string;
  };
  displayedSubtotal: number;
  notes?: string;
};

type FetchState = 'idle' | 'loading' | 'error' | 'success';

const STATUS_OPTIONS = [
  { value: 'ALL', label: 'All statuses' },
  { value: 'PENDING', label: 'Pending' },
  { value: 'PROOF_SUBMITTED', label: 'Proof submitted' },
  { value: 'CONFIRMED', label: 'Confirmed' },
  { value: 'REJECTED', label: 'Rejected' }
] as const;

export function AdminDashboard() {
  const [orders, setOrders] = useState<OrderSummary[]>([]);
  const [statusFilter, setStatusFilter] = useState<(typeof STATUS_OPTIONS)[number]['value']>('ALL');
  const [query, setQuery] = useState('');
  const [state, setState] = useState<FetchState>('idle');
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = async () => {
    setState('loading');
    setError(null);
    try {
      const params = new URLSearchParams();
      if (statusFilter !== 'ALL') params.set('status', statusFilter);
      if (query.trim()) params.set('q', query.trim());
      const response = await fetch(`/api/orders?${params.toString()}`, {
        method: 'GET',
        credentials: 'include',
        cache: 'no-store'
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error || 'Unable to load orders');
      }
      setOrders(data.items ?? []);
      setState('success');
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'Unexpected error');
      setState('error');
    }
  };

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  const filteredOrders = useMemo(() => {
    if (!query.trim()) return orders;
    const needle = query.trim().toLowerCase();
    return orders.filter((order) => {
      const haystack = [
        order.orderId,
        order.customer.whatsappNumber ?? '',
        order.customer.email ?? '',
        order.notes ?? ''
      ]
        .join(' ')
        .toLowerCase();
      return haystack.includes(needle);
    });
  }, [orders, query]);

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 border-b border-wura-black/10 pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-3xl text-wura-black">Orders dashboard</h1>
          <p className="text-sm text-wura-black/60">Review new WhatsApp checkouts and manage payment proofs.</p>
        </div>
        <Button type="button" variant="outline" className="gap-2 border-wura-gold" onClick={fetchOrders}>
          <RefreshCcw className="h-4 w-4" aria-hidden /> Refresh
        </Button>
      </header>

      <div className="grid gap-4 rounded-3xl border border-wura-black/10 bg-white/90 p-4 shadow-sm sm:grid-cols-[200px_1fr]">
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-[0.3em] text-wura-black/60">Status</label>
          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value as (typeof STATUS_OPTIONS)[number]['value'])}
            className="w-full rounded-full border border-wura-black/15 bg-white px-4 py-2 text-sm text-wura-black focus:border-wura-gold focus:outline-none focus:ring-2 focus:ring-wura-gold"
          >
            {STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-[0.3em] text-wura-black/60">Search</label>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Input
              placeholder="Search by order ID, contact, SKU, or notes"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  event.preventDefault();
                  fetchOrders();
                }
              }}
            />
            <Button type="button" variant="outline" onClick={fetchOrders} className="sm:w-36">
              Apply
            </Button>
          </div>
        </div>
      </div>

      {state === 'loading' && (
        <div className="flex items-center gap-2 rounded-3xl border border-dashed border-wura-black/20 bg-white/80 p-6 text-sm text-wura-black/70">
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> Loading orders…
        </div>
      )}

      {state === 'error' && error && (
        <div className="rounded-3xl border border-wura-wine/40 bg-wura-wine/10 p-4 text-sm text-wura-wine">
          {error}
        </div>
      )}

      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-wura-black">{filteredOrders.length} orders</h2>
        {filteredOrders.length === 0 ? (
          <p className="text-sm text-wura-black/60">No orders matched your filters.</p>
        ) : (
          <ul className="space-y-3">
            {filteredOrders.map((order) => (
              <li key={order.orderId} className="rounded-3xl border border-wura-black/10 bg-white/90 p-4 shadow-sm">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <Link
                      href={`/admin/orders/${order.orderId}`}
                      className="text-lg font-semibold text-wura-black underline-offset-4 hover:underline"
                    >
                      {order.orderId}
                    </Link>
                    <p className="text-xs uppercase tracking-[0.3em] text-wura-black/50">
                      {order.status.replace('_', ' ')} · {formatDateTime(order.createdAt)}
                    </p>
                  </div>
                  <div className="text-sm text-wura-black/60">
                    <p>{order.customer.whatsappNumber || 'No WhatsApp provided'}</p>
                    <p>{order.customer.email || 'No email provided'}</p>
                  </div>
                  <div className="text-sm font-medium text-wura-black">
                    {formatCurrency(order.displayedSubtotal ?? 0)}
                  </div>
                </div>
                {order.notes && (
                  <p className="mt-3 rounded-2xl bg-wura-black/5 p-3 text-xs text-wura-black/70">Notes: {order.notes}</p>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
