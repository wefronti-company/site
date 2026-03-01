#!/usr/bin/env node
/**
 * Cria as tabelas: admins, site_conteudo.
 * Uso: npm run db:init  ou  node -r dotenv/config scripts/init-admin-db.mjs
 */
import 'dotenv/config';
import { neon } from '@neondatabase/serverless';

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error('ERRO: DATABASE_URL não definida no .env');
  process.exit(1);
}

const sql = neon(databaseUrl);

async function run() {
  console.log('Criando tabelas (admins, site_conteudo)...');

  await sql`
    CREATE TABLE IF NOT EXISTS admins (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      nome VARCHAR(150),
      email VARCHAR(254) NOT NULL UNIQUE,
      codigo_acesso_hash VARCHAR(200) NOT NULL,
      super_admin BOOLEAN NOT NULL DEFAULT false,
      criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      atualizado_em TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
  console.log('  ✓ admins');

  await sql`CREATE INDEX IF NOT EXISTS idx_admins_email ON admins(email)`;
  console.log('  ✓ idx_admins_email');

  await sql`
    CREATE TABLE IF NOT EXISTS site_conteudo (
      secao VARCHAR(80) PRIMARY KEY,
      dados JSONB NOT NULL DEFAULT '{}',
      atualizado_em TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
  console.log('  ✓ site_conteudo');

  console.log('\nTabelas criadas: admins, site_conteudo.');
}

run().catch((err) => {
  console.error('Erro:', err.message);
  process.exit(1);
});
