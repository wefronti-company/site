export const DEFAULT_WHATSAPP_NUMBER = '5221981013467';
export const DEFAULT_WHATSAPP_MESSAGE = 'Olá! Vim pelo site da Wefronti e gostaria de saber mais.';

export interface WhatsAppReferralConfig {
  nome?: string;
  whatsappNumero?: string;
  whatsappMensagem?: string;
}

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

export function buildReferralWhatsAppMessage(config?: WhatsAppReferralConfig, contextMessage?: string): string {
  const nome = String(config?.nome || '').trim();
  const numero = normalizeWhatsappNumber(config?.whatsappNumero);
  const custom = String(config?.whatsappMensagem || '').trim();

  // Se o participante definiu mensagem personalizada, ela deve ser enviada sozinha.
  if (custom) return custom;

  const base = custom || (
    nome
      ? `Olá! Vim pelo link de indicação da Wefronti do(a) ${nome}. Pode me atender neste WhatsApp (${numero})?`
      : DEFAULT_WHATSAPP_MESSAGE
  );

  const context = String(contextMessage || '').trim();
  if (!context) return base;
  return `${context}\n\n${base}`;
}

