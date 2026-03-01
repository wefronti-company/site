/**
 * API para atualizar perfil do admin (nome, senha).
 * PATCH: { nome?, codigoAcesso? }
 */
import type { NextApiRequest, NextApiResponse } from 'next';
import { verifySessionToken, COOKIE_NAME, hashCodigoAcesso } from '../../../lib/auth';
import { sanitizeTextForStorage } from '../../../lib/sanitize-server';
import { sql } from '../../../lib/db';

function getTokenFromCookie(req: NextApiRequest): string | null {
  const cookie = req.headers.cookie;
  if (!cookie) return null;
  const match = cookie.match(new RegExp(`(?:^|; )${COOKIE_NAME}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'PATCH') {
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
    return res.status(503).json({ error: 'Sistema indisponível.' });
  }

  const body = req.body as Record<string, unknown>;
  const nome = typeof body.nome === 'string' ? sanitizeTextForStorage(body.nome).slice(0, 150) : undefined;
  const codigoAcesso = typeof body.codigoAcesso === 'string' ? body.codigoAcesso.trim().slice(0, 64) : undefined;

  if (!nome && !codigoAcesso) {
    return res.status(400).json({ error: 'Informe nome ou nova senha para atualizar.' });
  }

  if (codigoAcesso && codigoAcesso.length < 4) {
    return res.status(400).json({ error: 'A senha deve ter no mínimo 4 caracteres.' });
  }

  try {
    if (nome !== undefined && codigoAcesso) {
      const hash = hashCodigoAcesso(codigoAcesso);
      await sql`
        UPDATE admins SET nome = ${nome || null}, codigo_acesso_hash = ${hash}, atualizado_em = NOW()
        WHERE id = ${payload.adminId}
      `;
    } else if (codigoAcesso) {
      const hash = hashCodigoAcesso(codigoAcesso);
      await sql`
        UPDATE admins SET codigo_acesso_hash = ${hash}, atualizado_em = NOW()
        WHERE id = ${payload.adminId}
      `;
    } else if (nome !== undefined) {
      await sql`
        UPDATE admins SET nome = ${nome || null}, atualizado_em = NOW()
        WHERE id = ${payload.adminId}
      `;
    }
    return res.status(200).json({ ok: true });
  } catch (e) {
    console.error('[Admin Update]', e);
    return res.status(500).json({ error: 'Erro ao atualizar perfil.' });
  }
}
