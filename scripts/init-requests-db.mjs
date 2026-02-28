#!/usr/bin/env node
import 'dotenv/config';
import { neon } from '@neondatabase/serverless';

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error('ERRO: DATABASE_URL não definida no .env');
  process.exit(1);
}

const sql = neon(databaseUrl);

async function run() {
  console.log('Criando tabela requests...');

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
  console.log('  ✓ requests');

  await sql`CREATE INDEX IF NOT EXISTS idx_requests_criado_em ON requests (criado_em DESC)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_requests_status ON requests (status)`;
  console.log('  ✓ índices');

  console.log('\nTabela requests criada com sucesso.');
}

run().catch((err) => {
  console.error('Erro:', err.message);
  process.exit(1);
});
