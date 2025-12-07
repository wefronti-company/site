/**
 * Utilitários de Segurança para o Frontend
 * Proteção contra ataques comuns no lado do cliente
 */

/**
 * Limpa e valida input em tempo real
 */
export function sanitizeUserInput(value: string, type: 'text' | 'email' | 'phone' | 'textarea' = 'text'): string {
 if (!value) return '';

 let sanitized = value;

 // Remover caracteres de controle e invisíveis
 sanitized = sanitized.replace(/[\x00-\x1F\x7F-\x9F]/g, '');

 switch (type) {
 case 'email':
 // Apenas caracteres válidos para email
 sanitized = sanitized.toLowerCase().replace(/[^a-z0-9@._+-]/g, '');
 break;

 case 'phone':
 // Apenas números e símbolos de telefone
 sanitized = sanitized.replace(/[^\d\s()+.-]/g, '');
 break;

 case 'text':
 // Remover tags HTML e scripts
 sanitized = sanitized
 .replace(/<\/?[^>]+(>|$)/g, '') // Remove tags HTML
 .replace(/javascript:/gi, '')
 .replace(/on\w+\s*=/gi, ''); // Remove event handlers
 break;

 case 'textarea':
 // Mais permissivo mas ainda seguro
 sanitized = sanitized
 .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
 .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
 .replace(/javascript:/gi, '')
 .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '');
 break;
 }

 return sanitized;
}

/**
 * Valida formato de email
 */
export function isValidEmail(email: string): boolean {
 const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
 return emailRegex.test(email) && email.length <= 255;
}

/**
 * Valida formato de telefone brasileiro
 */
export function isValidBrazilianPhone(phone: string): boolean {
 const cleaned = phone.replace(/\D/g, '');
 return cleaned.length >= 10 && cleaned.length <= 11;
}

/**
 * Detecta padrões suspeitos no texto
 */
export function containsSuspiciousPatterns(text: string): boolean {
 const suspiciousPatterns = [
 /<script/i,
 /<iframe/i,
 /javascript:/i,
 /on(click|load|error|mouse)/i,
 /<embed/i,
 /<object/i,
 /eval\s*\(/i,
 /expression\s*\(/i,
 /vbscript:/i,
 /data:text\/html/i,
 /<link/i,
 /<style/i,
 /document\./i,
 /window\./i,
 /__proto__/i,
 /constructor/i,
 ];

 return suspiciousPatterns.some(pattern => pattern.test(text));
}

/**
 * Limita o tamanho do input
 */
export function enforceMaxLength(value: string, maxLength: number): string {
 return value.slice(0, maxLength);
}

/**
 * Previne múltiplos espaços
 */
export function normalizeSpaces(value: string): string {
 return value.replace(/\s+/g, ' ').trim();
}

/**
 * Valida força da entrada (para detecção de bots)
 */
export function validateInputTiming(startTime: number, endTime: number, minTime: number = 1000): boolean {
 const duration = endTime - startTime;
 // Se preencheu muito rápido (< 1 segundo), pode ser bot
 return duration >= minTime;
}

/**
 * Honeypot - Campo invisível para capturar bots
 */
export function validateHoneypot(value: string): boolean {
 // Se o campo honeypot foi preenchido, é um bot
 return value === '';
}

/**
 * Gera fingerprint do navegador (detecção de automação)
 */
export function getBrowserFingerprint(): string {
 const canvas = document.createElement('canvas');
 const ctx = canvas.getContext('2d');
 if (!ctx) return 'unknown';

 ctx.textBaseline = 'top';
 ctx.font = '14px Arial';
 ctx.fillText('Browser Fingerprint', 2, 2);

 return canvas.toDataURL().slice(-50);
}

/**
 * Valida se é um navegador real (não headless)
 */
export function isRealBrowser(): boolean {
 // Verificações básicas de navegador headless/bot
 if (typeof navigator === 'undefined') return false;
 if (!navigator.webdriver) return true; // webdriver indica automação
 
 // Verificar se há plugins típicos de navegadores reais
 const hasPlugins = navigator.plugins && navigator.plugins.length > 0;
 
 // Verificar dimensões da tela
 const hasValidScreen = window.screen.width > 0 && window.screen.height > 0;
 
 return !navigator.webdriver && hasPlugins && hasValidScreen;
}

/**
 * Adiciona delay mínimo para prevenir brute force
 */
export async function addSecurityDelay(ms: number = 500): Promise<void> {
 return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Ofusca informações sensíveis no console
 */
export function sanitizeLog(data: Record<string, any>): Record<string, any> {
 const sensitiveKeys = ['password', 'token', 'secret', 'key', 'auth'];
 const sanitized = { ...data };

 Object.keys(sanitized).forEach(key => {
 if (sensitiveKeys.some(sensitive => key.toLowerCase().includes(sensitive))) {
 sanitized[key] = '***REDACTED***';
 }
 });

 return sanitized;
}

/**
 * Cria hash simples para verificação de integridade
 */
export function simpleHash(str: string): string {
 let hash = 0;
 for (let i = 0; i < str.length; i++) {
 const char = str.charCodeAt(i);
 hash = ((hash << 5) - hash) + char;
 hash = hash & hash; // Convert to 32bit integer
 }
 return Math.abs(hash).toString(36);
}

/**
 * Valida se a requisição está sendo feita do domínio correto
 */
export function isValidOrigin(): boolean {
 if (typeof window === 'undefined') return true;
 
 const allowedOrigins = [
 'localhost:3000',
 'wefronti.com',
 'www.wefronti.com',
 ];

 return allowedOrigins.some(allowed => 
 window.location.hostname.includes(allowed)
 );
}
