export const DEFAULT_WHATSAPP_NUMBER = '5221981013467';
export const DEFAULT_WHATSAPP_MESSAGE = 'Olá! Vim pelo site da Wefronti e gostaria de saber mais.';

export function normalizeWhatsappNumber(value: string | null | undefined): string {
  const digits = String(value || '').replace(/\D/g, '');
  if (!digits) return DEFAULT_WHATSAPP_NUMBER;
  if (digits.startsWith('55')) return digits;
  return `55${digits}`;
}

export function buildWhatsAppUrl(number: string, message: string): string {
  const normalized = normalizeWhatsappNumber(number);
  const msg = String(message || '').trim() || DEFAULT_WHATSAPP_MESSAGE;
  return `https://wa.me/${normalized}?text=${encodeURIComponent(msg)}`;
}

