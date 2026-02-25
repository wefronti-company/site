/**
 * Persistência de serviços (tipos de serviço: Site, Landing Page, etc.).
 */

import { sql } from './db';

export interface Servico {
  id: string;
  nome: string;
  ordem: number;
  criadoEm: string;
}

function rowToServico(row: Record<string, unknown>): Servico {
  const criadoEm = row.criado_em instanceof Date
    ? row.criado_em.toISOString()
    : String(row.criado_em ?? '');
  return {
    id: String(row.id ?? ''),
    nome: String(row.nome ?? ''),
    ordem: Number(row.ordem ?? 0),
    criadoEm,
  };
}

export async function getServicos(): Promise<Servico[]> {
  if (!sql) throw new Error('Banco de dados não configurado.');
  const rows = await sql`
    SELECT id, nome, ordem, criado_em
    FROM servicos
    ORDER BY ordem ASC, nome ASC
  `;
  return (rows as Record<string, unknown>[]).map(rowToServico);
}

export async function createServico(nome: string): Promise<Servico> {
  if (!sql) throw new Error('Banco de dados não configurado.');
  const nomeTrim = String(nome ?? '').trim();
  if (!nomeTrim) throw new Error('Nome do serviço é obrigatório.');
  const rows = await sql`
    INSERT INTO servicos (nome)
    VALUES (${nomeTrim})
    RETURNING id, nome, ordem, criado_em
  `;
  const row = rows[0] as Record<string, unknown>;
  if (!row) throw new Error('Falha ao criar serviço.');
  return rowToServico(row);
}
