/**
 * API de logout - invalida o cookie de sessão.
 */
import type { NextApiRequest, NextApiResponse } from 'next';
import { COOKIE_NAME, COOKIE_REFRESH_NAME } from '../../../lib/auth';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  const suffix = process.env.NODE_ENV === 'production' ? '; Secure' : '';
  res.setHeader('Set-Cookie', [
    `${COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0${suffix}`,
    `${COOKIE_REFRESH_NAME}=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0${suffix}`,
  ]);
  return res.status(200).json({ ok: true });
}
