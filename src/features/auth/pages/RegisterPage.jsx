import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeftRight } from 'lucide-react'
import { useAuth } from '@/features/auth/hooks/useAuth.js'
import { useRateLimitCountdown } from '@/features/auth/hooks/useRateLimitCountdown.js'

export default function RegisterPage() {
  const { register, login } = useAuth()
  const navigate = useNavigate()
  const { remaining, isCounting, start, reset } = useRateLimitCountdown()
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [formError, setFormError] = useState(null)
  // A throttled login after a successful register must not register again on
  // retry: the second attempt would fail with a duplicate-account 400.
  const [registered, setRegistered] = useState(null)

  async function handleSubmit(event) {
    event.preventDefault()
    if (isCounting) return
    setBusy(true)
    setFormError(null)
    try {
      const alreadyRegistered =
        registered?.username === username && registered?.email === email
      if (!alreadyRegistered) {
        await register({ username, email, password })
        setRegistered({ username, email })
      }
      await login({ username, password })
      reset()
      setRegistered(null)
      navigate('/', { replace: true })
    } catch (e) {
      if (e?.status === 429) {
        // The backend detail repeats the seconds; the countdown is the only
        // place the number is shown.
        start(e.retryAfter)
      } else {
        setFormError(e?.message ?? 'No se pudo crear la cuenta. Inténtalo de nuevo.')
      }
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface px-4">
      <div className="w-full max-w-md bg-white border border-gray-100 rounded-2xl p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-brand p-2 rounded-xl text-white">
            <ArrowLeftRight size={20} strokeWidth={2.5} />
          </div>
          <span className="font-bold text-gray-900 text-lg tracking-tight">Splitwise Friends</span>
        </div>

        <h1 className="text-xl font-bold text-gray-900 mb-1">Crear cuenta</h1>
        <p className="text-sm text-gray-500 mb-6">Regístrate para empezar a dividir gastos.</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label className="flex flex-col gap-1 text-sm font-medium text-gray-700">
            Usuario
            <input
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              required
              autoComplete="username"
              className="rounded-xl border border-gray-200 px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
            />
          </label>

          <label className="flex flex-col gap-1 text-sm font-medium text-gray-700">
            Email
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              autoComplete="email"
              className="rounded-xl border border-gray-200 px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
            />
          </label>

          <label className="flex flex-col gap-1 text-sm font-medium text-gray-700">
            Contraseña
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              minLength={8}
              autoComplete="new-password"
              className="rounded-xl border border-gray-200 px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
            />
          </label>

          {isCounting ? (
            <p className="text-sm text-red-600">
              Demasiados intentos. Espera antes de reintentar.
            </p>
          ) : formError ? (
            <p className="text-sm text-red-600">{formError}</p>
          ) : null}

          <button
            type="submit"
            disabled={busy || isCounting}
            className="bg-brand text-white text-sm font-bold rounded-xl py-2.5 disabled:opacity-60"
          >
            {isCounting ? `Reintentar en ${remaining}s` : busy ? 'Creando…' : 'Crear cuenta'}
          </button>
        </form>

        <p className="mt-6 text-sm text-gray-500">
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" className="text-brand-dark font-bold">
            Iniciar sesión
          </Link>
        </p>
      </div>
    </div>
  )
}
