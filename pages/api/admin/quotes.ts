import type { NextApiRequest, NextApiResponse } from 'next';
import { validateSession } from '../../../lib/adminSessions';
import { sql } from '../../../lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const cookie = req.headers.cookie || '';
    const match = cookie.match(/admin_session=([^;]+)/);
    const token = match ? match[1] : null;
    const email = await validateSession(token);
    if (!email) return res.status(401).json({ success: false, error: 'Unauthorized' });

    const page = Math.max(1, parseInt((req.query.page as string) || '1', 10));
    const perPage = Math.min(100, parseInt((req.query.perPage as string) || '20', 10));
    const offset = (page - 1) * perPage;

    const items = await sql`
      SELECT id, name, email, phone, company, investment, project_type as projectType, urgency, details, created_at
      FROM quote_requests
      ORDER BY id DESC
      LIMIT ${perPage} OFFSET ${offset}
    `;

    const [{ count }] = await sql`SELECT COUNT(*)::int as count FROM quote_requests`;

    return res.status(200).json({ success: true, items, total: count });
  } catch (err) {
    console.error('[ADMIN/QUOTES] error', err);
    return res.status(500).json({ success: false, error: 'Internal error' });
  }
}
