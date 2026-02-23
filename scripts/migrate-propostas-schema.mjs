#!/usr/bin/env node
/**
 * Migra a tabela propostas para o novo schema (campos do formulário).
 * ATENÇÃO: remove dados existentes da tabela propostas.
 * Uso: node -r dotenv/config scripts/migrate-propostas-schema.mjs
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
  console.log('Migrando tabela propostas para o novo schema...');

  await sql`DROP TABLE IF EXISTS propostas`;
  console.log('  ✓ tabela antiga removida');

  await sql`
    CREATE TABLE propostas (
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
  console.log('  ✓ nova tabela criada');

  await sql`CREATE INDEX IF NOT EXISTS idx_propostas_slug ON propostas(slug)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_propostas_enviado_em ON propostas(enviado_em)`;
  console.log('  ✓ índices criados');

  console.log('\nMigração concluída.');
}

run().catch((err) => {
  console.error('Erro:', err.message);
  process.exit(1);
});
