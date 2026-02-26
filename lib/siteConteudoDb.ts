/**
 * Persistência do conteúdo editável das seções do site.
 * Leitura retorna o que está no banco ou o default; escrita faz upsert.
 */
import { sql } from './db';
import {
  DEFAULT_SITE_CONTEUDO,
  isSecaoValida,
  type SecaoSlug,
} from './siteConteudoDefaults';

export type { SecaoSlug };
export { isSecaoValida, DEFAULT_SITE_CONTEUDO } from './siteConteudoDefaults';

/** Retorna o conteúdo da seção: do banco se existir, senão o default. */
export async function getConteudo(secao: string): Promise<unknown> {
  const defaultData = isSecaoValida(secao) ? DEFAULT_SITE_CONTEUDO[secao] : null;
  if (!sql) return defaultData ?? {};
  try {
    const rows = await sql`
      SELECT dados FROM site_conteudo WHERE secao = ${secao} LIMIT 1
    `;
    const row = Array.isArray(rows) ? rows[0] : undefined;
    if (row && row != null && typeof (row as { dados?: unknown }).dados === 'object') {
      return (row as { dados: unknown }).dados;
    }
  } catch (e) {
    console.warn('[siteConteudoDb] getConteudo:', e);
  }
  return defaultData ?? {};
}

/** Retorna o conteúdo de todas as seções (DB sobrescreve default). */
export async function getAllConteudo(): Promise<Record<string, unknown>> {
  const result: Record<string, unknown> = {};
  for (const slug of Object.keys(DEFAULT_SITE_CONTEUDO) as SecaoSlug[]) {
    result[slug] = DEFAULT_SITE_CONTEUDO[slug];
  }
  if (!sql) return result;
  try {
    const rows = await sql`SELECT secao, dados FROM site_conteudo`;
    const list = Array.isArray(rows) ? rows : [];
    for (const row of list as { secao: string; dados: unknown }[]) {
      if (row.secao && row.dados != null) {
        result[row.secao] = row.dados;
      }
    }
  } catch (e) {
    console.warn('[siteConteudoDb] getAllConteudo:', e);
  }
  return result;
}

/** Salva o conteúdo da seção (upsert). */
export async function setConteudo(secao: string, dados: unknown): Promise<boolean> {
  if (!isSecaoValida(secao)) return false;
  if (!sql) return false;
  const payload = JSON.stringify(dados ?? {});
  await sql`
    INSERT INTO site_conteudo (secao, dados, atualizado_em)
    VALUES (${secao}, ${payload}::jsonb, NOW())
    ON CONFLICT (secao) DO UPDATE SET
      dados = EXCLUDED.dados,
      atualizado_em = NOW()
  `;
  return true;
}
