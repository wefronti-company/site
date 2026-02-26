#!/usr/bin/env node
/**
 * Adiciona coluna dia_vencimento em clientes (dia do mês para vencimento, 1-31).
 * Uso: node -r dotenv/config scripts/migrate-dia-vencimento.mjs
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
  console.log('Verificando tabela clientes...');
  const tables = await sql`
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'clientes'
  `;
  if (!tables.length) {
    console.error('ERRO: A tabela clientes não existe. Execute primeiro: node -r dotenv/config scripts/init-admin-db.mjs');
    process.exit(1);
  }
  console.log('  ✓ tabela clientes existe');

  console.log('Adicionando coluna dia_vencimento em clientes...');
  await sql`ALTER TABLE clientes ADD COLUMN IF NOT EXISTS dia_vencimento SMALLINT`;
  console.log('  ✓ dia_vencimento (1-31)');
  console.log('\nMigração concluída.');
}

run().catch((err) => {
  console.error('Erro:', err.message);
  process.exit(1);
});
