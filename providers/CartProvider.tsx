'use client';

import React, { createContext, useContext, useEffect, useMemo, useReducer } from 'react';

import type { CartAction, CartState, CartItem } from '@/lib/cart/types';

type CartContextValue = {
  state: CartState;
  dispatch: React.Dispatch<CartAction>;
};

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = 'cart';

function loadInitialState(): CartState {
  if (typeof window === 'undefined') return { items: [] };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { items: [] };
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed?.items)) return { items: [] };
    const items: CartItem[] = [];
    for (const entry of parsed.items as unknown[]) {
      if (!entry || typeof entry !== 'object') continue;
      const item = entry as Partial<CartItem>;
      if (!item.id || !item.sku || !item.title) continue;

      items.push({
        ...item,
        id: String(item.id),
        sku: String(item.sku),
        title: String(item.title),
        priceFrom: item.priceFrom ? Number(item.priceFrom) : undefined,
        image: item.image ? String(item.image) : undefined,
        color: item.color ? String(item.color) : undefined,
        size: item.size ? String(item.size) : undefined,
        qty: Math.max(1, Number.parseInt(String(item.qty ?? 1), 10) || 1)
      });
    }
    return { items };
  } catch {
    return { items: [] };
  }
}

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD': {
      const existing = state.items.find((item) => item.id === action.item.id);
      if (existing) {
        return {
          items: state.items.map((item) =>
            item.id === action.item.id
              ? { ...item, qty: Math.max(1, item.qty + (action.item.qty || 1)) }
              : item
          )
        };
      }
      return { items: [...state.items, { ...action.item, qty: Math.max(1, action.item.qty || 1) }] };
    }
    case 'INC':
      return {
        items: state.items.map((item) =>
          item.id === action.id ? { ...item, qty: Math.max(1, item.qty + 1) } : item
        )
      };
    case 'DEC':
      return {
        items: state.items.map((item) =>
          item.id === action.id ? { ...item, qty: Math.max(1, item.qty - 1) } : item
        )
      };
    case 'DEL':
      return { items: state.items.filter((item) => item.id !== action.id) };
    case 'CLR':
      return { items: [] };
    default:
      return state;
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [] }, loadInitialState);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // ignore write errors
    }
  }, [state]);

  const value = useMemo(() => ({ state, dispatch }), [state]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
