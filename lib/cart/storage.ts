import type { CartItem, CartState } from './types';

const KEY = 'wura_cart';

const EMPTY_CART: CartState = { items: [] };

function isValidCartItem(value: unknown): value is CartItem {
  if (!value || typeof value !== 'object') return false;
  const item = value as Partial<CartItem>;
  if (!item.sku || typeof item.sku !== 'string') return false;
  if (!item.title || typeof item.title !== 'string') return false;
  const qty = Number(item.qty);
  if (!Number.isFinite(qty) || qty <= 0) return false;
  if (item.color !== undefined && typeof item.color !== 'string') return false;
  if (item.size !== undefined && typeof item.size !== 'string') return false;
  if (item.priceFrom !== undefined && typeof item.priceFrom !== 'number') return false;
  if (item.image !== undefined && typeof item.image !== 'string') return false;
  return true;
}

export function loadCart(): CartState {
  if (typeof window === 'undefined') return EMPTY_CART;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return EMPTY_CART;
    const parsed = JSON.parse(raw);
    const items = Array.isArray(parsed?.items) ? parsed.items.filter(isValidCartItem) : [];
    const normalized = items.map((item) => ({
      ...item,
      qty: Math.max(1, Math.floor(Number(item.qty) || 1))
    }));
    return { items: normalized };
  } catch {
    return EMPTY_CART;
  }
}

export function saveCart(state: CartState) {
  if (typeof window === 'undefined') return;
  try {
    const payload: CartState = {
      items: state.items.map((item) => ({
        ...item,
        qty: Math.max(1, Math.floor(Number(item.qty) || 1))
      }))
    };
    localStorage.setItem(KEY, JSON.stringify(payload));
  } catch {}
}
