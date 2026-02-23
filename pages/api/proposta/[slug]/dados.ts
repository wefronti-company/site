import type { NextApiRequest, NextApiResponse } from 'next';
import { getProposalBySlug } from '../../../../lib/proposalDb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const slug = typeof req.query.slug === 'string' ? req.query.slug : '';
  if (!slug) return res.status(400).json({ error: 'Slug inválido.' });

  try {
    const proposal = await getProposalBySlug(slug);
    if (!proposal) return res.status(404).json({ error: 'Proposta não encontrada.' });
    return res.status(200).json(proposal);
  } catch (e) {
    console.error('[proposta/dados]', e);
    return res.status(500).json({ error: 'Erro ao buscar proposta.' });
  }
}
