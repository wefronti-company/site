import type { NextApiRequest, NextApiResponse } from 'next';
import { compare } from '../../../lib/bcrypt';
import { createSession } from '../../../lib/adminSessions';
import { checkRateLimitRedis } from '../../../lib/redis';

type ResponseData = { success: boolean; message?: string };

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  if (req.method !== 'POST') return res.status(405).json({ success: false, message: 'Method not allowed' });

  try {
    const ip = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || 'unknown';
    const allowed = await checkRateLimitRedis(`admin_login:${ip}`, 5, 60_000);
    if (!allowed) return res.status(429).json({ success: false, message: 'Muitas tentativas. Aguarde.' });

    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ success: false, message: 'Credenciais incompletas' });

    // Try DB-backed admin first
    try {
      // Import lazily to keep startup fast
      const { getAdminByEmail } = await import('../../../lib/adminUsers');
      const admin = await getAdminByEmail(email);
      if (admin) {
        if (!admin.active) return res.status(401).json({ success: false, message: 'Credenciais inválidas' });
        const ok = await compare(password, admin.password_hash);
        if (!ok) return res.status(401).json({ success: false, message: 'Credenciais inválidas' });

        const token = await createSession(email);
        const isProd = process.env.NODE_ENV === 'production';
        const cookieParts = [`admin_session=${token}`, 'Path=/', `Max-Age=${60 * 60}`, 'HttpOnly', 'SameSite=Strict'];
        if (isProd) cookieParts.push('Secure');
        res.setHeader('Set-Cookie', cookieParts.join('; '));
        return res.status(200).json({ success: true });
      }
    } catch (e) {
      // If DB is not configured or query fails, fall back to env-based admin (handled below)
      console.warn('[ADMIN] db lookup failed, falling back to env:', e?.message || e);
    }

    // Fallback to environment-configured admin (legacy behaviour)
    const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
    const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH;

    if (!ADMIN_EMAIL) {
      console.warn('[ADMIN] ADMIN_EMAIL not configured');
      return res.status(500).json({ success: false, message: 'Admin not configured' });
    }

    if (email !== ADMIN_EMAIL) return res.status(401).json({ success: false, message: 'Credenciais inválidas' });

    // if password hash is configured, compare with bcrypt
    if (ADMIN_PASSWORD_HASH) {
      const ok = await compare(password, ADMIN_PASSWORD_HASH);
      if (!ok) return res.status(401).json({ success: false, message: 'Credenciais inválidas' });
    } else {
      // fallback to plain ADMIN_PASSWORD for dev (not recommended)
      const plain = process.env.ADMIN_PASSWORD_PLAIN || '';
      if (!plain || password !== plain) return res.status(401).json({ success: false, message: 'Credenciais inválidas' });
    }

    const token = await createSession(email);

    // Set cookie
    const isProd = process.env.NODE_ENV === 'production';
    const cookieParts = [`admin_session=${token}`, 'Path=/', `Max-Age=${60 * 60}`, 'HttpOnly', 'SameSite=Strict'];
    if (isProd) cookieParts.push('Secure');
    res.setHeader('Set-Cookie', cookieParts.join('; '));

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('[ADMIN/LOGIN] error', err);
    return res.status(500).json({ success: false, message: 'Erro interno' });
  }
}
