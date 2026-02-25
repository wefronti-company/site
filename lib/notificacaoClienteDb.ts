/**
 * Notificacoes do painel do cliente.
 */
import { sql } from './db';

export interface NotificacaoCliente {
  id: string;
  clienteId: string;
  tipo: string;
  titulo: string;
  mensagem: string | null;
  lidaEm: string | null;
  criadaEm: string;
}

function rowToNotif(row: Record<string, unknown>): NotificacaoCliente {
  return {
    id: String(row.id ?? ''),
    clienteId: String(row.cliente_id ?? ''),
    tipo: String(row.tipo ?? ''),
    titulo: String(row.titulo ?? ''),
    mensagem: row.mensagem != null && row.mensagem !== '' ? String(row.mensagem) : null,
    lidaEm: row.lida_em instanceof Date ? row.lida_em.toISOString() : (row.lida_em != null ? String(row.lida_em) : null),
    criadaEm: row.criada_em instanceof Date ? row.criada_em.toISOString() : String(row.criada_em ?? ''),
  };
}

export async function listNotificacoesByCliente(clienteId: string, limit = 50): Promise<NotificacaoCliente[]> {
  if (!sql) return [];
  try {
    const rows = await sql`
      SELECT id, cliente_id, tipo, titulo, mensagem, lida_em, criada_em
      FROM cliente_notificacoes
      WHERE cliente_id = ${clienteId}
      ORDER BY criada_em DESC
      LIMIT ${limit}
    `;
    return (Array.isArray(rows) ? rows : []).map((r) => rowToNotif(r as Record<string, unknown>));
  } catch {
    return [];
  }
}

export async function markNotificacaoClienteAsRead(notificacaoId: string, clienteId: string): Promise<boolean> {
  if (!sql) return false;
  try {
    const rows = await sql`
      UPDATE cliente_notificacoes
      SET lida_em = NOW()
      WHERE id = ${notificacaoId} AND cliente_id = ${clienteId} AND lida_em IS NULL
      RETURNING id
    `;
    return Array.isArray(rows) && rows.length > 0;
  } catch {
    return false;
  }
}

export async function markAllNotificacoesClienteAsRead(clienteId: string): Promise<boolean> {
  if (!sql) return false;
  try {
    await sql`
      UPDATE cliente_notificacoes
      SET lida_em = NOW()
      WHERE cliente_id = ${clienteId} AND lida_em IS NULL
    `;
    return true;
  } catch {
    return false;
  }
}

export async function getUnreadCountCliente(clienteId: string): Promise<number> {
  if (!sql) return 0;
  try {
    const rows = await sql`
      SELECT COUNT(*)::text AS cnt
      FROM cliente_notificacoes
      WHERE cliente_id = ${clienteId} AND lida_em IS NULL
    `;
    const row = Array.isArray(rows) ? (rows[0] as { cnt?: string }) : undefined;
    const n = row?.cnt ? parseInt(row.cnt, 10) : 0;
    return Number.isFinite(n) ? n : 0;
  } catch {
    return 0;
  }
}
