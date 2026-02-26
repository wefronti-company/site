import type { NextApiRequest, NextApiResponse } from 'next';
import { getConteudo, setConteudo, isSecaoValida } from '@/lib/siteConteudoDb';

/**
 * GET: retorna o conteúdo da seção (público). Retorna default se não houver no banco.
 * PATCH: salva o conteúdo da seção (requer admin). Body: { dados: object }
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const secao = typeof req.query.secao === 'string' ? req.query.secao.trim().toLowerCase() : '';
  if (!secao || !isSecaoValida(secao)) {
    return res.status(400).json({ error: 'Seção inválida.' });
  }

  if (req.method === 'GET') {
    try {
      const dados = await getConteudo(secao);
      return res.status(200).json({ dados });
    } catch (e) {
      console.error('[api/site/conteudo/[secao]] GET', e);
      return res.status(500).json({ error: 'Erro ao buscar conteúdo.' });
    }
  }

  if (req.method === 'PATCH') {
    const body = req.body as Record<string, unknown>;
    const dados = body?.dados;
    if (dados === undefined) {
      return res.status(400).json({ error: 'Envie { dados: ... } no body.' });
    }
    try {
      const ok = await setConteudo(secao, dados);
      if (!ok) return res.status(400).json({ error: 'Seção inválida ou falha ao salvar.' });
      const atual = await getConteudo(secao);
      return res.status(200).json({ dados: atual });
    } catch (e) {
      console.error('[api/site/conteudo/[secao]] PATCH', e);
      return res.status(500).json({ error: 'Erro ao salvar conteúdo.' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
