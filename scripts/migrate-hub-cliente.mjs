#!/usr/bin/env node
/**
 * Refatoração para Hub do Cliente:
 * 1. Adiciona forma_pagamento em pagamentos_mensalidade (pix, cartao).
 * 2. Remove tabelas do Indique e Ganhe: indicacao_acessos, indicacao_comissoes.
 * Uso: node -r dotenv/config scripts/migrate-hub-cliente.mjs
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
  console.log('Migrando para Hub do Cliente...\n');

  // 1. Adiciona forma_pagamento em pagamentos_mensalidade (como o cliente pagou: pix, cartao)
  await sql`ALTER TABLE pagamentos_mensalidade ADD COLUMN IF NOT EXISTS forma_pagamento VARCHAR(20)`;
  console.log('  ✓ coluna forma_pagamento em pagamentos_mensalidade (se não existir)');

  // 2. Forma de pagamento do projeto (cartao, pix, 50_50)
  await sql`ALTER TABLE clientes ADD COLUMN IF NOT EXISTS forma_pagamento_projeto VARCHAR(20)`;
  console.log('  ✓ coluna forma_pagamento_projeto em clientes (se não existir)');

  // 3. Remove tabelas do programa Indique e Ganhe
  await sql`DROP TABLE IF EXISTS indicacao_comissoes CASCADE`;
  console.log('  ✓ tabela indicacao_comissoes removida');
  await sql`DROP TABLE IF EXISTS indicacao_acessos CASCADE`;
  console.log('  ✓ tabela indicacao_acessos removida');

  console.log('\nMigração concluída. Valores de forma_pagamento_projeto: cartao, pix, 50_50.');
}

run().catch((err) => {
  console.error('Erro:', err.message);
  process.exit(1);
});
