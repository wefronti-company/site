#!/usr/bin/env node
/**
 * Cria tabelas usuarios e usuario_reset_tokens (painel do cliente).
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
  console.log('Criando tabelas de usuários...');

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

  await sql`ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS chave_pix VARCHAR(255)`;
  await sql`ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS banco VARCHAR(100)`;
  await sql`ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS nome_titular VARCHAR(200)`;
  await sql`ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS whatsapp_numero VARCHAR(20)`;
  await sql`ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS whatsapp_mensagem VARCHAR(400)`;
  console.log('  ✓ colunas opcionais em usuarios (se não existirem)');

  console.log('\nMigração concluída.');
}

run().catch((err) => {
  console.error('Erro:', err.message);
  process.exit(1);
});
