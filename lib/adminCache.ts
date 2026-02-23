/**
 * Cache dos dados do admin para evitar flicker na AppBar entre navegações.
 */
let cached: { nome: string | null; email: string } | null = null;

export function getAdminCache(): { nome: string | null; email: string } | null {
  return cached;
}

export function setAdminCache(data: { nome: string | null; email: string }): void {
  cached = data;
}

export function clearAdminCache(): void {
  cached = null;
}
