import type { NextApiRequest, NextApiResponse } from 'next'
import { compare } from '../../../lib/bcrypt'
import { getRedisClient } from '../../../lib/redis'

// Small in-memory cache to avoid hammering GA for interactive dashboards
let cached: { ts: number; data: any } | null = null
const TTL = Number(process.env.GA_REALTIME_CACHE_TTL_SECONDS || '15') // short TTL

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
        console.warn('[API/ANALYTICS/REALTIME] session check failed', err)
      }
    }
  }

  const cookie = req.cookies?.console_auth
  if (cookie) {
    if ((!process.env.DATABASE_URL || process.env.NODE_ENV !== 'production') && process.env.CONSOLE_AUTH_TOKEN && cookie === process.env.CONSOLE_AUTH_TOKEN) return true
  }

  return false
}

export default async function handler (req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).end()

  if (!(await checkAuth(req))) return res.status(401).json({ success: false, error: 'Não autorizado' })

  // Use lightweight in-memory cache first for a few seconds
  if (cached && (Date.now() - cached.ts) / 1000 < TTL) {
    return res.status(200).json({ success: true, cached: true, data: cached.data })
  }

  const saJson = process.env.GA4_SERVICE_ACCOUNT_JSON || process.env.GA4_SA_JSON
  const propertyId = process.env.GA4_PROPERTY_ID || process.env.NEXT_PUBLIC_GA4_PROPERTY_ID
  if (!saJson || !propertyId) {
    // Production may not have GA configured — return a graceful 200 so client UI
    // doesn't surface 501s in the browser console.
    return res.status(200).json({ success: false, error: 'GA4 credentials or property id not configured', configured: false })
  }

  try {
    const { google } = await import('googleapis')
    const creds = JSON.parse(saJson)

    const auth = new google.auth.GoogleAuth({
      credentials: creds,
      scopes: ['https://www.googleapis.com/auth/analytics.readonly']
    })

    const analyticsdata = google.analyticsdata({ version: 'v1beta', auth })

    const request = {
      property: `properties/${propertyId}`,
      requestBody: {
        dimensions: [{ name: 'country' }],
        metrics: [{ name: 'activeUsers' }],
        limit: 10
      }
    }

    const response = await analyticsdata.properties.runRealtimeReport(request as any)

    const rows = (response?.data?.rows as any[]) || []
    const countries = rows.map(r => ({ country: r.dimensionValues?.[0]?.value || 'Unknown', users: Number(r.metricValues?.[0]?.value || 0) }))

    // Store in memory cache
    cached = { ts: Date.now(), data: { countries } }

    return res.status(200).json({ success: true, cached: false, data: { countries } })
  } catch (err: any) {
    console.error('[API/ANALYTICS/REALTIME] failed to query GA4 realtime', err?.message || err)
    return res.status(500).json({ success: false, error: 'Failed to fetch realtime analytics' })
  }
}
