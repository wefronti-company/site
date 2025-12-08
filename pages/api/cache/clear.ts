import type { NextApiRequest, NextApiResponse } from 'next'
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
        console.warn('[API/CACHE/CLEAR] session check failed', err)
      }
    }
  }
  const legacy = req.cookies?.console_auth
  if (legacy) {
    if ((!process.env.DATABASE_URL || process.env.NODE_ENV !== 'production') && process.env.CONSOLE_AUTH_TOKEN && legacy === process.env.CONSOLE_AUTH_TOKEN) return true
  }
  return false
}

export default async function handler (req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()

  if (!(await checkAuth(req))) return res.status(401).json({ success: false, error: 'Não autorizado' })

  const client = getRedisClient()
  let deleted = { pages: 0, images: 0, api: 0 }
  try {
    if (client) {
      // delete keys matching patterns
      const patterns = [ ['cache:page:', 'pages'], ['cache:image:', 'images'], ['cache:api:', 'api'] ] as const
      for (const [prefix, label] of patterns) {
        let cursor = '0'
        do {
          const [nextCursor, keys] = await client.scan(cursor, 'MATCH', `${prefix}*`, 'COUNT', 1000) as [string, string[]]
          cursor = nextCursor
          if (keys && keys.length) {
            // delete in batches
            for (let i = 0; i < keys.length; i += 100) {
              const slice = keys.slice(i, i + 100)
              const rc = await client.del(...slice)
              deleted[label] += rc
            }
          }
        } while (cursor !== '0')
      }
    }

    // Optionally revalidate key public paths to rebuild caches (configurable via env)
    const pathsCsv = process.env.REVALIDATE_PATHS || '/'
    const paths = pathsCsv.split(',').map(p => p.trim()).filter(Boolean)
    if (paths.length > 0) {
      for (const p of paths) {
        try {
          // Next.js revalidate in API routes
          // @ts-ignore
          await res.revalidate(p)
        } catch (e) {
          console.warn('[API/CACHE/CLEAR] revalidate failed for', p, e)
        }
      }
    }

    // If Cloudflare settings are provided, purge the CDN cache for the site.
    // Requires: CLOUDFLARE_ZONE_ID and CLOUDFLARE_API_TOKEN. Optionally NEXT_PUBLIC_SITE_URL
    try {
      const zone = process.env.CLOUDFLARE_ZONE_ID
      const token = process.env.CLOUDFLARE_API_TOKEN
      if (zone && token) {
        // Build prefixes from site url and revalidate paths
        const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || `https://${req.headers.host}`
        const prefixes: string[] = []
        if (siteUrl) {
          // add root
          prefixes.push(siteUrl.replace(/\/$/, ''))
          for (const p of paths) {
            const clean = p === '/' ? '' : p
            prefixes.push(`${siteUrl.replace(/\/$/, '')}${clean}`)
          }
        }

        const cfBody: any = prefixes.length > 0 ? { prefixes } : { purge_everything: true }
        const cfRes = await fetch(`https://api.cloudflare.com/client/v4/zones/${zone}/purge_cache`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(cfBody)
        })

        if (!cfRes.ok) console.warn('[API/CACHE/CLEAR] Cloudflare purge failed', await cfRes.text())
        else console.log('[API/CACHE/CLEAR] Cloudflare purge requested')
      }
    } catch (e) {
      console.warn('[API/CACHE/CLEAR] Cloudflare purge error', e)
    }

    // Fastly purge (optional)
    try {
      const fastlyToken = process.env.FASTLY_API_TOKEN
      const fastlyService = process.env.FASTLY_SERVICE_ID
      if (fastlyToken && fastlyService) {
        const fastlyRes = await fetch(`https://api.fastly.com/service/${fastlyService}/purge_all`, {
          method: 'POST',
          headers: { 'Fastly-Key': fastlyToken }
        })
        if (!fastlyRes.ok) console.warn('[API/CACHE/CLEAR] Fastly purge failed', await fastlyRes.text())
        else console.log('[API/CACHE/CLEAR] Fastly purge requested')
      }
    } catch (e) {
      console.warn('[API/CACHE/CLEAR] Fastly purge error', e)
    }

    // CloudFront invalidation (AWS) — requires AWS credentials and distribution ID
    try {
      const cfDist = process.env.CLOUDFRONT_DISTRIBUTION_ID
      if (cfDist && process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY) {
        // lazy import so it doesn't require AWS SDK unless configured
        const { CloudFrontClient, CreateInvalidationCommand } = await import('@aws-sdk/client-cloudfront') as any
        const client = new CloudFrontClient({ region: process.env.AWS_REGION || 'us-east-1' })
        // Invalidation paths built from revalidated paths, or invalidate all if none
        const invalidationPaths = paths.length > 0 ? paths.map(p => p === '/' ? '/*' : `${p.endsWith('/') ? p + '*' : p + '/*'}`) : ['/*']
        const command = new CreateInvalidationCommand({
          DistributionId: cfDist,
          InvalidationBatch: {
            CallerReference: `manual-purge-${Date.now()}`,
            Paths: {
              Quantity: invalidationPaths.length,
              Items: invalidationPaths
            }
          }
        })
        const cfOut = await client.send(command)
        console.log('[API/CACHE/CLEAR] CloudFront invalidation requested', cfOut?.Invalidation?.Id || '')
      }
    } catch (e) {
      console.warn('[API/CACHE/CLEAR] CloudFront invalidation error', e)
    }

    return res.status(200).json({ success: true, cleared: deleted })
  } catch (err) {
    console.error('[API/CACHE/CLEAR] failed', err)
    return res.status(500).json({ success: false, error: 'Falha ao limpar cache' })
  }
}
