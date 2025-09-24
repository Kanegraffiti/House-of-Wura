export const DEFAULT_WHATSAPP_NUMBER = '2349060294599';

export function normalizePhone(input: string) {
  return (input || '').replace(/[^\d]/g, '');
}

export function getConfiguredWhatsAppNumber() {
  const raw = process.env.NEXT_PUBLIC_WA_NUMBER || DEFAULT_WHATSAPP_NUMBER;
  const digits = normalizePhone(raw);
  return digits || DEFAULT_WHATSAPP_NUMBER;
}

export function waLink(message: string) {
  const num = getConfiguredWhatsAppNumber();
  const text = encodeURIComponent((message || '').trim());
  return `https://wa.me/${num}?text=${text}`;
}
