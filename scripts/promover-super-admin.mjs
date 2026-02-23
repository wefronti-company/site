#!/usr/bin/env node
/**
 * Define um admin como super_admin pelo e-mail.
 * Uso: node -r dotenv/config scripts/promover-super-admin.mjs seu@email.com
 */
import 'dotenv/config';
import { neon } from '@neondatabase/serverless';

const email = process.argv[2];
if (!email) {
  console.error('Uso: node -r dotenv/config scripts/promover-super-admin.mjs seu@email.com');
  process.exit(1);
}

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error('ERRO: DATABASE_URL não definida no .env');
  process.exit(1);
}

const sql = neon(databaseUrl);
const emailLower = email.toLowerCase().trim();

async function run() {
  const rows = await sql`
    UPDATE admins SET super_admin = true WHERE email = ${emailLower}
    RETURNING id, email
  `;
  if (rows.length === 0) {
    console.error(`Admin não encontrado: ${emailLower}`);
    process.exit(1);
  }
  console.log(`Super admin definido: ${rows[0].email}`);
}

run().catch((err) => {
  console.error('Erro:', err.message);
  process.exit(1);
});
