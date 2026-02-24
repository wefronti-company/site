/**
 * GET: lista comissões do usuário logado (painel participante).
 */
import type { NextApiRequest, NextApiResponse } from 'next';
import { verifyUsuarioSessionToken, COOKIE_NAME } from '../../../lib/auth-usuario';
import { getUsuarioById } from '../../../lib/usuarioDb';
import { listComissoesByUsuario } from '../../../lib/comissaoDb';

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

  const payload = await verifyUsuarioSessionToken(token);
  if (!payload) return res.status(401).json({ error: 'Sessão expirada' });

  const usuario = await getUsuarioById(payload.usuarioId);
  if (!usuario) return res.status(401).json({ error: 'Usuário não encontrado' });

  try {
    const list = await listComissoesByUsuario(usuario.id);
    return res.status(200).json(list);
  } catch (e) {
    console.error('[usuario/comissoes]', e);
    return res.status(500).json({ error: 'Erro ao carregar comissões.' });
  }
}
