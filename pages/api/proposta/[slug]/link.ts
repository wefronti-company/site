import type { NextApiRequest, NextApiResponse } from 'next';
import { setProposalLinkAtivo } from '../../../../lib/proposalDb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'PATCH') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const slug = typeof req.query.slug === 'string' ? req.query.slug : '';
  if (!slug) return res.status(400).json({ error: 'Slug inválido.' });

  const ativo = req.body?.ativo;
  if (typeof ativo !== 'boolean') {
    return res.status(400).json({ error: 'Envie { ativo: true | false }.' });
  }

  try {
    const ok = await setProposalLinkAtivo(slug, ativo);
    if (!ok) return res.status(404).json({ error: 'Proposta não encontrada.' });
    return res.status(200).json({ ok: true, ativo });
  } catch (e) {
    console.error('[proposta/link]', e);
    return res.status(500).json({ error: 'Erro ao atualizar.' });
  }
}
