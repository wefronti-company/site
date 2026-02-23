/**
 * Gera o hash do código de acesso para inserir no banco.
 * Uso: npx ts-node scripts/criar-admin.ts seu@email.com SEU_CODIGO
 */
import { hashCodigoAcesso } from '../lib/auth';

const [email, codigo] = process.argv.slice(2);
if (!email || !codigo) {
  console.error('Uso: npx ts-node scripts/criar-admin.ts email codigo_acesso');
  process.exit(1);
}

const hash = hashCodigoAcesso(codigo);
console.log('\nExecute no Neon (ou via SQL):\n');
console.log(`INSERT INTO admins (email, codigo_acesso_hash) VALUES ('${email.toLowerCase().replace(/'/g, "''")}', '${hash}');\n`);
console.log('Ou use a API /api/admin/seed se disponível.\n');
