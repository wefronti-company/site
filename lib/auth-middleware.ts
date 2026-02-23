/**
 * Verificação de sessão para uso no middleware (Edge).
 * Não importar lib/auth.ts aqui para evitar deps Node (crypto) no Edge.
 */
import { jwtVerify } from 'jose';

const COOKIE_NAME = 'admin_session';

function getSecretKey() {
  return new TextEncoder().encode(process.env.JWT_SECRET || 'dev-secret-change-in-production');
}

export function getTokenFromCookie(cookieHeader: string | null): string | null {
  if (!cookieHeader) return null;
  const match = cookieHeader.match(new RegExp(`(?:^|; )${COOKIE_NAME}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

export async function verifyTokenInEdge(token: string): Promise<boolean> {
  try {
    await jwtVerify(token, getSecretKey());
    return true;
  } catch {
    return false;
  }
}
