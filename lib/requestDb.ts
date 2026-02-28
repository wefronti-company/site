import { sql } from './db';

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
