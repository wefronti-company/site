/**
 * Cache dos dados do admin para evitar flicker na AppBar entre navegações.
 */
let cached: { nome: string | null; email: string } | null = null;
const STORAGE_KEY = 'wefronti_admin_cache_v1';

export function getAdminCache(): { nome: string | null; email: string } | null {
  if (cached) return cached;
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { nome?: string | null; email?: string };
    if (!parsed?.email) return null;
    cached = { nome: parsed.nome ?? null, email: parsed.email };
    return cached;
  } catch {
    return null;
  }
}

export function setAdminCache(data: { nome: string | null; email: string }): void {
  cached = data;
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // ignore
  }
}

export function clearAdminCache(): void {
  cached = null;
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}
