import type { NextApiRequest, NextApiResponse } from 'next'
import { compareSync, compare } from '../../lib/bcrypt'

export default async function handler (req: NextApiRequest, res: NextApiResponse) {
  // clear session cookie in DB if present
  const sessionCookie = req.cookies?.console_session
  if (sessionCookie && process.env.DATABASE_URL) {
    try {
      const { sql } = await import('../../lib/db')
      const rows: any[] = await sql`SELECT id, session_hash FROM console_sessions`;
      for (const r of rows) {
        if (r?.session_hash && await compare(sessionCookie, r.session_hash)) {
          await sql`DELETE FROM console_sessions WHERE id = ${r.id}`
          break
        }
      }
    } catch (err) {
      console.warn('[API/LOGOUT] failed to purge session', err)
    }
  }

  // Clear both session and legacy auth cookies
  const secureFlag = process.env.NODE_ENV === 'production' ? ' Secure;' : ''
  const domain = process.env.SESSION_COOKIE_DOMAIN ? ` Domain=${process.env.SESSION_COOKIE_DOMAIN};` : ''
  res.setHeader('Set-Cookie', `console_session=deleted; HttpOnly; Path=/; SameSite=Strict; Max-Age=0;${domain}${secureFlag}`)
  res.setHeader('Set-Cookie', `console_auth=deleted; HttpOnly; Path=/; SameSite=Strict; Max-Age=0;${domain}${secureFlag}`)

  return res.status(200).json({ success: true })
}
