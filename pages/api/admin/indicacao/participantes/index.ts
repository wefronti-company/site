/**
 * Lista participantes do Indique e Ganhe (admin).
 */
import type { NextApiRequest, NextApiResponse } from 'next';
import { verifySessionToken, COOKIE_NAME } from '../../../../../lib/auth';
import { listParticipantesIndicacao, searchParticipantesIndicacao } from '../../../../../lib/usuarioDb';

function getTokenFromCookie(req: NextApiRequest): string | null {
  const cookie = req.headers.cookie;
  if (!cookie) return null;
  const match = cookie.match(new RegExp(`(?:^|; )${COOKIE_NAME}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  const token = getTokenFromCookie(req);
  if (!token) return res.status(401).json({ error: 'Não autenticado' });

  const payload = await verifySessionToken(token);
  if (!payload) return res.status(401).json({ error: 'Sessão inválida ou expirada' });

  try {
    const q = typeof req.query.q === 'string' ? req.query.q.trim() : '';
    if (q.length >= 2) {
      const list = await searchParticipantesIndicacao(q);
      return res.status(200).json(list);
    }
    const list = await listParticipantesIndicacao();
    return res.status(200).json(list);
  } catch (e) {
    console.error('[admin/indicacao/participantes]', e);
    return res.status(500).json({ error: 'Erro ao listar participantes.' });
  }
}
