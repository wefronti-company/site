/**
 * API de refresh da sessão.
 * Usa o token de refresh para emitir um novo token de sessão (15 min).
 * Requer que o tempo absoluto não tenha excedido 8h.
 */
import type { NextApiRequest, NextApiResponse } from 'next';
import { createSessionToken, verifyRefreshToken, COOKIE_NAME, COOKIE_REFRESH_NAME } from '../../../lib/auth';

function getRefreshFromCookie(req: NextApiRequest): string | null {
  const cookie = req.headers.cookie;
  if (!cookie) return null;
  const match = cookie.match(new RegExp(`(?:^|; )${COOKIE_REFRESH_NAME}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST' && req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const refreshToken = getRefreshFromCookie(req);
  if (!refreshToken) {
    return res.status(401).json({ error: 'Sessão expirada. Faça login novamente.' });
  }

  const payload = await verifyRefreshToken(refreshToken);
  if (!payload) {
    return res.status(401).json({ error: 'Sessão expirada. Faça login novamente.' });
  }

  const sessionToken = await createSessionToken(payload.adminId, payload.email);
  const isProd = process.env.NODE_ENV === 'production';
  const sessionMaxAge = 15 * 60;

  res.setHeader('Set-Cookie', [
    `${COOKIE_NAME}=${sessionToken}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${sessionMaxAge}` +
      (isProd ? '; Secure' : ''),
  ]);
  return res.status(200).json({ ok: true });
}
