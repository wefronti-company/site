# Relatório de Auditoria de Segurança

**Data:** 2025-02-14  
**Escopo:** Site Wefronti (Next.js)

## Brechas corrigidas

### 1. Bypass de validação CSRF em `validateOrigin` (crítico)
- **Problema:** `origin.startsWith(allowed)` permitia `https://wefronti.com.attacker.com`. O fallback `origin.includes(host)` permitia `https://evil.com?wefronti.com`.
- **Correção:** Validação por hostname exato via `new URL(origin).hostname` contra um conjunto fixo de hosts permitidos.

### 2. `ALLOWED_ORIGINS_DEBUG` em produção
- **Problema:** Com `ALLOWED_ORIGINS_DEBUG=true`, qualquer origem era aceita, inclusive em produção.
- **Correção:** O bypass de debug só é aplicado quando `NODE_ENV !== 'production'`.

### 3. Log de debug em produção
- **Problema:** `origin_debug.log` era escrito sempre que `ALLOWED_ORIGINS_DEBUG` estava ativo, inclusive em produção.
- **Correção:** Escrita do log restrita a ambientes não-produção.

### 4. XSS em `GA_TRACKING_ID` (gtag.js)
- **Problema:** O ID do Google Analytics era injetado em `innerHTML` sem sanitização. Se o env fosse comprometido, poderia permitir XSS.
- **Correção:** Sanitização com regex `/^[GA]-[\w-]+$/`; IDs inválidos resultam em string vazia.

### 5. `origin_debug.log` no controle de versão
- **Correção:** Arquivo adicionado ao `.gitignore`.

---

## Pontos positivos (já implementados)

| Área | Status |
|------|--------|
| **Headers de segurança** | HSTS, X-Frame-Options, X-Content-Type-Options, CSP, Permissions-Policy |
| **Middleware** | Bloqueio de path traversal (`..`, `//`), bloqueio de `.env`, `.git`, etc., validação de origem para POST/PUT/DELETE |
| **Projetos estáticos** | Slugs vindos de `data/projects.ts` (dados controlados), sem SSG dinâmico de user input |
| **`.env`** | Incluído em `.gitignore` |

---

## Recomendações futuras

1. **CSP `unsafe-inline`:** O Next.js usa inline scripts para hidratação. Considerar nonces ou hashes para reduzir a dependência de `unsafe-inline`.
2. **`Cross-Origin-Embedder-Policy: require-corp`:** Pode causar problemas com recursos de terceiros. Testar com Google Fonts e Analytics.
3. **`npm audit`:** Executar periodicamente e corrigir vulnerabilidades de dependências.
