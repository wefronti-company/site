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
  console.log('Ajustando coluna requests.investimento para opcional...');
  await sql`ALTER TABLE requests ALTER COLUMN investimento DROP NOT NULL`;
  console.log('  ✓ coluna investimento ajustada');
  console.log('\nMigração concluída.');
}

run().catch((err) => {
  console.error('Erro:', err.message);
  process.exit(1);
});
