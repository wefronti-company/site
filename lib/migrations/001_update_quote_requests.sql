-- Migration: Atualizar estrutura da tabela quote_requests
-- Data: 2026-01-20
-- Descrição: Atualizar colunas do formulário (remover role, whatsapp, timeline, revenue, challenge, privacy_consent; adicionar phone, investment, project_type, urgency, details)

-- Backup da tabela atual (opcional, descomente se houver dados importantes)
-- CREATE TABLE quote_requests_backup AS SELECT * FROM quote_requests;

-- Opção 1: Dropar e recriar a tabela (USE APENAS SE NÃO HOUVER DADOS IMPORTANTES)
DROP TABLE IF EXISTS quote_requests CASCADE;

CREATE TABLE quote_requests (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  email VARCHAR(255) NOT NULL,
  company VARCHAR(255) NOT NULL,
  investment VARCHAR(100) NOT NULL,
  project_type VARCHAR(100) NOT NULL,
  urgency VARCHAR(100) NOT NULL,
  details TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Recriar índices
CREATE INDEX idx_quote_requests_email ON quote_requests(email);
CREATE INDEX idx_quote_requests_created_at ON quote_requests(created_at);

-- Comentários
COMMENT ON TABLE quote_requests IS 'Armazena as solicitações de orçamento enviadas através do formulário do site';
COMMENT ON COLUMN quote_requests.name IS 'Nome completo do solicitante';
COMMENT ON COLUMN quote_requests.phone IS 'Número de celular para contato';
COMMENT ON COLUMN quote_requests.email IS 'Email para contato';
COMMENT ON COLUMN quote_requests.company IS 'Nome da empresa';
COMMENT ON COLUMN quote_requests.investment IS 'Valor para investimento';
COMMENT ON COLUMN quote_requests.project_type IS 'Tipo de projeto (site, ecommerce, sistema, app, saas, api, outro)';
COMMENT ON COLUMN quote_requests.urgency IS 'Nível de urgência (baixa, media, alta, urgente)';
COMMENT ON COLUMN quote_requests.details IS 'Descrição detalhada do projeto';

-- Se você tiver dados importantes e quiser migrá-los, descomente e ajuste:
/*
-- Opção 2: Migração com preservação de dados
ALTER TABLE quote_requests RENAME COLUMN whatsapp TO phone;
ALTER TABLE quote_requests RENAME COLUMN challenge TO details;
ALTER TABLE quote_requests DROP COLUMN IF EXISTS role;
ALTER TABLE quote_requests DROP COLUMN IF EXISTS revenue;
ALTER TABLE quote_requests DROP COLUMN IF EXISTS timeline;
ALTER TABLE quote_requests DROP COLUMN IF EXISTS privacy_consent;
ALTER TABLE quote_requests DROP COLUMN IF EXISTS consented_at;
ALTER TABLE quote_requests ADD COLUMN IF NOT EXISTS investment VARCHAR(100) DEFAULT '';
ALTER TABLE quote_requests ADD COLUMN IF NOT EXISTS project_type VARCHAR(100) DEFAULT '';
ALTER TABLE quote_requests ADD COLUMN IF NOT EXISTS urgency VARCHAR(100) DEFAULT '';

-- Atualizar valores default para NOT NULL
UPDATE quote_requests SET investment = '5k-15k' WHERE investment = '';
UPDATE quote_requests SET project_type = 'outro' WHERE project_type = '';
UPDATE quote_requests SET urgency = 'media' WHERE urgency = '';

ALTER TABLE quote_requests ALTER COLUMN investment SET NOT NULL;
ALTER TABLE quote_requests ALTER COLUMN project_type SET NOT NULL;
ALTER TABLE quote_requests ALTER COLUMN urgency SET NOT NULL;
*/
