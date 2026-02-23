-- Tabela de administradores (campos com tamanho mínimo)
CREATE TABLE IF NOT EXISTS admins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(254) NOT NULL UNIQUE,
  codigo_acesso_hash VARCHAR(200) NOT NULL,
  criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  atualizado_em TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_admins_email ON admins(email);

-- Tabela de sessões (autenticação ativa)
CREATE TABLE IF NOT EXISTS admin_sessoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID NOT NULL REFERENCES admins(id) ON DELETE CASCADE,
  token_hash VARCHAR(64) NOT NULL UNIQUE,
  expira_em TIMESTAMPTZ NOT NULL,
  criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_admin_sessoes_token ON admin_sessoes(token_hash);
CREATE INDEX IF NOT EXISTS idx_admin_sessoes_expira ON admin_sessoes(expira_em);

-- Tabela de propostas comerciais (storage otimizado)
-- servico: 0=Site, 1=Landing Page | preco/preco_manutencao: centavos
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
);

CREATE INDEX IF NOT EXISTS idx_propostas_slug ON propostas(slug);
CREATE INDEX IF NOT EXISTS idx_propostas_enviado_em ON propostas(enviado_em);
