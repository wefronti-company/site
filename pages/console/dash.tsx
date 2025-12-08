import React, { useEffect, useState } from 'react'
import SEO from '../../components/SEO'
import { colors } from '../../styles/colors'
import { useRouter } from 'next/router'

type Quote = {
  id: number
  name: string
  email: string
  whatsapp: string
  company?: string
  role?: string
  revenue?: string
  challenge?: string
  timeline?: string
}

export default function DashPage () {
  const router = useRouter()
  const [items, setItems] = useState<Quote[]>([])
  const [analytics, setAnalytics] = useState<{ visitors?: number | null; views?: number | null; avgSeconds?: number | null }>({})
  // `null` = unknown/loading, `false` = GA not configured in env, `true` = configured
  const [analyticsConfigured, setAnalyticsConfigured] = useState<boolean | null>(null)
  const [realtimeCountries, setRealtimeCountries] = useState<Array<{country: string; users: number}>>([])
  // mark when we are mounted on the client to avoid hydration mismatches
  const [isClient, setIsClient] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [tab, setTab] = useState<'overview' | 'budget'>('overview')
  const [cacheStatus, setCacheStatus] = useState<{ pages?: { count: number; bytes?: number | null }; images?: { count: number; bytes?: number | null }; api?: { count: number; bytes?: number | null }; totalBytes?: number | null }>({})
  const [clearingCache, setClearingCache] = useState(false)
  const [security, setSecurity] = useState<any>(null)

  useEffect(() => {
    const run = async () => {
      setLoading(true)
      setError(null)

      try {
        // verify authentication first
        const authRes = await fetch('/api/login')
        if (!authRes.ok) return router.replace('/console')
        const authBody = await authRes.json().catch(() => ({}))
        if (!authBody?.authenticated) return router.replace('/console')

        const res = await fetch('/api/quotes')
        if (res.status === 401) return router.replace('/console')

        const body = await res.json()
        if (!body.success) throw new Error(body.error || 'Failed to fetch')
        setItems(body.items || [])
      } catch (err: any) {
        console.error('[console/dash] fetch error', err)
        setError(err.message || 'Erro ao buscar registros')
      } finally {
        setLoading(false)
      }
    }

    run()
    void fetchAnalytics()
    void fetchCacheStatus()
    void fetchSecurityStatus()
    void fetchRealtimeCountries()
    // avoid showing client-side metrics until hydration completes
    setIsClient(true)
  }, [])

  const handleLogout = async () => {
    await fetch('/api/logout', { method: 'POST' }).catch(() => {})
    // ensure the client goes back to login
    router.replace('/console')
  }

  async function fetchSecurityStatus () {
    try {
      const res = await fetch('/api/security/status')
      if (!res.ok) return
      const body = await res.json().catch(() => ({}))
      if (!body?.success) return
      setSecurity(body.result || null)
    } catch (e) {
      // ignore
    }
  }

  // fetch helper so Update button can reuse it
  async function fetchItems () {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/quotes')
      if (res.status === 401) return router.replace('/console')

      const body = await res.json()
      if (!body.success) throw new Error(body.error || 'Failed to fetch')
      setItems(body.items || [])
    } catch (err: any) {
      console.error('[console/dash] fetch error', err)
      setError(err.message || 'Erro ao buscar registros')
    } finally {
      setLoading(false)
    }
  }

  // fetch analytics for Overview (last-7-days)
  async function fetchAnalytics () {
    try {
      const res = await fetch('/api/analytics/overview')
      if (!res.ok) return
      const body = await res.json().catch(() => ({}))
      // if the server indicates GA is not configured, reflect that in UI
      if (body?.configured === false) {
        setAnalyticsConfigured(false)
        return
      }
      if (!body?.success) return
      setAnalyticsConfigured(true)
      const m = body.metrics || {}
      setAnalytics({ visitors: m.visitors || null, views: m.views || null, avgSeconds: m.averageSessionDurationSeconds || null })
    } catch (e) {
      // silently ignore analytics errors
    }
  }

  // ensure we mark analytics as unknown while loading
  useEffect(() => { setAnalyticsConfigured(null); }, [])

  async function fetchCacheStatus () {
    try {
      const res = await fetch('/api/cache/status')
      if (!res.ok) return
      const body = await res.json().catch(() => ({}))
      if (!body?.success) return
      setCacheStatus(body.status || {})
    } catch (e) {
      // ignore
    }
  }

  async function clearCache () {
    if (!confirm('Confirma limpar o cache do site? Esta ação pode causar regeneração/ carga temporária ao tráfego.')) return
    setClearingCache(true)
    try {
      const res = await fetch('/api/cache/clear', { method: 'POST' })
      const body = await res.json().catch(() => ({}))
      if (!res.ok || !body?.success) {
        alert('Falha ao limpar cache: ' + (body?.error || res.statusText))
      } else {
        // success
        await fetchCacheStatus()
        // also refetch analytics because clearing cache might affect metrics collection
        await fetchAnalytics()
      }
    } catch (e) {
      console.error('[console/dash] clear cache', e)
      alert('Erro ao limpar cache')
    } finally {
      setClearingCache(false)
    }
  }

  async function fetchRealtimeCountries () {
    try {
      const res = await fetch('/api/analytics/realtime')
      if (!res.ok) return
      const body = await res.json().catch(() => ({}))
      if (!body?.success) return
      const list = body?.data?.countries || []
      setRealtimeCountries(list)
    } catch (e) {
      // ignore
    }
  }

  return (
    <>
      <SEO title="Dash" noindex />
      <div style={{ padding: 18 }}>

        <div style={{ marginTop: 12, display: 'flex', gap: 18, alignItems: 'flex-start' }}>
          {/* Left Sidebar */}
          <aside style={{ width: 260 }}>
            <div style={{ padding: 18, borderRadius: 12, background: '#0f0f10', border: `1px solid ${colors.borderDark}` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <img src="/images/isologo-white.webp" alt="Wefronti" style={{ height: 34 }} />
              </div>

              <nav style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 8 }} aria-label="Console navigation">
                <button onClick={() => setTab('overview')} aria-current={tab === 'overview'} style={{ textAlign: 'left', padding: '10px 12px', borderRadius: 10, background: tab === 'overview' ? 'linear-gradient(90deg, rgba(99,102,241,0.12), rgba(147,197,253,0.03))' : 'transparent', border: `1px solid ${colors.borderDark}`, color: tab === 'overview' ? '#e7e7ff' : '#bdbdbd', cursor: 'pointer' }}>Overview</button>
                <button onClick={() => setTab('budget')} aria-current={tab === 'budget'} style={{ textAlign: 'left', padding: '10px 12px', borderRadius: 10, background: tab === 'budget' ? 'linear-gradient(90deg, rgba(99,102,241,0.08), rgba(147,197,253,0.02))' : 'transparent', border: `1px solid ${colors.borderDark}`, color: tab === 'budget' ? '#e7e7ff' : '#bdbdbd', cursor: 'pointer' }}>Orçamento</button>
              </nav>

              <div style={{ marginTop: 20, background: '#0b0b0c', padding: 10, borderRadius: 8, border: `1px solid ${colors.borderDark}` }}>
                <div style={{ fontSize: 12, color: '#9f9f9f' }}>Status do Sistema</div>
                <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ width: 10, height: 10, borderRadius: 999, background: '#10b981', display: 'inline-block' }} />
                  <strong style={{ color: '#fff', fontSize: 13 }}>Online</strong>
                </div>
              </div>
              <div style={{ marginTop: 12 }}>
                <button onClick={(e) => { e.preventDefault(); void handleLogout() }} aria-label="Sair sidebar" style={{ width: '100%', padding: '8px 10px', borderRadius: 8, border: `1px solid ${colors.borderDark}`, background: '#111', color: '#fff', cursor: 'pointer' }}>Sair</button>
              </div>
            </div>
          </aside>

          {/* Main content */}
          <main style={{ flex: 1 }}>
            {/* MAIN: Overview or Orçamento */}
            {tab === 'overview' && (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
              {/* Analytics card */}
              <section style={{ borderRadius: 12, padding: 18, background: '#0f0f10', border: `1px solid ${colors.borderDark}` }} aria-labelledby="analytics-title">
                <h2 id="analytics-title" style={{ margin: 0, color: '#fff' }}>Google Analytics</h2>
                <div style={{ marginTop: 10, color: '#9f9f9f', fontSize: 13 }}>Últimos 7 dias</div>
                <div style={{ marginTop: 14, display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ color: '#9c5cff', fontWeight: 700, fontSize: 18 }}>Visitantes</div>
                    <div style={{ color: '#9f9f9f', marginTop: 6 }}>{!isClient ? '—' : analytics.visitors ? (analytics.visitors >= 1000 ? `${(analytics.visitors / 1000).toFixed(1)}K` : analytics.visitors) : '—'}</div>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ color: '#34d399', fontWeight: 700, fontSize: 18 }}>Visualizações</div>
                    <div style={{ color: '#9f9f9f', marginTop: 6 }}>{!isClient ? '—' : analytics.views ? (analytics.views >= 1000 ? `${(analytics.views / 1000).toFixed(1)}K` : analytics.views) : '—'}</div>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ color: '#a78bfa', fontWeight: 700, fontSize: 18 }}>Tempo Médio</div>
                    <div style={{ color: '#9f9f9f', marginTop: 6 }}>{!isClient ? '—' : analytics.avgSeconds ? `${Math.floor((analytics.avgSeconds || 0) / 60)}m ${Math.round((analytics.avgSeconds || 0) % 60)}s` : '—'}</div>
                  </div>
                </div>
                {/* small line placeholder for graph */}
                <div style={{ height: 120, marginTop: 14, background: '#0b0b0c', borderRadius: 8, border: `1px dashed ${colors.borderDark}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9f9f9f' }}>
                  {analyticsConfigured === false ? (
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontWeight: 700, color: '#f97316', marginBottom: 6 }}>Analytics não configurado</div>
                      <div style={{ fontSize: 12 }}>Defina GA4_SERVICE_ACCOUNT_JSON e GA4_PROPERTY_ID no ambiente para ativar métricas.</div>
                    </div>
                  ) : (
                    <div style={{ width: '100%', height: '100%' }} />
                  )}
                </div>
              </section>

              {/* Performance / Cache card (client-only) */}
              {/* Dynamically loaded to avoid SSR/client hydration mismatches */}
              {isClient ? (
                // performance card will render on client only
                <React.Suspense fallback={<div style={{ height: '220px' }} />}>
                  {/* eslint-disable-next-line @next/next/no-server-import-in-client */}
                  {/* dynamic import workaround: require at runtime */}
                  {(() => {
                    const PC = require('../../components/console/PerformanceCard').default
                    return <PC cacheStatus={cacheStatus} clearingCache={clearingCache} clearCache={clearCache} isClient={isClient} />
                  })()}
                </React.Suspense>
              ) : (
                // server and initial client render placeholder
                <section style={{ borderRadius: 12, padding: 18, background: '#0f0f10', border: `1px solid ${colors.borderDark}`, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }} aria-labelledby="performance-title">
                  <div>
                    <h2 id="performance-title" style={{ margin: 0, color: '#fff' }}>Performance do Site</h2>
                    <div style={{ marginTop: 8, color: '#9f9f9f', fontSize: 13 }}>Otimização e cache</div>

                    <ul style={{ marginTop: 14, listStyle: 'none', padding: 0, display: 'grid', gap: 8 }}>
                      <li style={{ padding: 10, borderRadius: 8, background: '#0b0b0c', border: `1px solid ${colors.borderDark}`, display: 'flex', justifyContent: 'space-between' }}><span>Cache de Páginas</span><strong>—</strong></li>
                      <li style={{ padding: 10, borderRadius: 8, background: '#0b0b0c', border: `1px solid ${colors.borderDark}`, display: 'flex', justifyContent: 'space-between' }}><span>Cache de Imagens</span><strong>—</strong></li>
                      <li style={{ padding: 10, borderRadius: 8, background: '#0b0b0c', border: `1px solid ${colors.borderDark}`, display: 'flex', justifyContent: 'space-between' }}><span>Cache de API</span><strong>—</strong></li>
                    </ul>
                  </div>

                  <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <div style={{ height: 12, borderRadius: 6, background: '#080808', border: `1px solid ${colors.borderDark}` }}>
                      <div style={{ height: '100%', width: `0%`, background: '#fb923c', borderRadius: 6 }} />
                    </div>
                    <button aria-label="Limpar cache" disabled style={{ background: '#666', color: '#fff', borderRadius: 10, padding: '10px 12px', border: 'none', cursor: 'not-allowed', fontWeight: 700 }}>Limpar Cache</button>
                  </div>
                </section>
              )}
              </div>

              {/* second row: Security + Countries */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, marginTop: 18 }}>
              <section style={{ borderRadius: 12, padding: 18, background: '#0f0f10', border: `1px solid ${colors.borderDark}` }} aria-labelledby="security-title">
                <h3 id="security-title" style={{ margin: 0, color: '#fff' }}>Segurança do Site</h3>
                <div style={{ marginTop: 12, color: '#9f9f9f' }}>O guarda do seu site</div>
                <ul style={{ marginTop: 12, listStyle: 'none', padding: 0, display: 'grid', gap: 8 }}>
                  <li style={{ padding: 10, borderRadius: 8, background: '#0b0b0c', border: `1px solid ${colors.borderDark}` }}>
                    <strong style={{ color: security?.ssl?.ok ? '#10b981' : '#ef4444' }}>{security?.ssl?.ok ? '✔' : '✖'}</strong>
                    {' '}
                    Certificado SSL — {!isClient ? '—' : (security?.ssl?.ok ? `válido (${security?.ssl?.daysLeft} dias)` : (security?.ssl?.info || 'inválido'))}
                  </li>

                  <li style={{ padding: 10, borderRadius: 8, background: '#0b0b0c', border: `1px solid ${colors.borderDark}` }}>
                    <strong style={{ color: security?.firewall?.active ? '#10b981' : '#9f9f9f' }}>{security?.firewall?.active ? '✔' : '○'}</strong>
                    {' '}
                    Firewall — {!isClient ? '—' : (security?.firewall?.active ? `ativo${security?.firewall?.provider ? ` (${security?.firewall?.provider})` : ''}` : 'inativo')}
                  </li>

                  <li style={{ padding: 10, borderRadius: 8, background: '#0b0b0c', border: `1px solid ${colors.borderDark}` }}>
                    <strong style={{ color: security?.twoFactor?.enabled === true ? '#10b981' : (security?.twoFactor?.enabled === false ? '#ef4444' : '#f59e0b') }}>{security?.twoFactor?.enabled === true ? '✔' : (security?.twoFactor?.enabled === false ? '✖' : '⚠')}</strong>
                    {' '}
                    2FA — {!isClient ? '—' : (security?.twoFactor?.enabled === true ? 'ativado' : (security?.twoFactor?.enabled === false ? 'desativado' : 'recomendado'))}
                  </li>
                </ul>
                {/* Optional details */}
                {isClient && security && (
                  <div style={{ marginTop: 8, color: '#9f9f9f', fontSize: 12 }}>
                    <div>Host: {security.host || '—'}</div>
                    <div>Site: {security.siteUrl || '—'}</div>
                  </div>
                )}
              </section>

              <section style={{ borderRadius: 12, padding: 18, background: '#0f0f10', border: `1px solid ${colors.borderDark}` }} aria-labelledby="countries-title">
                <h3 id="countries-title" style={{ margin: 0, color: '#fff' }}>Acessos em Tempo Real</h3>
                <div style={{ marginTop: 12, color: '#9f9f9f' }}>Por país</div>
                <ul style={{ marginTop: 12, listStyle: 'none', padding: 0, display: 'grid', gap: 10 }}>
                  {!isClient && (
                    // server placeholder
                    <>
                      <li style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 10, borderRadius: 8, background: '#0b0b0c', border: `1px solid ${colors.borderDark}` }}><span>—</span><strong>—</strong></li>
                      <li style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 10, borderRadius: 8, background: '#0b0b0c', border: `1px solid ${colors.borderDark}` }}><span>—</span><strong>—</strong></li>
                      <li style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 10, borderRadius: 8, background: '#0b0b0c', border: `1px solid ${colors.borderDark}` }}><span>—</span><strong>—</strong></li>
                    </>
                  )}

                  {isClient ? (
                    // render client-only RealtimeCountries component to avoid hydration mismatch
                    (() => {
                      // runtime require to keep the server bundle unaffected
                      try {
                        // eslint-disable-next-line @typescript-eslint/no-var-requires
                        const Comp = require('../../components/console/RealtimeCountries').default
                        return <Comp />
                      } catch (e) {
                        return <li style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 10, borderRadius: 8, background: '#0b0b0c', border: `1px solid ${colors.borderDark}` }}><span>Sem dados</span><strong>—</strong></li>
                      }
                    })()
                  ) : null}
                </ul>
              </section>
                </div>
              </>
            )}

            {tab === 'budget' && (
              <div style={{ marginTop: 6 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ color: '#9f9f9f' }}>{items.length} resultados</div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={(e) => { e.preventDefault(); void fetchItems() }} aria-label="Atualizar" style={{ padding: '6px 10px', borderRadius: 8, border: `1px solid ${colors.borderDark}`, background: '#111', color: '#fff', cursor: 'pointer' }}>Atualizar</button>
                  </div>
                </div>

            <div style={{ marginTop: 12 }}>
            {loading && <div style={{ color: '#9f9f9f' }}>Carregando…</div>}
            {error && <div style={{ color: 'salmon' }}>{error}</div>}

            {!loading && !error && (
              <div style={{ marginTop: 12 }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ textAlign: 'left', color: '#cfcfcf', borderBottom: `1px solid ${colors.borderDark}` }}>
                      <th style={{ padding: 8 }}>ID</th>
                      <th>Nome</th>
                      <th>E-mail</th>
                      <th>WhatsApp</th>
                      <th>Empresa</th>
                      <th>Operador</th>
                      <th>Faturamento</th>
                      <th>Timeline</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map(it => (
                      <tr key={it.id} style={{ borderBottom: `1px dashed ${colors.borderDark}` }}>
                        <td style={{ padding: 8 }}>{it.id}</td>
                        <td>{it.name}</td>
                        <td>{it.email}</td>
                        <td>{it.whatsapp}</td>
                        <td>{it.company}</td>
                        <td>{it.role}</td>
                        <td>{it.revenue}</td>
                        <td>{it.timeline}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            </div>
            </div>
            )}
        </main>
        </div>
      </div>
    </>
  )
}
