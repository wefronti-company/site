import crypto from 'crypto';
import { getRedisClient } from './redis';

const IN_MEMORY = new Map<string, { email: string; expiresAt: number }>();
const DEFAULT_TTL = 60 * 60; // 1 hour

export async function createSession(email: string, ttl = DEFAULT_TTL): Promise<string> {
  const token = crypto.randomBytes(32).toString('hex');
  const client = getRedisClient();
  if (client) {
    await client.set(`admin_session:${token}`, email, 'EX', ttl);
  } else {
    IN_MEMORY.set(token, { email, expiresAt: Date.now() + ttl * 1000 });
  }
  return token;
}

export async function validateSession(token?: string | null): Promise<string | null> {
  if (!token) return null;
  const client = getRedisClient();
  if (client) {
    try {
      const v = await client.get(`admin_session:${token}`);
      return v || null;
    } catch (err) {
      console.error('[SESSIONS] Redis error', err);
      return null;
    }
  }

  const rec = IN_MEMORY.get(token);
  if (!rec) return null;
  if (Date.now() > rec.expiresAt) {
    IN_MEMORY.delete(token);
    return null;
  }
  return rec.email;
}

export async function destroySession(token?: string | null): Promise<void> {
  if (!token) return;
  const client = getRedisClient();
  if (client) {
    await client.del(`admin_session:${token}`);
  } else {
    IN_MEMORY.delete(token);
  }
}
