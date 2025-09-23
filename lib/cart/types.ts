export type CartItem = {
  id: string; // product id
  sku: string;
  title: string;
  priceFrom?: number;
  image?: string;
  color?: string;
  size?: string;
  qty: number;
};

export type CartState = { items: CartItem[] };

export type CartAction =
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: { sku: string; color?: string; size?: string } }
  | { type: 'INCREMENT'; payload: { sku: string; color?: string; size?: string } }
  | { type: 'DECREMENT'; payload: { sku: string; color?: string; size?: string } }
  | { type: 'UPDATE_SELECTIONS'; payload: { sku: string; color?: string; size?: string } }
  | { type: 'CLEAR' };

export type ProductOption = {
  label: string;
  value: string;
};

export type ContactPreference = {
  prefer: 'whatsapp' | 'email';
  whatsappNumber?: string;
  email?: string;
};
