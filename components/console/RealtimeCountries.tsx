"use client"
import React, { useEffect, useState } from 'react'
import { colors } from '../../styles/colors'

export default function RealtimeCountries () {
  const [countries, setCountries] = useState<Array<{country: string; users: number}>>([])
  // null = loading/unknown, false = GA not configured, true = configured
  const [configured, setConfigured] = useState<boolean | null>(null)
  const [loading, setLoading] = useState(true)

  async function load () {
    setLoading(true)
    try {
      const res = await fetch('/api/analytics/realtime')
      if (!res.ok) {
        setConfigured(null)
        return setCountries([])
      }
      const body = await res.json().catch(() => ({}))
      if (body?.configured === false) {
        setConfigured(false)
        setCountries([])
        return
      }
      if (!body?.success) {
        setConfigured(null)
        return setCountries([])
      }
      setConfigured(true)
      setCountries(body.data?.countries || [])
    } catch (e) {
      // ignore
      setCountries([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let mounted = true
    void load()
    // optional polling for realtime numbers every 15s
    const ttl = Number(process.env.NEXT_PUBLIC_REALTIME_POLL_INTERVAL || 15) * 1000
    const id = setInterval(() => { if (mounted) void load() }, ttl)
    return () => { mounted = false; clearInterval(id) }
  }, [])

  if (loading) {
    return (
      <>
        <li style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 10, borderRadius: 8, background: '#0b0b0c', border: `1px solid ${colors.borderDark}` }}><span>—</span><strong>—</strong></li>
        <li style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 10, borderRadius: 8, background: '#0b0b0c', border: `1px solid ${colors.borderDark}` }}><span>—</span><strong>—</strong></li>
        <li style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 10, borderRadius: 8, background: '#0b0b0c', border: `1px solid ${colors.borderDark}` }}><span>—</span><strong>—</strong></li>
      </>
    )
  }

  if (configured === false) {
    return <li style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 10, borderRadius: 8, background: '#0b0b0c', border: `1px solid ${colors.borderDark}`, color: '#f97316' }}>Analytics não configurado — defina GA4_SERVICE_ACCOUNT_JSON & GA4_PROPERTY_ID</li>
  }

  if (!countries || countries.length === 0) {
    return <li style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 10, borderRadius: 8, background: '#0b0b0c', border: `1px solid ${colors.borderDark}` }}><span>Sem dados</span><strong>—</strong></li>
  }

  return (
    <>
      {countries.map((c, idx) => (
        <li key={c.country + idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 10, borderRadius: 8, background: '#0b0b0c', border: `1px solid ${colors.borderDark}` }}><span>{c.country}</span><strong>{c.users.toLocaleString()}</strong></li>
      ))}
    </>
  )
}
