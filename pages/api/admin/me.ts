/**
 * API que retorna o admin autenticado ou 401.
 */
import type { NextApiRequest, NextApiResponse } from 'next';
import { verifySessionToken, COOKIE_NAME } from '../../../lib/auth';
import { sql } from '../../../lib/db';

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

  if (!sql) {
    return res.status(200).json({
      adminId: payload.adminId,
      email: payload.email,
      nome: null,
      superAdmin: false,
    });
  }

  const rows = await sql`
    SELECT nome, super_admin FROM admins WHERE id = ${payload.adminId} LIMIT 1
  `;
  const admin = rows[0] as { nome: string | null; super_admin: boolean } | undefined;
  let superAdmin = admin?.super_admin ?? false;

  if (!superAdmin) {
    const countRows = await sql`SELECT COUNT(*)::int AS total FROM admins`;
    const total = (countRows[0] as { total: number })?.total ?? 0;
    if (total === 1) superAdmin = true;
  }

  return res.status(200).json({
    adminId: payload.adminId,
    email: payload.email,
    nome: admin?.nome ?? null,
    superAdmin,
  });
}
