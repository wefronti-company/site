import type { NextApiRequest, NextApiResponse } from 'next';
import isEmail from 'validator/lib/isEmail';
import { createCliente } from '../../lib/clientDb';
import { checkRateLimit } from '../../lib/rate-limit';
import { sanitizeTextForStorage } from '../../lib/sanitize-server';

const RATE_LIMIT_MS = 60_000; // 1 cadastro por IP a cada 60s (evita spam)

/**
 * Cadastro público: cria um novo cliente (sem autenticação).
 * Protegido por: rate limit, validação server-side, sanitização (XSS), resposta mínima (não vaza id/status).
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (checkRateLimit(req, RATE_LIMIT_MS, 'cadastro')) {
    return res.status(429).json({ error: 'Aguarde um momento antes de enviar novamente.' });
  }

  const body = req.body as Record<string, unknown>;

  const nome = typeof body.nome === 'string' ? sanitizeTextForStorage(body.nome).slice(0, 150) : '';
  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase().slice(0, 254) : '';
  const razaoSocial = typeof body.razaoSocial === 'string' ? sanitizeTextForStorage(body.razaoSocial).slice(0, 200) : '';

  if (!nome || !email || !razaoSocial) {
    return res.status(400).json({
      error: 'Preencha nome, e-mail e razão social.',
    });
  }

  if (!isEmail(email)) {
    return res.status(400).json({ error: 'E-mail inválido.' });
  }

  try {
    await createCliente({
      nome,
      email,
      cpf: typeof body.cpf === 'string' ? body.cpf.replace(/\D/g, '').slice(0, 11) || undefined : undefined,
      celular: typeof body.celular === 'string' ? body.celular.replace(/\D/g, '').slice(0, 20) || undefined : undefined,
      razaoSocial,
      cnpj: typeof body.cnpj === 'string' ? body.cnpj.replace(/\D/g, '').slice(0, 14) || undefined : undefined,
      site: typeof body.site === 'string' ? sanitizeTextForStorage(body.site).slice(0, 200) || undefined : undefined,
      enderecoLogradouro: typeof body.enderecoLogradouro === 'string' ? sanitizeTextForStorage(body.enderecoLogradouro).slice(0, 150) || undefined : undefined,
      enderecoNumero: typeof body.enderecoNumero === 'string' ? sanitizeTextForStorage(body.enderecoNumero).slice(0, 20) || undefined : undefined,
      enderecoComplemento: typeof body.enderecoComplemento === 'string' ? sanitizeTextForStorage(body.enderecoComplemento).slice(0, 80) || undefined : undefined,
      enderecoBairro: typeof body.enderecoBairro === 'string' ? sanitizeTextForStorage(body.enderecoBairro).slice(0, 80) || undefined : undefined,
      enderecoCidade: typeof body.enderecoCidade === 'string' ? sanitizeTextForStorage(body.enderecoCidade).slice(0, 80) || undefined : undefined,
      enderecoUf: typeof body.enderecoUf === 'string' ? body.enderecoUf.trim().slice(0, 2).toUpperCase() || undefined : undefined,
      enderecoCep: typeof body.enderecoCep === 'string' ? body.enderecoCep.replace(/\D/g, '').slice(0, 8) || undefined : undefined,
      mensalidade: 0,
    });

    return res.status(201).json({ ok: true, message: 'Cadastro realizado com sucesso.' });
  } catch (e) {
    console.error('[cadastro]', e);
    return res.status(500).json({ error: 'Erro ao cadastrar. Tente novamente.' });
  }
}
