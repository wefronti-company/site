/**
 * Verificação de sessão do cliente para middleware (Edge).
 */
import { jwtVerify } from 'jose';

const COOKIE_NAME = 'cliente_session';

function getSecretKey() {
  return new TextEncoder().encode(process.env.JWT_SECRET || 'dev-secret-change-in-production');
}

export function getClienteTokenFromCookie(cookieHeader: string | null): string | null {
  if (!cookieHeader) return null;
  const match = cookieHeader.match(new RegExp('(?:^|; )' + COOKIE_NAME + '=([^;]*)'));
  return match ? decodeURIComponent(match[1]) : null;
}

export async function verifyClienteTokenInEdge(token: string): Promise<boolean> {
  try {
    await jwtVerify(token, getSecretKey());
    return true;
  } catch {
    return false;
  }
}
