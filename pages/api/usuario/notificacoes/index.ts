import type { NextApiRequest, NextApiResponse } from 'next';
import { verifyUsuarioSessionToken, COOKIE_NAME } from '../../../../lib/auth-usuario';
import { listNotificacoesByUsuario, markNotificacaoAsRead, markAllNotificacoesAsRead, getUnreadCount } from '../../../../lib/notificacaoDb';

function getTokenFromCookie(req: NextApiRequest): string | null {
  const cookie = req.headers.cookie;
  if (!cookie) return null;
  const match = cookie.match(new RegExp(`(?:^|; )${COOKIE_NAME}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = getTokenFromCookie(req);
  if (!token) return res.status(401).json({ error: 'Não autenticado.' });

  const payload = await verifyUsuarioSessionToken(token);
  if (!payload) return res.status(401).json({ error: 'Sessão expirada.' });

  const usuarioId = payload.usuarioId;

  if (req.method === 'GET') {
    const list = await listNotificacoesByUsuario(usuarioId);
    const unreadCount = await getUnreadCount(usuarioId);
    return res.status(200).json({ notificacoes: list, unreadCount });
  }

  if (req.method === 'PATCH') {
    const body = (req.body || {}) as Record<string, unknown>;
    if (body.todos === true) {
      await markAllNotificacoesAsRead(usuarioId);
      return res.status(200).json({ ok: true });
    }
    const id = typeof body.id === 'string' ? body.id.trim() : '';
    if (id) {
      const ok = await markNotificacaoAsRead(id, usuarioId);
      return res.status(200).json({ ok });
    }
    return res.status(400).json({ error: 'Informe id ou todos.' });
  }

  return res.status(405).json({ error: 'Método não permitido' });
}
