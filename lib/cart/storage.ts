const KEY = 'wura_cart';
export function loadCart(): import('./types').CartState {
  if (typeof window === 'undefined') return { items: [] };
  try {
    return JSON.parse(localStorage.getItem(KEY) || '{"items":[]}');
  } catch {
    return { items: [] };
  }
}
export function saveCart(state: import('./types').CartState) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {}
}
