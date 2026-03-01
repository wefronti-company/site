import { sql } from './db';

export interface SecurityEvent {
  id: string;
  tipo: string;
  ip: string | null;
  path: string | null;
  user_agent: string | null;
  detalhes: string | null;
  criado_em: string;
}

export async function insertSecurityEvent(input: {
  tipo: string;
  ip?: string;
  path?: string;
  user_agent?: string;
  detalhes?: string;
}): Promise<void> {
  if (!sql) return;

  const ua = input.user_agent ? String(input.user_agent).slice(0, 512) : null;

  await sql`
    INSERT INTO security_events (tipo, ip, path, user_agent, detalhes)
    VALUES (
      ${input.tipo},
      ${input.ip ?? null},
      ${input.path ?? null},
      ${ua},
      ${input.detalhes ?? null}
    )
  `;
}

export async function getSecurityEvents(limit = 50, sinceHours = 24): Promise<SecurityEvent[]> {
  if (!sql) return [];

  const cutoff = new Date(Date.now() - sinceHours * 60 * 60 * 1000).toISOString();

  const rows = await sql`
    SELECT id, tipo, ip, path, user_agent, detalhes, criado_em
    FROM security_events
    WHERE criado_em >= ${cutoff}
    ORDER BY criado_em DESC
    LIMIT ${limit}
  `;

  return (rows as unknown[]) as SecurityEvent[];
}

export async function getSecurityEventCount(sinceHours = 24): Promise<number> {
  if (!sql) return 0;

  const cutoff = new Date(Date.now() - sinceHours * 60 * 60 * 1000).toISOString();

  const rows = await sql`
    SELECT COUNT(*)::int AS total
    FROM security_events
    WHERE criado_em >= ${cutoff}
  `;

  return (rows[0] as { total: number })?.total ?? 0;
}
