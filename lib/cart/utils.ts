import type { CartItem } from '@/lib/cart/types';

export function sumDisplaySubtotal(items: CartItem[]) {
  return items.reduce((acc, it) => acc + (it.priceFrom || 0) * (it.qty || 1), 0);
}

export function countCartItems(items: CartItem[]) {
  return items.reduce((acc, item) => acc + (item.qty || 0), 0);
}
