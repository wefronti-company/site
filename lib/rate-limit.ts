/**
 * Rate limit por IP para APIs (uso server-side).
 * Cada slug (ex: 'usuario-login') tem seu próprio intervalo por IP.
 */
import type { NextApiRequest } from 'next';

const store = new Map<string, number>();
const MAX_ENTRIES = 50000;
const PRUNE_AFTER = 1000;

function prune(): void {
  if (store.size < MAX_ENTRIES) return;
  const now = Date.now();
  const cutoff = now - 3600000; // 1h
  store.forEach((ts, key) => {
    if (ts < cutoff) store.delete(key);
  });
}

export function getClientIp(req: NextApiRequest): string {
  const forwarded = req.headers['x-forwarded-for'];
  const ip = Array.isArray(forwarded) ? forwarded[0] : forwarded ?? req.socket?.remoteAddress ?? 'unknown';
  return String(ip).trim();
}

/**
 * Verifica rate limit por IP. Se retornar true, a API deve responder 429.
 * @param req - NextApiRequest
 * @param minIntervalMs - intervalo mínimo entre requisições (por IP e slug)
 * @param slug - identificador da rota (ex: 'usuario-login') para limitar por endpoint
 */
export function checkRateLimit(req: NextApiRequest, minIntervalMs: number, slug: string): boolean {
  const ip = getClientIp(req);
  const key = `${slug}:${ip}`;
  const now = Date.now();
  const last = store.get(key) ?? 0;
  if (now - last < minIntervalMs) return true;
  if (store.size > MAX_ENTRIES - PRUNE_AFTER) prune();
  store.set(key, now);
  return false;
}
