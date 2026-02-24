import type { NextApiRequest, NextApiResponse } from 'next';
import isEmail from 'validator/lib/isEmail';
import { checkRateLimit } from '../../../lib/rate-limit';
import { getUsuarioByEmail, createResetCodigo } from '../../../lib/usuarioDb';
import { sendMail } from '../../../lib/email';

/** Intervalo mínimo entre solicitações de código (evita spam de e-mail). */
const RATE_LIMIT_MS = 60_000;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  if (checkRateLimit(req, RATE_LIMIT_MS, 'usuario-esqueci-senha')) {
    return res.status(429).json({ error: 'Aguarde um minuto antes de solicitar outro código.' });
  }

  const body = req.body as Record<string, unknown>;
  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';

  if (!email) {
    return res.status(400).json({ error: 'Informe o e-mail.' });
  }
  if (!isEmail(email)) {
    return res.status(400).json({ error: 'E-mail inválido.' });
  }

  const usuario = await getUsuarioByEmail(email);

  if (usuario) {
    try {
      const codigo = await createResetCodigo(usuario.id);

      const enviado = await sendMail({
        to: usuario.email,
        subject: 'Seu código de acesso chegou',
        html: `
          <p>Olá${usuario.nomeCompleto ? `, ${usuario.nomeCompleto}` : ''}!</p>
          <p>Você solicitou a redefinição de senha. Use o código abaixo para criar uma nova senha:</p>
          <p style="font-size:24px;font-weight:bold;letter-spacing:4px;">${codigo}</p>
          <p>Este código expira em 1 hora. Se não foi você quem solicitou, ignore este e-mail.</p>
          <p>— Equipe Wefronti</p>
        `,
        text: `Seu código: ${codigo}\n\nExpira em 1 hora. Se não foi você, ignore.`,
      });

      if (!enviado) {
        console.error('[esqueci-senha] Falha ao enviar e-mail para', email);
        return res.status(500).json({
          error: 'Erro ao enviar e-mail. Tente novamente mais tarde.',
        });
      }
    } catch (err) {
      console.error('[esqueci-senha]', err);
      return res.status(500).json({ error: 'Erro ao processar solicitação. Tente novamente.' });
    }
  }

  return res.status(200).json({
    message: 'Se o e-mail estiver cadastrado, você receberá o código em breve.',
  });
}
