#!/usr/bin/env node
/**
 * Corrige mensalidade nos clientes existentes: define mensalidade = preco_manutencao
 * quando manutencao = true (em vez da soma projeto + manutenção).
 * Uso: npm run db:corrigir-mensalidades
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
  console.log('Corrigindo mensalidades (mensalidade = preco_manutencao onde manutencao = true)...');

  const updated = await sql`
    UPDATE clientes
    SET mensalidade = preco_manutencao
    WHERE manutencao = true AND (mensalidade IS DISTINCT FROM preco_manutencao)
    RETURNING id
  `;

  const count = Array.isArray(updated) ? updated.length : 0;
  console.log('  ✓ Registros atualizados:', count);

  console.log('\nConcluído. A mensalidade exibida passará a ser apenas o valor da manutenção.');
}

run().catch((err) => {
  console.error('Erro:', err.message);
  process.exit(1);
});
