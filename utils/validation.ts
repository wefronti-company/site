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
 .refine((email: string) => validator.isEmail(email), 'Email inválido'),
 
 company: z
 .string()
 .min(2, 'Nome da empresa deve ter no mínimo 2 caracteres')
 .max(100, 'Nome da empresa deve ter no máximo 100 caracteres')
 .regex(/^[a-zA-Z0-9À-ÿ\s&.,'()-]+$/, 'Nome da empresa contém caracteres inválidos'),
 
 role: z
 .string()
 .refine(
 (val: string) => ['ceo', 'cto', 'manager', 'developer', 'other'].includes(val),
 'Cargo inválido'
 ),
 
 revenue: z
 .string()
 .refine(
 (val: string) => ['0-10k', '10k-50k', '50k-100k', '100k-500k', '500k+'].includes(val),
 'Faturamento inválido'
 ),
 
 challenge: z
 .string()
 .min(10, 'Descreva seu desafio (mínimo 10 caracteres)')
 .max(2000, 'Descrição muito longa (máximo 2000 caracteres)')
 .refine(
 (text: string) => !containsMaliciousPatterns(text),
 'Texto contém conteúdo não permitido'
 ),
 
 timeline: z
 .string()
 .refine(
 (val: string) => ['immediate', 'short', 'medium', 'long'].includes(val),
 'Prazo inválido'
 ),
 
 // LGPD: Campo de consentimento obrigatório
 privacy_consent: z
 .boolean()
 .refine((val: boolean) => val === true, 'Consentimento de privacidade é obrigatório'),
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
 // Em desenvolvimento local, permitir quando não houver origin
 if (process.env.NODE_ENV === 'development') {
 if (!origin) return true;
 }
 
 // Allow if host is localhost/127.0.0.1 even when NODE_ENV is not 'development'
 if (!origin || !host) {
   // If host indicates loopback, allow for local testing
   const hostLower = (host || '').toLowerCase();
   if (hostLower.includes('localhost') || hostLower.includes('127.0.0.1') || hostLower.includes('0.0.0.0')) {
     if (process.env.ALLOWED_ORIGINS_DEBUG === 'true' || process.env.NODE_ENV === 'development') console.warn('[SECURITY] validateOrigin: allowing missing origin for localhost', { origin, host });
     return true;
   }
   return false;
 }
 
 // Debug override: accept all origins when ALLOWED_ORIGINS_DEBUG is true (only use for local testing)
 if (process.env.ALLOWED_ORIGINS_DEBUG === 'true') {
   console.warn('[SECURITY] validateOrigin: ALLOWED_ORIGINS_DEBUG enabled — accepting origin', { origin, host });
   return true;
 }
 
 // Allow additional origins via ALLOWED_ORIGINS env var (CSV)
 const envAllowed = process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',').map(s => s.trim()).filter(Boolean) : [];
 
 const allowedOrigins = [
 'https://wefronti.com',
 'https://www.wefronti.com',
 // Accept localhost (any port) and loopback for local testing
 'http://localhost',
 'http://127.0.0.1',
 ...envAllowed,
 ...(process.env.NODE_ENV === 'development' ? ['http://localhost:3000'] : [])
 ];
 
 // Match when origin starts with an allowed origin (covers ports) or includes the host header
 const matched = allowedOrigins.some(allowed => origin.startsWith(allowed)) || origin.includes(host);
 
 const debug = process.env.ALLOWED_ORIGINS_DEBUG === 'true' || process.env.NODE_ENV === 'development';
 if (!matched && debug) {
   // Log minimal debug info to help identify missing origin/host combinations during testing
   console.warn('[SECURITY] validateOrigin: origin rejected', { origin, host, allowedOrigins });
 }
 
 return matched;
}

