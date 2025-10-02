'use client';
import React, { createContext, useContext, useEffect, useMemo, useReducer, useState } from 'react';
import type { CartAction, CartState, CartItem } from '@/lib/cart/types';
import { loadCart, saveCart } from '@/lib/cart/storage';

const CartContext = createContext<{ state: CartState; dispatch: React.Dispatch<CartAction> } | null>(null);

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'HYDRATE': {
      if (!action.payload || !Array.isArray(action.payload.items)) return state;
      return { items: action.payload.items };
    }
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
      return { items: state.items.filter((item) => !matchesVariant(item, action.payload)) };
    case 'INCREMENT':
      return {
        items: state.items.map((item) =>
          matchesVariant(item, action.payload) ? { ...item, qty: item.qty + 1 } : item
        )
      };
    case 'DECREMENT':
      return {
        items: state.items.map((item) =>
          matchesVariant(item, action.payload) ? { ...item, qty: Math.max(1, item.qty - 1) } : item
        )
      };
    case 'UPDATE_SELECTIONS':
      return {
        items: state.items.map((item) =>
          matchesVariant(item, action.payload) ? { ...item, ...action.payload } : item
        )
      };
    case 'CLEAR':
      return { items: [] };
    default:
      return state;
  }
}

function matchesVariant(item: CartItem, target: { sku: string; color?: string; size?: string }) {
  if (item.sku !== target.sku) return false;
  if (target.color !== undefined && item.color !== target.color) return false;
  if (target.size !== undefined && item.size !== target.size) return false;
  return true;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [] });
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const stored = loadCart();
    if (stored.items.length) {
      dispatch({ type: 'HYDRATE', payload: stored });
    }
    setReady(true);
  }, [dispatch]);

  useEffect(() => {
    if (!ready) return;
    saveCart(state);
  }, [state, ready]);

  const value = useMemo(() => ({ state, dispatch }), [state]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
