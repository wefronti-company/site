#!/usr/bin/env node
/**
 * Cria um admin diretamente no banco.
 * Uso: npm run db:inserir-admin -- seu@email.com SEU_CODIGO
 */
import 'dotenv/config';
import { scryptSync, randomBytes } from 'crypto';
import { neon } from '@neondatabase/serverless';

function hashCodigoAcesso(plain) {
  const salt = randomBytes(16).toString('hex');
  const hash = scryptSync(plain, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}

const [email, codigo, nome] = process.argv.slice(2);
if (!email || !codigo) {
  console.error('Uso: npm run db:inserir-admin -- seu@email.com SEU_CODIGO [nome]');
  process.exit(1);
}

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error('ERRO: DATABASE_URL não definida no .env');
  process.exit(1);
}

const sql = neon(databaseUrl);
const hash = hashCodigoAcesso(codigo);
const emailLower = email.toLowerCase().trim();

async function run() {
  const nomeVal = nome ? String(nome).trim().slice(0, 150) : null;
  await sql`
    INSERT INTO admins (nome, email, codigo_acesso_hash)
    VALUES (${nomeVal}, ${emailLower}, ${hash})
    ON CONFLICT (email) DO UPDATE SET
      nome = COALESCE(EXCLUDED.nome, admins.nome),
      codigo_acesso_hash = EXCLUDED.codigo_acesso_hash,
      atualizado_em = NOW()
  `;
  console.log(`Admin criado/atualizado: ${emailLower}`);
}

run().catch((err) => {
  if (err.code === '42P01') {
    console.error('ERRO: Tabela admins não existe. Rode antes: npm run db:init');
  } else {
    console.error('Erro:', err.message);
  }
  process.exit(1);
});
