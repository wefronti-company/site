/**
 * API para listar orçamentos (requests) do formulário.
 * GET ?status=novo|respondido
 */
import type { NextApiRequest, NextApiResponse } from 'next';
import { verifySessionToken, COOKIE_NAME } from '../../../../lib/auth';
import { getRequests } from '../../../../lib/requestDb';

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
  if (!token) {
    return res.status(401).json({ error: 'Não autenticado' });
  }

  const payload = await verifySessionToken(token);
  if (!payload) {
    return res.status(401).json({ error: 'Sessão inválida ou expirada' });
  }

  const status = typeof req.query.status === 'string' ? req.query.status : 'novo';
  if (status !== 'novo' && status !== 'respondido') {
    return res.status(400).json({ error: 'status deve ser "novo" ou "respondido"' });
  }

  try {
    const items = await getRequests(status);
    return res.status(200).json(items);
  } catch (e) {
    console.error('[admin/requests]', e);
    return res.status(500).json({ error: 'Erro ao listar orçamentos' });
  }
}
