import React from 'react'
import { colors } from '../../styles/colors'

type CacheStatus = {
  pages?: { count: number; bytes?: number | null }
  images?: { count: number; bytes?: number | null }
  api?: { count: number; bytes?: number | null }
  totalBytes?: number | null
}

export default function PerformanceCard({ cacheStatus, clearingCache, clearCache, isClient } : { cacheStatus: CacheStatus, clearingCache: boolean, clearCache: () => void, isClient: boolean }) {
  const fmt = (b?: number | null) => {
    if (!isClient) return '—'
    if (!b) return '—'
    if (b >= 1024 * 1024) return `${(b / (1024 * 1024)).toFixed(1)} MB`
    return `${Math.round(b / 1024)} KB`
  }

  const barPct = !isClient ? 0 : Math.min(100, cacheStatus.totalBytes ? Math.round((cacheStatus.totalBytes / (1024*1024*1024)) * 100) : 0)

  return (
    <section style={{ borderRadius: 12, padding: 18, background: '#0f0f10', border: `1px solid ${colors.borderDark}`, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }} aria-labelledby="performance-title">
      <div>
        <h2 id="performance-title" style={{ margin: 0, color: '#fff' }}>Performance do Site</h2>
        <div style={{ marginTop: 8, color: '#9f9f9f', fontSize: 13 }}>Otimização e cache</div>

        <ul style={{ marginTop: 14, listStyle: 'none', padding: 0, display: 'grid', gap: 8 }}>
          <li style={{ padding: 10, borderRadius: 8, background: '#0b0b0c', border: `1px solid ${colors.borderDark}`, display: 'flex', justifyContent: 'space-between' }}><span>Cache de Páginas</span><strong>{fmt(cacheStatus.pages?.bytes)}</strong></li>
          <li style={{ padding: 10, borderRadius: 8, background: '#0b0b0c', border: `1px solid ${colors.borderDark}`, display: 'flex', justifyContent: 'space-between' }}><span>Cache de Imagens</span><strong>{fmt(cacheStatus.images?.bytes)}</strong></li>
          <li style={{ padding: 10, borderRadius: 8, background: '#0b0b0c', border: `1px solid ${colors.borderDark}`, display: 'flex', justifyContent: 'space-between' }}><span>Cache de API</span><strong>{fmt(cacheStatus.api?.bytes)}</strong></li>
        </ul>
      </div>

      <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ height: 12, borderRadius: 6, background: '#080808', border: `1px solid ${colors.borderDark}` }}>
          <div style={{ height: '100%', width: `${barPct}%`, background: '#fb923c', borderRadius: 6 }} />
        </div>
        <button aria-label="Limpar cache" onClick={(e) => { e.preventDefault(); clearCache() }} disabled={!isClient} style={{ background: !isClient ? '#666' : (clearingCache ? '#a13a3a' : '#ef4444'), color: '#fff', borderRadius: 10, padding: '10px 12px', border: 'none', cursor: !isClient ? 'not-allowed' : 'pointer', fontWeight: 700 }}>{clearingCache ? 'Limpando...' : 'Limpar Cache'}</button>
      </div>
    </section>
  )
}
