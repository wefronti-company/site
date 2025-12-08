-- Migration 0001: Create console_tokens and console_sessions tables
-- Run this file once during deployment/migration step

CREATE TABLE IF NOT EXISTS console_tokens (
  id SERIAL PRIMARY KEY,
  token_hash VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE console_tokens IS 'Lista de tokens válidos (armazenados como hash) para acessar o console administrativo';
COMMENT ON COLUMN console_tokens.token_hash IS 'Hash do token de acesso (bcrypt). O token real não deve ser armazenado em texto claro.';

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
