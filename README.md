# Wefronti — Monorepo

This repository is now configured as a simple monorepo with three workspaces:

- `site/` — existing public site (wefronti.com)
- `dashboard/` — client dashboard / painel (painel.wefronti.com)
- `console/` — admin console (console.wefronti.com)

All workspaces are managed using npm workspaces. From the repository root you can run:

```bash
# run the site dev server
npm run dev:site

# run the dashboard dev server
npm run dev:dashboard

# run the console dev server
npm run dev:console
```

Notes:
- The `site/` app contains the existing Next.js application and has its own package.json.
- The `dashboard/` and `console/` folders are scaffolds/boilerplate — add dependencies and pages as needed.
