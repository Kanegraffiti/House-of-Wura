import type { CartItem } from '@/lib/cart/types';
import { formatCurrency } from '@/lib/format';

export function sumDisplaySubtotal(items: CartItem[]) {
  return items.reduce((acc, it) => acc + (it.priceFrom || 0) * (it.qty || 1), 0);
}

export function countCartItems(items: CartItem[]) {
  return items.reduce((acc, item) => acc + (item.qty || 0), 0);
}

export function describeCartLines(items: CartItem[]) {
  return items
    .map((item) => {
      const parts: string[] = [`• ${item.title} ×${item.qty}`];
      if (item.color) parts.push(`Colour: ${item.color}`);
      if (item.size) parts.push(`Size: ${item.size}`);
      if (item.priceFrom) parts.push(`From ${formatCurrency(item.priceFrom)}`);
      return parts.join(' | ');
    })
    .join('\n');
}
