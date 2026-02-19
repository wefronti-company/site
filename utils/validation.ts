import { z } from 'zod';
import validator from 'validator';

// Schema de validação do formulário de orçamento
export const quoteFormSchema = z.object({
 name: z
 .string()
 .min(2, 'Nome deve ter no mínimo 2 caracteres')
 .max(100, 'Nome deve ter no máximo 100 caracteres')
 .regex(/^[a-zA-ZÀ-ÿ\s'-]+$/, 'Nome contém caracteres inválidos'),
 
 phone: z
 .string()
 .min(10, 'Celular inválido')
 .max(20, 'Celular inválido')
 .regex(/^[\d\s()+.-]+$/, 'Celular contém caracteres inválidos'),
 
 email: z
 .string()
 .email('Email inválido')
 .max(255, 'Email muito longo')
 .refine((email: string) => validator.isEmail(email), 'Email inválido'),
 
 company: z
 .string()
 .min(2, 'Nome da empresa deve ter no mínimo 2 caracteres')
 .max(100, 'Nome da empresa deve ter no máximo 100 caracteres')
 .regex(/^[a-zA-Z0-9À-ÿ\s&.,'()-]+$/, 'Nome da empresa contém caracteres inválidos'),
 
 investment: z
 .string()
 .refine(
 (val: string) => ['5k-15k', '15k-30k', '30k-50k', '50k-100k', '100k+'].includes(val),
 'Valor de investimento inválido'
 ),
 
 projectType: z
 .string()
 .refine(
 (val: string) => ['site', 'ecommerce', 'sistema', 'app', 'saas', 'api', 'outro'].includes(val),
 'Tipo de projeto inválido'
 ),
 
 urgency: z
 .string()
 .refine(
 (val: string) => ['baixa', 'media', 'alta', 'urgente'].includes(val),
 'Nível de urgência inválido'
 ),
 
 details: z
 .string()
 .min(10, 'Descreva seu projeto (mínimo 10 caracteres)')
 .max(2000, 'Descrição muito longa (máximo 2000 caracteres)')
 .refine(
 (text: string) => !containsMaliciousPatterns(text),
 'Texto contém conteúdo não permitido'
 ),
});

export type QuoteFormData = z.infer<typeof quoteFormSchema>;

// Detectar padrões maliciosos
function containsMaliciousPatterns(text: string): boolean {
 const maliciousPatterns = [
 /<script/i,
 /javascript:/i,
 /on\w+\s*=/i, // onclick, onerror, etc
 /<iframe/i,
 /<embed/i,
 /<object/i,
 /eval\s*\(/i,
 /expression\s*\(/i,
 /vbscript:/i,
 /data:text\/html/i,
 ];

 return maliciousPatterns.some(pattern => pattern.test(text));
}

// Sanitizar entrada de texto
export function sanitizeInput(input: string): string {
 return validator.escape(
 input
 .trim()
 .replace(/\s+/g, ' ') // Normalizar espaços
 .slice(0, 2000) // Limitar tamanho
 );
}

// Sanitizar HTML
export function sanitizeHtml(html: string): string {
 return validator.stripLow(
 html
 .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
 .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
 .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
 .replace(/javascript:/gi, '')
 );
}

// Validar e sanitizar WhatsApp
export function sanitizeWhatsApp(whatsapp: string): string {
 return whatsapp.replace(/[^\d+\s()-]/g, '');
}

// Validar e sanitizar email
export function sanitizeEmail(email: string): string {
 return validator.normalizeEmail(email.toLowerCase().trim()) || email;
}

// Rate limiting - verificar tentativas por IP
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

export function checkRateLimit(ip: string, maxAttempts = 5, windowMs = 60000): boolean {
 const now = Date.now();
 const record = rateLimitStore.get(ip);

 if (!record || now > record.resetTime) {
 rateLimitStore.set(ip, { count: 1, resetTime: now + windowMs });
 return true;
 }

 if (record.count >= maxAttempts) {
 return false;
 }

 record.count++;
 return true;
}

// Limpar registros antigos periodicamente
setInterval(() => {
 const now = Date.now();
 rateLimitStore.forEach((record, ip) => {
 if (now > record.resetTime) {
 rateLimitStore.delete(ip);
 }
 });
}, 60000);

// Hostnames permitidos (evita bypass como wefronti.com.attacker.com ou evil.com?wefronti.com)
const ALLOWED_ORIGIN_HOSTNAMES = new Set([
  'wefronti.com',
  'www.wefronti.com',
  'localhost',
  '127.0.0.1',
  '0.0.0.0',
]);

// Validar origem da requisição (CSRF protection)
export function validateOrigin(origin: string | null, host: string | null): boolean {
  // Em desenvolvimento local, permitir quando não houver origin
  if (process.env.NODE_ENV === 'development') {
    if (!origin) return true;
  }

  // Allow if host is localhost/127.0.0.1 even when NODE_ENV is not 'development'
  if (!origin || !host) {
    const hostLower = (host || '').toLowerCase();
    if (hostLower.includes('localhost') || hostLower.includes('127.0.0.1') || hostLower.includes('0.0.0.0')) {
      if (process.env.NODE_ENV === 'development') console.warn('[SECURITY] validateOrigin: allowing missing origin for localhost');
      return true;
    }
    return false;
  }

  // NUNCA aceitar bypass em produção — ALLOWED_ORIGINS_DEBUG só em dev
  if (process.env.ALLOWED_ORIGINS_DEBUG === 'true' && process.env.NODE_ENV !== 'production') {
    console.warn('[SECURITY] validateOrigin: ALLOWED_ORIGINS_DEBUG enabled (dev only)');
    return true;
  }

  try {
    const url = new URL(origin);
    const originHostname = url.hostname.toLowerCase();

    // Match exato do hostname (evita wefronti.com.attacker.com)
    if (ALLOWED_ORIGIN_HOSTNAMES.has(originHostname)) return true;

    // Allow additional hostnames via ALLOWED_ORIGINS env (formato: https://dominio.com)
    const envAllowed = process.env.ALLOWED_ORIGINS
      ? process.env.ALLOWED_ORIGINS.split(',')
          .map((s) => s.trim())
          .filter(Boolean)
      : [];
    for (const allowed of envAllowed) {
      try {
        const allowedUrl = new URL(allowed);
        if (allowedUrl.hostname.toLowerCase() === originHostname) return true;
      } catch {
        // ignore URLs inválidas no env
      }
    }

    const debug = process.env.NODE_ENV === 'development';
    if (debug) {
      console.warn('[SECURITY] validateOrigin: origin rejected', { originHostname, host });
    }
  } catch {
    // origin não é URL válida
    if (process.env.NODE_ENV === 'development') {
      console.warn('[SECURITY] validateOrigin: invalid origin URL', { origin });
    }
  }

  return false;
}

