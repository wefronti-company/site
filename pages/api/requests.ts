import type { NextApiRequest, NextApiResponse } from 'next';
import isEmail from 'validator/lib/isEmail';
import { checkRateLimit } from '../../lib/rate-limit';
import { sanitizeTextForStorage } from '../../lib/sanitize-server';

const RATE_LIMIT_MS = 20_000;

function getString(value: unknown, max = 500): string {
  if (typeof value !== 'string') return '';
  return sanitizeTextForStorage(value).slice(0, max);
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (checkRateLimit(req, RATE_LIMIT_MS, 'requests')) {
    return res.status(429).json({ error: 'Aguarde alguns segundos antes de enviar novamente.' });
  }

  const body = req.body as Record<string, unknown>;
  const tipo = getString(body.tipo, 120);
  const nome = getString(body.nome, 120);
  const sobrenome = getString(body.sobrenome, 120);
  const email = getString(body.email, 254).toLowerCase();
  const whatsapp = getString(body.whatsapp, 40);
  const investimento = getString(body.investimento, 80);
  const tipoProjeto = getString(body.tipoProjeto, 40);
  const contexto = getString(body.contexto, 5000);
  const origem = getString(body.origem, 120);
  const isSiteInstitucional = tipo.toLowerCase().includes('site');
  const isLandingPage = tipo.toLowerCase().includes('landing');
  const requiresProjectType = isSiteInstitucional;
  const requiresInvestment = isLandingPage;

  if (
    !tipo ||
    !nome ||
    !sobrenome ||
    !email ||
    !whatsapp ||
    (requiresInvestment && !investimento) ||
    (requiresProjectType && !tipoProjeto) ||
    !contexto
  ) {
    return res.status(400).json({ error: 'Preencha todos os campos obrigatórios.' });
  }
  if (!isEmail(email)) {
    return res.status(400).json({ error: 'E-mail inválido.' });
  }

  // Sem banco de dados: valida e retorna sucesso.
  return res.status(201).json({ ok: true });
}
