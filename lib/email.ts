/**
 * Envio de e-mails via SMTP (Hostinger).
 * Variáveis de ambiente: SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, MAIL_FROM
 */
import nodemailer from 'nodemailer';

const MAIL_FROM = process.env.MAIL_FROM || process.env.SMTP_USER || 'no-reply@wefronti.com';

function createTransport() {
  const smtpUrl = process.env.SMTP_URL;
  if (smtpUrl) {
    return nodemailer.createTransport(smtpUrl);
  }

  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!host || !user || !pass) {
    return null;
  }
  const parsedPort = parseInt(process.env.SMTP_PORT || '587', 10);
  const port = Number.isFinite(parsedPort) ? parsedPort : 587;
  const secure = process.env.SMTP_SECURE != null
    ? process.env.SMTP_SECURE === 'true'
    : port === 465;
  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
    connectionTimeout: 15_000,
    greetingTimeout: 15_000,
    socketTimeout: 20_000,
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
    console.error('[EMAIL] SMTP não configurado. Defina SMTP_URL ou SMTP_HOST/SMTP_USER/SMTP_PASS no ambiente de produção.');
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
    console.error('[EMAIL] Erro ao enviar (tentativa 1):', err);
    try {
      await new Promise((resolve) => setTimeout(resolve, 400));
      await transport.sendMail({
        from: `Wefronti <${MAIL_FROM}>`,
        to: options.to,
        subject: options.subject,
        html: options.html,
        text: options.text,
      });
      return true;
    } catch (retryErr) {
      console.error('[EMAIL] Erro ao enviar (tentativa 2):', retryErr);
      return false;
    }
  }
}
