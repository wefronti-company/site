import type { NextApiRequest, NextApiResponse } from 'next'
import tls from 'tls'
import { URL } from 'url'
import { getRedisClient } from '../../../lib/redis'
import { compare } from '../../../lib/bcrypt'

async function checkAuth(req: NextApiRequest) {
  const sessionCookie = req.cookies?.console_session
  if (sessionCookie) {
    if (process.env.DATABASE_URL) {
      try {
        const { sql } = await import('../../../lib/db')
        const rows: any[] = await sql`SELECT id, session_hash, expires_at FROM console_sessions WHERE expires_at > NOW()`
        for (const r of rows) {
          if (r?.session_hash && await compare(sessionCookie, r.session_hash)) return true
        }
      } catch (err) {
        console.warn('[API/SECURITY] session check failed', err)
      }
    }
  }

  const legacy = req.cookies?.console_auth
  if (legacy) {
    if ((!process.env.DATABASE_URL || process.env.NODE_ENV !== 'production') && process.env.CONSOLE_AUTH_TOKEN && legacy === process.env.CONSOLE_AUTH_TOKEN) return true
  }

  return false
}

function parseHostFromEnv(): string | null {
  const site = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_SITE_DOMAIN
  if (!site) return null
  try {
    return new URL(site).hostname
  } catch (e) {
    return site
  }
}

async function checkSsl(hostname: string) {
  return new Promise((resolve) => {
    const socket = tls.connect(443, hostname, { servername: hostname, timeout: 5000 }, () => {
      const cert: any = socket.getPeerCertificate(true)
      socket.end()
      if (!cert || !cert.valid_to) return resolve({ ok: false, info: 'no cert' })

      const expiresAt = new Date(cert.valid_to)
      const now = new Date()
      const daysLeft = Math.ceil((expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
      const ok = daysLeft > 0
      const issuer = cert.issuer ? cert.issuer.O || cert.issuer.CN || '' : ''
      resolve({ ok, expiresAt: expiresAt.toISOString(), daysLeft, issuer })
    })

    socket.on('error', (err) => {
      resolve({ ok: false, info: 'tls error', error: String(err) })
    })
    socket.on('timeout', () => {
      socket.destroy()
      resolve({ ok: false, info: 'timeout' })
    })
  })
}

async function checkFirewall(siteUrl: string) {
  // Make a HEAD request and inspect headers for Cloudflare and other CDN/waf indicators
  try {
    const u = new URL(siteUrl)
    const res = await fetch(u.toString(), { method: 'HEAD' })
    const headers: Record<string, string> = {}
    res.headers.forEach((v,k) => headers[k.toLowerCase()] = v)
    const server = headers['server'] || ''
    const cf = headers['cf-ray'] || headers['cf-cache-status'] || null
    const via = headers['via'] || null
    const isCloudflare = server.toLowerCase().includes('cloudflare') || !!cf
    const provider = isCloudflare ? 'cloudflare' : via ? 'proxy' : 'none'
    return { active: isCloudflare || !!via, provider, headers }
  } catch (err) {
    return { active: false, provider: null, error: String(err) }
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).end()

  if (!(await checkAuth(req))) return res.status(401).json({ success: false, error: 'Não autorizado' })

  // Determine site url/host
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || (req.headers.host ? `https://${req.headers.host}` : null)
  const host = parseHostFromEnv() || (req.headers.host ? req.headers.host.split(':')[0] : null)

  const result: any = { ssl: { ok: false }, firewall: { active: false }, twoFactor: { enabled: null } }

  if (host) {
    // SSL check
    try {
      // remove port if present
      const hostname = host.split(':')[0]
      const ssl = await checkSsl(hostname)
      result.ssl = ssl
    } catch (e) {
      result.ssl = { ok: false, error: String(e) }
    }
  }

  if (siteUrl) {
    const fw = await checkFirewall(siteUrl)
    result.firewall = fw
  }

  // Two-factor: best-effort: check env var flags that indicate 2FA enforced
  const tfEnv = process.env.ADMIN_ENFORCE_2FA || process.env.ENABLE_2FA || process.env.AUTH_REQUIRE_2FA
  if (tfEnv) result.twoFactor = { enabled: tfEnv === 'true' || tfEnv === '1' ? true : Boolean(tfEnv), reason: 'declarado nas variáveis de ambiente' }
  else result.twoFactor = { enabled: null, reason: 'não configurado; recomenda-se ativar 2FA para contas administrativas' }

  // Optional additional checks: redis connectivity
  try {
    const client = getRedisClient()
    result.redis = { configured: Boolean(client) }
  } catch (e) {
    result.redis = { configured: false }
  }

  return res.status(200).json({ success: true, siteUrl, host, result })
}
