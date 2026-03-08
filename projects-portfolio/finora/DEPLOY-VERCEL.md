# Deploy Finora no subdomínio finora.wefronti.com

O erro 404 `DEPLOYMENT_NOT_FOUND` ocorre quando o subdomínio está configurado na Vercel mas **nenhum projeto está deployado** para esse domínio.

## Passos para corrigir

1. **Criar um novo projeto na Vercel** para o site Finora
2. Conectar o repositório e configurar:
   - **Root Directory:** `projects-portfolio/finora`
   - **Framework Preset:** Other (site estático)
   - **Build Command:** deixe em branco
   - **Output Directory:** `.` (ou deixe em branco)
3. Fazer o deploy
4. Em **Settings → Domains**, adicionar `finora.wefronti.com`
5. No site principal Wefronti, configurar a variável `NEXT_PUBLIC_FINORA_URL=https://finora.wefronti.com` (ou ela já usa esse valor como fallback)

O subdomínio precisa estar vinculado ao **projeto Finora** (não ao projeto principal Wefronti).
