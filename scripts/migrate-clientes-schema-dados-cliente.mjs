#!/usr/bin/env node
/**
 * Redefine a tabela clientes para conter apenas as colunas do formulário
 * de dados do cliente (/dados-cliente) + mensalidade, dia_vencimento e status.
 *
 * ATENÇÃO: Este script APAGA todos os dados de clientes e pagamentos_mensalidade.
 * Uso: node -r dotenv/config scripts/migrate-clientes-schema-dados-cliente.mjs
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
  console.log('Redefinindo tabela clientes (apenas colunas do form dados-cliente)...\n');

  console.log('Removendo tabela pagamentos_mensalidade...');
  await sql`DROP TABLE IF EXISTS pagamentos_mensalidade`;
  console.log('  ✓ removida');

  console.log('Removendo tabela clientes...');
  await sql`DROP TABLE IF EXISTS clientes`;
  console.log('  ✓ removida');

  console.log('Criando tabela clientes (schema mínimo)...');
  await sql`
    CREATE TABLE clientes (
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
  console.log('  ✓ clientes criada');

  console.log('Criando tabela pagamentos_mensalidade...');
  await sql`
    CREATE TABLE pagamentos_mensalidade (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      cliente_id UUID NOT NULL REFERENCES clientes(id) ON DELETE CASCADE,
      mes_ref INTEGER NOT NULL,
      pago_em TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      UNIQUE(cliente_id, mes_ref)
    )
  `;
  console.log('  ✓ pagamentos_mensalidade criada');

  console.log('Criando índices...');
  await sql`CREATE INDEX idx_clientes_email ON clientes(email)`;
  await sql`CREATE INDEX idx_clientes_cnpj ON clientes(cnpj)`;
  await sql`CREATE INDEX idx_clientes_status ON clientes(status)`;
  await sql`CREATE INDEX idx_pagamentos_cliente ON pagamentos_mensalidade(cliente_id)`;
  await sql`CREATE INDEX idx_pagamentos_mes_ref ON pagamentos_mensalidade(mes_ref)`;
  console.log('  ✓ índices criados');

  console.log('\nMigração concluída. Tabela clientes contém apenas as colunas do form dados-cliente.');
}

run().catch((err) => {
  console.error('Erro:', err.message);
  process.exit(1);
});
