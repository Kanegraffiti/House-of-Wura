import { formatCurrency, formatWhatsappDisplay } from '@/lib/format';
import { normalizePhone } from '@/lib/wa';

import type { CartItem, ContactPreference } from './types';

const WA_SAFE_LENGTH = 3500;
const WA_TRUNCATE_TARGET = 3400;

export function sumDisplaySubtotal(items: CartItem[]) {
  return items.reduce((acc, it) => acc + (it.priceFrom || 0) * (it.qty || 1), 0);
}

export function countCartItems(items: CartItem[]) {
  return items.reduce((acc, item) => acc + (item.qty || 0), 0);
}

function lineFor(item: CartItem, index: number, condensed = false) {
  const base = `${index}) ${item.title} (SKU:${item.sku})`;
  const parts = [base];
  if (item.color) parts.push(`${condensed ? 'C' : 'Color'}:${item.color}`);
  if (item.size) parts.push(`${condensed ? 'S' : 'Size'}:${item.size}`);
  parts.push(`${condensed ? 'Q' : 'Qty'}:${item.qty}`);
  return parts.join(condensed ? ' ' : ' | ');
}

function buildContactLines(contact: ContactPreference) {
  const phone = contact.whatsappNumber ? formatWhatsappDisplay(contact.whatsappNumber) : '';
  const email = contact.email?.trim();
  return [
    phone ? `- WhatsApp: ${phone}` : '- WhatsApp: (not provided)',
    email ? `- Email: ${email}` : '- Email: (not provided)'
  ];
}

function buildItemsSection(items: CartItem[], condensed = false) {
  return items.map((item, index) => lineFor(item, index + 1, condensed));
}

function maybeCondenseMessage(
  baseLines: string[],
  items: CartItem[],
  notes: string
) {
  const condensed = [
    ...baseLines.slice(0, baseLines.indexOf('Items:') + 1),
    ...buildItemsSection(items, true),
    '',
    'Notes:',
    notes,
    '',
    baseLines[baseLines.length - 2],
    baseLines[baseLines.length - 1]
  ];
  return condensed.join('\n');
}

export function buildCartWhatsAppMessage(
  items: CartItem[],
  contact: ContactPreference,
  notes?: string
) {
  const cleanNotes = (notes || '(none)').trim() || '(none)';
  const subtotal = sumDisplaySubtotal(items);
  const subtotalLine = `Displayed Subtotal: ${formatCurrency(subtotal)}`;
  const baseLines = [
    'New House of Wura enquiry',
    '',
    'Customer:',
    ...buildContactLines(contact),
    '',
    'Items:',
    ...buildItemsSection(items),
    '',
    'Notes:',
    cleanNotes,
    '',
    subtotalLine,
    'Please confirm final price & delivery timeline. Thank you!'
  ];

  let message = baseLines.join('\n');

  if (message.length > WA_SAFE_LENGTH) {
    message = maybeCondenseMessage(baseLines, items, cleanNotes);
  }

  if (message.length > WA_SAFE_LENGTH) {
    message = `${message.slice(0, WA_TRUNCATE_TARGET)}\n…(truncated)`;
  }

  return message;
}

export function buildMailtoBody(message: string) {
  return encodeURIComponent(message.replace(/\n/g, '\r\n'));
}

export function sanitizeWhatsAppNumber(input: string) {
  const digits = normalizePhone(input);
  if (!digits) return '';
  return `+${digits}`;
}
