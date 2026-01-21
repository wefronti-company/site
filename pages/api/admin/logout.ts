import type { NextApiRequest, NextApiResponse } from 'next';
import { destroySession } from '../../../lib/adminSessions';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Accept POST to logout
  if (req.method !== 'POST') return res.status(405).end();

  try {
    const cookie = req.headers.cookie || '';
    const match = cookie.match(/admin_session=([^;]+)/);
    const token = match ? match[1] : null;
    await destroySession(token);

    // Clear cookie
    const cookieClear = ['admin_session=; Path=/; Max-Age=0; HttpOnly', 'SameSite=Strict'];
    if (process.env.NODE_ENV === 'production') cookieClear.push('Secure');
    res.setHeader('Set-Cookie', cookieClear.join('; '));

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('[ADMIN/LOGOUT] error', err);
    return res.status(500).json({ success: false });
  }
}
