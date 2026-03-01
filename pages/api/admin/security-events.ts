/**
 * API para listar eventos de segurança (admin).
 */
import type { NextApiRequest, NextApiResponse } from 'next';
import { verifySessionToken, COOKIE_NAME } from '../../../lib/auth';
import { getSecurityEvents, getSecurityEventCount } from '../../../lib/securityEventsDb';

function getTokenFromCookie(req: NextApiRequest): string | null {
  const cookie = req.headers.cookie;
  if (!cookie) return null;
  const match = cookie.match(new RegExp(`(?:^|; )${COOKIE_NAME}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const token = getTokenFromCookie(req);
  if (!token) {
    return res.status(401).json({ error: 'Não autenticado' });
  }

  const payload = await verifySessionToken(token);
  if (!payload) {
    return res.status(401).json({ error: 'Sessão inválida ou expirada' });
  }

  const sinceHours = typeof req.query.hours === 'string' ? parseInt(req.query.hours, 10) : 24;
  const limit = typeof req.query.limit === 'string' ? parseInt(req.query.limit, 10) : 50;

  try {
    const [events, total] = await Promise.all([
      getSecurityEvents(Math.min(limit, 100), Math.min(Math.max(sinceHours, 1), 168)),
      getSecurityEventCount(Math.min(Math.max(sinceHours, 1), 168)),
    ]);
    return res.status(200).json({ events, total });
  } catch (e) {
    console.error('[admin/security-events]', e);
    return res.status(500).json({ error: 'Erro ao listar eventos' });
  }
}
