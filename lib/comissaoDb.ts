/**
 * Comissões do programa Indique e Ganhe.
 */
import { sql } from './db';

export interface Comissao {
  id: string;
  usuarioId: string;
  empresaIndicada: string;
  valorContrato: number;
  valorComissao: number;
  criadoEm: string;
}

export interface ComissaoDetalhada extends Comissao {
  nomeUsuario: string;
  emailUsuario: string;
  cpfUsuario?: string;
  chavePix?: string;
  banco?: string;
  nomeTitular?: string;
}

function rowToComissao(row: Record<string, unknown>): Comissao {
  const num = (v: unknown) => (v != null ? Number(v) : 0);
  return {
    id: String(row.id ?? ''),
    usuarioId: String(row.usuario_id ?? ''),
    empresaIndicada: String(row.empresa_indicada ?? ''),
    valorContrato: num(row.valor_contrato),
    valorComissao: num(row.valor_comissao),
    criadoEm: row.criado_em instanceof Date ? row.criado_em.toISOString() : String(row.criado_em ?? ''),
  };
}

/** Lista comissões do participante (painel do usuário). */
export async function listComissoesByUsuario(usuarioId: string): Promise<Comissao[]> {
  if (!sql) return [];
  const rows = await sql`
    SELECT id, usuario_id, empresa_indicada, valor_contrato, valor_comissao, criado_em
    FROM indicacao_comissoes
    WHERE usuario_id = ${usuarioId}
    ORDER BY criado_em DESC
  `;
  return (rows as Record<string, unknown>[]).map(rowToComissao);
}

/** Lista todas as comissões (admin). */
export async function listComissoesForAdmin(): Promise<(Comissao & { nomeParticipante: string; emailParticipante: string })[]> {
  if (!sql) return [];
  const rows = await sql`
    SELECT c.id, c.usuario_id, c.empresa_indicada, c.valor_contrato, c.valor_comissao, c.criado_em,
           u.nome_completo AS nome_participante, u.email AS email_participante
    FROM indicacao_comissoes c
    JOIN usuarios u ON u.id = c.usuario_id
    ORDER BY c.criado_em DESC
  `;
  return (rows as (Record<string, unknown> & { nome_participante: string; email_participante: string })[]).map((row) => ({
    ...rowToComissao(row),
    nomeParticipante: row.nome_participante ?? '',
    emailParticipante: row.email_participante ?? '',
  }));
}

/** Busca uma comissão do participante com dados para comprovante. */
export async function getComissaoDetalhadaByIdForUsuario(comissaoId: string, usuarioId: string): Promise<ComissaoDetalhada | null> {
  if (!sql) return null;
  const rows = await sql`
    SELECT
      c.id,
      c.usuario_id,
      c.empresa_indicada,
      c.valor_contrato,
      c.valor_comissao,
      c.criado_em,
      u.nome_completo AS nome_usuario,
      u.email AS email_usuario,
      u.cpf AS cpf_usuario,
      u.chave_pix AS chave_pix,
      u.banco AS banco,
      u.nome_titular AS nome_titular
    FROM indicacao_comissoes c
    JOIN usuarios u ON u.id = c.usuario_id
    WHERE c.id = ${comissaoId} AND c.usuario_id = ${usuarioId}
    LIMIT 1
  `;
  const row = rows[0] as (Record<string, unknown> & {
    nome_usuario?: string;
    email_usuario?: string;
    cpf_usuario?: string;
    chave_pix?: string;
    banco?: string;
    nome_titular?: string;
  }) | undefined;
  if (!row) return null;
  return {
    ...rowToComissao(row),
    nomeUsuario: String(row.nome_usuario ?? ''),
    emailUsuario: String(row.email_usuario ?? ''),
    cpfUsuario: row.cpf_usuario ? String(row.cpf_usuario) : undefined,
    chavePix: row.chave_pix ? String(row.chave_pix) : undefined,
    banco: row.banco ? String(row.banco) : undefined,
    nomeTitular: row.nome_titular ? String(row.nome_titular) : undefined,
  };
}

/** Registra pagamento de comissão (admin). */
export async function createComissao(
  usuarioId: string,
  empresaIndicada: string,
  valorContrato: number,
  valorComissao: number
): Promise<Comissao | null> {
  if (!sql) {
    console.warn('[comissaoDb] createComissao: sql não disponível (DATABASE_URL?)');
    return null;
  }
  const rows = await sql`
    INSERT INTO indicacao_comissoes (usuario_id, empresa_indicada, valor_contrato, valor_comissao)
    VALUES (${usuarioId}, ${empresaIndicada.trim().slice(0, 200)}, ${valorContrato}, ${valorComissao})
    RETURNING id, usuario_id, empresa_indicada, valor_contrato, valor_comissao, criado_em
  `;
  const row = Array.isArray(rows) ? (rows[0] as Record<string, unknown> | undefined) : undefined;
  return row ? rowToComissao(row) : null;
}
