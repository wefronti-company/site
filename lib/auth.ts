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
const JWT_EXPIRY = '7d';
const COOKIE_NAME = 'admin_session';

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

/** Gera token JWT para sessão */
export async function createSessionToken(adminId: string, email: string): Promise<string> {
  const token = await new SignJWT({ sub: adminId, email })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(JWT_EXPIRY)
    .sign(getSecretKey());
  return token;
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

export { COOKIE_NAME };
