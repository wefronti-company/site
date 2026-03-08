import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const BLOCKED_IPS = new Set<string>([]);

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

function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  if (forwarded) return forwarded.split(',')[0].trim();
  if (realIp) return realIp;
  return 'unknown';
}

function isSuspiciousBot(userAgent: string | null): boolean {
  if (!userAgent) return true;
  return SUSPICIOUS_USER_AGENTS.some((pattern) => pattern.test(userAgent));
}

function isValidOrigin(request: NextRequest): boolean {
  const origin = request.headers.get('origin');
  const referer = request.headers.get('referer');
  const host = request.headers.get('host');
  if (!origin && !referer && request.method === 'GET') return true;

  const allowedDomains = [
    'localhost:3000',
    'wefronti.com',
    'www.wefronti.com',
    '.vercel.app',
  ];
  const sourceUrl = origin || referer || '';

  for (const domain of allowedDomains) {
    if (domain.includes(':')) {
      if (sourceUrl) {
        try {
          const p = new URL(sourceUrl);
          if (p.host === domain) return true;
        } catch (_) {}
      }
      if (host && host === domain) return true;
      continue;
    }
    if (sourceUrl) {
      try {
        const p = new URL(sourceUrl);
        const hostname = p.hostname;
        if (domain.startsWith('.')) {
          const base = domain.slice(1);
          if (hostname === base || hostname.endsWith('.' + base) || hostname.endsWith(base)) return true;
        } else if (hostname === domain) return true;
      } catch (_) {}
    }
    if (host) {
      const hostName = host.split(':')[0];
      if (domain.startsWith('.')) {
        const base = domain.slice(1);
        if (hostName === base || hostName.endsWith('.' + base) || hostName.endsWith(base)) return true;
      } else if (hostName === domain) return true;
    }
  }
  return false;
}

export async function middleware(request: NextRequest) {
  const clientIp = getClientIp(request);
  const userAgent = request.headers.get('user-agent');
  const url = request.nextUrl;
  const pathname = url.pathname;

  if (BLOCKED_IPS.has(clientIp)) {
    return new NextResponse('Forbidden', { status: 403 });
  }

  if (request.method !== 'GET' && pathname.startsWith('/api/') && isSuspiciousBot(userAgent)) {
    return new NextResponse('Forbidden', { status: 403 });
  }

  if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(request.method)) {
    if (!isValidOrigin(request)) {
      return new NextResponse('Forbidden - Invalid Origin', { status: 403 });
    }
  }

  if (url.pathname.includes('..') || url.pathname.includes('//')) {
    return new NextResponse('Bad Request', { status: 400 });
  }

  const sensitivePaths = ['.env', '.git', 'package.json', 'node_modules'];
  if (sensitivePaths.some((p) => url.pathname.includes(p))) {
    return new NextResponse('Not Found', { status: 404 });
  }

  const response = NextResponse.next();
  response.headers.set('X-DNS-Prefetch-Control', 'on');
  response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  response.headers.set(
    'Content-Security-Policy',
    [
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
    ].join('; ')
  );

  if (url.pathname.startsWith('/api/')) {
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
  }

  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon\\.ico).*)'],
};
