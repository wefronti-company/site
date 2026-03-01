/**
 * API de login do painel admin.
 * POST: { email, codigoAcesso }
 */
import type { NextApiRequest, NextApiResponse } from 'next';
import isEmail from 'validator/lib/isEmail';
import { sql } from '../../../lib/db';
import {
  verifyCodigoAcesso,
  createSessionToken,
  createRefreshToken,
  COOKIE_NAME,
  COOKIE_REFRESH_NAME,
} from '../../../lib/auth';
import { insertSecurityEvent } from '../../../lib/securityEventsDb';

const MAX_EMAIL_LENGTH = 254;
const MAX_CODIGO_LENGTH = 64;
const RATE_LIMIT_MS = 2000; // delay mínimo entre tentativas
const lastAttempt = new Map<string, number>();

function sanitize(str: string, maxLen: number): string {
  return String(str).slice(0, maxLen).trim();
}

function getClientKey(req: NextApiRequest): string {
  const forwarded = req.headers['x-forwarded-for'];
  const ip = Array.isArray(forwarded) ? forwarded[0] : forwarded || req.socket.remoteAddress || 'unknown';
  return ip.trim();
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  const clientKey = getClientKey(req);
  const now = Date.now();
  const last = lastAttempt.get(clientKey) ?? 0;
  if (now - last < RATE_LIMIT_MS) {
    return res.status(429).json({ error: 'Muitas tentativas. Aguarde um momento.' });
  }
  lastAttempt.set(clientKey, now);

  const schema = req.body;
  if (!schema || typeof schema !== 'object') {
    return res.status(400).json({ error: 'Dados inválidos' });
  }

  const rawEmail = typeof schema.email === 'string' ? schema.email : '';
  const rawCodigo = typeof schema.codigoAcesso === 'string' ? schema.codigoAcesso : '';

  const email = sanitize(rawEmail, MAX_EMAIL_LENGTH).toLowerCase();
  const codigoAcesso = sanitize(rawCodigo, MAX_CODIGO_LENGTH);

  if (!email || !codigoAcesso) {
    return res.status(400).json({ error: 'E-mail e código de acesso são obrigatórios.' });
  }

  if (!isEmail(email)) {
    return res.status(400).json({ error: 'E-mail inválido.' });
  }

  if (!sql) {
    return res.status(503).json({ error: 'Sistema temporariamente indisponível.' });
  }

  try {
    const rows = await sql`SELECT id, email, codigo_acesso_hash FROM admins WHERE email = ${email} LIMIT 1`;
    const admin = rows[0] as { id: string; email: string; codigo_acesso_hash: string } | undefined;

    if (!admin || !verifyCodigoAcesso(codigoAcesso, admin.codigo_acesso_hash)) {
      insertSecurityEvent({
        tipo: 'admin_login_falhou',
        ip: clientKey,
        path: '/api/admin/login',
        detalhes: 'credenciais inválidas',
      }).catch(() => {});
      return res.status(401).json({ error: 'E-mail ou código de acesso incorretos.' });
    }

    const [sessionToken, refreshToken] = await Promise.all([
      createSessionToken(admin.id, admin.email),
      createRefreshToken(admin.id, admin.email),
    ]);
    const isProd = process.env.NODE_ENV === 'production';
    const sessionMaxAge = 15 * 60; // 15 min em segundos
    const refreshMaxAge = 8 * 60 * 60; // 8h em segundos

    res.setHeader('Set-Cookie', [
      `${COOKIE_NAME}=${sessionToken}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${sessionMaxAge}` +
        (isProd ? '; Secure' : ''),
      `${COOKIE_REFRESH_NAME}=${refreshToken}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${refreshMaxAge}` +
        (isProd ? '; Secure' : ''),
    ]);
    return res.status(200).json({ ok: true });
  } catch (e) {
    console.error('[Admin Login]', e);
    return res.status(500).json({ error: 'Erro ao processar login.' });
  }
}
