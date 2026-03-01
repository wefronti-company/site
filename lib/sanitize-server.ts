/**
 * Sanitização server-side para dados que vão para o banco ou são reexibidos.
 * Remove HTML, scripts e caracteres de controle para reduzir risco de XSS e injeção.
 * Uso apenas no backend (APIs, lib).
 */

/** Remove tags HTML, scripts, event handlers e caracteres de controle. Mantém apenas texto seguro. */
export function sanitizeTextForStorage(value: string): string {
  if (typeof value !== 'string') return '';
  return value
    .replace(/[\x00-\x1F\x7F-\x9F]/g, '')
    .replace(/<\/?[^>]+(>|$)/g, '')
    .replace(/javascript:/gi, '')
    .replace(/vbscript:/gi, '')
    .replace(/data:text\/html[^,]*/gi, '')
    .replace(/data:image\/svg\+xml[^,]*/gi, '')
    .replace(/expression\s*\(/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .trim();
}

/** Sanitiza e limita tamanho. Uso em APIs para inputs de texto. */
export function getStringSafe(value: unknown, maxLen = 500): string {
  if (typeof value !== 'string') return '';
  return sanitizeTextForStorage(value).slice(0, maxLen);
}

/** Para campos numéricos/alphanuméricos curtos (CPF, CEP, UF): só dígitos/letras. */
export function sanitizeAlphanumeric(value: string, maxLen: number): string {
  if (typeof value !== 'string') return '';
  return value.replace(/[^a-zA-Z0-9]/g, '').slice(0, maxLen);
}
