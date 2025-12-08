import type { NextApiRequest, NextApiResponse } from 'next'
// lazy import the DB helper inside the handler to avoid crashing the module
// initialization when DATABASE_URL is not configured (avoids 500s on import)

type QuoteRow = {
  id: number
  name: string
  whatsapp: string
  email: string
  company: string | null
  role: string | null
  revenue: string | null
  challenge: string | null
  timeline: string | null
  privacy_consent: boolean
  consented_at: string
  created_at?: string
}

// simple cookie auth check
import { compareSync } from '../../lib/bcrypt'

async function checkTokenInDb (token: string) {
  if (!process.env.DATABASE_URL) return false
  try {
    const { sql } = await import('../../lib/db')
    const rows: any[] = await sql`SELECT token_hash FROM console_tokens WHERE active = true`
    for (const r of rows) {
      const hash = r?.token_hash
      if (hash && compareSync(token, hash)) return true
    }
    return false
  } catch (err) {
    console.warn('[API/QUOTES] DB token check failed', err)
    return false
  }
}

async function isAuthorized(req: NextApiRequest) {
  const cookie = req.cookies?.console_auth
  if (!cookie) return false

  // check environment secret first
  if (process.env.CONSOLE_AUTH_TOKEN && cookie === process.env.CONSOLE_AUTH_TOKEN) return true

  // otherwise, fall back to DB lookup when configured
  if (process.env.DATABASE_URL) return await checkTokenInDb(cookie)

  return false
}

export default async function handler (req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).end()

  if (!(await isAuthorized(req))) return res.status(401).json({ success: false, error: 'Unauthorized' })

  try {
    if (!process.env.DATABASE_URL) {
      console.warn('[API/QUOTES] DATABASE_URL not set')
      return res.status(500).json({ success: false, error: 'Database not configured' })
    }

    // import lazily to avoid crashing on module load when env vars are missing
    const { sql } = await import('../../lib/db')
    const rows: any[] = await sql`SELECT id, name, whatsapp, email, company, role, revenue, challenge, timeline, privacy_consent, consented_at FROM quote_requests ORDER BY id DESC LIMIT 200`
    return res.status(200).json({ success: true, items: rows })
  } catch (err) {
    console.error('[API/QUOTES] error', err)
    return res.status(500).json({ success: false, error: 'Unable to fetch quotes' })
  }
}
