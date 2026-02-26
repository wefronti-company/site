#!/usr/bin/env node
/**
 * Cria apenas as tabelas: admins, clientes, pagamentos_mensalidade, propostas.
 * Uso: npm run db:init  ou  node -r dotenv/config scripts/init-admin-db.mjs
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
  console.log('Criando tabelas (admins, clientes, pagamentos_mensalidade, propostas)...');

  await sql`
    CREATE TABLE IF NOT EXISTS admins (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      nome VARCHAR(150),
      email VARCHAR(254) NOT NULL UNIQUE,
      codigo_acesso_hash VARCHAR(200) NOT NULL,
      super_admin BOOLEAN NOT NULL DEFAULT false,
      criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      atualizado_em TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
  console.log('  ✓ admins');

  await sql`CREATE INDEX IF NOT EXISTS idx_admins_email ON admins(email)`;
  console.log('  ✓ idx_admins_email');

  await sql`
    CREATE TABLE IF NOT EXISTS propostas (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      slug VARCHAR(120) NOT NULL UNIQUE,
      codigo VARCHAR(20) NOT NULL,
      empresa VARCHAR(150) NOT NULL,
      cliente VARCHAR(150) NOT NULL,
      servico SMALLINT NOT NULL DEFAULT 0,
      preco INTEGER NOT NULL DEFAULT 0,
      manutencao BOOLEAN NOT NULL DEFAULT FALSE,
      preco_manutencao INTEGER NOT NULL DEFAULT 0,
      enviado_em TIMESTAMPTZ NOT NULL
    )
  `;
  console.log('  ✓ propostas');

  await sql`CREATE INDEX IF NOT EXISTS idx_propostas_slug ON propostas(slug)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_propostas_enviado_em ON propostas(enviado_em)`;
  console.log('  ✓ índices de propostas');

  await sql`
    CREATE TABLE IF NOT EXISTS clientes (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      nome VARCHAR(150) NOT NULL,
      email VARCHAR(254) NOT NULL,
      cpf VARCHAR(14),
      celular VARCHAR(20),
      razao_social VARCHAR(200) NOT NULL,
      cnpj VARCHAR(18),
      site VARCHAR(200),
      endereco_logradouro VARCHAR(150),
      endereco_numero VARCHAR(20),
      endereco_complemento VARCHAR(80),
      endereco_bairro VARCHAR(80),
      endereco_cidade VARCHAR(80),
      endereco_uf CHAR(2),
      endereco_cep VARCHAR(10),
      mensalidade INTEGER NOT NULL DEFAULT 0,
      dia_vencimento SMALLINT,
      status SMALLINT NOT NULL DEFAULT 0,
      criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
  await sql`CREATE TABLE IF NOT EXISTS pagamentos_mensalidade (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cliente_id UUID NOT NULL REFERENCES clientes(id) ON DELETE CASCADE,
    mes_ref INTEGER NOT NULL,
    pago_em TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(cliente_id, mes_ref)
  )`;
  console.log('  ✓ clientes');

  await sql`CREATE INDEX IF NOT EXISTS idx_clientes_email ON clientes(email)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_clientes_cnpj ON clientes(cnpj)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_clientes_status ON clientes(status)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_pagamentos_cliente ON pagamentos_mensalidade(cliente_id)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_pagamentos_mes_ref ON pagamentos_mensalidade(mes_ref)`;
  console.log('  ✓ índices de clientes e pagamentos');

  await sql`
    CREATE TABLE IF NOT EXISTS site_conteudo (
      secao VARCHAR(80) PRIMARY KEY,
      dados JSONB NOT NULL DEFAULT '{}',
      atualizado_em TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
  console.log('  ✓ site_conteudo');

  console.log('\nTabelas criadas: admins, clientes, pagamentos_mensalidade, propostas, site_conteudo.');
}

run().catch((err) => {
  console.error('Erro:', err.message);
  process.exit(1);
});
