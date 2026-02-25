#!/usr/bin/env node
/**
 * Adiciona coluna parcelas_cartao em clientes (quando forma de pagamento é cartão).
 * Uso: node -r dotenv/config scripts/migrate-parcelas-cartao.mjs
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
  console.log('Adicionando coluna parcelas_cartao em clientes...');
  await sql`ALTER TABLE clientes ADD COLUMN IF NOT EXISTS parcelas_cartao SMALLINT`;
  console.log('  ✓ parcelas_cartao');
  console.log('\nMigração concluída.');
}

run().catch((err) => {
  console.error('Erro:', err.message);
  process.exit(1);
});
