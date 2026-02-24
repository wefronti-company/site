/**
 * Notificações do painel do usuário (Indique e Ganhe).
 */
import { sql } from './db';

export interface Notificacao {
  id: string;
  usuarioId: string;
  tipo: string;
  titulo: string;
  mensagem: string | null;
  lidaEm: string | null;
  criadaEm: string;
}

function rowToNotificacao(row: Record<string, unknown>): Notificacao {
  return {
    id: String(row.id ?? ''),
    usuarioId: String(row.usuario_id ?? ''),
    tipo: String(row.tipo ?? ''),
    titulo: String(row.titulo ?? ''),
    mensagem: row.mensagem != null && row.mensagem !== '' ? String(row.mensagem) : null,
    lidaEm: row.lida_em instanceof Date ? row.lida_em.toISOString() : (row.lida_em != null ? String(row.lida_em) : null),
    criadaEm: row.criada_em instanceof Date ? row.criada_em.toISOString() : String(row.criada_em ?? ''),
  };
}

let schemaReady = false;

async function ensureNotificacaoSchema(): Promise<void> {
  if (!sql || schemaReady) return;
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS usuario_notificacoes (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        usuario_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
        tipo VARCHAR(50) NOT NULL,
        titulo VARCHAR(200) NOT NULL,
        mensagem TEXT,
        lida_em TIMESTAMPTZ NULL,
        criada_em TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `;
    await sql`CREATE INDEX IF NOT EXISTS idx_usuario_notificacoes_usuario_criada ON usuario_notificacoes (usuario_id, criada_em DESC)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_usuario_notificacoes_usuario_lida ON usuario_notificacoes (usuario_id, lida_em)`;
    schemaReady = true;
  } catch (e) {
    console.error('[notificacaoDb] ensure schema error', e);
  }
}

/** Cria uma notificação para o usuário. Falha em silêncio se a tabela não existir. */
export async function createNotificacao(
  usuarioId: string,
  tipo: string,
  titulo: string,
  mensagem?: string | null
): Promise<Notificacao | null> {
  if (!sql) return null;
  await ensureNotificacaoSchema();
  try {
    const rows = await sql`
      INSERT INTO usuario_notificacoes (usuario_id, tipo, titulo, mensagem)
      VALUES (${usuarioId}, ${tipo.slice(0, 50)}, ${titulo.slice(0, 200)}, ${mensagem ?? null})
      RETURNING id, usuario_id, tipo, titulo, mensagem, lida_em, criada_em
    `;
    const row = Array.isArray(rows) ? (rows[0] as Record<string, unknown>) : undefined;
    return row ? rowToNotificacao(row) : null;
  } catch (e) {
    console.error('[notificacaoDb] createNotificacao error', e);
    return null;
  }
}

/** Lista notificações do usuário (mais recentes primeiro). */
export async function listNotificacoesByUsuario(usuarioId: string, limit = 50): Promise<Notificacao[]> {
  if (!sql) return [];
  await ensureNotificacaoSchema();
  try {
    const rows = await sql`
      SELECT id, usuario_id, tipo, titulo, mensagem, lida_em, criada_em
      FROM usuario_notificacoes
      WHERE usuario_id = ${usuarioId}
      ORDER BY criada_em DESC
      LIMIT ${limit}
    `;
    return (Array.isArray(rows) ? rows : []).map((r) => rowToNotificacao(r as Record<string, unknown>));
  } catch (e) {
    console.error('[notificacaoDb] listNotificacoesByUsuario error', e);
    return [];
  }
}

/** Marca notificação como lida. */
export async function markNotificacaoAsRead(notificacaoId: string, usuarioId: string): Promise<boolean> {
  if (!sql) return false;
  await ensureNotificacaoSchema();
  try {
    const rows = await sql`
      UPDATE usuario_notificacoes
      SET lida_em = NOW()
      WHERE id = ${notificacaoId} AND usuario_id = ${usuarioId} AND lida_em IS NULL
      RETURNING id
    `;
    return Array.isArray(rows) && rows.length > 0;
  } catch (e) {
    console.error('[notificacaoDb] markNotificacaoAsRead error', e);
    return false;
  }
}

/** Marca todas as notificações do usuário como lidas. */
export async function markAllNotificacoesAsRead(usuarioId: string): Promise<boolean> {
  if (!sql) return false;
  await ensureNotificacaoSchema();
  try {
    await sql`
      UPDATE usuario_notificacoes
      SET lida_em = NOW()
      WHERE usuario_id = ${usuarioId} AND lida_em IS NULL
    `;
    return true;
  } catch (e) {
    console.error('[notificacaoDb] markAllNotificacoesAsRead error', e);
    return false;
  }
}

/** Retorna a quantidade de notificações não lidas. */
export async function getUnreadCount(usuarioId: string): Promise<number> {
  if (!sql) return 0;
  await ensureNotificacaoSchema();
  try {
    const rows = await sql`
      SELECT COUNT(*)::text AS cnt
      FROM usuario_notificacoes
      WHERE usuario_id = ${usuarioId} AND lida_em IS NULL
    `;
    const row = Array.isArray(rows) ? (rows[0] as { cnt?: string }) : undefined;
    const n = row?.cnt ? parseInt(row.cnt, 10) : 0;
    return Number.isFinite(n) ? n : 0;
  } catch (e) {
    console.error('[notificacaoDb] getUnreadCount error', e);
    return 0;
  }
}
