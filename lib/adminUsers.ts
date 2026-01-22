import { sql } from './db';

export interface AdminUser {
  id: number;
  email: string;
  password_hash: string;
  name?: string;
  role?: string;
  active: boolean;
  created_at?: Date;
  updated_at?: Date;
}

export async function getAdminByEmail(email: string): Promise<AdminUser | null> {
  const rows = await sql`SELECT id, email, password_hash, name, role, active, created_at, updated_at FROM admin_users WHERE email = ${email} LIMIT 1`;
  return rows && rows.length ? (rows[0] as AdminUser) : null;
}

export async function createAdmin(opts: { email: string; password_hash: string; name?: string; role?: string }): Promise<{ id: number; email: string; name?: string; role?: string; active: boolean; created_at?: Date } | null> {
  const { email, password_hash, name = null, role = null } = opts;
  const rows = await sql`
    INSERT INTO admin_users (email, password_hash, name, role)
    VALUES (${email}, ${password_hash}, ${name}, ${role})
    RETURNING id, email, name, role, active, created_at
  `;
  return rows && rows.length ? (rows[0] as any) : null;
}

export async function deactivateAdminByEmail(email: string) {
  await sql`UPDATE admin_users SET active = false WHERE email = ${email}`;
}
