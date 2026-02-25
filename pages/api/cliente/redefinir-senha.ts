import type { NextApiRequest, NextApiResponse } from 'next';
import { hashCodigoAcesso } from '../../../lib/auth';
import { checkRateLimit } from '../../../lib/rate-limit';
import { consumirCodigoEAtualizarSenhaCliente } from '../../../lib/clientDb';

const RATE_LIMIT_MS = 2000;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  if (checkRateLimit(req, RATE_LIMIT_MS, 'cliente-redefinir-senha')) {
    return res.status(429).json({ error: 'Muitas tentativas. Aguarde um momento.' });
  }

  const body = req.body as Record<string, unknown>;
  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
  const codigo = typeof body.codigo === 'string' ? body.codigo.replace(/\D/g, '').slice(0, 6) : '';
  const senha = typeof body.senha === 'string' ? body.senha : '';

  if (!email) return res.status(400).json({ error: 'E-mail é obrigatório.' });
  if (!codigo || codigo.length !== 6) return res.status(400).json({ error: 'Código inválido. Informe o código de 6 dígitos.' });
  if (!senha || senha.length < 6) return res.status(400).json({ error: 'A nova senha deve ter pelo menos 6 caracteres.' });

  const hash = hashCodigoAcesso(senha);
  const ok = await consumirCodigoEAtualizarSenhaCliente(email, codigo, hash);

  if (!ok) return res.status(400).json({ error: 'Código inválido ou expirado. Solicite um novo código.' });

  return res.status(200).json({ message: 'Senha alterada com sucesso. Faça login com a nova senha.' });
}
