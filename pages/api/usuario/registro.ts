import type { NextApiRequest, NextApiResponse } from 'next';
import isEmail from 'validator/lib/isEmail';
import { hashCodigoAcesso } from '../../../lib/auth';
import { sanitizeTextForStorage } from '../../../lib/sanitize-server';
import { checkRateLimit } from '../../../lib/rate-limit';
import { getUsuarioByEmail, createUsuario } from '../../../lib/usuarioDb';

const RATE_LIMIT_MS = 2000;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  if (checkRateLimit(req, RATE_LIMIT_MS, 'usuario-registro')) {
    return res.status(429).json({ error: 'Muitas tentativas. Aguarde um momento.' });
  }

  const body = req.body as Record<string, unknown>;
  const nomeCompleto = typeof body.nomeCompleto === 'string' ? sanitizeTextForStorage(body.nomeCompleto).slice(0, 200) : '';
  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
  const senha = typeof body.senha === 'string' ? body.senha : '';

  if (!nomeCompleto) {
    return res.status(400).json({ error: 'Preencha o nome.' });
  }
  if (!email) {
    return res.status(400).json({ error: 'Preencha o e-mail.' });
  }
  if (!isEmail(email)) {
    return res.status(400).json({ error: 'E-mail inválido.' });
  }
  if (!senha || senha.length < 6) {
    return res.status(400).json({ error: 'A senha deve ter pelo menos 6 caracteres.' });
  }

  const existente = await getUsuarioByEmail(email);
  if (existente) {
    return res.status(409).json({ error: 'Este e-mail já está cadastrado. Faça login ou use "Esqueceu senha?".' });
  }

  try {
    const hash = hashCodigoAcesso(senha);
    await createUsuario({ nomeCompleto, email, senhaHash: hash });
    return res.status(201).json({ message: 'Conta criada com sucesso!' });
  } catch (err) {
    console.error('[registro]', err);
    return res.status(500).json({ error: 'Erro ao criar conta. Tente novamente.' });
  }
}
