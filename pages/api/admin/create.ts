import type { NextApiRequest, NextApiResponse } from 'next';
import { hash } from '../../../lib/bcrypt';
import { isValidEmail } from '../../../utils/security-frontend';
import { getAdminByEmail, createAdmin } from '../../../lib/adminUsers';

type ResponseData = { success: boolean; message?: string };

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  if (req.method !== 'POST') return res.status(405).json({ success: false, message: 'Method not allowed' });

  // Protect this endpoint: allowed if running in non-production (dev) OR if a valid ADMIN_SETUP_TOKEN header is present
  const token = req.headers['x-admin-setup-token'];
  const allowedByToken = process.env.ADMIN_SETUP_TOKEN && token === process.env.ADMIN_SETUP_TOKEN;
  if (process.env.NODE_ENV === 'production' && !allowedByToken) {
    return res.status(403).json({ success: false, message: 'Not allowed' });
  }

  try {
    const { email, password, name, role } = req.body;
    if (!email || !password) return res.status(400).json({ success: false, message: 'Missing email or password' });
    if (!isValidEmail(email)) return res.status(400).json({ success: false, message: 'Email inválido' });
    if (typeof password !== 'string' || password.length < 8) return res.status(400).json({ success: false, message: 'Senha muito curta (mínimo 8 caracteres)' });

    const existing = await getAdminByEmail(email);
    if (existing) return res.status(409).json({ success: false, message: 'Usuário já existe' });

    const password_hash = await hash(password, 12);
    const created = await createAdmin({ email, password_hash, name, role });
    if (!created) return res.status(500).json({ success: false, message: 'Erro ao criar usuário' });

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('[ADMIN/CREATE] error', err);
    return res.status(500).json({ success: false, message: 'Erro interno' });
  }
}