# Clarus — Portfólio Wefronti

Especialistas em micropigmentação labial. Case para Fernanda Frigs.

## Executar localmente

```bash
cd projects-portfolio/clarus
npm install
npm run dev
```

Acesse: http://localhost:3003

## Deploy (ex.: Vercel)

1. Novo projeto → importe o repositório.
2. **Root Directory:** `projects-portfolio/clarus`
3. **Domains:** adicione `clarus.wefronti.com`
4. DNS: CNAME `clarus` → valor indicado pelo Vercel

## Assets

Substitua os arquivos em `public/images/brand/`:
- `logo.png` — logo Clarus
- `favicon.png` — favicon

Seção "Como funciona" — adicione fotos em `public/images/processo/`:
- `etapa-1.jpg` — Avaliação
- `etapa-2.jpg` — Preparação
- `etapa-3.jpg` — Aplicação
- `etapa-4.jpg` — Resultado

Enquanto as imagens não existirem, será exibido o número da etapa como placeholder.
