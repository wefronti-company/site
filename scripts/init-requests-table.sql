CREATE TABLE IF NOT EXISTS requests (
  id BIGSERIAL PRIMARY KEY,
  tipo TEXT NOT NULL,
  nome TEXT NOT NULL,
  sobrenome TEXT NOT NULL,
  email TEXT NOT NULL,
  whatsapp TEXT NOT NULL,
  investimento TEXT,
  tipo_projeto TEXT,
  contexto TEXT NOT NULL,
  origem TEXT,
  ip TEXT,
  user_agent TEXT,
  status TEXT NOT NULL DEFAULT 'novo',
  criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  respondido_em TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_requests_criado_em ON requests (criado_em DESC);
CREATE INDEX IF NOT EXISTS idx_requests_status ON requests (status);

ALTER TABLE requests ADD COLUMN IF NOT EXISTS respondido_em TIMESTAMPTZ;
