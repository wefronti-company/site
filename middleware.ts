import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getTokenFromCookie, verifyTokenInEdge } from './lib/auth-middleware';

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
		'admin.wefronti.com',
		'painel.wefronti.com',
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

// Host do subdomínio admin (acesso permitido)
const ADMIN_HOST = 'admin.wefronti.com';
// Hosts do site público (acesso a /admin bloqueado)
const MAIN_HOSTS = ['wefronti.com', 'www.wefronti.com'];

const SECURITY_LOG_SECRET = process.env.SECURITY_LOG_SECRET || 'dev-internal-secret';

function logSecurityEvent(
  origin: string,
  payload: { tipo: string; ip?: string; path?: string; user_agent?: string; detalhes?: string }
) {
  const url = `${origin}/api/internal/security-event`;
  fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Security-Log-Secret': SECURITY_LOG_SECRET,
    },
    body: JSON.stringify(payload),
  }).catch(() => {});
}

export async function middleware(request: NextRequest) {
 const clientIp = getClientIp(request);
 const userAgent = request.headers.get('user-agent');
 const url = request.nextUrl;
 const host = request.headers.get('host')?.split(':')[0] || '';

 // 0.5 Proteger APIs administrativas legadas/sem guard local
 const pathname = url.pathname;
 const isProtectedAdminApi =
   (pathname.startsWith('/api/admin/') && pathname !== '/api/admin/login') ||
   (pathname.startsWith('/api/site') && request.method !== 'GET');

 if (isProtectedAdminApi) {
   const token = getTokenFromCookie(request.headers.get('cookie'));
   if (!token || !(await verifyTokenInEdge(token))) {
     return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
   }
 }

 // 1. Regras do subdomínio admin (admin.wefronti.com) ou localhost (dev)
 const isAdminDomain = host === ADMIN_HOST || host?.startsWith('localhost');
 if (isAdminDomain) {
   // Em admin.wefronti.com: se acessar /admin/*, redirecionar para /* (ex: /admin/dashboard -> /dashboard)
   if (host === ADMIN_HOST && (url.pathname.startsWith('/admin/') || url.pathname === '/admin')) {
     const redirectUrl = url.clone();
     redirectUrl.pathname = url.pathname.replace(/^\/admin/, '') || '/';
     return NextResponse.redirect(redirectUrl);
   }
   // Proteger dashboard: /dashboard ou /admin/dashboard (dev local)
   const isDashboard = url.pathname === '/dashboard' || url.pathname.startsWith('/dashboard/') ||
     url.pathname === '/admin/dashboard' || url.pathname.startsWith('/admin/dashboard/');
   if (isDashboard) {
     const token = getTokenFromCookie(request.headers.get('cookie'));
     if (!token || !(await verifyTokenInEdge(token))) {
       const loginUrl = url.clone();
       loginUrl.pathname = host === ADMIN_HOST ? '/' : '/admin';
       return NextResponse.redirect(loginUrl);
     }
   }
   // Rewrite apenas em admin.wefronti.com: / → /admin, /dashboard → /admin/dashboard
   if (host === ADMIN_HOST) {
     const skipRewrite = url.pathname.startsWith('/api') || url.pathname.startsWith('/_next') || url.pathname.startsWith('/images') || url.pathname.startsWith('/favicon');
     if (!skipRewrite) {
       const rewriteUrl = url.clone();
       rewriteUrl.pathname = url.pathname === '/' ? '/admin' : `/admin${url.pathname}`;
       return NextResponse.rewrite(rewriteUrl);
     }
   }
 } else if (MAIN_HOSTS.includes(host) && url.pathname.startsWith('/admin')) {
   // wefronti.com ou www: bloquear acesso a /admin (mostrar 404)
   const notFoundUrl = url.clone();
   notFoundUrl.pathname = '/404';
   return NextResponse.rewrite(notFoundUrl);
 }

 // 1. Bloquear IPs maliciosos
 if (BLOCKED_IPS.has(clientIp)) {
   const origin = request.nextUrl.origin;
   logSecurityEvent(origin, { tipo: 'ip_bloqueado', ip: clientIp, path: pathname, user_agent: userAgent ?? undefined });
   console.warn(`[SECURITY] IP bloqueado tentou acesso: ${clientIp}`);
   return new NextResponse('Forbidden', { status: 403 });
 }
 
 // 2. Bloquear bots suspeitos (exceto para rotas públicas e internal)
 const isInternalApi = pathname.startsWith('/api/internal/');
 if (!isInternalApi && url.pathname.startsWith('/api/') && isSuspiciousBot(userAgent)) {
   const origin = request.nextUrl.origin;
   logSecurityEvent(origin, { tipo: 'bot_suspeito', ip: clientIp, path: pathname, user_agent: userAgent ?? undefined });
   console.warn(`[SECURITY] Bot suspeito bloqueado: ${userAgent} (IP: ${clientIp})`);
   return new NextResponse('Forbidden', { status: 403 });
 }
 
 // 3. Validar origem para requisições POST/PUT/DELETE (CSRF Protection)
 if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(request.method)) {
 if (!isValidOrigin(request)) {
   const origin = request.nextUrl.origin;
   logSecurityEvent(origin, {
     tipo: 'origem_invalida',
     ip: clientIp,
     path: pathname,
     detalhes: `origin: ${request.headers.get('origin')}`,
   });
   console.warn(`[SECURITY] Origem inválida detectada: ${request.headers.get('origin')} (IP: ${clientIp})`);
   return new NextResponse('Forbidden - Invalid Origin', { status: 403 });
 }
 }
 
 // 4. Prevenir Path Traversal Attack
 if (url.pathname.includes('..') || url.pathname.includes('//')) {
   const origin = request.nextUrl.origin;
   logSecurityEvent(origin, { tipo: 'path_traversal', ip: clientIp, path: pathname });
   console.warn(`[SECURITY] Path traversal attempt: ${url.pathname} (IP: ${clientIp})`);
   return new NextResponse('Bad Request', { status: 400 });
 }
 
 // 5. Bloquear acesso direto a arquivos sensíveis
 const sensitivePaths = ['.env', '.git', 'package.json', 'node_modules'];
 if (sensitivePaths.some(p => url.pathname.includes(p))) {
   const origin = request.nextUrl.origin;
   logSecurityEvent(origin, { tipo: 'arquivo_sensivel', ip: clientIp, path: pathname });
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
	// Content Security Policy: mitiga XSS e injeção de recursos não confiáveis.
	// script-src: 'unsafe-inline' necessário para Next.js; object-src 'none' bloqueia plugins.
	response.headers.set('Content-Security-Policy', [
		"default-src 'self' https:",
		"script-src 'self' 'unsafe-inline' https:",
		"style-src 'self' 'unsafe-inline' https:",
		"img-src 'self' data: https: blob:",
		"connect-src 'self' https:",
		"frame-ancestors 'none'",
		"base-uri 'self'",
		"form-action 'self'",
		"object-src 'none'",
		"upgrade-insecure-requests",
	].join('; '));
 
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
 * Match all request paths except:
 * - _next/static, _next/image, favicon.ico
 */
 '/((?!_next/static|_next/image|favicon\\.ico).*)',
 ],
};
