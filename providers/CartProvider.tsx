'use client';

import React, { createContext, useContext, useEffect, useMemo, useReducer } from 'react';

import type { CartAction, CartItem, CartState } from '@/lib/cart/types';
import { loadCart, saveCart } from '@/lib/cart/storage';

type CartContextValue = { state: CartState; dispatch: React.Dispatch<CartAction> };

const CartContext = createContext<CartContextValue | null>(null);

function keyFor(item: Pick<CartItem, 'sku' | 'color' | 'size'>) {
  return [item.sku, item.color ?? '', item.size ?? ''].join('::');
}

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingIndex = state.items.findIndex((item) => keyFor(item) === keyFor(action.payload));
      if (existingIndex >= 0) {
        const items = state.items.map((item, idx) =>
          idx === existingIndex ? { ...item, qty: item.qty + action.payload.qty } : item
        );
        return { items };
      }
      return { items: [...state.items, action.payload] };
    }
    case 'REMOVE_ITEM': {
      const targetKey = keyFor(action.payload);
      return { items: state.items.filter((item) => keyFor(item) !== targetKey) };
    }
    case 'INCREMENT': {
      const targetKey = keyFor(action.payload);
      return {
        items: state.items.map((item) =>
          keyFor(item) === targetKey ? { ...item, qty: item.qty + 1 } : item
        )
      };
    }
    case 'DECREMENT': {
      const targetKey = keyFor(action.payload);
      return {
        items: state.items.map((item) =>
          keyFor(item) === targetKey ? { ...item, qty: Math.max(1, item.qty - 1) } : item
        )
      };
    }
    case 'UPDATE_SELECTIONS': {
      const targetKey = keyFor(action.payload);
      return {
        items: state.items.map((item) =>
          keyFor(item) === targetKey ? { ...item, ...action.payload } : item
        )
      };
    }
    case 'CLEAR':
      return { items: [] };
    default:
      return state;
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, undefined, () => loadCart());

  useEffect(() => {
    saveCart(state);
  }, [state]);

  const value = useMemo(() => ({ state, dispatch }), [state]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error('useCart must be used within CartProvider');
  }
  return ctx;
}
