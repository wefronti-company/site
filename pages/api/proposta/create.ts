import type { NextApiRequest, NextApiResponse } from 'next';
import { addProposal } from '../../../lib/proposalData';
import type { ProposalItem } from '../../../lib/proposalData';

interface Body {
  slug: string;
  cliente: string;
  empresa?: string;
  itens: ProposalItem[];
  observacoes?: string;
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const body = req.body as Body;

  if (!body.slug?.trim() || !body.cliente?.trim() || !body.itens?.length) {
    return res.status(400).json({
      error: 'Preencha slug, cliente e pelo menos um item.',
    });
  }

  const slug = body.slug.trim().toLowerCase().replace(/\s+/g, '-');
  const itens = body.itens.filter((i) => i.descricao?.trim()).map((i) => ({
    descricao: i.descricao.trim(),
    valor: Number(i.valor) || 0,
  }));

  if (itens.length === 0) {
    return res.status(400).json({ error: 'Adicione pelo menos um serviço.' });
  }

  const proposal = addProposal({
    slug,
    cliente: body.cliente.trim(),
    empresa: body.empresa?.trim() || undefined,
    itens,
    observacoes: body.observacoes?.trim() || undefined,
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
