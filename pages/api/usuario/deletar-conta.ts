import type { NextApiRequest, NextApiResponse } from 'next';
import { verifyUsuarioSessionToken, COOKIE_NAME } from '../../../lib/auth-usuario';
import { getUsuarioById } from '../../../lib/usuarioDb';
import { deleteUsuario } from '../../../lib/usuarioDb';

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

  const payload = await verifyUsuarioSessionToken(token);
  if (!payload) {
    return res.status(401).json({ error: 'Sessão expirada.' });
  }

  const usuario = await getUsuarioById(payload.usuarioId);
  if (!usuario) {
    return res.status(404).json({ error: 'Usuário não encontrado.' });
  }

  const deleted = await deleteUsuario(usuario.id);
  if (!deleted) {
    return res.status(500).json({ error: 'Não foi possível excluir a conta. Tente novamente.' });
  }

  const cookieClear = `${COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0`;
  res.setHeader('Set-Cookie', cookieClear);
  return res.status(200).json({ ok: true });
}
