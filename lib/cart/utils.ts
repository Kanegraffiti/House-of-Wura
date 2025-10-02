import type { CartItem } from '@/lib/cart/types';
import { formatCurrency, formatWhatsappDisplay } from '@/lib/format';
import { normalizePhone } from '@/lib/wa';

export function sumDisplaySubtotal(items: CartItem[]) {
  return items.reduce((acc, it) => acc + (it.priceFrom || 0) * (it.qty || 1), 0);
}

export function countCartItems(items: CartItem[]) {
  return items.reduce((acc, item) => acc + (item.qty || 0), 0);
}

type Contact = {
  prefer: 'whatsapp' | 'email';
  whatsappNumber?: string;
  email?: string;
};

const MAX_WA_CHARS = 3500;
const TRUNCATE_AT = 3400;

export function buildCartWhatsAppMessage(items: CartItem[], contact: Contact, notes?: string) {
  const subtotal = formatCurrency(sumDisplaySubtotal(items));
  const phone = formatWhatsappDisplay(contact.whatsappNumber || normalizePhone(contact.whatsappNumber || '')) || 'Not provided';
  const email = (contact.email || '').trim() || 'Not provided';

  const lines: string[] = [
    'New House of Wura cart submission',
    '',
    'Customer preferences:',
    `- Contact preference: ${contact.prefer}`,
    `- WhatsApp: ${phone}`,
    `- Email: ${email}`,
    '',
    'Items:'
  ];

  items.forEach((item, index) => {
    const parts: string[] = [`${index + 1}) ${item.title} (SKU: ${item.sku})`, `Qty: ${item.qty}`];
    if (item.color) parts.push(`Color: ${item.color}`);
    if (item.size) parts.push(`Size: ${item.size}`);
    if (item.priceFrom) parts.push(`Display price: ${formatCurrency(item.priceFrom)}`);
    lines.push(parts.join(' | '));
  });

  if (notes) {
    lines.push('', `Notes: ${notes}`);
  }

  lines.push('', `Displayed subtotal: ${subtotal}`);

  let message = lines.join('\n');
  if (message.length > MAX_WA_CHARS) {
    message = `${message.slice(0, TRUNCATE_AT)}\n…(truncated)`;
  }
  return message;
}
