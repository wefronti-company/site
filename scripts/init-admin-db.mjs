#!/usr/bin/env node
/**
 * Cria as tabelas admins e admin_sessoes no banco.
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
  console.log('Criando tabelas...');

  await sql`
    CREATE TABLE IF NOT EXISTS admins (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      email VARCHAR(254) NOT NULL UNIQUE,
      codigo_acesso_hash VARCHAR(200) NOT NULL,
      criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      atualizado_em TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
  console.log('  ✓ admins');

  await sql`CREATE INDEX IF NOT EXISTS idx_admins_email ON admins(email)`;
  console.log('  ✓ idx_admins_email');

  await sql`
    CREATE TABLE IF NOT EXISTS admin_sessoes (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      admin_id UUID NOT NULL REFERENCES admins(id) ON DELETE CASCADE,
      token_hash VARCHAR(64) NOT NULL UNIQUE,
      expira_em TIMESTAMPTZ NOT NULL,
      criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
  console.log('  ✓ admin_sessoes');

  await sql`CREATE INDEX IF NOT EXISTS idx_admin_sessoes_token ON admin_sessoes(token_hash)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_admin_sessoes_expira ON admin_sessoes(expira_em)`;
  console.log('  ✓ índices de admin_sessoes');

  await sql`
    CREATE TABLE IF NOT EXISTS propostas (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      slug VARCHAR(120) NOT NULL UNIQUE,
      codigo VARCHAR(20) NOT NULL,
      empresa VARCHAR(150) NOT NULL,
      cliente VARCHAR(150) NOT NULL,
      servico SMALLINT NOT NULL DEFAULT 0,
      preco INTEGER NOT NULL DEFAULT 0,
      manutencao BOOLEAN NOT NULL DEFAULT FALSE,
      preco_manutencao INTEGER NOT NULL DEFAULT 0,
      enviado_em TIMESTAMPTZ NOT NULL
    )
  `;
  console.log('  ✓ propostas');

  await sql`CREATE INDEX IF NOT EXISTS idx_propostas_slug ON propostas(slug)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_propostas_enviado_em ON propostas(enviado_em)`;
  console.log('  ✓ índices de propostas');

  console.log('\nTabelas criadas com sucesso.');
}

run().catch((err) => {
  console.error('Erro:', err.message);
  process.exit(1);
});
