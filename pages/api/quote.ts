import type { NextApiRequest, NextApiResponse } from 'next';
import { sql, QuoteRequest } from '../../lib/db';
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
 // 1. Rate Limiting por IP
 const clientIp = getClientIp(req);
 if (!checkRateLimit(clientIp, 5, 60000)) {
 return res.status(429).json({
 success: false,
 error: 'Muitas tentativas. Aguarde 1 minuto e tente novamente.'
 });
 }

 // 2. Validar origem (CSRF protection)
 const origin = req.headers.origin || req.headers.referer || null;
 const host = req.headers.host || null;
 
 if (!validateOrigin(origin, host)) {
 return res.status(403).json({
 success: false,
 error: 'Origem não autorizada'
 });
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

 // 6. Log de segurança para auditoria
 console.log(`[QUOTE] Nova solicitação de: ${sanitizedData.email} (IP: ${clientIp}, ID: ${insertedId})`);

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
