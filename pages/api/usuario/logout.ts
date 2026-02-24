import type { NextApiRequest, NextApiResponse } from 'next';
import { COOKIE_NAME } from '../../../lib/auth-usuario';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  res.setHeader('Set-Cookie', `${COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`);
  return res.status(200).json({ message: 'Logout realizado.' });
}
