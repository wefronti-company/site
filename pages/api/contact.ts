import type { NextApiRequest, NextApiResponse } from 'next';
import isEmail from 'validator/lib/isEmail';
import { checkRateLimit, getClientIp } from '../../lib/rate-limit';
import { sanitizeTextForStorage } from '../../lib/sanitize-server';
import { createRequest } from '../../lib/requestDb';

const RATE_LIMIT_MS = 20_000;

function getString(value: unknown, max = 500): string {
  if (typeof value !== 'string') return '';
  return sanitizeTextForStorage(value).slice(0, max);
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (checkRateLimit(req, RATE_LIMIT_MS, 'contact')) {
    return res.status(429).json({ error: 'Aguarde alguns segundos antes de enviar novamente.' });
  }

  const body = req.body as Record<string, unknown>;
  const nome = getString(body.nome, 120);
  const sobrenome = getString(body.sobrenome, 120);
  const email = getString(body.email, 254).toLowerCase();
  const assunto = getString(body.assunto, 200);
  const mensagem = getString(body.mensagem, 5000);

  if (!nome || !sobrenome || !email || !assunto || !mensagem) {
    return res.status(400).json({ error: 'Preencha todos os campos obrigatórios.' });
  }
  if (!isEmail(email)) {
    return res.status(400).json({ error: 'E-mail inválido.' });
  }

  try {
    await createRequest({
      tipo: 'Contato',
      nome,
      sobrenome,
      email,
      whatsapp: '—',
      investimento: assunto,
      tipoProjeto: null,
      contexto: mensagem,
      origem: 'pagina-contato',
      ip: getClientIp(req),
      userAgent: String(req.headers['user-agent'] || '').slice(0, 512),
    });
    return res.status(201).json({ ok: true });
  } catch (e) {
    console.error('[contact]', e);
    return res.status(500).json({ error: 'Erro ao enviar mensagem. Tente novamente.' });
  }
}
