import { sql } from './db';

export interface RequestRow {
  id: string;
  tipo: string;
  nome: string;
  sobrenome: string;
  email: string;
  whatsapp: string;
  investimento: string | null;
  tipo_projeto: string | null;
  contexto: string;
  origem: string | null;
  ip: string | null;
  user_agent: string | null;
  status: string;
  criado_em: string;
  respondido_em: string | null;
}

export interface CreateRequestInput {
  tipo: string;
  nome: string;
  sobrenome: string;
  email: string;
  whatsapp: string;
  investimento?: string | null;
  tipoProjeto?: string | null;
  contexto: string;
  origem?: string;
  ip?: string;
  userAgent?: string;
}

export async function createRequest(input: CreateRequestInput): Promise<void> {
  if (!sql) throw new Error('Banco de dados não configurado.');

  await sql`
    CREATE TABLE IF NOT EXISTS requests (
      id BIGSERIAL PRIMARY KEY,
      tipo TEXT NOT NULL,
      nome TEXT NOT NULL,
      sobrenome TEXT NOT NULL,
      email TEXT NOT NULL,
      whatsapp TEXT NOT NULL,
      investimento TEXT,
      tipo_projeto TEXT,
      contexto TEXT NOT NULL,
      origem TEXT,
      ip TEXT,
      user_agent TEXT,
      status TEXT NOT NULL DEFAULT 'novo',
      criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
  await sql`ALTER TABLE requests ALTER COLUMN investimento DROP NOT NULL`;
  await sql`ALTER TABLE requests ADD COLUMN IF NOT EXISTS tipo_projeto TEXT`;
  await sql`ALTER TABLE requests ADD COLUMN IF NOT EXISTS respondido_em TIMESTAMPTZ`;

  await sql`
    INSERT INTO requests (
      tipo, nome, sobrenome, email, whatsapp, investimento, tipo_projeto, contexto, origem, ip, user_agent
    ) VALUES (
      ${input.tipo},
      ${input.nome},
      ${input.sobrenome},
      ${input.email},
      ${input.whatsapp},
      ${input.investimento ?? null},
      ${input.tipoProjeto ?? null},
      ${input.contexto},
      ${input.origem ?? null},
      ${input.ip ?? null},
      ${input.userAgent ?? null}
    )
  `;
}

export interface GetRequestsOptions {
  tipo?: string;
  excludeTipo?: string;
}

export async function getRequests(
  status: 'novo' | 'respondido',
  opts?: GetRequestsOptions
): Promise<RequestRow[]> {
  if (!sql) return [];

  const statusVal = status === 'novo' ? 'novo' : 'respondido';
  const tipoFilter = opts?.tipo;
  const excludeTipo = opts?.excludeTipo;

  let rows: unknown[];
  if (status === 'novo') {
    if (tipoFilter) {
      rows = await sql`
        SELECT id, tipo, nome, sobrenome, email, whatsapp, investimento, tipo_projeto,
               contexto, origem, ip, user_agent, status, criado_em, respondido_em
        FROM requests
        WHERE status = ${statusVal} AND tipo = ${tipoFilter}
        ORDER BY criado_em DESC
      `;
    } else if (excludeTipo) {
      rows = await sql`
        SELECT id, tipo, nome, sobrenome, email, whatsapp, investimento, tipo_projeto,
               contexto, origem, ip, user_agent, status, criado_em, respondido_em
        FROM requests
        WHERE status = ${statusVal} AND tipo != ${excludeTipo}
        ORDER BY criado_em DESC
      `;
    } else {
      rows = await sql`
        SELECT id, tipo, nome, sobrenome, email, whatsapp, investimento, tipo_projeto,
               contexto, origem, ip, user_agent, status, criado_em, respondido_em
        FROM requests
        WHERE status = ${statusVal}
        ORDER BY criado_em DESC
      `;
    }
  } else {
    rows = await sql`
      SELECT id, tipo, nome, sobrenome, email, whatsapp, investimento, tipo_projeto,
             contexto, origem, ip, user_agent, status, criado_em, respondido_em
      FROM requests
      WHERE status = ${statusVal}
      ORDER BY respondido_em DESC NULLS LAST
    `;
  }
  return (rows as unknown[]) as RequestRow[];
}

export async function getRequestById(id: string): Promise<RequestRow | null> {
  if (!sql) return null;

  const rows = await sql`
    SELECT id, tipo, nome, sobrenome, email, whatsapp, investimento, tipo_projeto,
           contexto, origem, ip, user_agent, status, criado_em, respondido_em
    FROM requests
    WHERE id = ${id}
    LIMIT 1
  `;
  const row = (rows[0] as unknown) as RequestRow | undefined;
  return row ?? null;
}

export async function markAsRespondido(id: string): Promise<boolean> {
  if (!sql) return false;

  const result = await sql`
    UPDATE requests
    SET status = 'respondido', respondido_em = NOW()
    WHERE id = ${id} AND status = 'novo'
    RETURNING id
  `;
  return Array.isArray(result) && result.length > 0;
}
