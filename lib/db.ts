/**
 * Cliente Neon PostgreSQL.
 * Requer DATABASE_URL no .env
 */
import { neon } from '@neondatabase/serverless';

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.warn('[DB] DATABASE_URL não definida. Admin login desabilitado.');
}

export const sql = databaseUrl ? neon(databaseUrl) : null;
