#!/usr/bin/env node
/**
 * Adiciona coluna link_ativo na tabela propostas.
 * Uso: node -r dotenv/config scripts/migrate-propostas-link-ativo.mjs
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
  console.log('Adicionando coluna link_ativo em propostas...');

  await sql`
    ALTER TABLE propostas
    ADD COLUMN IF NOT EXISTS link_ativo BOOLEAN NOT NULL DEFAULT true
  `;
  console.log('  ✓ coluna link_ativo adicionada');

  console.log('\nMigração concluída.');
}

run().catch((err) => {
  console.error('Erro:', err.message);
  process.exit(1);
});
