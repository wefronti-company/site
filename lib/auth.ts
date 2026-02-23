/**
 * Autenticação do painel admin.
 * - Hash do código de acesso com PBKDF2
 * - Tokens de sessão com JWT
 */
import { randomBytes, scryptSync, timingSafeEqual } from 'crypto';
import { SignJWT, jwtVerify } from 'jose';

const DEFAULT_SECRET = 'dev-secret-change-in-production';
const JWT_SECRET = process.env.JWT_SECRET || DEFAULT_SECRET;

if (typeof process !== 'undefined' && process.env.NODE_ENV === 'production' && JWT_SECRET === DEFAULT_SECRET) {
  console.error('[AUTH] JWT_SECRET deve ser definida em produção. Defina a variável no Vercel.');
}
/** Token de sessão: 15 min (inatividade) */
const SESSION_EXPIRY = '15m';
/** Token de refresh: 8h (tempo absoluto máximo da sessão) */
const REFRESH_EXPIRY = '8h';
/** Tempo absoluto em ms: 8 horas */
const SESSION_ABSOLUTE_MS = 8 * 60 * 60 * 1000;

const COOKIE_NAME = 'admin_session';
const COOKIE_REFRESH_NAME = 'admin_refresh';

function getSecretKey() {
  return new TextEncoder().encode(JWT_SECRET);
}

/** Gera hash do código de acesso (para inserir no banco). Usa salt aleatório por hash. */
export function hashCodigoAcesso(plain: string): string {
  const salt = randomBytes(16).toString('hex');
  const hash = scryptSync(plain, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}

/** Verifica se o código de acesso confere com o hash */
export function verifyCodigoAcesso(plain: string, stored: string): boolean {
  try {
    const [salt, hash] = stored.split(':');
    if (!salt || !hash) return false;
    const computed = scryptSync(plain, salt, 64).toString('hex');
    return timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(computed, 'hex'));
  } catch {
    return false;
  }
}

/** Gera token JWT para sessão (15 min) */
export async function createSessionToken(adminId: string, email: string): Promise<string> {
  const token = await new SignJWT({ sub: adminId, email })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(SESSION_EXPIRY)
    .sign(getSecretKey());
  return token;
}

/** Gera token de refresh (8h) com session_start para tempo absoluto */
export async function createRefreshToken(adminId: string, email: string): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const token = await new SignJWT({ sub: adminId, email, session_start: now })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt(now)
    .setExpirationTime(REFRESH_EXPIRY)
    .sign(getSecretKey());
  return token;
}

/** Valida refresh token e verifica tempo absoluto (< 8h). Retorna payload ou null. */
export async function verifyRefreshToken(token: string): Promise<{ adminId: string; email: string } | null> {
  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    const sub = payload.sub;
    const email = payload.email;
    const sessionStart = payload.session_start;
    if (typeof sub !== 'string' || typeof email !== 'string') return null;
    const start = typeof sessionStart === 'number' ? sessionStart * 1000 : 0;
    if (Date.now() - start > SESSION_ABSOLUTE_MS) return null;
    return { adminId: sub, email };
  } catch {
    return null;
  }
}

/** Valida token JWT e retorna payload ou null */
export async function verifySessionToken(token: string): Promise<{ adminId: string; email: string } | null> {
  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    const sub = payload.sub;
    const email = payload.email;
    if (typeof sub !== 'string' || typeof email !== 'string') return null;
    return { adminId: sub, email };
  } catch {
    return null;
  }
}

export { COOKIE_NAME, COOKIE_REFRESH_NAME };
