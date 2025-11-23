import { z } from 'zod';
import validator from 'validator';

// Schema de validação do formulário de orçamento
export const quoteFormSchema = z.object({
  name: z
    .string()
    .min(2, 'Nome deve ter no mínimo 2 caracteres')
    .max(100, 'Nome deve ter no máximo 100 caracteres')
    .regex(/^[a-zA-ZÀ-ÿ\s'-]+$/, 'Nome contém caracteres inválidos'),
  
  whatsapp: z
    .string()
    .min(10, 'WhatsApp inválido')
    .max(20, 'WhatsApp inválido')
    .regex(/^[\d\s()+.-]+$/, 'WhatsApp contém caracteres inválidos'),
  
  email: z
    .string()
    .email('Email inválido')
    .max(255, 'Email muito longo')
    .refine((email) => validator.isEmail(email), 'Email inválido'),
  
  company: z
    .string()
    .min(2, 'Nome da empresa deve ter no mínimo 2 caracteres')
    .max(100, 'Nome da empresa deve ter no máximo 100 caracteres')
    .regex(/^[a-zA-Z0-9À-ÿ\s&.,'()-]+$/, 'Nome da empresa contém caracteres inválidos'),
  
  role: z
    .string()
    .refine(
      (val) => ['ceo', 'cto', 'manager', 'developer', 'other'].includes(val),
      'Cargo inválido'
    ),
  
  revenue: z
    .string()
    .refine(
      (val) => ['0-10k', '10k-50k', '50k-100k', '100k-500k', '500k+'].includes(val),
      'Faturamento inválido'
    ),
  
  challenge: z
    .string()
    .min(10, 'Descreva seu desafio (mínimo 10 caracteres)')
    .max(2000, 'Descrição muito longa (máximo 2000 caracteres)')
    .refine(
      (text) => !containsMaliciousPatterns(text),
      'Texto contém conteúdo não permitido'
    ),
  
  timeline: z
    .string()
    .refine(
      (val) => ['immediate', 'short', 'medium', 'long'].includes(val),
      'Prazo inválido'
    ),
  
  // LGPD: Campo de consentimento obrigatório
  privacy_consent: z
    .boolean()
    .refine((val) => val === true, 'Consentimento de privacidade é obrigatório'),
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

// Validar origem da requisição (CSRF protection)
export function validateOrigin(origin: string | null, host: string | null): boolean {
  // Em desenvolvimento, permitir localhost
  if (process.env.NODE_ENV === 'development') {
    return true;
  }
  
  if (!origin || !host) return false;
  
  const allowedOrigins = [
    'http://localhost:3000',
    'https://wefronti.com',
    'https://www.wefronti.com',
  ];

  return allowedOrigins.some(allowed => origin.startsWith(allowed)) || origin.includes(host);
}

// Gerar token CSRF
export function generateCsrfToken(): string {
  return Array.from({ length: 32 }, () => 
    Math.random().toString(36).charAt(2)
  ).join('');
}
