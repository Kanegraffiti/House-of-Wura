export function encodeMessage(message: string) {
  return encodeURIComponent(message.trim());
}

export function waLink(message: string) {
  const num = process.env.NEXT_PUBLIC_WA_NUMBER?.replace(/[^\d]/g, '') || '';
  return `https://wa.me/${num}?text=${encodeMessage(message)}`;
}
