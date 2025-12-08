import type { NextApiRequest, NextApiResponse } from 'next'

type Body = { token?: string }

// Utility: check if a token exists and is active in the DB (when configured)
import { compareSync } from '../../lib/bcrypt'

async function checkTokenInDb (token: string) {
  if (!process.env.DATABASE_URL) return false
  try {
    const { sql } = await import('../../lib/db')
    // retrieve active token hashes and compare with bcrypt
    const rows: any[] = await sql`SELECT token_hash FROM console_tokens WHERE active = true`
    for (const r of rows) {
      const hash = r?.token_hash
      if (hash && compareSync(token, hash)) return true
    }
    return false
  } catch (err) {
    // Any DB error -> do not authenticate via DB
    console.warn('[API/LOGIN] DB token check failed', err)
    return false
  }
}

export default async function handler (req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    // Accept a single token in the body — simplified console auth
    const body: Body = req.body || {}
    const token = (body.token || '').toString().trim()

    // Validate token format: exactly 12 alphanumeric chars
    const isValidFormat = /^[A-Za-z0-9]{12}$/.test(token)
    if (!isValidFormat) return res.status(401).json({ success: false, error: 'Token inválido — formato incorreto' })

    // First check env var (fast path for dev & single-token deployments)
    const expectedToken = process.env.CONSOLE_AUTH_TOKEN
    if (expectedToken && token === expectedToken) {
      res.setHeader('Set-Cookie', `console_auth=${token}; HttpOnly; Path=/; SameSite=Lax`)
      return res.status(200).json({ success: true })
    }

    // If a DB is configured, check the token there (production scenario)
    if (process.env.DATABASE_URL) {
      const found = await checkTokenInDb(token)
      if (found) {
        res.setHeader('Set-Cookie', `console_auth=${token}; HttpOnly; Path=/; SameSite=Lax`)
        return res.status(200).json({ success: true })
      }
    }

    return res.status(401).json({ success: false, error: 'Token inválido' })
  }

  // GET -> return whether current request is authenticated
  if (req.method === 'GET') {
    const cookie = req.cookies?.console_auth
    if (!cookie) return res.status(200).json({ authenticated: false })

    // Check against env var first
    if (process.env.CONSOLE_AUTH_TOKEN && cookie === process.env.CONSOLE_AUTH_TOKEN) return res.status(200).json({ authenticated: true })

    // Otherwise, if DB configured, verify that token exists and is active
    if (process.env.DATABASE_URL) {
      const isDbValid = await checkTokenInDb(cookie)
      return res.status(200).json({ authenticated: !!isDbValid })
    }

    // No match
    return res.status(200).json({ authenticated: false })
  }

  res.status(405).end()
}
