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
  console.log('Criando tabela site_views...');
  await sql`
    CREATE TABLE IF NOT EXISTS site_views (
      id BIGSERIAL PRIMARY KEY,
      path TEXT NOT NULL,
      ip_hash TEXT,
      criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
  await sql`CREATE INDEX IF NOT EXISTS idx_site_views_criado_em ON site_views (criado_em DESC)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_site_views_path ON site_views (path)`;
  console.log('  ✓ site_views');
  console.log('\nTabela site_views criada.');
}

run().catch((err) => {
  console.error('Erro:', err.message);
  process.exit(1);
});
