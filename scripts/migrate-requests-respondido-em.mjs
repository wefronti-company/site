#!/usr/bin/env node
import 'dotenv/config';
import { neon } from '@neondatabase/serverless';

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error('ERRO: DATABASE_URL não definida no .env');
  process.exit(1);
}

const sql = neon(databaseUrl);

async function run() {
  console.log('Adicionando coluna requests.respondido_em...');
  await sql`ALTER TABLE requests ADD COLUMN IF NOT EXISTS respondido_em TIMESTAMPTZ`;
  console.log('  ✓ coluna respondido_em criada');
  console.log('\nMigração concluída.');
}

run().catch((err) => {
  console.error('Erro:', err.message);
  process.exit(1);
});
