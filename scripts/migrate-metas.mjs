#!/usr/bin/env node
/**
 * Cria tabela metas para configuração do dashboard.
 * Uso: node -r dotenv/config scripts/migrate-metas.mjs
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
  console.log('Criando tabela metas...');

  await sql`
    CREATE TABLE IF NOT EXISTS metas (
      id SMALLINT PRIMARY KEY DEFAULT 1,
      meta_receita INTEGER NOT NULL DEFAULT 0,
      meta_clientes INTEGER NOT NULL DEFAULT 0
    )
  `;
  await sql`
    INSERT INTO metas (id, meta_receita, meta_clientes)
    VALUES (1, 0, 0)
    ON CONFLICT (id) DO UPDATE SET meta_receita = 0, meta_clientes = 0
  `;
  console.log('  ✓ metas criada/zerada');

  console.log('\nMigração concluída.');
}

run().catch((err) => {
  console.error('Erro:', err.message);
  process.exit(1);
});
