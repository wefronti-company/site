import { checkRateLimit } from '../utils/validation';

/**
 * Rate limiting (in-memory). Mantém a mesma API que antes para compatibilidade com pages/api/quote.ts.
 * @param key - Chave única (ex: IP do cliente)
 * @param maxAttempts - Número máximo de tentativas
 * @param windowMs - Janela de tempo em milissegundos
 * @returns true se permitido, false se excedeu limite
 */
export async function checkRateLimitRedis(
  key: string,
  maxAttempts: number = 5,
  windowMs: number = 60000
): Promise<boolean> {
  return Promise.resolve(checkRateLimit(key, maxAttempts, windowMs));
}

/**
 * Limpar rate limit de uma chave específica (no-op quando usando apenas in-memory).
 */
export async function clearRateLimit(_key: string): Promise<void> {
  // Store in-memory em utils/validation não expõe limpeza por chave; no-op.
}
