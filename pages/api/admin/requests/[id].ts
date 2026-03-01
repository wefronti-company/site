/**
 * API para obter um orçamento ou marcar como respondido.
 * GET - retorna o orçamento
 * PATCH - marca como respondido
 */
import type { NextApiRequest, NextApiResponse } from 'next';
import { verifySessionToken, COOKIE_NAME } from '../../../../../lib/auth';
import { getRequestById, markAsRespondido } from '../../../../../lib/requestDb';

function getTokenFromCookie(req: NextApiRequest): string | null {
  const cookie = req.headers.cookie;
  if (!cookie) return null;
  const match = cookie.match(new RegExp(`(?:^|; )${COOKIE_NAME}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = getTokenFromCookie(req);
  if (!token) {
    return res.status(401).json({ error: 'Não autenticado' });
  }

  const payload = await verifySessionToken(token);
  if (!payload) {
    return res.status(401).json({ error: 'Sessão inválida ou expirada' });
  }

  const id = typeof req.query.id === 'string' ? req.query.id : null;
  if (!id) {
    return res.status(400).json({ error: 'ID não informado' });
  }

  if (req.method === 'GET') {
    try {
      const item = await getRequestById(id);
      if (!item) {
        return res.status(404).json({ error: 'Orçamento não encontrado' });
      }
      return res.status(200).json(item);
    } catch (e) {
      console.error('[admin/requests]', e);
      return res.status(500).json({ error: 'Erro ao buscar orçamento' });
    }
  }

  if (req.method === 'PATCH') {
    try {
      const ok = await markAsRespondido(id);
      if (!ok) {
        return res.status(404).json({ error: 'Orçamento não encontrado ou já respondido' });
      }
      return res.status(200).json({ ok: true });
    } catch (e) {
      console.error('[admin/requests]', e);
      return res.status(500).json({ error: 'Erro ao marcar como respondido' });
    }
  }

  return res.status(405).json({ error: 'Método não permitido' });
}
