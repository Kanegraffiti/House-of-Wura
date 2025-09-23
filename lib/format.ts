import { normalizePhone } from '@/lib/wa';

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
  return digits.replace(/(\d{3})(\d{3})(\d{0,4})/, (_match, a, b, c) => [a, b, c].filter(Boolean).join('-'));
}

export function formatWhatsappDisplay(phone?: string) {
  const digits = normalizePhone(phone || '');
  if (!digits) return '';
  return digits.startsWith('+') ? digits : `+${digits}`;
}

export function pluralize(label: string, value: number) {
  return `${label}${value === 1 ? '' : 's'}`;
}

export function formatDateTime(value?: number | Date | null) {
  if (!value) return '';
  const date = typeof value === 'number' ? new Date(value) : value;
  return new Intl.DateTimeFormat('en-NG', {
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(date);
}

export function formatDate(value?: number | Date | null) {
  if (!value) return '';
  const date = typeof value === 'number' ? new Date(value) : value;
  return new Intl.DateTimeFormat('en-NG', { dateStyle: 'medium' }).format(date);
}

export function formatRelativeTime(value?: number | Date | null) {
  if (!value) return '';
  const date = typeof value === 'number' ? new Date(value) : value;
  const diff = Date.now() - date.getTime();
  const seconds = Math.round(diff / 1000);
  const absSeconds = Math.abs(seconds);
  const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
  if (absSeconds < 60) return rtf.format(-Math.round(seconds), 'second');
  const minutes = Math.round(absSeconds / 60);
  if (minutes < 60) return rtf.format(-Math.round(seconds / 60), 'minute');
  const hours = Math.round(minutes / 60);
  if (hours < 24) return rtf.format(-Math.round(hours), 'hour');
  const days = Math.round(hours / 24);
  if (days < 30) return rtf.format(-Math.round(days), 'day');
  const months = Math.round(days / 30);
  if (months < 12) return rtf.format(-Math.round(months), 'month');
  const years = Math.round(months / 12);
  return rtf.format(-Math.round(years), 'year');
}
