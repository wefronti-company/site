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
  console.log('Criando tabela security_events...');
  await sql`
    CREATE TABLE IF NOT EXISTS security_events (
      id BIGSERIAL PRIMARY KEY,
      tipo TEXT NOT NULL,
      ip TEXT,
      path TEXT,
      user_agent TEXT,
      detalhes TEXT,
      criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
  await sql`CREATE INDEX IF NOT EXISTS idx_security_events_criado_em ON security_events (criado_em DESC)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_security_events_tipo ON security_events (tipo)`;
  console.log('  ✓ security_events');
  console.log('\nTabela security_events criada.');
}

run().catch((err) => {
  console.error('Erro:', err.message);
  process.exit(1);
});
