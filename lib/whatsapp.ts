export const DEFAULT_WHATSAPP_NUMBER = '5521981013467';
export const DEFAULT_WHATSAPP_MESSAGE = 'Oi, vim pelo site, gostaria de um orçamento.';
export const WHATSAPP_MESSAGE_ORCAMENTO = 'Oi, vim pelo site, gostaria de um orçamento.';
export const WHATSAPP_MESSAGE_DUVIDAS = 'Oi, vim pelo site e gostaria de tirar algumas dúvidas.';

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

