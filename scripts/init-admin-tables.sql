-- Tabela de administradores (campos com tamanho mínimo)
CREATE TABLE IF NOT EXISTS admins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome VARCHAR(150),
  email VARCHAR(254) NOT NULL UNIQUE,
  codigo_acesso_hash VARCHAR(200) NOT NULL,
  super_admin BOOLEAN NOT NULL DEFAULT false,
  criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  atualizado_em TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_admins_email ON admins(email);
