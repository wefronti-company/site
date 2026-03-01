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
  console.log('Adicionando coluna country em site_views...');
  await sql`ALTER TABLE site_views ADD COLUMN IF NOT EXISTS country VARCHAR(2)`;
  console.log('  ✓ coluna country criada');
  console.log('\nMigração concluída.');
}

run().catch((err) => {
  console.error('Erro:', err.message);
  process.exit(1);
});
