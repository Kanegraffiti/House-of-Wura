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
  | { type: 'ADD'; item: CartItem }
  | { type: 'INC'; id: string }
  | { type: 'DEC'; id: string }
  | { type: 'DEL'; id: string }
  | { type: 'CLR' };

export type ProductOption = {
  label: string;
  value: string;
};

export type ContactPreference = {
  prefer: 'whatsapp' | 'email';
  whatsappNumber?: string;
  email?: string;
};
