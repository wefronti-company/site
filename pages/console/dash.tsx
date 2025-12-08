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
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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
  }, [])

  const handleLogout = async () => {
    await fetch('/api/logout', { method: 'POST' }).catch(() => {})
    // ensure the client goes back to login
    router.replace('/console')
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

  return (
    <>
      <SEO title="Console / Dash — WeFronti" noindex />
      <div style={{ padding: 18 }}>
        <h1 style={{ margin: 0 }}>Console — Solicitações de Orçamento</h1>
        <div style={{ marginTop: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ color: '#9f9f9f' }}>{items.length} resultados</div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={(e) => { e.preventDefault(); void fetchItems() }} aria-label="Atualizar" style={{ padding: '6px 10px', borderRadius: 8, border: `1px solid ${colors.borderDark}`, background: '#111', color: '#fff', cursor: 'pointer' }}>Atualizar</button>
                <button onClick={(e) => { e.preventDefault(); void handleLogout() }} aria-label="Sair" style={{ padding: '6px 10px', borderRadius: 8, border: `1px solid ${colors.borderDark}`, background: '#111', color: '#fff', cursor: 'pointer' }}>Sair</button>
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
      </div>
    </>
  )
}
