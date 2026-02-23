#!/usr/bin/env node
/**
 * Adiciona suporte a mensalidade e pagamentos.
 * Uso: node -r dotenv/config scripts/migrate-clientes-mensalidade.mjs
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
  console.log('Migrando clientes para suporte a mensalidade...');

  await sql`
    ALTER TABLE clientes
    ADD COLUMN IF NOT EXISTS mensalidade INTEGER NOT NULL DEFAULT 0
  `;
  console.log('  ✓ coluna mensalidade adicionada');

  await sql`
    CREATE TABLE IF NOT EXISTS pagamentos_mensalidade (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      cliente_id UUID NOT NULL REFERENCES clientes(id) ON DELETE CASCADE,
      mes_ref INTEGER NOT NULL,
      pago_em TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      UNIQUE(cliente_id, mes_ref)
    )
  `;
  console.log('  ✓ tabela pagamentos_mensalidade criada');

  await sql`CREATE INDEX IF NOT EXISTS idx_pagamentos_cliente ON pagamentos_mensalidade(cliente_id)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_pagamentos_mes_ref ON pagamentos_mensalidade(mes_ref)`;
  console.log('  ✓ índices criados');

  console.log('\nMigração concluída.');
}

run().catch((err) => {
  console.error('Erro:', err.message);
  process.exit(1);
});
