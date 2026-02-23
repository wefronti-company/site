import type { NextApiRequest, NextApiResponse } from 'next';
import isEmail from 'validator/lib/isEmail';
import { verifySessionToken, COOKIE_NAME, hashCodigoAcesso } from '../../../lib/auth';
import { sql } from '../../../lib/db';

function getTokenFromCookie(req: NextApiRequest): string | null {
  const cookie = req.headers.cookie;
  if (!cookie) return null;
  const match = cookie.match(new RegExp(`(?:^|; )${COOKIE_NAME}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método não permitido' });

  const token = getTokenFromCookie(req);
  if (!token) return res.status(401).json({ error: 'Não autenticado' });

  const payload = await verifySessionToken(token);
  if (!payload) return res.status(401).json({ error: 'Sessão inválida ou expirada' });

  if (!sql) return res.status(503).json({ error: 'Sistema indisponível.' });

  const adminRows = await sql`SELECT super_admin FROM admins WHERE id = ${payload.adminId} LIMIT 1`;
  const admin = adminRows[0] as { super_admin: boolean } | undefined;
  if (!admin?.super_admin) {
    return res.status(403).json({ error: 'Apenas super admin pode adicionar novos administradores.' });
  }

  const body = req.body as Record<string, unknown>;
  const nome = typeof body.nome === 'string' ? body.nome.trim().slice(0, 150) : '';
  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase().slice(0, 254) : '';
  const codigoAcesso = typeof body.codigoAcesso === 'string' ? body.codigoAcesso.trim().slice(0, 64) : '';

  if (!email || !codigoAcesso) {
    return res.status(400).json({ error: 'E-mail e código de acesso são obrigatórios.' });
  }
  if (!isEmail(email)) return res.status(400).json({ error: 'E-mail inválido.' });
  if (codigoAcesso.length < 4) {
    return res.status(400).json({ error: 'O código de acesso deve ter no mínimo 4 caracteres.' });
  }

  try {
    const hash = hashCodigoAcesso(codigoAcesso);
    await sql`
      INSERT INTO admins (nome, email, codigo_acesso_hash, super_admin)
      VALUES (${nome || null}, ${email}, ${hash}, false)
      ON CONFLICT (email) DO UPDATE SET
        nome = EXCLUDED.nome,
        codigo_acesso_hash = EXCLUDED.codigo_acesso_hash,
        atualizado_em = NOW()
    `;
    return res.status(201).json({ ok: true });
  } catch (e) {
    console.error('[Admin Create]', e);
    return res.status(500).json({ error: 'Erro ao criar administrador.' });
  }
}
