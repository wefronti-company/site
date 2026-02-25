import type { NextApiRequest, NextApiResponse } from 'next';
import isEmail from 'validator/lib/isEmail';
import { getClienteLoginByEmail } from '../../../lib/clientDb';
import { verifyCodigoAcesso } from '../../../lib/auth';
import { createClienteSessionToken, COOKIE_NAME } from '../../../lib/auth-cliente';
import { checkRateLimit } from '../../../lib/rate-limit';

const RATE_LIMIT_MS = 2000;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  if (checkRateLimit(req, RATE_LIMIT_MS, 'cliente-login')) {
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

  const login = await getClienteLoginByEmail(email);
  if (!login?.codigoAcessoHash || !verifyCodigoAcesso(senha, login.codigoAcessoHash)) {
    return res.status(401).json({ error: 'E-mail ou senha incorretos.' });
  }

  const token = await createClienteSessionToken(login.id, login.email);
  const isProd = process.env.NODE_ENV === 'production';
  const maxAge = 8 * 60 * 60; // 8h
  res.setHeader('Set-Cookie', [
    `${COOKIE_NAME}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAge}` +
      (isProd ? '; Secure' : ''),
  ]);
  return res.status(200).json({ message: 'Login realizado.' });
}
