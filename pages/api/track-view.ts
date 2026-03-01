/**
 * API para registrar visualização de página (anonimizada).
 */
import type { NextApiRequest, NextApiResponse } from 'next';
import { checkRateLimit, getClientIp } from '../../lib/rate-limit';
import { recordPageView } from '../../lib/siteViewsDb';
import { sanitizeTextForStorage } from '../../lib/sanitize-server';
import { createHash } from 'crypto';

const RATE_LIMIT_MS = 5000; // 1 request per 5s per IP

function hashIp(ip: string): string {
  if (!ip || ip === 'unknown') return '';
  return createHash('sha256').update(ip + (process.env.IP_HASH_SALT || 'wefronti')).digest('hex').slice(0, 16);
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (checkRateLimit(req, RATE_LIMIT_MS, 'track-view')) {
    return res.status(429).json({ error: 'Aguarde um momento.' });
  }

  const body = req.body as Record<string, unknown>;
  const rawPath = typeof body.path === 'string' ? body.path : '/';
  const path = sanitizeTextForStorage(rawPath).slice(0, 500) || '/';

  const ip = getClientIp(req);
  const ipHash = hashIp(ip);

  const country = (req.headers['x-vercel-ip-country'] as string) || null;

  try {
    await recordPageView(path, ipHash || null, country);
    return res.status(201).json({ ok: true });
  } catch (e) {
    console.error('[track-view]', e);
    return res.status(500).json({ error: 'Erro ao registrar visualização' });
  }
}
