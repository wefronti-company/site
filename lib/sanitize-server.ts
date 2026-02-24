/**
 * Sanitização server-side para dados que vão para o banco ou são reexibidos.
 * Remove HTML, scripts e caracteres de controle para reduzir risco de XSS e dados malformados.
 * Uso apenas no backend (APIs, lib).
 */

/** Remove tags HTML, javascript: e caracteres de controle. Mantém apenas texto seguro. */
export function sanitizeTextForStorage(value: string): string {
  if (typeof value !== 'string') return '';
  return value
    .replace(/[\x00-\x1F\x7F-\x9F]/g, '')
    .replace(/<\/?[^>]+(>|$)/g, '')
    .replace(/javascript:/gi, '')
    .replace(/data:/gi, '')
    .replace(/vbscript:/gi, '')
    .trim();
}

/** Para campos numéricos/alphanuméricos curtos (CPF, CEP, UF): só dígitos/letras. */
export function sanitizeAlphanumeric(value: string, maxLen: number): string {
  if (typeof value !== 'string') return '';
  return value.replace(/[^a-zA-Z0-9]/g, '').slice(0, maxLen);
}
