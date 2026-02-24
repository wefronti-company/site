/**
 * Envio de e-mails via SMTP (Hostinger).
 * Variáveis de ambiente: SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, MAIL_FROM
 */
import nodemailer from 'nodemailer';

const MAIL_FROM = process.env.MAIL_FROM || process.env.SMTP_USER || 'no-reply@wefronti.com';

function createTransport() {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!host || !user || !pass) {
    return null;
  }
  const port = parseInt(process.env.SMTP_PORT || '587', 10);
  const secure = process.env.SMTP_SECURE === 'true';
  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
  });
}

export interface SendMailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export async function sendMail(options: SendMailOptions): Promise<boolean> {
  const transport = createTransport();
  if (!transport) {
    console.error('[EMAIL] SMTP não configurado. Defina SMTP_HOST, SMTP_USER, SMTP_PASS no .env');
    return false;
  }
  try {
    await transport.sendMail({
      from: `Wefronti <${MAIL_FROM}>`,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
    });
    return true;
  } catch (err) {
    console.error('[EMAIL] Erro ao enviar:', err);
    return false;
  }
}
