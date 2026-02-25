#!/usr/bin/env node
/**
 * Cria tabela servicos para cadastro de tipos de serviço (Site, Landing Page, etc.).
 * Uso: node -r dotenv/config scripts/migrate-servicos.mjs
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
  console.log('Criando tabela servicos...');

  await sql`
    CREATE TABLE IF NOT EXISTS servicos (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      nome VARCHAR(100) NOT NULL,
      ordem INTEGER NOT NULL DEFAULT 0,
      criado_em TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `;
  console.log('  ✓ servicos criada');

  console.log('\nMigração concluída.');
}

run().catch((err) => {
  console.error('Erro:', err.message);
  process.exit(1);
});
