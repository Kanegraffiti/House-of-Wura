'use client';
import React, { createContext, useContext, useEffect, useMemo, useReducer } from 'react';
import type { CartAction, CartState } from '@/lib/cart/types';
import { loadCart, saveCart } from '@/lib/cart/storage';

const CartContext = createContext<{ state: CartState; dispatch: React.Dispatch<CartAction> } | null>(null);

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const exists = state.items.find(
        (i) => i.sku === action.payload.sku && i.color === action.payload.color && i.size === action.payload.size
      );
      if (exists) {
        return {
          items: state.items.map((i) => (i === exists ? { ...i, qty: i.qty + action.payload.qty } : i))
        };
      }
      return { items: [...state.items, action.payload] };
    }
    case 'REMOVE_ITEM':
      return { items: state.items.filter((i) => i.sku !== action.payload.sku) };
    case 'INCREMENT':
      return { items: state.items.map((i) => (i.sku === action.payload.sku ? { ...i, qty: i.qty + 1 } : i)) };
    case 'DECREMENT':
      return {
        items: state.items.map((i) => (i.sku === action.payload.sku ? { ...i, qty: Math.max(1, i.qty - 1) } : i))
      };
    case 'UPDATE_SELECTIONS':
      return { items: state.items.map((i) => (i.sku === action.payload.sku ? { ...i, ...action.payload } : i)) };
    case 'CLEAR':
      return { items: [] };
    default:
      return state;
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, undefined as unknown as CartState, () => loadCart());

  useEffect(() => {
    saveCart(state);
  }, [state]);

  const value = useMemo(() => ({ state, dispatch }), [state]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
