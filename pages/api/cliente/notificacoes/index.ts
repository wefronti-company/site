import type { NextApiRequest, NextApiResponse } from 'next';
import { verifyClienteSessionToken, COOKIE_NAME } from '../../../../lib/auth-cliente';
import {
  listNotificacoesByCliente,
  markNotificacaoClienteAsRead,
  markAllNotificacoesClienteAsRead,
  getUnreadCountCliente,
} from '../../../../lib/notificacaoClienteDb';

function getTokenFromCookie(req: NextApiRequest): string | null {
  const c = req.headers.cookie;
  if (!c) return null;
  const m = c.match(new RegExp('(?:^|; )' + COOKIE_NAME + '=([^;]*)'));
  return m ? decodeURIComponent(m[1]) : null;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = getTokenFromCookie(req);
  if (!token) return res.status(401).json({ error: 'Não autenticado.' });

  const payload = await verifyClienteSessionToken(token);
  if (!payload) return res.status(401).json({ error: 'Sessão expirada.' });

  const clienteId = payload.clienteId;

  if (req.method === 'GET') {
    const list = await listNotificacoesByCliente(clienteId);
    const unreadCount = await getUnreadCountCliente(clienteId);
    return res.status(200).json({
      notificacoes: list.map((n) => ({
        id: n.id,
        tipo: n.tipo,
        titulo: n.titulo,
        mensagem: n.mensagem,
        lidaEm: n.lidaEm,
        criadaEm: n.criadaEm,
      })),
      unreadCount,
    });
  }

  if (req.method === 'PATCH') {
    const body = (req.body || {}) as Record<string, unknown>;
    if (body.todos === true) {
      await markAllNotificacoesClienteAsRead(clienteId);
      return res.status(200).json({ ok: true });
    }
    const id = typeof body.id === 'string' ? body.id.trim() : '';
    if (id) {
      const ok = await markNotificacaoClienteAsRead(id, clienteId);
      return res.status(200).json(ok);
    }
    return res.status(400).json({ error: 'Informe id ou todos.' });
  }

  return res.status(405).json({ error: 'Método não permitido' });
}
