#!/usr/bin/env node
/**
 * Adiciona coluna cpf na tabela clientes.
 * Uso: node -r dotenv/config scripts/migrate-clientes-cpf.mjs
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
  console.log('Adicionando coluna cpf em clientes...');

  await sql`
    ALTER TABLE clientes
    ADD COLUMN IF NOT EXISTS cpf VARCHAR(14)
  `;
  console.log('  ✓ coluna cpf adicionada');

  console.log('\nMigração concluída.');
}

run().catch((err) => {
  console.error('Erro:', err.message);
  process.exit(1);
});
