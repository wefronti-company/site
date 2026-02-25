export function getDashBaseUrl(): string {
  const fromEnv = (process.env.NEXT_PUBLIC_DASH_URL || '').trim();
  if (fromEnv) return fromEnv.replace(/\/+$/, '');
  return 'https://dash.wefronti.com';
}

export function toDashUrl(path = '/'): string {
  const base = getDashBaseUrl();
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${base}${normalizedPath}`;
}

