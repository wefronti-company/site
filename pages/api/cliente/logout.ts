import type { NextApiRequest, NextApiResponse } from 'next';
import { COOKIE_NAME } from '../../../lib/auth-cliente';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const isProd = process.env.NODE_ENV === 'production';
  res.setHeader('Set-Cookie', `${COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0${isProd ? '; Secure' : ''}`);
  return res.status(200).json({ message: 'Logout realizado.' });
}
