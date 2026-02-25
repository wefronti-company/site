export function getDashBaseUrl(): string {
  const fromEnv = (process.env.NEXT_PUBLIC_DASH_URL || '').trim();
  if (fromEnv) return fromEnv.replace(/\/+$/, '');
  return 'https://painel.wefronti.com';
}

export function toDashUrl(path = '/'): string {
  const base = getDashBaseUrl();
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${base}${normalizedPath}`;
}

/** Path para rotas do painel: no subdomínio dash usa /dashboard, em localhost usa /dash/dashboard */
export function getDashPath(path: string): string {
  if (typeof window === 'undefined') return `/dash${path}`;
  const isDashHost = window.location.hostname === 'painel.wefronti.com';
  return isDashHost ? path : `/dash${path}`;
}

