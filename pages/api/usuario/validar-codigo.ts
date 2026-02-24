import type { NextApiRequest, NextApiResponse } from 'next';
import isEmail from 'validator/lib/isEmail';
import { checkRateLimit } from '../../../lib/rate-limit';
import { validarCodigoReset } from '../../../lib/usuarioDb';

const RATE_LIMIT_MS = 2000;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  if (checkRateLimit(req, RATE_LIMIT_MS, 'usuario-validar-codigo')) {
    return res.status(429).json({ error: 'Muitas tentativas. Aguarde um momento.' });
  }

  const body = req.body as Record<string, unknown>;
  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
  const codigo = typeof body.codigo === 'string' ? body.codigo.replace(/\D/g, '').slice(0, 6) : '';

  if (!email) {
    return res.status(400).json({ error: 'E-mail é obrigatório.' });
  }
  if (!isEmail(email)) {
    return res.status(400).json({ error: 'E-mail inválido.' });
  }
  if (!codigo || codigo.length !== 6) {
    return res.status(400).json({ error: 'Informe o código de 6 dígitos.' });
  }

  const usuarioId = await validarCodigoReset(email, codigo);
  if (!usuarioId) {
    return res.status(400).json({
      error: 'Código inválido ou expirado. Solicite um novo código.',
    });
  }

  return res.status(200).json({ message: 'Código válido.' });
}
