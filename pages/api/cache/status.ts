import type { NextApiRequest, NextApiResponse } from 'next'
import { getRedisClient } from '../../../lib/redis'
import { compare } from '../../../lib/bcrypt'

const SCAN_COUNT = 1000

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
        console.warn('[API/CACHE] session check failed', err)
      }
    }
  }
  const legacy = req.cookies?.console_auth
  if (legacy) {
    if ((!process.env.DATABASE_URL || process.env.NODE_ENV !== 'production') && process.env.CONSOLE_AUTH_TOKEN && legacy === process.env.CONSOLE_AUTH_TOKEN) return true
  }
  return false
}

function humanSize (bytes: number | null) {
  if (bytes == null) return '—'
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`
}

export default async function handler (req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).end()

  if (!(await checkAuth(req))) return res.status(401).json({ success: false, error: 'Não autorizado' })

  const client = getRedisClient()
  if (!client) {
    // No Redis configured -> nothing to report
    return res.status(200).json({ success: true, status: { pages: { count: 0, bytes: null }, images: { count: 0, bytes: null }, api: { count: 0, bytes: null }, totalBytes: null } })
  }

  // scan keys for common cache prefixes
  const patterns = [ ['cache:page:', 'pages'], ['cache:image:', 'images'], ['cache:api:', 'api'] ] as const

  const totals: Record<string, { count: number; bytes: number | null }> = { pages: { count: 0, bytes: 0 }, images: { count: 0, bytes: 0 }, api: { count: 0, bytes: 0 } }

  try {
    for (const [prefix, label] of patterns) {
      let cursor = '0'
      do {
        // SCAN iteration
        const [nextCursor, keys] = await client.scan(cursor, 'MATCH', `${prefix}*`, 'COUNT', SCAN_COUNT) as [string, string[]]
        cursor = nextCursor
        if (keys && keys.length) {
          totals[label].count += keys.length
          // For each key ask MEMORY USAGE for pretty bytes (may be null if server doesn't support)
          for (const k of keys) {
            try {
              const size = await client.memory('USAGE', k).catch(() => null)
              if (typeof size === 'number') totals[label].bytes! += size
            } catch (e) {
              // ignore
            }
          }
        }
      } while (cursor !== '0')
    }

    const totalBytes = Object.values(totals).reduce((acc, v) => acc + (v.bytes || 0), 0)

    return res.status(200).json({ success: true, status: {
      pages: { count: totals.pages.count, bytes: totals.pages.bytes || null },
      images: { count: totals.images.count, bytes: totals.images.bytes || null },
      api: { count: totals.api.count, bytes: totals.api.bytes || null },
      totalBytes: totalBytes || null
    }})
  } catch (err) {
    console.error('[API/CACHE] failed to compute cache status', err)
    return res.status(500).json({ success: false, error: 'Falha ao obter status do cache' })
  }
}
