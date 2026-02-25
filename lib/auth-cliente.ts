/**
 * Autenticação do painel do cliente.
 * JWT em cookie separado do admin e do antigo usuario.
 */
import { SignJWT, jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-in-production';

export const COOKIE_NAME = 'cliente_session';

function getSecretKey() {
  return new TextEncoder().encode(JWT_SECRET);
}

export async function createClienteSessionToken(clienteId: string, email: string): Promise<string> {
  return new SignJWT({ sub: clienteId, email })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('8h')
    .sign(getSecretKey());
}

export async function verifyClienteSessionToken(
  token: string
): Promise<{ clienteId: string; email: string } | null> {
  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    const sub = payload.sub;
    const email = payload.email;
    if (typeof sub !== 'string' || typeof email !== 'string') return null;
    return { clienteId: sub, email };
  } catch {
    return null;
  }
}
