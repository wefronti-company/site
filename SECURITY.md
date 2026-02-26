# Segurança – Resumo da varredura

## O que foi verificado e reforçado

### 1. Formulário “Dados do cliente” (`/dados-cliente`)
- **Backend único**: o envio é só via `POST /api/cadastro`; nenhuma lógica sensível no frontend.
- **Rate limit**: 1 cadastro por IP a cada 60s (evita spam e abuso).
- **Sanitização**: todos os campos de texto passam por `sanitizeTextForStorage` no backend (remove HTML/scripts, reduz XSS).
- **Validação no servidor**: nome, e-mail, razão social obrigatórios; e-mail validado com `validator`; CPF/celular/CNPJ/CEP com tamanho limitado e só dígitos.
- **Resposta mínima**: a API não devolve mais o objeto `cliente` (evita vazar `id`, `status`, `criadoEm`). Resposta: `{ ok: true, message: '...' }`.

### 2. APIs públicas protegidas
- **`POST /api/cadastro`**: rate limit + sanitização + resposta mínima (acima).
- **`GET /api/cep/[cep]`**: rate limit (1 consulta por IP a cada 2s) para não abusar do ViaCEP nem do servidor.
- **`GET /api/proposta/[slug]`**: slug validado (máx. 120 caracteres, só `a-zA-Z0-9_-`), evitando path traversal e payloads estranhos.

### 3. APIs administrativas (middleware)
- Rotas protegidas por cookie de sessão admin: `/api/clientes/*`, `/api/dashboard`, `/api/proposta/*` (exceto GET por slug), `/api/site` (métodos diferentes de GET).
- Sem token válido → `401 Não autenticado`.

### 4. Autenticação e sessão
- Admin: JWT em cookie `HttpOnly`, `SameSite=Strict`, `Secure` em produção; refresh com tempo máximo de 8h.
- Usuário (cliente): sessão verificada por token em cookie; APIs de perfil/dados só retornam dados do próprio usuário (vinculado ao e-mail da sessão).
- **Produção**: definir `JWT_SECRET` no ambiente (o código avisa se estiver em produção com secret padrão).

### 5. Middleware (proteções globais)
- **Origin/Referer**: requisições POST/PUT/DELETE/PATCH só aceitas de origens permitidas (CSRF).
- **Bots**: User-Agent suspeito (curl, scrapy, etc.) → 403.
- **Path traversal**: URLs com `..` ou `//` → 400.
- **Arquivos sensíveis**: `.env`, `.git`, etc. → 404.
- **Headers de segurança**: HSTS, X-Frame-Options, X-Content-Type-Options, CSP, etc.
- **Cache**: APIs com `no-store` para não cachear respostas sensíveis.

### 6. Dados e inputs
- **SQL**: uso de queries parametrizadas (Neon `sql` tag); sem concatenação de input em SQL.
- **XSS**: sanitização no backend para dados de cadastro; HTML de propostas usa `escapeHtml` ao montar o HTML.
- **Frontend**: nenhuma chave ou secret em `.tsx`; variáveis de ambiente só no servidor.

### 7. Página de dados do cliente
- Formulário apenas coleta dados e envia para `/api/cadastro`; não há leitura de cookies de admin/usuário para lógica sensível.
- Tratamento de erro genérico (“Erro ao enviar”); em caso de 429, a API envia mensagem de “aguarde” e o frontend exibe `data.error`.

## Recomendações contínuas
- Manter `JWT_SECRET` forte e único em produção; nunca commitar em repositório.
- Em produção, manter `DATABASE_URL` apenas no ambiente (ex.: Vercel).
- Revisar periodicamente a lista de origens permitidas no middleware se surgirem novos domínios (ex.: previews).
- Se no futuro o form de dados do cliente exigir login, proteger a rota e a API com a sessão do usuário e manter rate limit e sanitização.
