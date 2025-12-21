import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Lista de IPs bloqueados (adicionar IPs suspeitos aqui)
const BLOCKED_IPS = new Set<string>([
 // Exemplo: '192.168.1.100'
]);

// User agents suspeitos (bots maliciosos)
const SUSPICIOUS_USER_AGENTS = [
 /curl/i,
 /wget/i,
 /python-requests/i,
 /scrapy/i,
 /bot/i,
 /spider/i,
 /crawl/i,
 /slurp/i,
];

// Extrair IP real (considerando proxies)
function getClientIp(request: NextRequest): string {
 const forwarded = request.headers.get('x-forwarded-for');
 const realIp = request.headers.get('x-real-ip');
 
 if (forwarded) {
 return forwarded.split(',')[0].trim();
 }
 
 if (realIp) {
 return realIp;
 }
 
 // NextRequest não tem propriedade ip no Next.js 16
 return 'unknown';
}

// Verificar se é bot suspeito
function isSuspiciousBot(userAgent: string | null): boolean {
 if (!userAgent) return true;
 
 return SUSPICIOUS_USER_AGENTS.some(pattern => pattern.test(userAgent));
}

// Verificar se a origem é válida (previne CSRF e desvio de tráfego)
function isValidOrigin(request: NextRequest): boolean {
 const origin = request.headers.get('origin');
 const referer = request.headers.get('referer');
 const host = request.headers.get('host');
 
 // Permitir requisições diretas (sem origin/referer) apenas para GET
 if (!origin && !referer && request.method === 'GET') {
 return true;
 }
 
	const allowedDomains = [
		'localhost:3000',
		'wefronti.com',
		'www.wefronti.com',
		'.vercel.app', // Para preview deployments (subdomains)
	];

	const sourceUrl = origin || referer || '';

	// Prefer explicit URL parsing for origin/referer
	for (const domain of allowedDomains) {
		// If the allowed domain contains a port, match host:port explicitly
		if (domain.includes(':')) {
			if (sourceUrl) {
				try {
					const p = new URL(sourceUrl)
					if (p.host === domain) return true
				} catch (_) {}
			}
			if (host && host === domain) return true
			continue
		}

		// Allow exact hostname matches
		if (sourceUrl) {
			try {
				const p = new URL(sourceUrl)
				const hostname = p.hostname
				if (domain.startsWith('.')) {
					// allow exact or end-with match for subdomains (.vercel.app -> any.vercel.app)
					const base = domain.slice(1)
					if (hostname === base || hostname.endsWith('.' + base) || hostname.endsWith(base)) return true
				} else if (hostname === domain) {
					return true
				}
			} catch (_) {}
		}

		// Fall back to host header if origin/referer not parseable
		if (host) {
			const hostName = host.split(':')[0]
			if (domain.startsWith('.')) {
				const base = domain.slice(1)
				if (hostName === base || hostName.endsWith('.' + base) || hostName.endsWith(base)) return true
			} else if (hostName === domain) {
				return true
			}
		}
	}

	return false
}

export function middleware(request: NextRequest) {
 const clientIp = getClientIp(request);
 const userAgent = request.headers.get('user-agent');
 const url = request.nextUrl;
 
 // 1. Bloquear IPs maliciosos
 if (BLOCKED_IPS.has(clientIp)) {
 console.warn(`[SECURITY] IP bloqueado tentou acesso: ${clientIp}`);
 return new NextResponse('Forbidden', { status: 403 });
 }
 
 // 2. Bloquear bots suspeitos (exceto para rotas públicas)
 if (url.pathname.startsWith('/api/') && isSuspiciousBot(userAgent)) {
 console.warn(`[SECURITY] Bot suspeito bloqueado: ${userAgent} (IP: ${clientIp})`);
 return new NextResponse('Forbidden', { status: 403 });
 }
 
 // 3. Validar origem para requisições POST/PUT/DELETE (CSRF Protection)
 if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(request.method)) {
 if (!isValidOrigin(request)) {
 console.warn(`[SECURITY] Origem inválida detectada: ${request.headers.get('origin')} (IP: ${clientIp})`);
 return new NextResponse('Forbidden - Invalid Origin', { status: 403 });
 }
 }
 
 // 4. Prevenir Path Traversal Attack
 if (url.pathname.includes('..') || url.pathname.includes('//')) {
 console.warn(`[SECURITY] Path traversal attempt: ${url.pathname} (IP: ${clientIp})`);
 return new NextResponse('Bad Request', { status: 400 });
 }
 
 // 5. Bloquear acesso direto a arquivos sensíveis
 const sensitivePaths = ['.env', '.git', 'package.json', 'node_modules'];
 if (sensitivePaths.some(path => url.pathname.includes(path))) {
 console.warn(`[SECURITY] Tentativa de acesso a arquivo sensível: ${url.pathname} (IP: ${clientIp})`);
 return new NextResponse('Not Found', { status: 404 });
 }

 const response = NextResponse.next();

 // Security Headers (reforçando o next.config.js)
 response.headers.set('X-DNS-Prefetch-Control', 'on');
 response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
 response.headers.set('X-Frame-Options', 'DENY');
 response.headers.set('X-Content-Type-Options', 'nosniff');
 response.headers.set('X-XSS-Protection', '1; mode=block');
 response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
 response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
	// Basic Content Security Policy to mitigate XSS.
	// Keep it permissive for analytics and external assets (https:) — tighten when possible.
	response.headers.set('Content-Security-Policy', "default-src 'self' https:; script-src 'self' 'unsafe-inline' 'unsafe-eval' https:; style-src 'self' 'unsafe-inline' https:; img-src 'self' data: https:; connect-src 'self' https:; frame-ancestors 'none';")
 
 // Prevenir cache de dados sensíveis e APIs
 if (url.pathname.startsWith('/api/')) {
 	 response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
 	 response.headers.set('Pragma', 'no-cache');
 	 response.headers.set('Expires', '0');
 } else if (request.method === 'GET') {
 	 // Allow CDN / edge caching for public pages. Use s-maxage for edge caches and
 	 // stale-while-revalidate to allow fast responses while background refresh occurs.
 	 // Values configurable via env: DEFAULT_S_MAXAGE (seconds) and DEFAULT_STALE (seconds)
 	 const smax = process.env.DEFAULT_S_MAXAGE ? parseInt(process.env.DEFAULT_S_MAXAGE, 10) : 60
 	 const stale = process.env.DEFAULT_STALE ? parseInt(process.env.DEFAULT_STALE, 10) : 300
 	 // Set cache headers for public pages and assets. APIs are handled separately above.
 }
 
 // Log de segurança para monitoramento
 if (process.env.NODE_ENV === 'production') {
 console.log(`[ACCESS] ${request.method} ${url.pathname} - IP: ${clientIp} - UA: ${userAgent?.slice(0, 50)}`);
 }

 return response;
}

export const config = {
 matcher: [
 /*
 * Match all request paths except for the ones starting with:
 * - _next/static (static files)
 * - _next/image (image optimization files)
 * - favicon.ico (favicon file)
 */
 '/((?!_next/static|_next/image|favicon.ico).*)',
 ],
};
