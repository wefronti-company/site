# 503 em chunks JS no console

Se aparecerem erros `Failed to load resource: 503` em arquivos `/_next/static/chunks/*.js`, possíveis causas:

## 1. Cloudflare (mais provável)

- **Security Level / Bot Fight Mode**: Podem bloquear requisições paralelas de chunks.
- **Ajuste**: Cloudflare Dashboard → Security → Settings → Security Level = "Medium" ou "Low".
- Ou crie uma **WAF Custom Rule** para bypass em `/_next/static/*`:
  - Expression: `(http.request.uri.path contains "/_next/static/")`
  - Action: Skip → All remaining custom rules

## 2. Race pós-deploy

Após o deploy, o purge do Cloudflare pode ocorrer antes da propagação do Vercel.  
O workflow agora espera 30s antes do purge. Se ainda ocorrer 503, aumente o delay no workflow.

## 3. Cache de erro

Se o Cloudflare tiver cacheado 503:

- Cloudflare Dashboard → Caching → Configuration → "Caching Level"
- Ou use "Purge Everything" manualmente após o deploy

## 4. Teste sem Cloudflare

Teste direto em `*.vercel.app` (sem passar pelo Cloudflare). Se lá funcionar, o problema é do Cloudflare.
