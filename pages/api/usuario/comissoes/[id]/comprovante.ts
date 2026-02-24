import { readFile } from 'fs/promises';
import path from 'path';
import type { NextApiRequest, NextApiResponse } from 'next';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { verifyUsuarioSessionToken, COOKIE_NAME } from '../../../../../lib/auth-usuario';
import { getComissaoDetalhadaByIdForUsuario } from '../../../../../lib/comissaoDb';

const BLUE_PRIMARY = '#3598FF';

function hexToRgb(hex: string) {
  const clean = hex.replace('#', '');
  const full = clean.length === 3 ? clean.split('').map((c) => c + c).join('') : clean;
  const n = Number.parseInt(full, 16);
  return rgb(((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255);
}

function getTokenFromCookie(req: NextApiRequest): string | null {
  const cookie = req.headers.cookie;
  if (!cookie) return null;
  const match = cookie.match(new RegExp(`(?:^|; )${COOKIE_NAME}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

function formatBRL(val: number): string {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
}

function formatDateTime(iso: string): string {
  try {
    return new Date(iso).toLocaleString('pt-BR');
  } catch {
    return iso;
  }
}

function onlyDigits(v?: string): string {
  return String(v || '').replace(/\D/g, '');
}

function formatCpf(v?: string): string {
  const d = onlyDigits(v);
  if (d.length !== 11) return v || '-';
  return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6, 9)}-${d.slice(9)}`;
}

async function tryLoadLogo(pdf: PDFDocument) {
  const candidates = [
    path.join(process.cwd(), 'public', 'images', 'brand', 'isologo-white.png'),
    path.join(process.cwd(), 'public', 'isologo-white.png'),
  ];
  for (const p of candidates) {
    try {
      const bytes = await readFile(p);
      try {
        return await pdf.embedPng(bytes);
      } catch {
        try {
          return await pdf.embedJpg(bytes);
        } catch {
          return null;
        }
      }
    } catch {
      // try next path
    }
  }
  console.warn('[comprovante] Logo não encontrada nos caminhos esperados:', candidates);
  return null;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Método não permitido' });

  const token = getTokenFromCookie(req);
  if (!token) return res.status(401).json({ error: 'Não autenticado' });

  const payload = await verifyUsuarioSessionToken(token);
  if (!payload) return res.status(401).json({ error: 'Sessão expirada' });

  const comissaoId = typeof req.query.id === 'string' ? req.query.id.trim() : '';
  if (!comissaoId) return res.status(400).json({ error: 'Comissão inválida' });

  try {
    const comissao = await getComissaoDetalhadaByIdForUsuario(comissaoId, payload.usuarioId);
    if (!comissao) return res.status(404).json({ error: 'Comissão não encontrada' });

    const pdf = await PDFDocument.create();
    const pageW = 420;
    const pageH = 760;
    const page = pdf.addPage([pageW, pageH]);
    const fontRegular = await pdf.embedFont(StandardFonts.Helvetica);
    const fontBold = await pdf.embedFont(StandardFonts.HelveticaBold);
    const bluePrimary = hexToRgb(BLUE_PRIMARY);

    const cardX = 24;
    const cardY = 24;
    const cardW = pageW - 48;
    const cardH = pageH - 48;
    const headerH = 98;

    page.drawRectangle({ x: 0, y: 0, width: pageW, height: pageH, color: rgb(0.96, 0.97, 0.99) });
    page.drawRectangle({
      x: cardX,
      y: cardY,
      width: cardW,
      height: cardH,
      color: rgb(1, 1, 1),
      borderWidth: 1,
      borderColor: rgb(0.9, 0.92, 0.95),
    });
    page.drawRectangle({
      x: cardX,
      y: cardY + cardH - headerH,
      width: cardW,
      height: headerH,
      color: bluePrimary,
    });

    const logo = await tryLoadLogo(pdf);
    if (logo) {
      const logoWidth = 170;
      const ratio = logo.height / logo.width;
      const logoHeight = logoWidth * ratio;
      const logoY = cardY + cardH - (headerH + logoHeight) / 2 + 2;
      page.drawImage(logo, {
        x: cardX + 18,
        y: logoY,
        width: logoWidth,
        height: logoHeight,
      });
    } else {
      page.drawText('W', {
        x: cardX + 22,
        y: cardY + cardH - 58,
        size: 28,
        font: fontBold,
        color: rgb(1, 1, 1),
      });
    }

    page.drawText('RECIBO DE COMISSAO', {
      x: cardX + 200,
      y: cardY + cardH - 44,
      size: 14,
      font: fontBold,
      color: rgb(1, 1, 1),
    });
    page.drawText('Pagamento registrado via PIX', {
      x: cardX + 200,
      y: cardY + cardH - 64,
      size: 10,
      font: fontRegular,
      color: rgb(0.92, 0.96, 1),
    });

    const textX = cardX + 20;
    const textW = cardW - 40;
    let y = cardY + cardH - headerH - 20;

    const drawDivider = () => {
      page.drawLine({
        start: { x: textX, y },
        end: { x: textX + textW, y },
        thickness: 1,
        color: rgb(0.92, 0.94, 0.97),
      });
      y -= 14;
    };

    const drawSectionTitle = (title: string) => {
      page.drawText(title, {
        x: textX,
        y,
        size: 10,
        font: fontBold,
        color: rgb(0.26, 0.29, 0.35),
      });
      y -= 18;
    };

    const drawRow = (label: string, value: string, highlight = false) => {
      page.drawText(label, { x: textX, y, size: 9, font: fontRegular, color: rgb(0.46, 0.5, 0.57) });
      page.drawText(value || '-', {
        x: textX + 130,
        y,
        size: highlight ? 12 : 10,
        font: highlight ? fontBold : fontRegular,
        color: highlight ? bluePrimary : rgb(0.1, 0.12, 0.15),
      });
      y -= 16;
    };

    drawRow('Recibo', `#${comissao.id.slice(0, 8).toUpperCase()}`);
    drawRow('Emitido em', formatDateTime(new Date().toISOString()));
    drawDivider();

    drawSectionTitle('PARTICIPANTE');
    drawRow('Nome', comissao.nomeUsuario || '-');
    drawRow('E-mail', comissao.emailUsuario || '-');
    drawRow('CPF', formatCpf(comissao.cpfUsuario));
    drawDivider();

    drawSectionTitle('PAGAMENTO');
    drawRow('Empresa indicada', comissao.empresaIndicada || '-');
    drawRow('Valor do contrato', formatBRL(comissao.valorContrato));
    drawRow('Percentual', '10%');
    drawRow('Comissao paga', formatBRL(comissao.valorComissao), true);
    drawRow('Forma de pagamento', 'PIX');
    drawRow('Chave PIX', comissao.chavePix || '-');
    drawRow('Data do pagamento', formatDateTime(comissao.criadoEm));
    drawDivider();

    page.drawText('Documento digital gerado automaticamente pela Wefronti.', {
      x: textX,
      y,
      size: 9,
      font: fontRegular,
      color: rgb(0.46, 0.5, 0.57),
    });

    const bytes = await pdf.save();
    const fileName = `comprovante-comissao-${comissao.id.slice(0, 8)}.pdf`;
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    return res.status(200).send(Buffer.from(bytes));
  } catch (error) {
    console.error('[usuario/comissoes/[id]/comprovante]', error);
    return res.status(500).json({ error: 'Erro ao gerar comprovante.' });
  }
}
