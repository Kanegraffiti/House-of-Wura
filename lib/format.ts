export function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    maximumFractionDigits: 0
  }).format(value);
}

export function formatPhone(phone?: string | null) {
  if (!phone) return '';
  const digits = phone.replace(/[^\d]/g, '');
  if (digits.length <= 4) return digits;
  return digits.replace(/(\d{3})(\d{3})(\d{0,4})/, (_match, a, b, c) =>
    [a, b, c].filter(Boolean).join('-')
  );
}
