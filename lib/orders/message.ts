import { formatCurrency, formatWhatsappDisplay } from '@/lib/format';
import { waLink } from '@/lib/wa';

import type { OrderType } from './schema';

const MAX_WA_CHARS = 3500;
const TRUNCATE_AT = 3400;

function cleanContact(order: OrderType) {
  const number = order.whatsapp ? formatWhatsappDisplay(order.whatsapp) : null;
  return {
    whatsapp: number ?? '(not provided)',
    email: order.email ?? '(not provided)'
  };
}

export function buildWhatsAppMessageText(order: OrderType) {
  const { whatsapp, email } = cleanContact(order);
  const subtotal = formatCurrency(order.subtotal ?? 0);

  const lines: string[] = [
    `New House of Wura order (${order.orderId})`,
    '',
    'Customer:',
    `- WhatsApp: ${whatsapp}`,
    `- Email: ${email}`,
    '',
    'Items:'
  ];

  order.items.forEach((item, index) => {
    const base = `${index + 1}) ${item.title} (SKU:${item.sku})`;
    const details: string[] = [base, `Qty:${item.qty}`];
    if (item.color) details.push(`Color:${item.color}`);
    if (item.size) details.push(`Size:${item.size}`);
    lines.push(details.join(' | '));
  });

  if (order.note) {
    lines.push('', `Notes: ${order.note}`);
  }

  lines.push('', `Displayed Subtotal: ${subtotal}`);
  lines.push('Reply here with confirmation, price & delivery timeline. Thank you!');

  let message = lines.join('\n');
  if (message.length > MAX_WA_CHARS) {
    message = `${message.slice(0, TRUNCATE_AT)}\n…(truncated)`;
  }

  return message;
}

export function buildWhatsAppDeeplink(order: OrderType) {
  return waLink(buildWhatsAppMessageText(order));
}
