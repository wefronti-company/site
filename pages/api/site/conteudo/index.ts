import type { NextApiRequest, NextApiResponse } from 'next';
import { getAllConteudo } from '@/lib/siteConteudoDb';

/**
 * GET: retorna o conteúdo de todas as seções (público).
 * Usado pela home ou por quem quiser exibir o site com conteúdo do banco/default.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  try {
    const dados = await getAllConteudo();
    return res.status(200).json(dados);
  } catch (e) {
    console.error('[api/site/conteudo]', e);
    return res.status(500).json({ error: 'Erro ao buscar conteúdo.' });
  }
}
