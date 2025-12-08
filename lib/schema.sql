-- Criação da tabela quote_requests
CREATE TABLE IF NOT EXISTS quote_requests (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  whatsapp VARCHAR(20) NOT NULL,
  email VARCHAR(255) NOT NULL,
  company VARCHAR(255) NOT NULL,
  role VARCHAR(100) NOT NULL,
  revenue VARCHAR(100) NOT NULL,
  challenge TEXT NOT NULL,
  timeline VARCHAR(100) NOT NULL,
  privacy_consent BOOLEAN NOT NULL DEFAULT FALSE,
  consented_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para melhor performance
CREATE INDEX idx_quote_requests_email ON quote_requests(email);
CREATE INDEX idx_quote_requests_created_at ON quote_requests(created_at);

COMMENT ON TABLE quote_requests IS 'Armazena as solicitações de orçamento enviadas através do formulário do site';
COMMENT ON COLUMN quote_requests.name IS 'Nome completo do solicitante';
COMMENT ON COLUMN quote_requests.whatsapp IS 'Número do WhatsApp para contato';
COMMENT ON COLUMN quote_requests.email IS 'Email para contato';
COMMENT ON COLUMN quote_requests.company IS 'Nome da empresa';
COMMENT ON COLUMN quote_requests.role IS 'Cargo do solicitante (CEO, CTO, Manager, Developer, Other)';
COMMENT ON COLUMN quote_requests.revenue IS 'Faturamento anual da empresa';
COMMENT ON COLUMN quote_requests.challenge IS 'Descrição do desafio/projeto';
COMMENT ON COLUMN quote_requests.timeline IS 'Prazo desejado para o projeto';
COMMENT ON COLUMN quote_requests.privacy_consent IS 'LGPD: Consentimento do usuário para tratamento de dados';
COMMENT ON COLUMN quote_requests.consented_at IS 'LGPD: Data e hora do consentimento';

-- Tabela para armazenar tokens de acesso ao console em produção
-- Store token hashes for security (do NOT store raw tokens)
CREATE TABLE IF NOT EXISTS console_tokens (
  id SERIAL PRIMARY KEY,
  token_hash VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE console_tokens IS 'Lista de tokens válidos (armazenados como hash) para acessar o console administrativo';
COMMENT ON COLUMN console_tokens.token_hash IS 'Hash do token de acesso (bcrypt). O token real não deve ser armazenado em texto claro.';

-- Tabela para sessões do console (armazenar apenas hashes de session ids)
CREATE TABLE IF NOT EXISTS console_sessions (
  id SERIAL PRIMARY KEY,
  session_hash VARCHAR(255) NOT NULL UNIQUE,
  token_id INTEGER REFERENCES console_tokens(id) ON DELETE SET NULL,
  ip VARCHAR(64),
  user_agent TEXT,
  expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE console_sessions IS 'Sessões ativas do console (hash das session ids, expiração e meta)';
COMMENT ON COLUMN console_sessions.session_hash IS 'Hash (bcrypt) do session id armazenado no cookie (apenas hash salvo no DB)';
