#!/usr/bin/env node
/**
 * Migração: painel usa cliente em vez de usuário.
 * 1. Adiciona codigo_acesso_hash em clientes (login do painel).
 * 2. Cria cliente_reset_tokens (esqueci senha).
 * 3. Cria cliente_notificacoes (notificações do painel).
 * 4. Copia dados de usuarios para clientes (hash por email; cria cliente se não existir).
 * Uso: node -r dotenv/config scripts/migrate-painel-cliente.mjs
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
  console.log('Migrando painel de usuario para cliente...\n');

  // 1. Login: cliente pode ter senha
  await sql`ALTER TABLE clientes ADD COLUMN IF NOT EXISTS codigo_acesso_hash VARCHAR(255)`;
  console.log('  ✓ coluna codigo_acesso_hash em clientes');

  // 2. Reset de senha
  await sql`
    CREATE TABLE IF NOT EXISTS cliente_reset_tokens (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      cliente_id UUID NOT NULL REFERENCES clientes(id) ON DELETE CASCADE,
      token VARCHAR(64) NOT NULL UNIQUE,
      expira_em TIMESTAMPTZ NOT NULL,
      usado BOOLEAN NOT NULL DEFAULT false,
      criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
  await sql`CREATE INDEX IF NOT EXISTS idx_cliente_reset_tokens_token ON cliente_reset_tokens(token)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_cliente_reset_tokens_expira ON cliente_reset_tokens(expira_em)`;
  console.log('  ✓ tabela cliente_reset_tokens');

  // 3. Notificações do painel por cliente
  await sql`
    CREATE TABLE IF NOT EXISTS cliente_notificacoes (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      cliente_id UUID NOT NULL REFERENCES clientes(id) ON DELETE CASCADE,
      tipo VARCHAR(50) NOT NULL,
      titulo VARCHAR(200) NOT NULL,
      mensagem TEXT,
      lida_em TIMESTAMPTZ NULL,
      criada_em TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
  await sql`CREATE INDEX IF NOT EXISTS idx_cliente_notificacoes_cliente_criada ON cliente_notificacoes (cliente_id, criada_em DESC)`;
  console.log('  ✓ tabela cliente_notificacoes');

  // 4. Copiar hash de usuarios para clientes (onde email coincide)
  try {
    const updated = await sql`
      UPDATE clientes c
      SET codigo_acesso_hash = u.codigo_acesso_hash
      FROM usuarios u
      WHERE LOWER(TRIM(c.email)) = LOWER(TRIM(u.email))
        AND u.codigo_acesso_hash IS NOT NULL
        AND u.codigo_acesso_hash != ''
    `;
    const updatedCount = Array.isArray(updated) ? updated.length : (updated?.length ?? 0);
    console.log('  ✓ atualizados clientes com hash de usuarios (por email):', updatedCount, 'linhas');
  } catch (e) {
    console.log('  ⚠ skip update (usuarios pode não existir):', e.message);
  }

  // 5. Inserir clientes para usuarios que ainda não têm (conta só no painel, sem contrato)
  try {
    const inserted = await sql`
      INSERT INTO clientes (nome, email, razao_social, codigo_acesso_hash, mensalidade, status, criado_em)
      SELECT u.nome_completo, LOWER(TRIM(u.email)), '', u.codigo_acesso_hash, 0, 0, COALESCE(u.criado_em, NOW())
      FROM usuarios u
      WHERE NOT EXISTS (
        SELECT 1 FROM clientes c WHERE LOWER(TRIM(c.email)) = LOWER(TRIM(u.email))
      )
    `;
    const insertCount = Array.isArray(inserted) ? inserted.length : (inserted?.length ?? 0);
    console.log('  ✓ novos clientes criados a partir de usuarios (sem match):', insertCount, 'linhas');
  } catch (e) {
    console.log('  ⚠ skip insert:', e.message);
  }

  console.log('\nMigração concluída. Painel passa a autenticar por clientes.');
}

run().catch((err) => {
  console.error('Erro:', err.message);
  process.exit(1);
});
