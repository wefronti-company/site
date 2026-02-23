import type { NextApiRequest, NextApiResponse } from 'next';
import { getProposalBySlug, isProposalExpired } from '../../../../lib/proposalDb';
import {
  generateProposalHtml,
  generateExpiredHtml,
  generateNotFoundHtml,
} from '../../../../lib/proposalHtml';

/**
 * API que gera e retorna a página temporária da proposta em HTML.
 * Acessado via rewrite: /proposta/:slug -> /api/proposta/:slug
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const slug = typeof req.query.slug === 'string' ? req.query.slug : '';
  const proposal = await getProposalBySlug(slug);

  if (!proposal) {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    return res.status(404).send(generateNotFoundHtml());
  }

  if (isProposalExpired(proposal)) {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    return res.status(410).send(generateExpiredHtml());
  }

  if (proposal.linkAtivo === false) {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    return res.status(404).send(generateNotFoundHtml());
  }

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
  return res.status(200).send(generateProposalHtml(proposal));
}
