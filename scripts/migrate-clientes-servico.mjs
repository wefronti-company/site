#!/usr/bin/env node
/**
 * Adiciona colunas de serviço e manutenção em clientes.
 * Uso: node -r dotenv/config scripts/migrate-clientes-servico.mjs
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
  console.log('Migrando clientes para suporte a serviço e manutenção...');

  await sql`ALTER TABLE clientes ADD COLUMN IF NOT EXISTS servico_tipo VARCHAR(50)`;
  await sql`ALTER TABLE clientes ADD COLUMN IF NOT EXISTS manutencao BOOLEAN NOT NULL DEFAULT false`;
  await sql`ALTER TABLE clientes ADD COLUMN IF NOT EXISTS preco_servico INTEGER NOT NULL DEFAULT 0`;
  await sql`ALTER TABLE clientes ADD COLUMN IF NOT EXISTS preco_manutencao INTEGER NOT NULL DEFAULT 0`;
  console.log('  ✓ colunas servico_tipo, manutencao, preco_servico, preco_manutencao adicionadas');

  console.log('\nMigração concluída.');
}

run().catch((err) => {
  console.error('Erro:', err.message);
  process.exit(1);
});
