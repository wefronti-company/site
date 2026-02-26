/**
 * Autenticação do painel de usuário (cliente).
 * JWT em cookie separado do admin.
 */
import { SignJWT, jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-in-production';

export const COOKIE_NAME = 'usuario_session';

function getSecretKey() {
  return new TextEncoder().encode(JWT_SECRET);
}

export async function createUsuarioSessionToken(usuarioId: string, email: string): Promise<string> {
  return new SignJWT({ sub: usuarioId, email })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('8h')
    .sign(getSecretKey());
}

export async function verifyUsuarioSessionToken(
  token: string
): Promise<{ usuarioId: string; email: string } | null> {
  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    const sub = payload.sub;
    const email = payload.email;
    if (typeof sub !== 'string' || typeof email !== 'string') return null;
    return { usuarioId: sub, email };
  } catch {
    return null;
  }
}
