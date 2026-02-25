/**
 * Gera HTML da proposta comercial para servir via API.
 * Página temporária gerada no backend a partir do template.
 */

import type { Proposal } from './proposalData';
import { isProposalExpired, PROPOSAL_VALID_HOURS } from './proposalData';
import { buildWhatsAppUrl, DEFAULT_WHATSAPP_NUMBER } from './whatsapp';

function formatBRL(val: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(val);
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

function formatRemaining(proposal: Proposal): string {
  const sent = new Date(proposal.enviadoEm).getTime();
  const expiresAt = sent + PROPOSAL_VALID_HOURS * 60 * 60 * 1000;
  const ms = Math.max(0, expiresAt - Date.now());
  if (ms <= 0) return 'Expirada';
  const h = Math.floor(ms / (1000 * 60 * 60));
  const m = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
  if (h > 0) return `${h}h ${m}min restantes`;
  return `${m}min restantes`;
}

export function generateProposalHtml(proposal: Proposal): string {
  const total = proposal.itens.reduce((s, i) => s + i.valor, 0);
  const remaining = formatRemaining(proposal);
  const proposalWhatsAppUrl = buildWhatsAppUrl(
    DEFAULT_WHATSAPP_NUMBER,
    'Olá! Recebi a proposta comercial e gostaria de conversar.'
  );

  const itensRows = proposal.itens
    .map(
      (i) =>
        `<tr><td style="padding:12px;font-size:16px;color:#1a1a1a;border-bottom:1px solid #e5e5e5">${escapeHtml(i.descricao)}</td><td style="padding:12px;font-size:16px;color:#1a1a1a;border-bottom:1px solid #e5e5e5;text-align:right">${formatBRL(i.valor)}</td></tr>`
    )
    .join('');

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="robots" content="noindex, nofollow">
  <title>Proposta comercial | Wefronti</title>
  <style>
    *{box-sizing:border-box}
    body{margin:0;font-family:system-ui,-apple-system,sans-serif;background:#f8f9fa}
    .wrap{min-height:100vh}
    .hero{background:linear-gradient(135deg,#0A0C12 0%,#131822 30%,#1a2332 60%,#0d1117 100%);padding:96px 24px;text-align:center}
    .hero-inner{max-width:720px;margin:0 auto}
    .hero img{margin-bottom:24px}
    .hero h1{font-size:clamp(1.75rem,4vw,2.5rem);font-weight:700;color:#fff;margin:0;line-height:1.3}
    .hero p{color:rgba(255,255,255,0.75);margin:24px 0 0;font-size:18px}
    .card{max-width:680px;margin:-40px auto 0;padding:0 24px 96px;position:relative;z-index:1}
    .card-inner{background:#fff;border-radius:16px;box-shadow:0 8px 40px rgba(0,0,0,0.12);overflow:hidden}
    .section{padding:24px}
    .section-first{padding-top:32px}
    .meta{display:flex;flex-wrap:wrap;gap:16px;margin-bottom:16px;padding-bottom:16px;border-bottom:1px solid #e5e5e5}
    .meta p{margin:0;font-size:14px;color:#1a1a1a}
    .meta .remaining{color:#3598FF}
    .label{font-size:14px;font-weight:600;color:#1a1a1a;margin:0 0 8px;text-transform:uppercase;letter-spacing:.05em;opacity:.8}
    .cliente{font-size:20px;font-weight:600;color:#1a1a1a;margin:0}
    .empresa{font-size:16px;color:#1a1a1a;opacity:.8;margin:4px 0 0}
    .date{font-size:14px;color:#1a1a1a;opacity:.6;margin:12px 0 0}
    table{width:100%;border-collapse:collapse}
    th{text-align:left;padding:8px 12px;font-size:12px;font-weight:600;color:#1a1a1a;opacity:.7;border-bottom:1px solid #e5e5e5}
    th:last-child{text-align:right;width:120px}
    .total-row{display:flex;justify-content:space-between;align-items:center;margin-top:16px;padding-top:16px;border-top:2px solid #e5e5e5}
    .total-val{font-size:24px;font-weight:700;color:#3598FF}
    .footer{padding:24px;background:rgba(0,0,0,.02);border-top:1px solid #e5e5e5}
    .footer p{font-size:14px;color:#1a1a1a;opacity:.8;margin:0 0 16px}
    .cta{display:inline-block;padding:12px 32px;background:#25D366;color:#fff;font-size:16px;font-weight:600;text-decoration:none;border-radius:10px;box-shadow:0 4px 14px rgba(37,211,102,0.35)}
    .error{min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:48px;background:#fff}
    .error h1{font-size:24px;font-weight:600;color:#1a1a1a;margin:0 0 12px}
    .error p{font-size:16px;color:#1a1a1a;opacity:.8;margin:0}
  </style>
</head>
<body>
  <div class="wrap">
    <header class="hero">
      <div class="hero-inner">
        <img src="/images/brand/isologo-white.webp" alt="Wefronti" width="160" height="42" style="object-fit:contain">
        <h1>Proposta comercial de desenvolvimento de site</h1>
        <p>Sua presença digital com qualidade e profissionalismo</p>
      </div>
    </header>
    <div class="card">
      <article class="card-inner">
        <section class="section section-first">
          <div class="meta">
            <p>Código: <strong>${escapeHtml(proposal.codigo)}</strong></p>
            <p class="remaining">Tempo restante: <strong>${remaining}</strong></p>
          </div>
          <h2 class="label">Proposta para</h2>
          <p class="cliente">${escapeHtml(proposal.cliente)}</p>
          ${proposal.empresa ? `<p class="empresa">${escapeHtml(proposal.empresa)}</p>` : ''}
          <p class="date">Emitida em ${formatDate(proposal.enviadoEm)}</p>
        </section>
        <section class="section">
          <h3 class="label">Serviços</h3>
          <table>
            <thead><tr><th>Descrição</th><th>Valor</th></tr></thead>
            <tbody>${itensRows}</tbody>
          </table>
          <div class="total-row">
            <span style="font-size:18px;font-weight:600;color:#1a1a1a">Total</span>
            <span class="total-val">${formatBRL(total)}</span>
          </div>
        </section>
        ${proposal.observacoes ? `<section class="section"><p style="margin:0;font-size:14px;color:#1a1a1a;opacity:.8">${escapeHtml(proposal.observacoes)}</p></section>` : ''}
        <footer class="footer">
          <p>Esta proposta tem validade de 24 horas. Para aceitar ou esclarecer dúvidas, entre em contato.</p>
          <a href="${proposalWhatsAppUrl}" target="_blank" rel="noopener noreferrer" class="cta">Falar no WhatsApp</a>
        </footer>
      </article>
    </div>
  </div>
</body>
</html>`;
}

export function generateExpiredHtml(): string {
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="robots" content="noindex, nofollow">
  <title>Proposta expirada | Wefronti</title>
  <style>
    body{margin:0;font-family:system-ui,sans-serif;min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:48px;background:#fff}
    h1{font-size:24px;font-weight:600;color:#1a1a1a;margin:0 0 12px}
    p{font-size:16px;color:#1a1a1a;opacity:.8;margin:0}
  </style>
</head>
<body>
  <h1>Proposta expirada</h1>
  <p>Esta proposta tinha validade de 24 horas e já expirou. Entre em contato para receber uma nova proposta.</p>
</body>
</html>`;
}

export function generateNotFoundHtml(): string {
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="robots" content="noindex, nofollow">
  <title>Proposta não encontrada | Wefronti</title>
  <style>
    body{margin:0;font-family:system-ui,sans-serif;min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:48px;background:#fff}
    h1{font-size:24px;font-weight:600;color:#1a1a1a;margin:0 0 12px}
    p{font-size:16px;color:#1a1a1a;opacity:.8;margin:0}
  </style>
</head>
<body>
  <h1>Proposta não encontrada</h1>
  <p>O link pode estar incorreto ou a proposta foi removida.</p>
</body>
</html>`;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
