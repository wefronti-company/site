import type { NextApiRequest, NextApiResponse } from 'next'
import { compare } from '../../../lib/bcrypt'

type Metrics = {
  visitors: number | null
  views: number | null
  averageSessionDurationSeconds: number | null
}

// Simple in-memory cache (server worker process)
let cached: { ts: number; data: Metrics } | null = null
const TTL = Number(process.env.GA_CACHE_TTL_SECONDS || '300') // default 5 minutes

async function checkAuth(req: NextApiRequest) {
  // Prefer session cookie
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
        console.warn('[API/ANALYTICS] session check failed', err)
      }
    }
  }

  // fallback legacy cookie (non-prod / no-db)
  const legacy = req.cookies?.console_auth
  if (legacy) {
    if ((!process.env.DATABASE_URL || process.env.NODE_ENV !== 'production') && process.env.CONSOLE_AUTH_TOKEN && legacy === process.env.CONSOLE_AUTH_TOKEN) return true
    if (process.env.DATABASE_URL) {
      try {
        // verify token exists in DB
        const { sql } = await import('../../../lib/db')
        const rows: any[] = await sql`SELECT token_hash FROM console_tokens WHERE active = true`
        for (const r of rows) {
          if (r?.token_hash && await compare(legacy, r.token_hash)) return true
        }
      } catch (err) {
        console.warn('[API/ANALYTICS] legacy token check failed', err)
      }
    }
  }

  return false
}

export default async function handler (req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).end()

  // Ensure the requester is authenticated as console user
  const ok = await checkAuth(req)
  if (!ok) return res.status(401).json({ success: false, error: 'Não autorizado' })

  // return cached result if fresh
  if (cached && (Date.now() - cached.ts) / 1000 < TTL) {
    return res.status(200).json({ success: true, metrics: cached.data, cached: true })
  }

  // Ensure we have credentials
  const saJson = process.env.GA4_SERVICE_ACCOUNT_JSON || process.env.GA4_SA_JSON
  const propertyId = process.env.GA4_PROPERTY_ID || process.env.NEXT_PUBLIC_GA4_PROPERTY_ID
  if (!saJson || !propertyId) {
    return res.status(501).json({ success: false, error: 'GA4 credentials or property id not configured' })
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
        dateRanges: [{ startDate: '7daysAgo', endDate: 'yesterday' }],
        metrics: [
          { name: 'activeUsers' },
          { name: 'screenPageViews' },
          { name: 'averageSessionDuration' }
        ]
      }
    }

    const response = await analyticsdata.properties.runReport(request as any)
    // Parse metrics out of the returned rows/metricValues
    let visitors: number | null = null
    let views: number | null = null
    let avgSec: number | null = null

    // response.data.rows may contain a single row with metricValues in same order
    const rows = (response?.data?.rows as any[]) || []
    if (rows.length > 0) {
      const metricValues = rows[0]?.metricValues || []
      if (metricValues[0]) visitors = Number(metricValues[0].value || null)
      if (metricValues[1]) views = Number(metricValues[1].value || null)
      if (metricValues[2]) avgSec = Number(metricValues[2].value || null)
    }

    const data: Metrics = {
      visitors,
      views,
      averageSessionDurationSeconds: avgSec
    }

    cached = { ts: Date.now(), data }

    return res.status(200).json({ success: true, metrics: data, cached: false })
  } catch (err: any) {
    console.error('[API/ANALYTICS] failed to query GA4', err?.message || err)
    return res.status(500).json({ success: false, error: 'Failed to fetch analytics' })
  }
}
