import { sql } from './db';

/**
 * Registra uma visualização de página (hash do IP para privacidade, país se disponível).
 */
export async function recordPageView(
  path: string,
  ipHash: string | null,
  country?: string | null
): Promise<void> {
  if (!sql) return;

  const countryCode = country && /^[A-Z]{2}$/i.test(country) ? country.toUpperCase() : null;

  try {
    await sql`
      INSERT INTO site_views (path, ip_hash, country)
      VALUES (${path}, ${ipHash}, ${countryCode})
    `;
  } catch {
    // Tabela pode não existir ou coluna country ausente
    try {
      await sql`
        INSERT INTO site_views (path, ip_hash)
        VALUES (${path}, ${ipHash})
      `;
    } catch {}
  }
}

/**
 * Contagem de pageviews hoje (desde meia-noite).
 */
export async function getPageViewsToday(): Promise<number> {
  if (!sql) return 0;

  try {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const rows = await sql`
      SELECT COUNT(*)::int AS total
      FROM site_views
      WHERE criado_em >= ${startOfDay.toISOString()}
    `;
    return (rows[0] as { total: number })?.total ?? 0;
  } catch {
    return 0;
  }
}

/**
 * Contagem de pageviews nos últimos 7 dias.
 */
export async function getPageViewsThisWeek(): Promise<number> {
  if (!sql) return 0;

  try {
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const rows = await sql`
      SELECT COUNT(*)::int AS total
      FROM site_views
      WHERE criado_em >= ${weekAgo.toISOString()}
    `;
    return (rows[0] as { total: number })?.total ?? 0;
  } catch {
    return 0;
  }
}

/**
 * Contagem de pageviews por país (últimos 30 dias).
 */
export async function getCountryCounts(sinceDays = 30): Promise<Record<string, number>> {
  if (!sql) return {};

  try {
    await sql`ALTER TABLE site_views ADD COLUMN IF NOT EXISTS country VARCHAR(2)`;
  } catch {}

  try {
    const since = new Date(Date.now() - sinceDays * 24 * 60 * 60 * 1000).toISOString();

    const rows = await sql`
      SELECT country, COUNT(*)::int AS total
      FROM site_views
      WHERE criado_em >= ${since} AND country IS NOT NULL AND country != ''
      GROUP BY country
    `;

    const result: Record<string, number> = {};
    for (const row of rows as Array<{ country: string; total: number }>) {
      result[row.country] = row.total;
    }
    return result;
  } catch {
    return {};
  }
}
