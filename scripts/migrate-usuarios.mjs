#!/usr/bin/env node
/**
 * Cria tabelas usuarios e usuario_reset_tokens (indique e ganhe).
 * Uso: node -r dotenv/config scripts/migrate-usuarios.mjs
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
  console.log('Criando tabelas de usuários (indique e ganhe)...');

  await sql`
    CREATE TABLE IF NOT EXISTS usuarios (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      nome_completo VARCHAR(200) NOT NULL,
      email VARCHAR(254) NOT NULL UNIQUE,
      celular VARCHAR(20),
      data_nascimento DATE,
      cpf VARCHAR(14),
      endereco_logradouro VARCHAR(150),
      endereco_numero VARCHAR(20),
      endereco_complemento VARCHAR(80),
      endereco_bairro VARCHAR(80),
      endereco_cidade VARCHAR(80),
      endereco_uf CHAR(2),
      endereco_cep VARCHAR(10),
      codigo_acesso_hash VARCHAR(200) NOT NULL,
      codigo_referencia VARCHAR(20) NOT NULL UNIQUE,
      ativo BOOLEAN NOT NULL DEFAULT true,
      criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
  console.log('  ✓ usuarios');

  await sql`CREATE INDEX IF NOT EXISTS idx_usuarios_email ON usuarios(email)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_usuarios_codigo_ref ON usuarios(codigo_referencia)`;
  console.log('  ✓ índices de usuarios');

  await sql`
    CREATE TABLE IF NOT EXISTS usuario_reset_tokens (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      usuario_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
      token VARCHAR(64) NOT NULL UNIQUE,
      expira_em TIMESTAMPTZ NOT NULL,
      usado BOOLEAN NOT NULL DEFAULT false,
      criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
  console.log('  ✓ usuario_reset_tokens');

  await sql`CREATE INDEX IF NOT EXISTS idx_usuario_reset_token ON usuario_reset_tokens(token)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_usuario_reset_expira ON usuario_reset_tokens(expira_em)`;
  console.log('  ✓ índices de usuario_reset_tokens');

  await sql`
    CREATE TABLE IF NOT EXISTS indicacao_acessos (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      usuario_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
      criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
  console.log('  ✓ indicacao_acessos');

  await sql`CREATE INDEX IF NOT EXISTS idx_indicacao_acessos_usuario ON indicacao_acessos(usuario_id)`;
  console.log('  ✓ índice indicacao_acessos');

  await sql`ALTER TABLE indicacao_acessos ADD COLUMN IF NOT EXISTS ip_hash VARCHAR(64)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_indicacao_acessos_usuario_ip ON indicacao_acessos(usuario_id, ip_hash)`;
  console.log('  ✓ coluna ip_hash e índice para deduplicação (indicacao_acessos)');

  await sql`ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS chave_pix VARCHAR(255)`;
  console.log('  ✓ coluna chave_pix (se não existir)');
  await sql`ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS banco VARCHAR(100)`;
  await sql`ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS nome_titular VARCHAR(200)`;
  console.log('  ✓ colunas banco e nome_titular (se não existirem)');

  await sql`
    CREATE TABLE IF NOT EXISTS indicacao_comissoes (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      usuario_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
      empresa_indicada VARCHAR(200) NOT NULL,
      valor_contrato NUMERIC(12, 2) NOT NULL,
      valor_comissao NUMERIC(12, 2) NOT NULL,
      criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
  console.log('  ✓ indicacao_comissoes');

  await sql`CREATE INDEX IF NOT EXISTS idx_indicacao_comissoes_usuario ON indicacao_comissoes(usuario_id)`;
  console.log('  ✓ índice indicacao_comissoes');

  await sql`
    CREATE TABLE IF NOT EXISTS usuario_notificacoes (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      usuario_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
      tipo VARCHAR(50) NOT NULL,
      titulo VARCHAR(200) NOT NULL,
      mensagem TEXT,
      lida_em TIMESTAMPTZ,
      criada_em TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
  console.log('  ✓ usuario_notificacoes');
  await sql`CREATE INDEX IF NOT EXISTS idx_usuario_notificacoes_usuario ON usuario_notificacoes(usuario_id)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_usuario_notificacoes_lida ON usuario_notificacoes(usuario_id, lida_em)`;
  console.log('  ✓ índices usuario_notificacoes');

  console.log('\nMigração concluída.');
}

run().catch((err) => {
  console.error('Erro:', err.message);
  process.exit(1);
});
