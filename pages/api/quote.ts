import type { NextApiRequest, NextApiResponse } from 'next';
// Use require to avoid missing type declarations in this environment
// eslint-disable-next-line @typescript-eslint/no-var-requires
const nodemailer: any = require('nodemailer');
import { sql, QuoteRequest } from '../../lib/db';
import { checkRateLimitRedis } from '../../lib/redis';
import { 
 quoteFormSchema, 
 sanitizeInput, 
 sanitizeEmail, 
 sanitizeWhatsApp,
 checkRateLimit,
 validateOrigin
} from '../../utils/validation';

type ResponseData = {
 success: boolean;
 message?: string;
 error?: string;
 id?: number;
};

// Obter IP do cliente (considerando proxies)
function getClientIp(req: NextApiRequest): string {
 const forwarded = req.headers['x-forwarded-for'];
 const ip = typeof forwarded === 'string' 
 ? forwarded.split(',')[0].trim() 
 : req.socket.remoteAddress || 'unknown';
 return ip;
}

export default async function handler(
 req: NextApiRequest,
 res: NextApiResponse<ResponseData>
) {
 // Apenas POST é permitido
 if (req.method !== 'POST') {
 return res.status(405).json({ 
 success: false, 
 error: 'Method not allowed' 
 });
 }

 // Segurança: Headers
 res.setHeader('X-Content-Type-Options', 'nosniff');
 res.setHeader('X-Frame-Options', 'DENY');
 res.setHeader('X-XSS-Protection', '1; mode=block');
 res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');

 try {
		// SMTP settings (use environment variables configured in Vercel)
		const smtpHost = process.env.SMTP_HOST || null;
		const smtpPort = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : undefined;
		const smtpUser = process.env.SMTP_USER || null;
		const smtpPass = process.env.SMTP_PASS || null;
		const smtpSecure = process.env.SMTP_SECURE === 'true';

		// Email envelope metadata
		const emailFrom = process.env.EMAIL_FROM || process.env.MAIL_FROM || smtpUser || 'no-reply@wefronti.com';
		const adminEmail = process.env.EMAIL_ADMIN || process.env.ADMIN_EMAIL || 'projetos@wefronti.com';
 // 1. Rate Limiting por IP (Redis ou in-memory fallback)
 const clientIp = getClientIp(req);
 
 // Tentar Redis primeiro, fallback para in-memory
 const isAllowedRedis = await checkRateLimitRedis(clientIp, 5, 60000);
 const isAllowedMemory = checkRateLimit(clientIp, 5, 60000);
 
 if (!isAllowedRedis || !isAllowedMemory) {
 return res.status(429).json({
 success: false,
 error: 'Muitas tentativas. Aguarde 1 minuto e tente novamente.'
 });
 }

 // 2. Validar origem (CSRF protection)
 const origin = req.headers.origin || req.headers.referer || null;
 const host = req.headers.host || null;
 
 // When debugging, persist incoming origin/host/referer headers to a local file for inspection
 if (process.env.ALLOWED_ORIGINS_DEBUG === 'true') {
   try {
     const fs = require('fs');
     const path = require('path');
     const logPath = path.join(process.cwd(), 'origin_debug.log');
     const payload = {
       ts: new Date().toISOString(),
       origin: req.headers.origin || null,
       referer: req.headers.referer || null,
       host: req.headers.host || null,
       method: req.method,
       ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress || null
     };
     fs.appendFileSync(logPath, JSON.stringify(payload) + '\n');
   } catch (err) {
     // ignore logging errors in debug path
   }
 }
 
 if (!validateOrigin(origin, host)) {
 // Debug logging to assist diagnosing rejected origins (enabled in dev or with ALLOWED_ORIGINS_DEBUG=true)
 if (process.env.ALLOWED_ORIGINS_DEBUG === 'true' || process.env.NODE_ENV === 'development') {
 console.warn('[API/QUOTE] Origin validation failed', { origin, referer: req.headers.referer, host });
 }
 return res.status(403).json({
 success: false,
 error: 'Origem não autorizada'
 });
 }

 // Passed origin validation — quick DB connectivity check in non-prod for debugging
 if (process.env.NODE_ENV !== 'production') {
   if (process.env.DATABASE_URL) {
     try {
       const { sql } = await import('../../lib/db');
       // lightweight check
       await sql`SELECT 1`;
       console.log('[API/QUOTE] DB connectivity check: OK');
     } catch (err) {
       console.warn('[API/QUOTE] DB connectivity check failed', (err as any)?.message || err);
     }
   } else {
     console.warn('[API/QUOTE] DATABASE_URL not set — skipping DB connectivity check');
   }
 }

 // 3. Validar dados com Zod
 const validationResult = quoteFormSchema.safeParse(req.body);
 
 if (!validationResult.success) {
 const errors = validationResult.error.issues.map((err: any) => err.message).join(', ');
 return res.status(400).json({
 success: false,
 error: errors
 });
 }

 // 4. Sanitizar inputs
 const { name, whatsapp, email, company, role, revenue, challenge, timeline, privacy_consent } = validationResult.data;
 
 // Validar consentimento LGPD (obrigatório)
 if (!privacy_consent) {
 return res.status(400).json({
 success: false,
 error: 'Consentimento de privacidade é obrigatório'
 });
 }
 
 const sanitizedData = {
 name: sanitizeInput(name),
 whatsapp: sanitizeWhatsApp(whatsapp),
 email: sanitizeEmail(email),
 company: sanitizeInput(company),
 role: role,
 revenue: revenue,
 challenge: sanitizeInput(challenge),
 timeline: timeline,
 privacy_consent: privacy_consent,
 };

 // 5. Inserir no banco de dados (prepared statement previne SQL Injection)
 const result = await sql`
 INSERT INTO quote_requests (
 name, 
 whatsapp, 
 email, 
 company, 
 role, 
 revenue, 
 challenge, 
 timeline,
 privacy_consent,
 consented_at
 )
 VALUES (
 ${sanitizedData.name},
 ${sanitizedData.whatsapp},
 ${sanitizedData.email},
 ${sanitizedData.company},
 ${sanitizedData.role},
 ${sanitizedData.revenue},
 ${sanitizedData.challenge},
 ${sanitizedData.timeline},
 ${sanitizedData.privacy_consent},
 NOW()
 )
 RETURNING id
 `;

	const insertedId = result[0]?.id;

		// 6. Log de segurança para auditoria — REDACT PII
		const maskEmail = (email: string) => {
			try {
				const parts = email.split('@')
				if (parts.length !== 2) return '***'
				const local = parts[0]
				const domain = parts[1]
				const localMasked = local.length <= 2 ? local[0] + '*' : local[0] + '*'.repeat(Math.min(3, local.length - 2)) + local.slice(-1)
				return `${localMasked}@${domain}`
			} catch (e) { return '***' }
		}

		console.log(`[QUOTE] Nova solicitação (ID: ${insertedId}) from ${maskEmail(sanitizedData.email)} (IP: ${clientIp})`);

		// 7. Send admin notification email (non-blocking, optional)
		// Prefer SMTP (Nodemailer) using Vercel-configured credentials; if missing, skip sending.
		if (smtpHost && smtpUser && smtpPass && emailFrom && adminEmail) {
			const subject = `Novo pedido de orçamento — ${sanitizedData.name}`;

			const plainBody = `Nova solicitação de orçamento\n\nID: ${insertedId}\nNome: ${sanitizedData.name}\nE-mail: ${sanitizedData.email}\nWhatsApp: ${sanitizedData.whatsapp}\nEmpresa: ${sanitizedData.company}\nOperador/cargo: ${sanitizedData.role}\nFaturamento: ${sanitizedData.revenue}\nPrazo/Timeline: ${sanitizedData.timeline}\nDesafio: ${sanitizedData.challenge}\n\nConsented: ${sanitizedData.privacy_consent}\n`;

			const htmlBody = `
				<div style="font-family:system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial; color:#111; background:#fff; padding:18px;">
					<h2>Nova solicitação de orçamento</h2>
					<p><strong>ID:</strong> ${insertedId}</p>
					<p><strong>Nome:</strong> ${sanitizedData.name}</p>
					<p><strong>E-mail:</strong> ${sanitizedData.email}</p>
					<p><strong>WhatsApp:</strong> ${sanitizedData.whatsapp}</p>
					<p><strong>Empresa:</strong> ${sanitizedData.company}</p>
					<p><strong>Operador / cargo:</strong> ${sanitizedData.role}</p>
					<p><strong>Faturamento:</strong> ${sanitizedData.revenue}</p>
					<p><strong>Timeline:</strong> ${sanitizedData.timeline}</p>
					<p><strong>Desafio:</strong></p>
					<pre style="white-space:pre-wrap">${sanitizedData.challenge}</pre>
					<hr />
					<p>Recebido de IP: ${clientIp}</p>
				</div>
			`;

			// configure nodemailer transport
			const transporter = nodemailer.createTransport({
				host: smtpHost,
				port: smtpPort || 587,
				secure: smtpSecure || false,
				auth: {
					user: smtpUser,
					pass: smtpPass
				}
			});

			// send async without blocking the response
			(async () => {
				try {
					await transporter.sendMail({
						from: emailFrom,
						to: adminEmail,
						subject,
						text: plainBody,
						html: htmlBody
					});
					console.log('[SMTP] admin notification sent to', adminEmail);
				} catch (err) {
					console.error('[SMTP] failed to send admin notification', err);
				}
			})();
		} else {
			// No SMTP configuration present — skip sending but log it.
			if (!smtpHost || !smtpUser || !smtpPass) console.warn('[SMTP] not configured — skipping email delivery');
			if (!emailFrom) console.warn('[SMTP] EMAIL_FROM not set — skipping email delivery');
			if (!adminEmail) console.warn('[SMTP] EMAIL_ADMIN not set — skipping email delivery');
		}

 return res.status(201).json({
 success: true,
 message: 'Solicitação enviada com sucesso! Entraremos em contato em breve.',
 id: insertedId
 });

 } catch (error) {
 console.error('[ERROR] Erro ao salvar solicitação:', error);
 
 // Não expor detalhes do erro ao cliente
 return res.status(500).json({
 success: false,
 error: 'Erro ao processar sua solicitação. Tente novamente mais tarde.'
 });
 }
}
