export function normalizePhone(input: string) {
  return (input || '').replace(/[^\d]/g, '');
}

export function waLink(message: string) {
  const num = normalizePhone(process.env.NEXT_PUBLIC_WA_NUMBER || '');
  const text = encodeURIComponent((message || '').trim());
  return `https://wa.me/${num}?text=${text}`;
}
