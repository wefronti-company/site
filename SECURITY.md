# Segurança do sistema (Wefronti)

Este documento descreve as medidas de segurança aplicadas no site e no painel (hospedagem Vercel).

## Princípios

- **Backend único:** Toda regra de negócio, validação forte e autenticação ficam no servidor (APIs em `pages/api/*`). O cliente recebe apenas o frontend; nenhuma lógica sensível ou segredos são enviados ao browser.
- **Secrets no servidor:** `JWT_SECRET`, `DATABASE_URL`, credenciais SMTP e demais variáveis sensíveis existem apenas como variáveis de ambiente no backend (Vercel). No cliente só são expostos `NEXT_PUBLIC_SITE_URL` e `NEXT_PUBLIC_GA_ID`.
- **Inputs protegidos:** Validação e sanitização de todos os inputs no backend; frontend faz apenas validações leves para UX.

---

## APIs (backend)

- **Localização:** Todas as APIs estão em `pages/api/*` e rodam no servidor (Vercel Serverless).
- **SQL:** Uso de queries parametrizadas (Neon tagged template em `lib/db.ts`), sem concatenação de strings para evitar SQL injection.
- **Autenticação:** APIs de usuário (`/api/usuario/me`, `/api/usuario/atualizar`, etc.) exigem JWT válido em cookie. Admin exige cookie de sessão admin.
- **Rate limiting:** Helper centralizado em `lib/rate-limit.ts` (por IP e por slug da rota).
  - Login e registro usuário: 2 s entre tentativas por IP.
  - Esqueci senha: 1 minuto entre solicitações de código por IP (evita spam de e-mail).
  - Validar código e redefinir senha: 2 s entre tentativas por IP (reduz brute force no código de 6 dígitos).
  - Admin login: intervalo mínimo entre tentativas por IP.
- **Origem:** POST/PUT/DELETE validam `Origin`/`Referer` no middleware quando aplicável.
- **Sanitização:** Campos de texto (nome, endereço, chave PIX, etc.) são sanitizados no servidor (`lib/sanitize-server.ts`) antes de gravar (remoção de HTML/scripts e caracteres de controle) para reduzir risco de XSS quando os dados forem exibidos.

---

## Autenticação e cookies

- Cookies de sessão (`usuario_session`, admin) são **HttpOnly**, **SameSite**, **Secure** em produção.
- Tokens JWT assinados com `JWT_SECRET`; validação apenas no backend.
- Senhas e códigos de acesso são hasheados antes de persistir (bcrypt/argon2 conforme `lib/auth`).

---

## Middleware (`middleware.ts`)

- Bloqueio de IPs configurados e User-Agents suspeitos (bots genéricos).
- Proteção contra path traversal e bloqueio de caminhos sensíveis.
- Headers de segurança: X-Frame-Options DENY, X-Content-Type-Options nosniff, HSTS, Referrer-Policy, Permissions-Policy.
- **CSP (Content-Security-Policy):** default-src e script-src restritos a `'self'` e https:; sem `eval`; base-uri e form-action `'self'`; object-src `'none'`; upgrade-insecure-requests para forçar HTTPS.
- Proteção das rotas `/dash/dashboard` e admin: exigem JWT/sessão válida; redirecionamento para login quando não autenticado.

---

## Dados de clientes

- Acesso aos dados de usuários (perfil) somente via APIs que exigem autenticação.
- Perfil atualizável apenas pelo próprio usuário (via token) ou pelo admin em rotas protegidas.
- Política de Privacidade e Termos de Uso disponíveis; coleta e uso de dados descritos nas páginas legais.

---

## Recomendações contínuas

- Manter dependências atualizadas (`npm audit`, correções de segurança).
- Revisar e ajustar CSP e rate limits conforme uso real.
- Logs e monitoramento (Vercel, Neon) para detectar abusos ou erros recorrentes.
- Em caso de expansão, considerar rate limit distribuído (ex.: Redis) em vez de mapa em memória por instância.
