import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import SEO from '../../components/SEO'
import ButtonCta from '../../components/ui/ButtonCta'
import Logo from '../../components/ui/Logo'
import { Boxes } from '../../components/ui/shadcn-io/background-boxes'
import { colors } from '../../styles/colors'
// fallback to native button style — project root doesn't include ButtonPrimary


export default function ConsolePage () {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const run = async () => {
      setLoading(true)
      setError(null)

      try {
        // If already authenticated, redirect immediately to the dash page.
        const authRes = await fetch('/api/login')
        if (!authRes.ok) return setLoading(false)

        const authBody = await authRes.json().catch(() => ({}))
        if (authBody?.authenticated) {
          router.replace('/console/dash')
        }
      } catch (err: any) {
        setError(err?.message || null)
      } finally {
        setLoading(false)
      }
    }

    run()
    setMounted(true)
  }, [router])

  const handleLogin = async (token: string) => {
    setError(null)
    setLoading(true)
    try {
      const resp = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token })
      })

      if (!resp.ok) {
        const b = await resp.json().catch(() => ({}))
        throw new Error(b?.error || 'Credenciais inválidas')
      }

      // verify server recognizes the new session/token before navigating
      try {
        const check = await fetch('/api/login')
        const body = await check.json().catch(() => ({}))
        if (!check.ok || !body?.authenticated) {
          throw new Error('Falha ao validar sessão após autenticar. Tente novamente.')
        }
      } catch (err) {
        throw err
      }

      router.push('/console/dash')
    } catch (e: any) {
      setError(e?.message || 'Erro ao autenticar')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <SEO title="Console — WeFronti" noindex />

      <div className="min-h-screen flex items-center justify-center relative overflow-hidden p-6" style={{ backgroundColor: colors.blackColor }}>
        {mounted && (
          <div className="absolute inset-0 w-full h-full z-[5] opacity-40 pointer-events-none"><Boxes /></div>
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/40 z-[10]" />
        <div className="relative z-[20] flex flex-col items-center max-w-md w-full">
          <div className="w-full p-8 lg:p-10 rounded-[20px] backdrop-blur-xl" style={{ border: `1px solid ${colors.borderDark}`, backgroundColor: 'rgba(16, 16, 16, 0.6)' }}>
            <div className="mb-6"><Logo /></div>
            {/* Minimal token-only login form for administrators — no extra copy */}
            <ConsoleLoginForm onSubmit={handleLogin} loading={loading} error={error} />
          </div>
        </div>
      </div>
    </>
  )
}

function ConsoleLoginForm ({ onSubmit, loading, error }: { onSubmit: (token: string) => Promise<void>, loading?: boolean, error?: string | null }) {
  const [token, setToken] = useState('')
  const [localError, setLocalError] = useState<string | null>(null)

  const submit = async (e?: React.FormEvent) => {
    e?.preventDefault()
    setLocalError(null)
    if (!token) {
      setLocalError('Token de acesso é obrigatório')
      return
    }

    // Basic client-side validation: 12 alphanumeric characters
    const validFormat = /^[A-Za-z0-9]{12}$/.test(token)
    if (!validFormat) {
      setLocalError('Token inválido — deve ter 12 caracteres alfanuméricos')
      return
    }

    await onSubmit(token)
  }

  return (
    <form onSubmit={submit} noValidate>
      <div>
        <div className="relative">
          <input
            id="token"
            type="text"
            value={token}
            onChange={(e) => { setToken(e.target.value); if (localError) setLocalError(null) }}
            placeholder="Token de acesso"
            required
            // fixed compact height and no bottom padding — keeps input tight
            className={`w-full px-4 rounded-[10px] transition-all duration-300 outline-none ${localError ? 'border-2 border-red-500' : ''}`}
            style={{ height: 44, paddingTop: 12, paddingBottom: 0, backgroundColor: colors.colorGray, border: localError ? '2px solid #EF4444' : `1px solid ${colors.borderDark}`, color: colors.whiteColor, fontSize: '16px' }}
          />
        </div>

        {(localError || error) && (
          <div className="mt-2 flex items-start gap-2 p-3 rounded-[10px]" style={{ backgroundColor: 'rgba(254, 226, 226, 1)', border: `1px solid rgba(239, 68, 68, 0.3)` }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-red-500 flex-shrink-0 mt-0.5">
              <path d="M12 9v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <p className="text-sm text-red-600 font-medium">{localError || error}</p>
          </div>
        )}

        {/* no placeholder spacer here — removing layout height */}
      </div>

      <div>
        {/* small breathing space between input and button */}
        <div style={{ marginTop: 5 }} />

        <div style={{ marginTop: 5 }}>
          <ButtonCta label={loading ? 'Validando...' : 'Entrar'} type="submit" disabled={!!loading} />
        </div>
      </div>
    </form>
  )
}
