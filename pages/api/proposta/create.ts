import type { NextApiRequest, NextApiResponse } from 'next';
import { upsertProposal } from '../../../lib/proposalDb';

interface Body {
  empresa: string;
  cliente: string;
  servico: string;
  preco: number;
  manutencao?: '' | 'sim';
  precoManutencao?: number;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const body = req.body as Body;

  if (!body.empresa?.trim() || !body.cliente?.trim() || !body.servico?.trim()) {
    return res.status(400).json({
      error: 'Preencha empresa, cliente e serviço.',
    });
  }

  const preco = Number(body.preco);
  if (!preco || preco < 100) {
    return res.status(400).json({ error: 'Preço inválido (mínimo R$ 100).' });
  }

  const slug = body.empresa.trim().toLowerCase().replace(/\s+/g, '-');
  const manutencao = body.manutencao === 'sim' ? 'sim' : '';
  const precoManutencao = manutencao === 'sim' ? Math.max(0, Number(body.precoManutencao) || 0) : 0;

  const proposal = await upsertProposal({
    slug,
    empresa: body.empresa.trim(),
    cliente: body.cliente.trim(),
    servico: body.servico.trim(),
    preco,
    manutencao,
    precoManutencao,
  });

  const host = req.headers.host || '';
  const isLocal = host.includes('localhost') || host.includes('127.0.0.1');
  const baseUrl = isLocal
    ? `http://${host}`
    : (process.env.NEXT_PUBLIC_SITE_URL || `https://${host}`);
  const link = `${baseUrl}/proposta/${proposal.slug}`;

  return res.status(200).json({
    slug: proposal.slug,
    codigo: proposal.codigo,
    link,
    enviadoEm: proposal.enviadoEm,
  });
}
