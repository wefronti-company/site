# Setup do login admin

## 1. Banco de dados

Execute o SQL em `scripts/init-admin-tables.sql` no Neon Console para criar as tabelas `admins` e `admin_sessoes`.

## 2. Variáveis de ambiente

Adicione ao `.env`:

```
DATABASE_URL=postgresql://...
JWT_SECRET=um-segredo-forte-aleatorio
```

## 3. Criar o primeiro admin

Gere o hash do código de acesso:

```bash
node -e "
const { scryptSync, randomBytes } = require('crypto');
const codigo = process.argv[2] || 'SEU_CODIGO';
const salt = randomBytes(16).toString('hex');
const hash = scryptSync(codigo, salt, 64).toString('hex');
console.log('INSERT INTO admins (email, codigo_acesso_hash) VALUES');
console.log(\"  ('seu@email.com', '\" + salt + ':' + hash + \"');\");
"
```

Substitua `SEU_CODIGO` e `seu@email.com` e execute o SQL resultante no Neon.
