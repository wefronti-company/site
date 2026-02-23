import type { NextApiRequest, NextApiResponse } from 'next';
import { updateProposal } from '../../../../lib/proposalDb';

interface Body {
  empresa?: string;
  cliente?: string;
  servico?: string;
  preco?: number;
  manutencao?: '' | 'sim';
  precoManutencao?: number;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'PATCH') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const slug = typeof req.query.slug === 'string' ? req.query.slug : '';
  if (!slug) return res.status(400).json({ error: 'Slug inválido.' });

  const body = req.body as Body;
  if (!body.empresa?.trim() || !body.cliente?.trim() || !body.servico?.trim()) {
    return res.status(400).json({ error: 'Preencha empresa, cliente e serviço.' });
  }

  const preco = Number(body.preco);
  if (!preco || preco < 100) {
    return res.status(400).json({ error: 'Preço inválido (mínimo R$ 100).' });
  }

  const manutencao = body.manutencao === 'sim' ? 'sim' : '';
  const precoManutencao = manutencao === 'sim' ? Math.max(0, Number(body.precoManutencao) || 0) : 0;

  try {
    const proposal = await updateProposal(slug, {
      empresa: body.empresa.trim(),
      cliente: body.cliente.trim(),
      servico: body.servico.trim(),
      preco,
      manutencao,
      precoManutencao,
    });
    if (!proposal) return res.status(404).json({ error: 'Proposta não encontrada.' });
    return res.status(200).json(proposal);
  } catch (e) {
    console.error('[proposta/update]', e);
    return res.status(500).json({ error: 'Erro ao atualizar proposta.' });
  }
}
