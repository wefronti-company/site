# Projetos Portfólio

Projetos de portfólio da Wefronti, publicados em subdomínios separados do site principal.

| Projeto   | Subdomínio              | Pasta    |
|----------|-------------------------|----------|
| Fibracom | fibracom.wefronti.com   | fibracom |

Cada pasta é uma aplicação Next.js independente.

**Deploy no subdomínio (ex.: Vercel)**  
1. Novo projeto → repositório deste repo.  
2. **Root Directory:** `projects-portfolio/fibracom` (para Fibracom).  
3. **Domains:** adicione `fibracom.wefronti.com` em Settings → Domains.  
4. No DNS do domínio `wefronti.com`, crie um CNAME: `fibracom` → `cname.vercel-dns.com` (ou o valor indicado pelo Vercel).
