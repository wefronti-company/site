#!/usr/bin/env node
/**
 * Gera o hash do código de acesso para inserir no banco.
 * Uso: npm run db:criar-admin -- seu@email.com SEU_CODIGO
 */
import 'dotenv/config';
import { scryptSync, randomBytes } from 'crypto';

function hashCodigoAcesso(plain) {
  const salt = randomBytes(16).toString('hex');
  const hash = scryptSync(plain, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}

const [email, codigo] = process.argv.slice(2);
if (!email || !codigo) {
  console.error('Uso: node scripts/criar-admin.mjs email codigo_acesso');
  process.exit(1);
}

const hash = hashCodigoAcesso(codigo);
const safeEmail = email.toLowerCase().replace(/'/g, "''");
console.log('\nExecute no Neon:\n');
console.log(`INSERT INTO admins (email, codigo_acesso_hash) VALUES ('${safeEmail}', '${hash}');\n`);
