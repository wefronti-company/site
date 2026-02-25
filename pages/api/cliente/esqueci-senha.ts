import type { NextApiRequest, NextApiResponse } from 'next';
import isEmail from 'validator/lib/isEmail';
import { checkRateLimit } from '../../../lib/rate-limit';
import { getClienteByEmail, createResetCodigoCliente } from '../../../lib/clientDb';
import { sendMail } from '../../../lib/email';

const RATE_LIMIT_MS = 60_000;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  if (checkRateLimit(req, RATE_LIMIT_MS, 'cliente-esqueci-senha')) {
    return res.status(429).json({ error: 'Aguarde um minuto antes de solicitar outro código.' });
  }

  const body = req.body as Record<string, unknown>;
  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';

  if (!email) return res.status(400).json({ error: 'Informe o e-mail.' });
  if (!isEmail(email)) return res.status(400).json({ error: 'E-mail inválido.' });

  const cliente = await getClienteByEmail(email);
  if (cliente) {
    try {
      const codigo = await createResetCodigoCliente(cliente.id);
      const enviado = await sendMail({
        to: cliente.email,
        subject: 'Seu código de acesso chegou',
        html: `<p>Olá${cliente.nome ? ', ' + cliente.nome : ''}!</p><p>Use o código para criar uma nova senha:</p><p style="font-size:24px;font-weight:bold;">${codigo}</p><p>Expira em 1 hora.</p>`,
        text: 'Seu código: ' + codigo + '\nExpira em 1 hora.',
      });
      if (!enviado) return res.status(500).json({ error: 'Erro ao enviar e-mail. Tente novamente.' });
    } catch (err) {
      console.error('[cliente-esqueci-senha]', err);
      return res.status(500).json({ error: 'Erro ao processar. Tente novamente.' });
    }
  }

  return res.status(200).json({ message: 'Se o e-mail estiver cadastrado, você receberá o código em breve.' });
}
