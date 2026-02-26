import type { NextApiRequest, NextApiResponse } from 'next';
import { checkRateLimit } from '../../../lib/rate-limit';

const RATE_LIMIT_MS = 2000; // 1 consulta por IP a cada 2s (evita abuso/ViaCEP)

export interface ViaCepResponse {
  cep?: string;
  logradouro?: string;
  complemento?: string;
  bairro?: string;
  localidade?: string;
  uf?: string;
  erro?: boolean;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (checkRateLimit(req, RATE_LIMIT_MS, 'cep')) {
    return res.status(429).json({ error: 'Aguarde um momento para consultar outro CEP.' });
  }

  const cep = typeof req.query.cep === 'string' ? req.query.cep.replace(/\D/g, '') : '';
  if (cep.length !== 8) {
    return res.status(400).json({ error: 'CEP inválido. Informe 8 dígitos.' });
  }

  try {
    const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`, {
      headers: { Accept: 'application/json' },
    });

    if (!response.ok) {
      return res.status(502).json({ error: 'Erro ao consultar CEP. Tente novamente.' });
    }

    const data = (await response.json()) as ViaCepResponse;

    if (data.erro) {
      return res.status(404).json({ error: 'CEP não encontrado.' });
    }

    return res.status(200).json({
      logradouro: data.logradouro ?? '',
      bairro: data.bairro ?? '',
      localidade: data.localidade ?? '',
      uf: data.uf ?? '',
    });
  } catch (e) {
    console.error('[api/cep]', e);
    return res.status(500).json({ error: 'Erro ao buscar CEP. Tente novamente.' });
  }
}
