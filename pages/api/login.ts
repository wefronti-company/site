import type { NextApiRequest, NextApiResponse } from 'next'
import { checkRateLimit } from '../../utils/validation'
import { checkRateLimitRedis } from '../../lib/redis'

type Body = { token?: string }

// Utility: check if a token exists and is active in the DB (when configured)
import { compare, hash } from '../../lib/bcrypt'
import crypto from 'crypto'

async function findTokenInDb (token: string) {
  if (!process.env.DATABASE_URL) return null
  try {
    const { sql } = await import('../../lib/db')
    const rows: any[] = await sql`SELECT id, token_hash FROM console_tokens WHERE active = true`
    for (const r of rows) {
      const hashValue = r?.token_hash
      if (hashValue && await compare(token, hashValue)) return r
    }
    return null
  } catch (err) {
    console.warn('[API/LOGIN] DB token check failed', err)
    return null
  }
}

async function checkTokenInDb (token: string) {
  const row = await findTokenInDb(token)
  return !!row
}


export default async function handler (req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    // Accept a single token in the body — simplified console auth
    const body: Body = req.body || {}
    const token = (body.token || '').toString().trim()

    // Rate-limit login attempts by IP (protect against brute-force)
    const clientIp = (req.headers['x-forwarded-for'] as string | undefined)?.split(',')[0].trim() || req.socket.remoteAddress || 'unknown'
    const allowedRedis = await checkRateLimitRedis(clientIp, 6, 60_000)
    const allowedMem = checkRateLimit(clientIp, 6, 60_000)
    if (!allowedRedis || !allowedMem) return res.status(429).json({ success: false, error: 'Muitas tentativas. Aguarde e tente novamente.' })

    // Validate token format: exactly 12 alphanumeric chars
    const isValidFormat = /^[A-Za-z0-9]{12}$/.test(token)
    if (!isValidFormat) return res.status(401).json({ success: false, error: 'Token inválido — formato incorreto' })

    // First check env var (fast path for dev & single-token deployments)
    const expectedToken = process.env.CONSOLE_AUTH_TOKEN
    if (expectedToken && token === expectedToken) {
      // Create a session and set session cookie for improved security
      const sessionId = crypto.randomBytes(32).toString('hex')
        const sessionHash = await hash(sessionId, parseInt(process.env.CONSOLE_AUTH_BCRYPT_ROUNDS || '12', 10))
      let sessionInserted = false
      try {
        if (process.env.DATABASE_URL) {
          const { sql } = await import('../../lib/db')
          const rows: any[] = await sql`INSERT INTO console_sessions (session_hash, token_id, ip, user_agent, expires_at) VALUES (${sessionHash}, NULL, ${clientIp}, ${req.headers['user-agent'] || null}, NOW() + INTERVAL '8 hours') RETURNING id`
          if (rows && rows.length > 0) sessionInserted = true
        } else {
          // no DB = nothing to insert but still accepted
          sessionInserted = true
        }
      } catch (err) {
        console.warn('[API/LOGIN] failed to create session record for env token', err)
      }

      const secureFlag = process.env.NODE_ENV === 'production' ? ' Secure;' : ''
      const domain = process.env.SESSION_COOKIE_DOMAIN ? ` Domain=${process.env.SESSION_COOKIE_DOMAIN};` : ''
      // Give a small debug log (ID only) so server logs can be used to trace session creation
      console.log('[API/LOGIN] created session for env token (sessionIdHash hidden)')
      // When running without a DB (simple/ single-token deployments), the
      // authentication GET handler falls back to checking `console_auth`.
      // In that scenario we must set the legacy `console_auth` cookie so the
      // GET check (and subsequent API calls) will treat the browser as
      // authenticated. When a DB is present the session is stored server-side
      // and only `console_session` is required.
      const cookies: string[] = []
      // Only set the session cookie when the server has successfully
      // recorded the session (or when DB is not configured). This avoids
      // returning a cookie the server can't validate which would cause a
      // follow-up GET auth check to fail and immediately log the user out.
      if (!process.env.DATABASE_URL || sessionInserted) {
        cookies.push(`console_session=${sessionId}; HttpOnly; Path=/; SameSite=Strict; Max-Age=${8 * 3600};${domain}${secureFlag}`)
      } else {
        console.warn('[API/LOGIN] not setting console_session cookie because session insertion failed')
        return res.status(500).json({ success: false, error: 'Failed to create session' })
      }
      // Only set the legacy console_auth cookie when running in non-production
      // with no DB configured (development / single-host scenarios). In
      // production we REQUIRE DB-backed sessions for improved security.
      if (!process.env.DATABASE_URL && process.env.NODE_ENV !== 'production') {
        // set the legacy cookie to the token so the GET auth endpoint can
        // validate against the environment secret.
        cookies.push(`console_auth=${expectedToken}; HttpOnly; Path=/; SameSite=Strict; Max-Age=${8 * 3600};${domain}${secureFlag}`)
      }
      res.setHeader('Set-Cookie', cookies)
      return res.status(200).json({ success: true })
    }

    // If a DB is configured, check the token there (production scenario)
    if (process.env.DATABASE_URL) {
      const tokenRow = await findTokenInDb(token)
      if (tokenRow) {
        // create a session bound to tokenRow.id
        const sessionId = crypto.randomBytes(32).toString('hex')
        const sessionHash = await hash(sessionId, parseInt(process.env.CONSOLE_AUTH_BCRYPT_ROUNDS || '12', 10))
        // ensure session INSERT truly succeeded before continuing
        let sessionInserted2 = false
        try {
          const { sql } = await import('../../lib/db')
          const rows: any[] = await sql`INSERT INTO console_sessions (session_hash, token_id, ip, user_agent, expires_at) VALUES (${sessionHash}, ${tokenRow.id}, ${clientIp}, ${req.headers['user-agent'] || null}, NOW() + INTERVAL '8 hours') RETURNING id`
          if (rows && rows.length > 0) sessionInserted2 = true
        } catch (err) {
          console.warn('[API/LOGIN] failed to create session record', err)
        }

        const secureFlag = process.env.NODE_ENV === 'production' ? ' Secure;' : ''
        const domain = process.env.SESSION_COOKIE_DOMAIN ? ` Domain=${process.env.SESSION_COOKIE_DOMAIN};` : ''
        if (!sessionInserted2) {
          console.warn('[API/LOGIN] session insert failed; aborting login')
          return res.status(500).json({ success: false, error: 'Failed to create session' })
        }

        console.log('[API/LOGIN] created session for token id', tokenRow?.id)
        res.setHeader('Set-Cookie', `console_session=${sessionId}; HttpOnly; Path=/; SameSite=Strict; Max-Age=${8 * 3600};${domain}${secureFlag}`)
        return res.status(200).json({ success: true })
      }
    }

    return res.status(401).json({ success: false, error: 'Token inválido' })
  }

  // GET -> return whether current request is authenticated
  if (req.method === 'GET') {
    // Prefer session cookie (more secure)
    const sessionCookie = req.cookies?.console_session
    if (sessionCookie) {
      // verify session in DB if available
      if (process.env.DATABASE_URL) {
        try {
          const { sql } = await import('../../lib/db')
          const rows: any[] = await sql`SELECT id, session_hash, expires_at FROM console_sessions WHERE expires_at > NOW()`
          let matched = false
          for (const r of rows) {
            if (r?.session_hash && await compare(sessionCookie, r.session_hash)) {
              matched = true
              break
            }
          }
          if (matched) return res.status(200).json({ authenticated: true })
          console.warn('[API/LOGIN] session cookie present but no matching active session found in DB')
        } catch (err) {
          console.warn('[API/LOGIN] Session check failed', err)
        }
      }
    }

    // Fallback: older cookie (console_auth) for compatibility in non-prod / no-DB
    const cookie = req.cookies?.console_auth
    if (!cookie) return res.status(200).json({ authenticated: false })

    // Check against env var first
    // Only honor the legacy console_auth cookie when running without a DB or
    // in non-production. Production deployments should use DB-backed sessions.
    if (( !process.env.DATABASE_URL || process.env.NODE_ENV !== 'production' ) && process.env.CONSOLE_AUTH_TOKEN && cookie === process.env.CONSOLE_AUTH_TOKEN) return res.status(200).json({ authenticated: true })

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
