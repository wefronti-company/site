import type { NextApiRequest, NextApiResponse } from 'next';
import isEmail from 'validator/lib/isEmail';
import { verifyCodigoAcesso } from '../../../lib/auth';
import { createUsuarioSessionToken } from '../../../lib/auth-usuario';
import { COOKIE_NAME } from '../../../lib/auth-usuario';
import { checkRateLimit } from '../../../lib/rate-limit';
import { sql } from '../../../lib/db';

const RATE_LIMIT_MS = 2000;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  if (checkRateLimit(req, RATE_LIMIT_MS, 'usuario-login')) {
    return res.status(429).json({ error: 'Muitas tentativas. Aguarde um momento.' });
  }

  const body = req.body as Record<string, unknown>;
  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
  const senha = typeof body.senha === 'string' ? body.senha : '';

  if (!email || !senha) {
    return res.status(400).json({ error: 'Preencha e-mail e senha.' });
  }
  if (!isEmail(email)) {
    return res.status(400).json({ error: 'E-mail inválido.' });
  }

  if (!sql) {
    return res.status(500).json({ error: 'Erro de configuração. Tente novamente.' });
  }

  const rows = await sql`
    SELECT id, email, nome_completo, codigo_referencia, codigo_acesso_hash
    FROM usuarios WHERE email = ${email} LIMIT 1
  `;
  const row = rows[0] as { id: string; email: string; nome_completo: string; codigo_referencia: string; codigo_acesso_hash: string } | undefined;
  if (!row || !verifyCodigoAcesso(senha, row.codigo_acesso_hash)) {
    return res.status(401).json({ error: 'E-mail ou senha incorretos.' });
  }

  const token = await createUsuarioSessionToken(row.id, row.email);
  const isProd = process.env.NODE_ENV === 'production';
  const maxAge = 8 * 60 * 60; // 8h
  res.setHeader('Set-Cookie', [
    `${COOKIE_NAME}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAge}` +
      (isProd ? '; Secure' : ''),
  ]);
  return res.status(200).json({ message: 'Login realizado.' });
}
