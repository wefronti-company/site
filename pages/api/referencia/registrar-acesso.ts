import type { NextApiRequest, NextApiResponse } from 'next';
import { createHash } from 'crypto';
import { validarCodigoReferencia, registrarAcessoIndicacao, getUsuarioByCodigoReferenciaIncludeInativo } from '../../../lib/usuarioDb';

const REF_RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minuto
const REF_RATE_LIMIT_MAX = 10; // máx. 10 registros por IP por minuto

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function getClientIp(req: NextApiRequest): string {
  const forwarded = req.headers['x-forwarded-for'];
  const raw = typeof forwarded === 'string'
    ? forwarded.split(',')[0].trim()
    : Array.isArray(forwarded)
      ? forwarded[0]?.trim()
      : '';
  return raw || (req.headers['x-real-ip'] as string) || req.socket?.remoteAddress || '';
}

function hashIp(ip: string): string {
  return createHash('sha256').update(ip, 'utf8').digest('hex');
}

function isOriginAllowed(req: NextApiRequest): boolean {
  const origin = req.headers.origin;
  const referer = req.headers.referer;
  const base = (process.env.NEXT_PUBLIC_SITE_URL || 'https://wefronti.com').replace(/\/+$/, '');
  const localhost = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i;
  const allowed = (url: string) => url === base || localhost.test(url);
  if (origin && allowed(origin)) return true;
  if (referer) {
    try {
      const u = new URL(referer);
      const refOrigin = `${u.protocol}//${u.host}`;
      if (allowed(refOrigin)) return true;
    } catch { /* ignore */ }
  }
  return false;
}

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + REF_RATE_LIMIT_WINDOW_MS });
    return true;
  }
  if (now >= entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + REF_RATE_LIMIT_WINDOW_MS });
    return true;
  }
  entry.count++;
  if (entry.count > REF_RATE_LIMIT_MAX) return false;
  return true;
}

/**
 * Registra um acesso via link de indicação (?ref=).
 * Proteções: formato do ref, rate limit por IP, deduplicação por IP/24h, origem do request.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const ref = typeof req.body?.ref === 'string' ? req.body.ref.trim().toLowerCase() : '';
  if (!ref) {
    return res.status(400).json({ error: 'Código de referência inválido.' });
  }
  if (!validarCodigoReferencia(ref)) {
    return res.status(400).json({ error: 'Código de referência inválido.' });
  }

  const ip = getClientIp(req);
  if (!ip) {
    return res.status(400).json({ error: 'Não foi possível identificar a origem.' });
  }
  if (!checkRateLimit(ip)) {
    return res.status(429).json({ error: 'Muitas tentativas. Tente novamente mais tarde.' });
  }

  if (!isOriginAllowed(req)) {
    return res.status(403).json({ error: 'Requisição não autorizada.' });
  }

  const usuario = await getUsuarioByCodigoReferenciaIncludeInativo(ref);
  if (!usuario) {
    return res.status(400).json({ error: 'Código de referência inválido.' });
  }
  if (!usuario.ativo) {
    return res.status(404).json({ error: 'Link indisponível.', code: 'REF_LINK_UNAVAILABLE' });
  }

  const ipHash = hashIp(ip);
  const ok = await registrarAcessoIndicacao(ref, ipHash);
  return res.status(200).json({ ok });
}
