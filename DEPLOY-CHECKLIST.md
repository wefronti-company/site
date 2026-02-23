# Checklist de deploy – produção

## 1. Variáveis de ambiente

### GitHub Secrets (Settings → Secrets and variables → Actions)

Adicione o secret `JWT_SECRET` com o valor gerado por `openssl rand -base64 32`.  
O workflow sincroniza automaticamente com o Vercel a cada deploy.

### Vercel (Settings → Environment Variables)

Para `DATABASE_URL` e outras variáveis, defina em **Vercel → Project → Settings → Environment Variables**:

| Variável       | Valor                  | Ambiente |
|----------------|------------------------|----------|
| `DATABASE_URL` | Connection string Neon | Production |
| `NEXT_PUBLIC_SITE_URL` | `https://wefronti.com` | Production (opcional) |

`JWT_SECRET` é sincronizado do GitHub pelo workflow.

## 2. Domínios (Vercel)

- **Site principal**: wefronti.com e www.wefronti.com  
- **Admin**: admin.wefronti.com (subdomínio do mesmo projeto ou domínio adicional)

## 3. Banco de dados (Neon)

- Rodar o script de criação de tabelas: `npm run db:init`
- Criar o primeiro admin: `npm run db:inserir-admin -- email codigo`

## 4. Verificações

- [ ] DATABASE_URL definida em produção
- [ ] JWT_SECRET forte (não usar o valor de desenvolvimento)
- [ ] admin.wefronti.com configurado no Vercel
- [ ] Tabelas criadas no Neon
- [ ] Admin criado com `db:inserir-admin`
