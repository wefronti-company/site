#!/usr/bin/env node
/**
 * Adiciona colunas nome e super_admin na tabela admins.
 * Define o primeiro admin como super_admin se não houver nenhum.
 * Uso: node -r dotenv/config scripts/migrate-admins-nome-super.mjs
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
  console.log('Migrando admins (nome, super_admin)...');

  await sql`ALTER TABLE admins ADD COLUMN IF NOT EXISTS nome VARCHAR(150)`;
  await sql`ALTER TABLE admins ADD COLUMN IF NOT EXISTS super_admin BOOLEAN NOT NULL DEFAULT false`;
  console.log('  ✓ colunas nome e super_admin adicionadas');

  // Se não há super_admin, definir o primeiro admin
  const rows = await sql`SELECT id FROM admins WHERE super_admin = true LIMIT 1`;
  if (rows.length === 0) {
    const first = await sql`SELECT id FROM admins ORDER BY criado_em ASC LIMIT 1`;
    if (first.length > 0) {
      await sql`UPDATE admins SET super_admin = true WHERE id = ${first[0].id}`;
      console.log('  ✓ primeiro admin definido como super_admin');
    }
  }

  console.log('\nMigração concluída.');
}

run().catch((err) => {
  console.error('Erro:', err.message);
  process.exit(1);
});
