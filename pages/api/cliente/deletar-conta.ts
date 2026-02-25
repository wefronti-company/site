import type { NextApiRequest, NextApiResponse } from 'next';
import { verifyClienteSessionToken, COOKIE_NAME } from '../../../lib/auth-cliente';
import { getClienteById, deleteCliente } from '../../../lib/clientDb';

function getTokenFromCookie(req: NextApiRequest): string | null {
  const cookie = req.headers.cookie;
  if (!cookie) return null;
  const match = cookie.match(new RegExp(`(?:^|; )${COOKIE_NAME}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const token = getTokenFromCookie(req);
  if (!token) {
    return res.status(401).json({ error: 'Não autenticado.' });
  }

  const payload = await verifyClienteSessionToken(token);
  if (!payload) {
    return res.status(401).json({ error: 'Sessão expirada.' });
  }

  const cliente = await getClienteById(payload.clienteId);
  if (!cliente) {
    return res.status(404).json({ error: 'Cliente não encontrado.' });
  }

  const deleted = await deleteCliente(cliente.id);
  if (!deleted) {
    return res.status(500).json({ error: 'Não foi possível excluir a conta. Tente novamente.' });
  }

  const isProd = process.env.NODE_ENV === 'production';
  res.setHeader('Set-Cookie', `${COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0${isProd ? '; Secure' : ''}`);
  return res.status(200).json({ ok: true });
}
